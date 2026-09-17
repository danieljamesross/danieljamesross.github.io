/**
 * @types/p5 already types the p5.sound addon (see
 * node_modules/@types/p5/lib/addons/p5.sound.d.ts), but it ships no module
 * declaration for the addon's own side-effect import path, which is needed
 * at runtime to actually patch sound support onto the p5 prototype.
 */
declare module "p5/lib/addons/p5.sound.js";
