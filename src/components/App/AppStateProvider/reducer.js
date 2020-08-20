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
	    sliderMax: 100,
	    showSlider: false,
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

    case 'END':
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
	    showSlider: false,
	    speedScaler: 1,
	    sectionNum: 0,
	    showTitle: true,
	    playGesture: false,
	    canvasCircleWidth: 300,
	    canvasCircleHeight: 300,
	    canvasVertWidth: 300,
	    canvasVertHeight: 100,
	    canvasHorizWidth: 100,
	    canvasHorizHeight: 300,
	    showMenu: true,
	    readyToGo: false,
	};
	
    case 'SET_PLAY_GESTURE':
        return {
            ...state,
            playGesture: true,
	    playButton: false,
	    pauseButton: true,
	    playError: false,
	    showSlider: true,
	    sectionNum: state.sectionNum === 0 ? 1 : state.sectionNum,
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

    case 'SET_SECTION':
	return {
	    ...state,
	    ...payload,
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

 
    case 'SLIDER_MAX':
	return {
	    ...state,
	    playGesture: false,
	    playButton: true,
	    pauseButton: false,
	    sectionNum: state.sectionNum + 1,
	};

    default:
        return state;
    }
};
