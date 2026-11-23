import type BlobSynth from "./blobSynth";
import SpectrumOverlay from "./spectrumOverlay";
import { vertexShader, fragmentShader } from "./shaders";

// Must match CAM_Z / FOCAL in the fragment shader: converts screen uv to
// world coordinates on the z = 0 plane the blob lives on.
const UV_TO_WORLD = 6.0 / 1.8;
const MAX_PIXELS = 1600 * 1000;
const NUM_DENTS = 4;

const UNIFORMS = [
  "uRes",
  "uTime",
  "uCenter",
  "uStretch",
  "uPull",
  "uDents",
  "uRough",
  "uEnergy",
  "uLight",
  "uBands",
] as const;

type PointerLike = { clientX: number; clientY: number };

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
  }
  return shader;
}

function damp(current: number, target: number, rate: number, dt: number) {
  return target + (current - target) * Math.exp(-rate * dt);
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

/**
 * Renders the blob, runs its spring physics and pointer interaction, and
 * drives the synth from it. Owns its animation loop; call destroy() to stop.
 */
export default class BlobScene {
  private gl: WebGLRenderingContext;
  private u: Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  private overlay: SpectrumOverlay;
  private raf = 0;
  private program: WebGLProgram;
  private buffer: WebGLBuffer;

  // Blob physics state, all in world units.
  private center = { x: 0, y: 0 };
  private vel = { x: 0, y: 0 };
  private stretch = { x: 0, y: 0 };
  private pullDir = [0, 1, 0];
  private pullLen = 0;
  private dents = new Float32Array(NUM_DENTS * 4);
  private nextDent = 0;
  private rough = 0.14;
  private roughTarget = 0.14;
  private energy = 0;
  private light = { x: 1.5, y: 1.5 };
  // Smoothed spectrum bands for colour: low, mid, high, centroid.
  private bands = [0, 0, 0, 0];

  private pointer = {
    x: 0,
    y: 0,
    over: false,
    down: false,
    mode: null as "grab" | "pull" | null,
  };
  private grabOffset = { x: 0, y: 0 };
  private extent = { x: 2, y: 2 };

  private time = 0;
  private last = performance.now();

  constructor(
    private canvas: HTMLCanvasElement,
    overlayCanvas: HTMLCanvasElement,
    private synth: BlobSynth,
  ) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;
    this.overlay = new SpectrumOverlay(overlayCanvas);

    const program = gl.createProgram()!;
    const shaders = [
      compile(gl, gl.VERTEX_SHADER, vertexShader),
      compile(gl, gl.FRAGMENT_SHADER, fragmentShader),
    ];
    shaders.forEach((shader) => gl.attachShader(program, shader));
    gl.linkProgram(program);
    // Only flagged for deletion; they're freed along with the program.
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "Shader link failed");
    }
    gl.useProgram(program);
    this.program = program;

    // One oversized triangle covers the screen.
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.u = Object.fromEntries(
      UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
    ) as BlobScene["u"];

    this.resize();
    this.raf = requestAnimationFrame(this.frame);
  }

  resize() {
    const { canvas } = this;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    let scale = Math.min(window.devicePixelRatio || 1, 2);
    // Ray marching is per pixel, so keep the pixel count in check.
    if (w * h * scale * scale > MAX_PIXELS) {
      scale = Math.sqrt(MAX_PIXELS / (w * h));
    }
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.extent = { x: ((0.5 * w) / h) * UV_TO_WORLD, y: 0.5 * UV_TO_WORLD };
    this.overlay.resize();
  }

  private toWorld(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const u = (clientX - rect.left - rect.width / 2) / rect.height;
    const v = -(clientY - rect.top - rect.height / 2) / rect.height;
    return { x: u * UV_TO_WORLD, y: v * UV_TO_WORLD };
  }

  pointerMove(e: PointerLike) {
    const p = this.toWorld(e.clientX, e.clientY);
    this.pointer.x = p.x;
    this.pointer.y = p.y;
    this.pointer.over = true;
  }

  pointerDown(e: PointerLike) {
    this.pointerMove(e);
    const { pointer, center } = this;
    pointer.down = true;
    const dx = pointer.x - center.x;
    const dy = pointer.y - center.y;
    // Touching the body grabs it; touching empty space pulls a tentacle out.
    if (Math.hypot(dx, dy) < 1.15) {
      pointer.mode = "grab";
      this.grabOffset = { x: -dx, y: -dy };
    } else {
      pointer.mode = "pull";
    }
    this.energy = Math.min(this.energy + 0.6, 1);
    this.synth.accent(pointer.mode === "grab" ? 1.5 : 2.5);
  }

  pointerUp() {
    const { pointer } = this;
    if (pointer.mode === "pull" && this.pullLen > 0.15) {
      // Leave a memory of the pull that slowly relaxes back.
      this.dents.set([...this.pullDir, this.pullLen * 0.55], this.nextDent * 4);
      this.nextDent = (this.nextDent + 1) % NUM_DENTS;
      this.synth.accent(-1.2);
    }
    pointer.down = false;
    pointer.mode = null;
  }

  pointerLeave() {
    this.pointer.over = false;
  }

  wheel(deltaY: number) {
    this.roughTarget = clamp(this.roughTarget - deltaY * 0.0006, 0.04, 0.4);
    this.energy = Math.min(this.energy + 0.15, 1);
  }

  private step(dt: number) {
    const { pointer, center, vel, extent } = this;
    const t = this.time;

    // Where the blob wants to be: a slow wander, or under the pointer.
    let tx = Math.sin(t * 0.13) * 0.35;
    let ty = Math.cos(t * 0.17) * 0.25;
    let stiffness = 1.2;
    if (pointer.mode === "grab") {
      tx = pointer.x + this.grabOffset.x;
      ty = pointer.y + this.grabOffset.y;
      stiffness = 40;
    }
    tx = clamp(tx, -extent.x + 0.8, extent.x - 0.8);
    ty = clamp(ty, -extent.y + 0.8, extent.y - 0.8);

    // Underdamped spring, so the blob lags and wobbles behind the pointer.
    const damping = 2 * Math.sqrt(stiffness) * 0.6;
    vel.x += ((tx - center.x) * stiffness - vel.x * damping) * dt;
    vel.y += ((ty - center.y) * stiffness - vel.y * damping) * dt;
    center.x += vel.x * dt;
    center.y += vel.y * dt;

    this.stretch.x = damp(
      this.stretch.x,
      clamp(vel.x * 0.12, -0.9, 0.9),
      10,
      dt,
    );
    this.stretch.y = damp(
      this.stretch.y,
      clamp(vel.y * 0.12, -0.9, 0.9),
      10,
      dt,
    );

    // Tentacle toward the pointer.
    const dx = pointer.x - center.x;
    const dy = pointer.y - center.y;
    const dist = Math.hypot(dx, dy);
    let pullTarget = 0;
    if (pointer.mode === "pull") {
      pullTarget = clamp(dist - 1.0, 0.2, 1.6);
    } else if (pointer.over && pointer.mode !== "grab") {
      // A gentle lean toward a hovering cursor.
      pullTarget = 0.18 * Math.exp(-Math.max(dist - 1, 0) * 0.8);
    }
    if (dist > 1e-3) {
      const len = Math.hypot(dx, dy, 0.35 * dist);
      const dir = [dx / len, dy / len, (0.35 * dist) / len];
      for (let k = 0; k < 3; k++) {
        this.pullDir[k] = damp(this.pullDir[k], dir[k], 12, dt);
      }
      const n = Math.hypot(...this.pullDir);
      for (let k = 0; k < 3; k++) this.pullDir[k] /= n;
    }
    this.pullLen = damp(
      this.pullLen,
      pullTarget,
      pointer.mode === "pull" ? 4 : 2.5,
      dt,
    );

    for (let i = 0; i < NUM_DENTS; i++) {
      this.dents[i * 4 + 3] *= Math.exp(-dt / 6);
    }

    this.rough = damp(this.rough, this.roughTarget, 3, dt);
    const speed = Math.hypot(vel.x, vel.y);
    const activityTarget = pointer.down ? 0.7 + Math.min(speed * 0.1, 0.3) : 0;
    this.energy = damp(this.energy, activityTarget, pointer.down ? 3 : 0.8, dt);

    this.light.x = damp(this.light.x, pointer.over ? pointer.x : 1.5, 3, dt);
    this.light.y = damp(
      this.light.y,
      pointer.over ? pointer.y + 0.5 : 1.5,
      3,
      dt,
    );

    // Pitch and filter follow the pointer while touching, the blob otherwise.
    const sx = pointer.down ? pointer.x : center.x;
    const sy = pointer.down ? pointer.y : center.y;
    this.synth.update({
      x: clamp(sx / extent.x, -1, 1),
      y: clamp(sy / extent.y, -1, 1),
      deform: this.pullLen + Math.hypot(this.stretch.x, this.stretch.y),
      rough: (this.rough - 0.04) / 0.36,
      activity: this.energy,
    });

    // Colour follows the sound. The analyser is already smoothed, so this
    // only takes the edge off frame-to-frame flicker.
    const spectrum = this.synth.analyse();
    const targets = [
      spectrum.low,
      spectrum.mid,
      spectrum.high,
      spectrum.centroid,
    ];
    for (let k = 0; k < 4; k++) {
      this.bands[k] = damp(this.bands[k], targets[k], 8, dt);
    }

    // The overlay works in CSS pixels, centred on the blob.
    const h = this.canvas.clientHeight;
    this.overlay.draw(
      spectrum,
      this.canvas.clientWidth / 2 + (center.x / UV_TO_WORLD) * h,
      h / 2 - (center.y / UV_TO_WORLD) * h,
      h / UV_TO_WORLD,
    );
  }

  private frame = (now: number) => {
    // rAF timestamps can be slightly behind performance.now() on the first
    // frame.
    const dt = clamp((now - this.last) / 1000, 0, 1 / 20);
    this.last = now;
    this.time += dt;
    this.step(dt);

    const { gl, u } = this;
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, this.time);
    gl.uniform3f(u.uCenter, this.center.x, this.center.y, 0);
    gl.uniform3f(u.uStretch, this.stretch.x, this.stretch.y, 0);
    gl.uniform4f(
      u.uPull,
      this.pullDir[0],
      this.pullDir[1],
      this.pullDir[2],
      this.pullLen,
    );
    gl.uniform4fv(u.uDents, this.dents);
    gl.uniform1f(u.uRough, this.rough);
    gl.uniform1f(u.uEnergy, this.energy);
    gl.uniform2f(u.uLight, this.light.x, this.light.y);
    gl.uniform4fv(u.uBands, this.bands);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.raf = requestAnimationFrame(this.frame);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    // Free what this scene made, but don't lose the context: the canvas (and
    // so its context) is reused if React remounts, as Strict Mode does.
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
  }
}
