// Main-thread side of the blob synth. All sample generation happens in the
// "saw-synth" AudioWorkletProcessor (public/worklets/saw-synth-processor.js);
// this wires up the graph, turns blob gestures into parameter changes and
// analyses what comes out.

const WORKLET_URL = "/worklets/saw-synth-processor.js";

// Minor pentatonic, so any position on screen lands on a friendly note.
const SCALE = [0, 3, 5, 7, 10];
const ROOT_HZ = 110; // A2

// The spectrum is resampled onto a log-frequency axis between these.
const SPECTRUM_MIN_HZ = 40;
const SPECTRUM_MAX_HZ = 12000;
export const SPECTRUM_POINTS = 96;

// Release time in seconds per second the note was held, kept long enough
// on a quick tap not to click and short enough not to hang forever.
const RELEASE_PER_SECOND_HELD = 1.5;
const MIN_RELEASE = 0.2;
const MAX_RELEASE = 8;

export type Spectrum = {
  /** SPECTRUM_POINTS magnitudes in 0..1, low to high frequency. */
  curve: Float32Array;
  /** Average magnitude below 250 Hz, 250 Hz–2 kHz and above 2 kHz. */
  low: number;
  mid: number;
  high: number;
  /** Spectral centroid on the log axis, 0 (dark) to 1 (bright). */
  centroid: number;
  /** Overall level, 0..1. */
  level: number;
};

export type SynthControls = {
  /** Screen position, -1..1 on each axis. */
  x: number;
  y: number;
  /** How far the blob is pulled or stretched, roughly 0..2. */
  deform: number;
  /** Surface roughness, 0..1. */
  rough: number;
  /** How actively it's being played, 0..1. */
  activity: number;
};

function noteToHz(step: number) {
  const octave = Math.floor(step / SCALE.length);
  const degree = SCALE[((step % SCALE.length) + SCALE.length) % SCALE.length];
  return ROOT_HZ * 2 ** (octave + degree / 12);
}

// A few seconds of decaying stereo noise makes a soft hall reverb.
function makeImpulse(ctx: BaseAudioContext, seconds = 3.2) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
  }
  return buffer;
}

export default class BlobSynth {
  private ctx: AudioContext | null = null;
  private node: AudioWorkletNode | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private bins: Uint8Array<ArrayBuffer> | null = null;
  private ready: Promise<void> | null = null;
  private step = -1;
  private muted = false;
  private closed = false;
  // Whether a note is held, kept so a press made while the worklet is still
  // loading still sounds once it arrives.
  private gate = false;
  private pressedAt = 0;

  private spectrum: Spectrum = {
    curve: new Float32Array(SPECTRUM_POINTS),
    low: 0,
    mid: 0,
    high: 0,
    centroid: 0,
    level: 0,
  };

