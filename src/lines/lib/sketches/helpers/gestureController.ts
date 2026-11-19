import type { AppState } from "../../state/types";
import type { LinesSketch } from "../types";
import { isHovering } from "./hover";
import { setPlaying } from "./playPause";

export interface GesturePosition {
  x: number;
  y: number;
}

export interface RecordedGesture {
  x: number[];
  y: number[];
}

export interface GestureControllerOptions {
  widthKey: keyof AppState;
  heightKey: keyof AppState;
  /** Logical (unscaled) canvas size that recorded x/y values were captured against. */
  xDivisor: number;
  yDivisor: number;
}

/**
 * Drives play/pause/record/gesture-replay for a sketch on every frame,
 * mutating `position` (the point to draw/react to) and `gesture` (the
 * in-progress recording, persisted to localStorage via p5's storeItem).
 */
export function handlePlayRecord(
  sketch: LinesSketch,
  position: GesturePosition,
  gesture: RecordedGesture,
  { widthKey, heightKey, xDivisor, yDivisor }: GestureControllerOptions,
): void {
  const { recordGesture, playGesture } = sketch.state;
  const width = sketch.state[widthKey] as number | undefined;
  const height = sketch.state[heightKey] as number | undefined;

  const hovering = isHovering(sketch);
  const dataKeyX = `${sketch.id}_X`;
  const dataKeyY = `${sketch.id}_Y`;
  const storedX = sketch.getItem(dataKeyX) as number[] | null;
  const storedY = sketch.getItem(dataKeyY) as number[] | null;
  const hasRecording = Boolean(storedX && storedY);

  if (hovering || (playGesture && hasRecording)) {
    setPlaying(sketch, true);
  }

  if (playGesture && !hasRecording) {
    sketch.dispatch({ type: "SET_PAUSE_GESTURE" });
    sketch.dispatch({ type: "SHOW_ERROR" });
  }

  if (!playGesture && !hovering) {
    setPlaying(sketch, false);
  }

  if (!playGesture) {
    position.x = sketch.mouseX;
    position.y = sketch.mouseY;
  }

  if (recordGesture) {
    sketch.dispatch({ type: "SET_PAUSE_GESTURE" });
  }

  if (recordGesture && hovering) {
    gesture.x.push(sketch.mouseX);
    gesture.y.push(sketch.mouseY);
    sketch.storeItem(dataKeyX, gesture.x);
    sketch.storeItem(dataKeyY, gesture.y);
  }

  if (playGesture && storedX && storedY) {
    if (storedX.length > 0 && width !== undefined) {
      position.x =
        (storedX[sketch.frameCount % storedX.length] / xDivisor) * width;
    }
    if (storedY.length > 0 && height !== undefined) {
      position.y =
        (storedY[sketch.frameCount % storedY.length] / yDivisor) * height;
    }
  }
}
