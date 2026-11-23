import { SPECTRUM_POINTS, type Spectrum } from "./blobSynth";

const SKY = [134, 187, 216];
const YELLOW = [234, 176, 26];

// Layout relative to the blob's resting radius: the plot spans a little
// wider than the blob, sits on a baseline across its lower half, and loud
// frequencies rise well above it.
const HALF_WIDTH = 1.5;
const BASELINE = 0.55;
const HEIGHT = 1.7;

/**
 * Draws the synth's spectrum over the blob as a straight plot, low
 * frequencies on the left to high on the right, following the blob as it
 * moves.
 */
export default class SpectrumOverlay {
  private ctx: CanvasRenderingContext2D;
  private scale = 1;
  // Plot points, reused every frame.
  private xs = new Float32Array(SPECTRUM_POINTS);
  private ys = new Float32Array(SPECTRUM_POINTS);

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
  }

  resize() {
    const { canvas } = this;
    this.scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * this.scale);
    canvas.height = Math.round(canvas.clientHeight * this.scale);
  }

  /** `cx`, `cy` and `radius` are in CSS pixels. */
  draw(spectrum: Spectrum, cx: number, cy: number, radius: number) {
    const { ctx, canvas, scale, xs, ys } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (spectrum.level < 0.002) return;

    cx *= scale;
    cy *= scale;
    radius *= scale;
    const left = cx - radius * HALF_WIDTH;
    const width = radius * HALF_WIDTH * 2;
    const base = cy + radius * BASELINE;
    const height = radius * HEIGHT;

    const t = Math.min(Math.max((spectrum.centroid - 0.25) / 0.5, 0), 1);
    const rgb = SKY.map((c, i) => Math.round(c + (YELLOW[i] - c) * t)).join();
    const alpha = Math.min(spectrum.level * 4, 1);

    for (let i = 0; i < SPECTRUM_POINTS; i++) {
      xs[i] = left + (width * i) / (SPECTRUM_POINTS - 1);
      ys[i] = base - height * spectrum.curve[i] ** 1.5;
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Bars from the baseline up to every other point.
    ctx.strokeStyle = `rgba(${rgb},${0.22 * alpha})`;
    ctx.lineWidth = scale;
    ctx.beginPath();
    for (let i = 0; i < SPECTRUM_POINTS; i += 2) {
      ctx.moveTo(xs[i], base);
      ctx.lineTo(xs[i], ys[i]);
    }
    ctx.stroke();

    // The outline, smoothed by curving through the midpoints.
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < SPECTRUM_POINTS - 1; i++) {
      ctx.quadraticCurveTo(
        xs[i],
        ys[i],
        (xs[i] + xs[i + 1]) / 2,
        (ys[i] + ys[i + 1]) / 2,
      );
    }
    ctx.lineTo(xs[SPECTRUM_POINTS - 1], ys[SPECTRUM_POINTS - 1]);
    ctx.strokeStyle = `rgba(${rgb},${0.75 * alpha})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Close it down to the baseline for a fill that fades out downwards.
    ctx.lineTo(xs[SPECTRUM_POINTS - 1], base);
    ctx.lineTo(xs[0], base);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, base - height, 0, base);
    fill.addColorStop(0, `rgba(${rgb},${0.3 * alpha})`);
    fill.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = fill;
    ctx.fill();

    // A faint baseline.
    ctx.strokeStyle = `rgba(${rgb},${0.35 * alpha})`;
    ctx.lineWidth = scale;
    ctx.beginPath();
    ctx.moveTo(left, base);
    ctx.lineTo(left + width, base);
    ctx.stroke();

    ctx.restore();
  }
}