  /**
   * Must be called from a user gesture at least once so the context is
   * allowed to start (Safari in particular).
   */
  start(): Promise<void> {
    if (!this.ready) {
      if (typeof AudioWorkletNode === "undefined") {
        this.ready = Promise.reject(new Error("AudioWorklet not supported"));
        return this.ready;
      }
      const ctx = new AudioContext({ latencyHint: "interactive" });
      this.ctx = ctx;
      this.ready = ctx.audioWorklet.addModule(WORKLET_URL).then(() => {
        // close() may have run while the module was loading.
        if (this.closed) return;
        const node = new AudioWorkletNode(ctx, "saw-synth", {
          numberOfInputs: 0,
          outputChannelCount: [2],
        });

        const reverb = ctx.createConvolver();
        reverb.buffer = makeImpulse(ctx);
        const wet = ctx.createGain();
        wet.gain.value = 0.35;
        const mix = ctx.createGain();
        node.connect(mix);
        node.connect(reverb);
        reverb.connect(wet);
        wet.connect(mix);

        // Analysed before the mute control, so the visuals keep moving
        // while muted.
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.78;
        analyser.minDecibels = -95;
        analyser.maxDecibels = -25;
        mix.connect(analyser);

        const master = ctx.createGain();
        master.gain.value = this.muted ? 0 : 0.8;
        mix.connect(master);
        master.connect(ctx.destination);

        this.node = node;
        this.master = master;
        this.analyser = analyser;
        this.bins = new Uint8Array(analyser.frequencyBinCount);
        if (this.gate) node.port.postMessage({ type: "noteOn" });
      });
      // Closing the context mid-load aborts addModule(); that's expected
      // (React Strict Mode does it on every mount in development).
      this.ready = this.ready.catch((e: unknown) => {
        if (!this.closed) throw e;
      });
    }
    if (this.ctx?.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ready;
  }

  private param(name: string) {
    return this.node!.parameters.get(name)!;
  }

  update({ x, y, deform, rough, activity }: SynthControls) {
    if (!this.node || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Horizontal position picks a note across two and a half octaves.
    const step = Math.round(((x + 1) / 2) * 12);
    if (step !== this.step) {
      this.step = step;
      this.param("frequency").setTargetAtTime(noteToHz(step), now, 0.05);
    }

    // Vertical position opens the filter; stretching the blob opens it
    // further and makes it ring.
    const octaves = (y + 1) * 2.4 + deform * 2 + activity * 0.8;
    this.param("cutoff").setTargetAtTime(
      Math.min(180 * 2 ** octaves, 16000),
      now,
      0.06,
    );
    this.param("resonance").setTargetAtTime(
      0.15 + 0.75 * Math.min(deform, 1),
      now,
      0.1,
    );
    this.param("detune").setTargetAtTime(3 + rough * 45, now, 0.2);
    this.param("gain").setTargetAtTime(0.1 + 0.25 * activity, now, 0.15);
  }

  /** Start a new attack, from wherever the envelope currently is. */
  noteOn() {
    this.gate = true;
    this.pressedAt = performance.now();
    this.node?.port.postMessage({ type: "noteOn" });
  }

  /** Let the note fade out, for longer the longer it was held. */
  noteOff() {
    this.gate = false;
    const held = (performance.now() - this.pressedAt) / 1000;
    const release = Math.min(
      Math.max(held * RELEASE_PER_SECOND_HELD, MIN_RELEASE),
      MAX_RELEASE,
    );
    this.node?.port.postMessage({ type: "noteOff", release });
  }

  /** Sweep the filter by `octaves` and let it fall back. */
  accent(octaves: number) {
    this.node?.port.postMessage({ type: "accent", amount: octaves });
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : 0.8,
        this.ctx.currentTime,
        0.05,
      );
    }
  }

  /** The current spectrum. Reuses one object, so read it straight away. */
  analyse(): Spectrum {
    const { analyser, bins, spectrum, ctx } = this;
    if (!analyser || !bins || !ctx) return spectrum;
    analyser.getByteFrequencyData(bins);

    const binHz = ctx.sampleRate / analyser.fftSize;
    const span = Math.log2(SPECTRUM_MAX_HZ / SPECTRUM_MIN_HZ);

    // Resample onto a log axis so each octave gets the same room.
    for (let i = 0; i < SPECTRUM_POINTS; i++) {
      const hz = SPECTRUM_MIN_HZ * 2 ** ((span * i) / (SPECTRUM_POINTS - 1));
      const pos = hz / binHz;
      const lo = Math.floor(pos);
      const frac = pos - lo;
      spectrum.curve[i] =
        ((bins[lo] ?? 0) * (1 - frac) + (bins[lo + 1] ?? 0) * frac) / 255;
    }

    let low = 0;
    let mid = 0;
    let high = 0;
    let lowN = 0;
    let midN = 0;
    let highN = 0;
    let weighted = 0;
    let total = 0;
    const first = Math.ceil(SPECTRUM_MIN_HZ / binHz);
    const last = Math.min(Math.floor(SPECTRUM_MAX_HZ / binHz), bins.length - 1);
    for (let b = first; b <= last; b++) {
      const hz = b * binHz;
      const v = bins[b] / 255;
      if (hz < 250) {
        low += v;
        lowN++;
      } else if (hz < 2000) {
        mid += v;
        midN++;
      } else {
        high += v;
        highN++;
      }
      weighted += v * Math.log2(hz / SPECTRUM_MIN_HZ);
      total += v;
    }

    spectrum.low = lowN ? low / lowN : 0;
    spectrum.mid = midN ? mid / midN : 0;
    spectrum.high = highN ? high / highN : 0;
    spectrum.centroid = total > 1e-3 ? weighted / total / span : 0;
    spectrum.level = total / (last - first + 1);
    return spectrum;
  }

  close() {
    this.closed = true;
    void this.ctx?.close();
    this.ctx = null;
    this.node = null;
    this.analyser = null;
  }
}
