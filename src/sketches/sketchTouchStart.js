const sketchTouchStart = (sketch)  => {
    sketch.touchStarted = () => {
	sketch.userStartAudio();
	sketch.getAudioContext().resume();
	sketch.clear();
    };
};

export default sketchTouchStart;
