import type p5 from "p5";
import type { LinesSketch } from "../types";

/**
 * Starts loading a sketch's sound, set to loop silently once it arrives,
 * and returns it at once. Loading it in preload() instead made p5 hold back
 * setup() and draw(), so no lines appeared until every sound file had
 * downloaded; now they draw straight away and play once their sound is in
 * (setPlaying waits for it).
 */
export function loadLoopingSound(
  sketch: LinesSketch,
  files: string[],
): p5.SoundFile {
  const sound = sketch.loadSound(files, () => {
    sound.setLoop(true);
    sound.setVolume(0);
  });
  return sound;
}
