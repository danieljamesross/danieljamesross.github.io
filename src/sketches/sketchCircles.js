export default function (s) {
    s.state = {}
    s.dispatch = () => {}
    s.canvasWidth = {}
    s.canvasHeight = {}
    s.audioFiles
    let thisPlay = false
    let touched = false
    let strokeVal = 50
    let offset = 1.1
    let numCircles = 6
    let sW = 4
    let speed = 1
    let analyzer = null
    let rms = 1
    
    s.preload = () => {
        s.soundFormats('mp3', 'ogg', 'm4a')
        s.mySound = s.loadSound(['audio/choir.mp3', 'audio/choir.ogg', 'audio/choir.m4a'])
    }

    s.setup = () => {
        s.createCanvas(s.canvasWidth, s.canvasHeight)
        s.mySound.setLoop(true)
	s.mySound.setVolume(0)
	analyzer = new p5.Amplitude();

	// Patch the input to an volume analyzer
	analyzer.setInput(s.mySound);
    }

    s.draw = () => {
	s.background(10, 25, 48)
	if (s.getAudioContext().state === 'suspended') {
	    s.fill(255, 50)
	    s.text('Touch to start',
		   s.width * 0.1, s.height * 0.1, s.width * 0.8,
		   s.height * 0.8)
	} else if (s.getAudioContext().state === 'running') {
	    hoverSketch()
	    s.strokeWeight(sW)
	    s.stroke(255, strokeVal)
	    s.noFill()
	    for (let i = 1; i < numCircles; i++) {
		const diam = ((s.deltaTime * offset) + (i * (s.height / numCircles))) % (s.height - 4)
		s.ellipse(s.width / 2, s.height / 2, diam * rms)
	    }
	    if (thisPlay) {
		rms = s.map(analyzer.getLevel(), 0, 1, 0.8, 2)
		rms = s.constrain(rms, 0.5, 1)
		strokeVal = 180 * rms
		strokeVal = s.constrain(strokeVal, 150, 255)
		offset = s.map(s.mouseY, 0, s.height, 20, 5)
		numCircles = s.map(s.mouseY, 0, s.height, 20, 5)
		numCircles = s.constrain(numCircles, 6, 20)
		sW = s.map(s.mouseY, 0, s.height, 0.1, 4)
		sW = s.constrain(sW, 1, 20)

		s.stroke(255, 127)
		s.strokeWeight(1)

		speed = s.map(s.mouseY, 0, s.height, 2, 0.1)
		speed = s.constrain(speed, 0.3, 4)
		s.mySound.rate(speed);
		/* 
		   s.stroke(255, 127)
		   s.strokeWeight(1)
		   for (let index = 0; index < s.width; index += 4) {
		 * const height = 100 * s.noise((s.frameCount + index) / 10)
		 * const y1 = s.height * 2 / 3 - height / 2
		 * const y2 = s.height * 2 / 3 + height / 2
		 * s.line(index, y1, index, y2)
		   } */
            }
            else {
		numCircles = 6
		sW = 4
		offset = 1.1
		strokeVal = 50
		rms = 0.8
            }
	}
    }

    s.touchStarted = ()  => {
	s.getAudioContext().resume()
	s.clear()
    }

    let hoverSketch = () => {

        if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY <
            s.height) {

            if (thisPlay === false) {
		s.mySound.setVolume(0.9, 0.01)
		s.mySound.play(0.015)
		console.log('over')
		
		thisPlay = true
            }
	}
        else {
	    s.mySound.setVolume(0, 0.05)
	    s.mySound.pause(0.06)
	    thisPlay = false
        }
    }
}
