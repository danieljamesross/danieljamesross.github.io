const sketchRecordGesture = (sketch, gestureArrayX, gestureArrayY) => {
    console.log("Gesture Recording...");
    return () => {
	gestureArrayX[sketch.frameCount] = sketch.mouseX;
	gestureArrayX[sketch.frameCount] = sketch.mouseY;
    };
};

export default sketchRecordGesture;
