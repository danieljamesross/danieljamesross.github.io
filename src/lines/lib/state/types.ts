export interface AppState {
  sketchAudio1: boolean;
  sketchAudio2: boolean;
  sketchAudio3: boolean;
  sketchAudio4: boolean;
  sketchAudio5: boolean;
  startButton: boolean;
  recordButton: boolean;
  playButton: boolean;
  pauseButton: boolean;
  clearButton: boolean;
  recordGesture: boolean;
  playGesture: boolean;
  playError: boolean;
  slider: number;
  showSlider: boolean;
  showGesture: boolean;
  checkbox: boolean;
  speedScaler: number;
  sectionNum: number;
  sliderMax: number;
  showTitle: boolean;
  changeSection: boolean;
  circColour: string;
  horizColour: string;
  vertColour: string;
  circRms: number;
  vertRms: number;
  horizRms: number;
  numSections: number;
  infoPage: boolean;
  trashed: boolean;
  canvasScaler: number;

  // Set once the piece has started (see the START/END/SET_SECTION actions).
  showMenu?: boolean;
  readyToGo?: boolean;
  canvasCircleWidth?: number;
  canvasCircleHeight?: number;
  canvasVertWidth?: number;
  canvasVertHeight?: number;
  canvasHorizWidth?: number;
  canvasHorizHeight?: number;
}

export type Colours = Pick<
  AppState,
  "circColour" | "horizColour" | "vertColour"
>;

export type Action =
  | { type: "START" }
  | { type: "END" }
  | { type: "SET_PLAY_GESTURE" }
  | { type: "SHOW_ERROR" }
  | { type: "SET_PAUSE_GESTURE" }
  | { type: "SET_SECTION"; payload: Partial<AppState> }
  | { type: "TOGGLE_RECORD_GESTURE" }
  | { type: "TOGGLE_PLAY_GESTURE" }
  | { type: "SET_SLIDER_VALUE"; payload: number }
  | { type: "INC_SLIDER_VALUE" }
  | { type: "TOGGLE_SHOW_GESTURE" }
  | { type: "SLIDER_MAX" }
  | { type: "SET_COLOURS"; payload: Colours }
  | { type: "SET_VERT_RMS"; payload: number }
  | { type: "SET_CIRC_RMS"; payload: number }
  | { type: "SET_HORIZ_RMS"; payload: number }
  | { type: "TOGGLE_INFO" }
  | { type: "TRASHED" }
  | { type: "SET_CANVAS_SCALER"; payload: number };

export type Dispatch = (action: Action) => void;

export type SketchAudioKey =
  | "sketchAudio1"
  | "sketchAudio2"
  | "sketchAudio3"
  | "sketchAudio4"
  | "sketchAudio5";

export type RecordedGesture = { x: number[]; y: number[] };
