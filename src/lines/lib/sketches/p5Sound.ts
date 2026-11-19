import p5 from "./p5Global";
import "p5/lib/addons/p5.sound.js";

/**
 * Import p5 from here (not "p5" directly) wherever code needs
 * p5.Amplitude/loadSound/etc. — this guarantees the sound addon has been
 * loaded first. Side-effect imports are cached, so this is cheap no matter
 * how many modules import it.
 */
export default p5;

let soundReady: Promise<void> | null = null;

/**
 * p5.sound loads its AudioWorklet modules from an `init` hook on every new
 * p5 instance until the first load finishes. Creating several sketches at
 * once therefore re-registers the processors ("sound-file-processor is
 * already registered"), and any instance whose load fails stays stuck in
 * preload forever. Booting one throwaway instance first and waiting for its
 * setup() means every real sketch sees the worklets as already loaded.
 */
export function whenSoundReady(): Promise<void> {
  soundReady ??= new Promise((resolve) => {
    new p5((s: p5) => {
      s.setup = () => {
        s.noCanvas();
        s.noLoop();
        resolve();
      };
    }, document.createElement("div"));
  });
  return soundReady;
}
