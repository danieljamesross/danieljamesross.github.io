import p5 from "p5";

/**
 * p5/lib/addons/p5.sound.js is a pre-bundled script written for a <script>
 * tag: it patches a bare global `p5`, not an imported one. ES module
 * evaluation order guarantees this file finishes running (including this
 * assignment) before any sibling import that comes after it in another
 * module's import list — see p5Sound.ts, which relies on that.
 */
if (typeof window !== "undefined") {
  (window as typeof window & { p5: typeof p5 }).p5 = p5;
}

export default p5;
