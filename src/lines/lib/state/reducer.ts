import type { Action, AppState } from "./types";

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        sketchAudio1: true,
        sketchAudio2: true,
        sketchAudio3: true,
        sketchAudio4: true,
        sketchAudio5: true,
        startButton: false,
        recordButton: true,
        playButton: true,
        clearButton: true,
        checkbox: true,
        slider: 0,
        sliderMax: 100,
        speedScaler: 1,
        showTitle: false,
        playGesture: false,
        canvasCircleWidth: 300 * state.canvasScaler,
        canvasCircleHeight: 300 * state.canvasScaler,
        canvasVertWidth: 300 * state.canvasScaler,
        canvasVertHeight: 100 * state.canvasScaler,
        canvasHorizWidth: 100 * state.canvasScaler,
        canvasHorizHeight: 300 * state.canvasScaler,
        showMenu: true,
      };

    // Back to the start, with the controls START gives: the recording can be
    // played again (and paused), or a new one recorded.
    case "END":
      return {
        ...state,
        sketchAudio1: true,
        sketchAudio2: true,
        sketchAudio3: true,
        sketchAudio4: true,
        sketchAudio5: true,
        startButton: false,
        recordButton: true,
        playButton: true,
        pauseButton: false,
        clearButton: true,
        checkbox: true,
        slider: 0,
        sliderMax: 100,
        speedScaler: 1,
        sectionNum: 0,
        showTitle: false,
        playGesture: false,
        canvasCircleWidth: 300 * state.canvasScaler,
        canvasCircleHeight: 300 * state.canvasScaler,
        canvasVertWidth: 300 * state.canvasScaler,
        canvasVertHeight: 100 * state.canvasScaler,
        canvasHorizWidth: 100 * state.canvasScaler,
        canvasHorizHeight: 300 * state.canvasScaler,
        canvasScaler:
          typeof window !== "undefined" && window.innerWidth <= 600 ? 0.4 : 1,
        showMenu: true,
        readyToGo: false,
        trashed: false,
      };

    case "SET_PLAY_GESTURE":
      return {
        ...state,
        playGesture: true,
        playButton: false,
        pauseButton: true,
        playError: false,
        sectionNum: state.sectionNum === 0 ? 1 : state.sectionNum,
        readyToGo: false,
        recordGesture: false,
        showTitle: false,
        trashed: false,
      };

    case "SHOW_ERROR":
      return {
        ...state,
        playError: true,
        sectionNum: 0,
      };

    case "SET_PAUSE_GESTURE":
      return {
        ...state,
        playGesture: false,
        playButton: true,
        pauseButton: false,
      };

    case "SET_SECTION":
      return {
        ...state,
        trashed: false,
        ...action.payload,
      };

    case "TOGGLE_RECORD_GESTURE":
      return {
        ...state,
        recordGesture: !state.recordGesture,
        playError: false,
        trashed: false,
      };

    case "TOGGLE_PLAY_GESTURE":
      return {
        ...state,
        playGesture: !state.playGesture,
        playButton: !state.playButton,
        pauseButton: !state.pauseButton,
        recordGesture: false,
        trashed: false,
        slider: 0,
      };

    case "SET_SLIDER_VALUE":
      return {
        ...state,
        slider: action.payload,
      };

    case "INC_SLIDER_VALUE":
      return {
        ...state,
        slider: state.slider + 1,
      };

    case "TOGGLE_SHOW_GESTURE":
      return {
        ...state,
        showGesture: !state.showGesture,
        trashed: false,
      };

    case "SLIDER_MAX":
      return {
        ...state,
        playGesture: false,
        playButton: true,
        pauseButton: false,
        sectionNum: state.sectionNum + 1,
      };

    case "SET_COLOURS":
      return {
        ...state,
        circColour: action.payload.circColour,
        horizColour: action.payload.horizColour,
        vertColour: action.payload.vertColour,
      };

    case "SET_VERT_RMS":
      return {
        ...state,
        vertRms: action.payload,
      };

    case "SET_CIRC_RMS":
      return {
        ...state,
        circRms: action.payload,
      };

    case "SET_HORIZ_RMS":
      return {
        ...state,
        horizRms: action.payload,
      };

    case "TOGGLE_INFO":
      return {
        ...state,
        infoPage: !state.infoPage,
      };

    case "TRASHED":
      return {
        ...state,
        trashed: true,
      };

    case "SET_CANVAS_SCALER":
      return {
        ...state,
        canvasScaler: action.payload,
        canvasCircleWidth: 300 * action.payload,
        canvasCircleHeight: 300 * action.payload,
        canvasHorizWidth: 100 * action.payload,
        canvasHorizHeight: 300 * action.payload,
        canvasVertWidth: 300 * action.payload,
        canvasVertHeight: 100 * action.payload,
      };

    default:
      return state;
  }
}
