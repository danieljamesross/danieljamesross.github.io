import type { LinesSketch } from "../types";

export function isHovering(sketch: LinesSketch): boolean {
  return (
    sketch.mouseX > 0 &&
    sketch.mouseX < sketch.width &&
    sketch.mouseY > 0 &&
    sketch.mouseY < sketch.height
  );
}
