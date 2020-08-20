import hoverSketch from './hoverSketch.js';
import playSketch from './playSketch.js';
import touchToStart from './touchToStart.js';
import sketchTouchStart from './sketchTouchStart.js';
import posCircle from './posCircle.js';
export default function (s) {
    s.state = {};
    s.dispatch = () => {};
    s.id = '';
    let strokeVal = 50;
    let offset = 1.1;
    let numLines = 11;
    let sW = 4;
    let speed = 1;
    let analyzer = null;
    let rms = 1;
    let gArrX = [];
    let gArrY = [];
    let posX = s.mouseX;
    let posY = s.mouseY;
    let c;
    
    s.preload = () => {
        s.soundFormats('mp3', 'ogg', 'm4a');
        s.mySound = s.loadSound(['audio/clm-lids.mp3', 'audio/clm-lids.ogg', 'audio/clm-lids.m4a']);
    };

    s.setup = () => {
	const { canvasHorizWidth, canvasHorizHeight } = s.state;
        c = s.createCanvas(canvasHorizWidth, canvasHorizHeight);
	c.class('horiz');
        s.mySound.setLoop(true);
	s.mySound.setVolume(0);
	analyzer = new p5.Amplitude();
	analyzer.setInput(s.mySound);
    };

    s.draw = () => {
	s.clear();
	if(!s.p5playing) {
	    s.mySound.stop();
	} else {
	    if (s.getAudioContext().state === 'suspended') {
		s.userStartAudio();
		s.getAudioContext().resume();
	    }
	    
	    if (s.getAudioContext().state === 'running') {
		
		handlePlayRecord();
		const { canvasHorizWidth, canvasHorizHeight,
			playGesture, slider, sliderMax, sectionNum } = s.state;
		
		let g = s.map(slider, 0, sliderMax, 10, 20);
		
		if(playGesture)	{
		    s.resizeCanvas(canvasHorizWidth * rms, canvasHorizHeight * rms);
		    s.background(g + sectionNum, 24, 60 * rms);
		    if(sectionNum > 5) c.class('horiz float');
		};
		if (!playGesture) {
		    s.resizeCanvas(canvasHorizWidth, canvasHorizHeight);
		    s.clear();
		    c.class('horiz');
		}
		
		drawLines();
		if (s.mySound.isPlaying()) {
		    moveLines();
		    const { showGesture } = s.state;
		    if (showGesture) posCircle(s, posX, posY);
		    s.mySound.rate(speed);
		}
		if(!s.mySound.isPlaying()) {
		    resetLines();
		}
	    }
	}
    };
    const drawLines = () => {
	s.strokeWeight(sW);
	s.stroke(255, strokeVal);
	s.noFill();
	for (let i = 1; i < numLines; i++) {
	    const y = ((s.deltaTime * offset) +
			  (i * (s.height / (numLines - 1))))
	    % s.height;
	    s.line(0, y, s.width, y);
	}
    };

    const moveLines = () => {
	const { speedScaler } = s.state;
	rms = s.map(analyzer.getLevel(), 0, 1, 0.9, 1.5);
	strokeVal = 180 * rms;
	strokeVal = s.constrain(strokeVal, 150, 255);
	offset = s.map(posY, 0, s.height, 20, 5) * rms * speedScaler;
	numLines = s.map(posY, 0, s.height, 20, 6);
	sW = s.map(posY, 0, s.height, 1, 4);
	speed = s.map(posY, 0, s.height, 16, 0.1) * speedScaler;
	speed = s.constrain(speed, 0.1, 16);
    };

    const resetLines = () => {
	numLines = 7;
	sW = 4;
	offset = 1.001;
	strokeVal = 50;
	rms = 0.9;
	gArrX = [];
	gArrY = [];
    };
    const handlePlayRecord = () => {
	const { recordGesture, playGesture, recordedData } = s.state;
	const hovering = hoverSketch(s);
	const sketchDataX = s.id + '_X';
	const sketchDataY = s.id + '_Y';
	let storedX = s.getItem(sketchDataX);
	let storedY = s.getItem(sketchDataY);
	if (hovering
	    || (hovering && recordGesture)
	    || (playGesture && storedX && storedY)) {
	    playSketch(s, true);
	};

	if (playGesture && !storedX && !storedY) {
	    s.dispatch({type: 'SET_PAUSE_GESTURE'});
	    s.dispatch({type: 'SHOW_ERROR'});
	};
	
	if ((!playGesture && !hovering)
	    || (!recordGesture && !hovering && !s.mySound.isPlaying)
	    || (!playGesture && !hovering && !recordGesture)) {
	    playSketch(s, false);
	};
	
	if (!playGesture) {
	    posX = s.mouseX;
	    posY = s.mouseY;
	};
	
	if (recordGesture) {
	    s.dispatch({type: 'SET_PAUSE_GESTURE'});
	};
	
	if (recordGesture && hovering) {
	    gArrX.push(s.mouseX);
	    gArrY.push(s.mouseY);
	    s.storeItem(sketchDataX, gArrX);
	    s.storeItem(sketchDataY, gArrY);
	};
	
	if (playGesture && storedX && storedY) {
	    if (storedX.length > 0) {
		posX = storedX[s.frameCount % storedX.length];
	    }
	    if (storedY.length > 0) {
		posY = storedY[s.frameCount % storedY.length];
	    }
	    if (!storedX) {
		posX = 0;
	    }
	    if (!storedY) {
		posY = 0;
	    }
	};
    };
}
