import p5 from "./p5Global";
import "p5/lib/addons/p5.sound.js";

/**
 * Import p5 from here (not "p5" directly) wherever code needs
 * p5.Amplitude/loadSound/etc. — this guarantees the sound addon has been
 * loaded first. Side-effect imports are cached, so this is cheap no matter
 * how many modules import it.
 */
export default p5;
