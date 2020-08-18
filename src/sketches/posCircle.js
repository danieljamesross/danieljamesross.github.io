const posCircle = (sketch, x, y) => {
    sketch.fill('rgba(255,255,255,0.4)');
    sketch.noStroke();
    sketch.ellipse(x, y, 20);
};

export default posCircle;
