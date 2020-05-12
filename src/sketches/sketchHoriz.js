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
    let numLines = 11
    let sW = 4
    let speed = 1
    let analyzer = null
    let rms = 1
    
    s.preload = () => {
        s.soundFormats('mp3', 'ogg', 'm4a')
        s.mySound = s.loadSound(['audio/clm-lids.mp3', 'audio/clm-lids.ogg', 'audio/clm-lids.m4a'])
    }

    s.setup = () => {
        s.createCanvas(s.canvasWidth, s.canvasHeight)
        s.mySound.setLoop(true)
	s.mySound.setVolume(0)
	analyzer = new p5.Amplitude();
	analyzer.setInput(s.mySound);
    }

    s.draw = () => {
	s.background(10, 25, 48)
	if (s.getAudioContext().state === 'suspended') {
	    s.fill(255, 50)
	    s.text('Touch to start',
		   s.width * 0.1, s.height * 0.1, s.width * 0.8, s.height * 0.8)
	} else if (s.getAudioContext().state === 'running') {
	    hoverSketch()
	    s.strokeWeight(sW)
	    s.stroke(255, strokeVal)
	    s.noFill()
	    for (let i = 1; i < numLines; i++) {
		const y = ((s.deltaTime * offset) + (i * (s.height / numLines))) % s.height
		s.line(0, y, s.width, y)
	    }
	    if (thisPlay) {
		rms = s.map(analyzer.getLevel(), 0, 1, 0.9, 1.5)
		strokeVal = 180 * rms
		strokeVal = s.constrain(strokeVal, 150, 255)
		offset = s.map(s.mouseY, 0, s.height, 20, 5) * rms
		numLines = s.map(s.mouseY, 0, s.height, 20, 6)
		sW = s.map(s.mouseY, 0, s.height, 1, 4)
		speed = s.map(s.mouseY, 0, s.height, 16, 0.1);
		s.mySound.rate(speed)
            }
            else {
		numLines = 7
		sW = 4
		offset = 1.1
		strokeVal = 50
		rms = 0.9
            }
	}
    }

    s.touchStarted = ()  => {
	s.getAudioContext().resume()
	s.clear()
    }

    let hoverSketch = () => {
        if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY < s.height) {
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
