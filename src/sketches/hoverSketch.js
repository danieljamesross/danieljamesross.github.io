const hoverSketch = (sketch) => {
    if (sketch.mouseX > 0 &&
	sketch.mouseX < sketch.width
	&& sketch.mouseY > 0
	&& sketch.mouseY < sketch.height) {
	return true;
    }
     else {
 	 return false;
     }
};

export default hoverSketch;
