export default function (state, { type, payload }) {
    switch (type) {
    case 'START':
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
	    showSlider: true,
	    checkbox: true,
	    slider: 0,
	    showSlider: false,
	    sectionNum: 0,
	    speedScaler: 1,
	    showTitle: false,
	    playGesture: false,
	    canvasCircleWidth: 300,
	    canvasCircleHeight: 300,
	    canvasVertWidth: 300,
	    canvasVertHeight: 100,
	    canvasHorizWidth: 100,
	    canvasHorizHeight: 300,
	    showMenu: true,
	};

    case 'SET_SECTION_1':
	return {
	    ...state,
	    showTitle: false,
	    sketchAudio1: true,
	    sketchAudio2: false,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: false,
	    readyToGo: true,
	    sliderMax: 64 / state.speedScaler,
	    showSlider: true,
	};
    case 'SET_SECTION_2':
	return {
	    ...state,
	    sketchAudio1: false,
	    sketchAudio2: true,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: false,
	    readyToGo: true,
	    sliderMax: 64 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	};
    case 'SET_SECTION_3':
	return {
	    ...state,
	    sketchAudio1: false,
	    sketchAudio2: false,
	    sketchAudio3: true,
	    sketchAudio4: false,
	    sketchAudio5: false,
	    readyToGo: true,
	    sliderMax: 64 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	};
    case 'SET_SECTION_4':
	return {
	    ...state,
	    sketchAudio1: false,
	    sketchAudio2: false,
	    sketchAudio3: false,
	    sketchAudio4: true,
	    sketchAudio5: false,
	    readyToGo: true,
	    sliderMax: 64 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	};
    case 'SET_SECTION_5':
	return {
	    ...state,
	  sketchAudio1: false,
	    sketchAudio2: false,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 64 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	};
    case 'SET_SECTION_6':
	return {
	    ...state,
	    sketchAudio1: false,
	    sketchAudio2: true,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 64 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 300,
	    canvasCircleHeight: 300,
	    canvasVertWidth: 100,
	    canvasVertHeight: 300,
	    canvasHorizWidth: 100,
	    canvasHorizHeight: 300,
	};
    case 'SET_SECTION_7':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: true,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 300,
	    canvasCircleHeight: 300,
	    canvasVertWidth: 100,
	    canvasVertHeight: 300,
	    canvasHorizWidth: 100,
	    canvasHorizHeight: 300,
	};
    case 'SET_SECTION_8':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: false,
	    sketchAudio3: true,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 500,
	    canvasCircleHeight: 500,
	    canvasVertWidth: 100,
	    canvasVertHeight: 300,
	    canvasHorizWidth: 300,
	    canvasHorizHeight: 500,	    

	};
    case 'SET_SECTION_9':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: true,
	    sketchAudio3: false,
	    sketchAudio4: true,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 500,
	    canvasCircleHeight: 500,
	    canvasVertWidth: 300,
	    canvasVertHeight: 500,
	    canvasHorizWidth: 500,
	    canvasHorizHeight: 500,
	};
    case 'SET_SECTION_10':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: false,
	    sketchAudio3: true,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 200,
	    canvasCircleHeight: 200,
	    canvasVertWidth: 100,
	    canvasVertHeight: 300,
	    canvasHorizWidth: 500,
	    canvasHorizHeight: 100,
	};
    case 'SET_SECTION_11':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: true,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 500,
	    canvasCircleHeight: 500,
	    canvasVertWidth: 300,
	    canvasVertHeight: 500,
	    canvasHorizWidth: 300,
	    canvasHorizHeight: 500,
	};
	case 'SET_SECTION_12':
	return {
	    ...state,
	    sketchAudio1: false,
	    sketchAudio2: true,
	    sketchAudio3: false,
	    sketchAudio4: true,
	    sketchAudio5: false,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 500,
	    canvasCircleHeight: 500,
	    canvasVertWidth: 300,
	    canvasVertHeight: 500,
	    canvasHorizWidth: 300,
	    canvasHorizHeight: 300,
	};
    case 'SET_SECTION_13':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: false,
	    sketchAudio3: false,
	    sketchAudio4: false,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 500,
	    canvasCircleHeight: 500,
	    canvasVertWidth: 300,
	    canvasVertHeight: 500,
	    canvasHorizWidth: 300,
	    canvasHorizHeight: 500,
	};
    case 'SET_SECTION_14':
	return {
	    ...state,
	    sketchAudio1: true,
	    sketchAudio2: true,
	    sketchAudio3: true,
	    sketchAudio4: true,
	    sketchAudio5: true,
	    readyToGo: true,
	    sliderMax: 128 / state.speedScaler,
	    showSlider: true,
	    slider: 0,
	    canvasCircleWidth: 300,
	    canvasCircleHeight: 300,
	    canvasVertWidth: 100,
	    canvasVertHeight: 300,
	    canvasHorizWidth: 100,
	    canvasHorizHeight: 300,
	};
	
    case 'INC_SECTION_NUM':
	return {
	    ...state,
	    sectionNum: state.sectionNum + 1,
	};
	
    case 'SET_PLAY_GESTURE':
        return {
            ...state,
            playGesture: true,
	    playButton: false,
	    pauseButton: true,
	    playError: false,
	    showSlider: true,
	    slider: state.slider >= 99 ? 0 : state.slider,
	    // sectionNum: state.sectionNum === 0 ? 1 : state.sectionNum,
	    readyToGo: false,
	    recordGesture: false,
	    showTitle: false,
        };
    case 'SHOW_ERROR':
	return {
	    ...state,
	    playError: true,
	    sectionNum: 0,
	};
    case 'SET_PAUSE_GESTURE':
        return {
            ...state,
            playGesture: false,
	    playButton: true,
	    pauseButton: false,
        };
    case 'SET_CHANGE':
        return {
            ...state,
            playGesture: false,
	    playButton: true,
	    pauseButton: false,
	    sectionNum: state.sectionNum + 1,
	    readyToGo: true,
        };

    case 'TOGGLE_RECORD_GESTURE':
        return {
            ...state,
            recordGesture: !state.recordGesture,
	    playError: false,
        };
    case 'TOGGLE_PLAY_GESTURE':
        return {
            ...state,
            playGesture: !state.playGesture,
	    playButton: !state.playButton,
	    pauseButton: !state.pauseButton,
	    recordGesture: false,
	    slider: 0,
        };
   
  
    case 'TOGGLE_SKETCH':
        return {
            ...state,
            [payload.key]: payload.value,
        };

    case 'SET_SLIDER_VALUE':
	return {
	    ...state,
	    slider: payload,
	};

    case 'INC_SLIDER_VALUE':
	return {
	    ...state,
	    slider: state.slider + 1,
	};

    case 'TOGGLE_SHOW_GESTURE':
	return {
	    ...state,
	    showGesture: !state.showGesture,
	};

    case 'SET_SPEED_SCALER':
	return {
	    ...state,
	    speedScaler: payload,
	};

    case 'GEN_IDS':
    	return {
    	    ...state,
    	    [payload.key]: payload.value,
		};
    case 'MOVE_SKETCH_1':
	return {
	    ...state,
	    sketch1Transform: payload,
	};
    default:
        return state;
    }
};
