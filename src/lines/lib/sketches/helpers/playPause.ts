import type { LinesSketch } from "../types";
import { getAudioContext } from "./audioContext";

export function setPlaying(sketch: LinesSketch, play: boolean): boolean {
  const playing = sketch.mySound.isPlaying();

  if (play && !playing) {
    getAudioContext(sketch).resume();
    sketch.mySound.setVolume(0);
    sketch.mySound.play();
    sketch.mySound.setVolume(0.9, 0.01);
    return true;
  }
  if (play && playing) {
    return true;
  }
  if (!play && playing) {
    sketch.mySound.setVolume(0, 0.01);
    sketch.mySound.pause(0.02);
    getAudioContext(sketch).suspend();
    return false;
  }
  return false;
}

/**
 * Fades a sketch's sound out without suspending the AudioContext, which
 * every sketch plays through, so the others carry on.
 */
export function silence(sketch: LinesSketch): void {
  if (!sketch.mySound?.isPlaying()) return;
  sketch.mySound.setVolume(0, 0.01);
  sketch.mySound.pause(0.02);
}
