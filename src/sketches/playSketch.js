const playSketch = (sketch, play) => {
    // if (sketch.gesturePaused) {
    // 	sketch.mySound.stop();
    // 	return false;
    // }
    if (play && !sketch.mySound.isPlaying()) {
	sketch.mySound.setVolume(0.9, 0.01);
	sketch.mySound.play(0.015);
	return true;
    }
    if (play && sketch.mySound.isPlaying()) {
	return true;
    }
    if (!play && sketch.mySound.isPlaying()) {
	sketch.mySound.setVolume(0, 0.05);
	sketch.mySound.pause(0.06);
 	return false;
    }
    if (!play && !sketch.mySound.isPlaying()) {
 	return false;
    }
    return false;
};

export default playSketch;
