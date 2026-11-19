import type p5 from "p5";
import type { AppState, Dispatch } from "../state/types";

/**
 * Each sketch is handed extra properties by P5Canvas beyond the base p5
 * instance: the current app state/dispatch, an id used as the localStorage
 * key prefix for recorded gestures, whether it's currently "playing", and
 * (once preload() runs) the loaded audio file.
 */
export interface LinesSketch extends p5 {
  state: AppState;
  dispatch: Dispatch;
  id: string;
  p5playing: boolean;
  mySound: p5.SoundFile;
}

export type SketchFactory = () => (sketch: LinesSketch) => void;
