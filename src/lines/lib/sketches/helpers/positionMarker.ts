import type { LinesSketch } from "../types";

export function drawPositionMarker(
  sketch: LinesSketch,
  x: number,
  y: number,
): void {
  sketch.fill("rgba(255,255,255,0.4)");
  sketch.noStroke();
  sketch.ellipse(x, y, 20);
}
