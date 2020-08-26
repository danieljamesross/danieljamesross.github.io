const playSketch = (sketch, play) => {
    if (play && !sketch.mySound.isPlaying()) {
        sketch.mySound.setVolume(0);
        sketch.mySound.play();
        sketch.mySound.setVolume(0.9, 0.01);
        return true;
    }
    if (play && sketch.mySound.isPlaying()) {
        return true;
    }
    if (!play && sketch.mySound.isPlaying()) {
        sketch.mySound.setVolume(0, 0.01);
        sketch.mySound.pause(0.02);
        return false;
    }
    if (!play && !sketch.mySound.isPlaying()) {
        return false;
    }
    return false;
};

export default playSketch;
