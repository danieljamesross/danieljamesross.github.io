import type { LinesSketch } from "../types";

/** @types/p5 types p5.sound's getAudioContext() as `object`; it's always an AudioContext. */
export function getAudioContext(sketch: LinesSketch): AudioContext {
  return sketch.getAudioContext() as unknown as AudioContext;
}
