// How slow a frame can be, against the display's own refresh, before the
// resolution drops, and how fast before it can climb back.
const SLOW = 1.35;
const FAST = 1.15;
const MIN_SCALE = 0.35;
// Drawn frames to judge by, and the least time between changes, in ms.
const SAMPLE = 20;
const SETTLE = 1000;
const CLIMB_AFTER = 3000;

/**
 * Chooses what fraction of the full resolution to ray-march at, from how
 * fast drawn frames actually arrive. Phones differ enormously in GPU power,
 * so rather than guess, it lowers the resolution while frames come slower
 * than the display refreshes, and raises it again when there's headroom.
 *
 * It judges against the fastest frame interval it has seen, which is the
 * display's refresh period, so a 120Hz phone, a 60Hz laptop and an iPhone in
 * Low Power Mode (30fps) are each held to their own pace. A scale found too
 * slow becomes a ceiling it only creeps back towards, so it doesn't bounce
 * between two levels.
 */
export default class AdaptiveResolution {
  /** Fraction of the full resolution, per axis. */
  scale = 1;
  private refresh = Infinity;
  private average = 0;
  private samples = 0;
  private ceiling = 1;
  private changedAt = 0;

  /**
   * Call once per animation frame with the time since the last one and
   * whether that last one drew. Returns true when `scale` has changed.
   */
  frame(interval: number, drew: boolean, now: number) {
    // A pause (a hidden tab, a shader compiling) says nothing about speed.
    if (interval <= 0 || interval > 250) return false;
    // Idle frames don't draw, so they show the display's refresh period.
    this.refresh = Math.min(this.refresh, interval);
    if (!drew) return false;

    this.average = this.samples
      ? this.average * 0.9 + interval * 0.1
      : interval;
    this.samples++;
    if (this.samples < SAMPLE || now - this.changedAt < SETTLE) return false;

    if (this.average > this.refresh * SLOW && this.scale > MIN_SCALE) {
      this.ceiling = this.scale;
      return this.change(Math.max(MIN_SCALE, this.scale * 0.8), now);
    }
    if (
      this.average < this.refresh * FAST &&
      now - this.changedAt > CLIMB_AFTER
    ) {
      // Keep hoping: the ceiling drifts up while frames stay fast.
      this.ceiling = Math.min(1, this.ceiling * 1.02);
      const next = Math.min(this.scale * 1.1, this.ceiling * 0.95, 1);
      if (next > this.scale + 0.01) return this.change(next, now);
    }
    return false;
  }

  private change(scale: number, now: number) {
    this.scale = scale;
    this.changedAt = now;
    this.samples = 0;
    return true;
  }
}
