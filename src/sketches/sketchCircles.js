import hoverSketch from './hoverSketch.js';
import playSketch from './playSketch.js';
import posCircle from './posCircle.js';
export default function (s) {
    s.state = {};
    s.dispatch = () => {};
    s.id = '';
    s.p5playing = true;
    let strokeVal = 50;
    let offset = 1.1;
    let numCircles = 6;
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
        s.mySound = s.loadSound([
            'audio/choir.mp3',
            'audio/choir.ogg',
            'audio/choir.m4a'
        ]);
    };

    s.setup = () => {
        const { canvasCircleWidth, canvasCircleHeight } = s.state;
        c = s.createCanvas(canvasCircleWidth, canvasCircleHeight);
        c.class('circ');
        s.mySound.setLoop(true);
        s.mySound.setVolume(0);
        analyzer = new p5.Amplitude();
        analyzer.setInput(s.mySound);
    };

    s.draw = () => {
        s.clear();
        if (s.getAudioContext().state === 'suspended' && s.p5playing) {
            s.userStartAudio();
            s.getAudioContext().resume();
        }

        if (s.getAudioContext().state === 'running' && s.p5playing) {
            handlePlayRecord(s);
            const {
                canvasCircleWidth,
                canvasCircleHeight,
                playGesture,
                circColour
            } = s.state;

            if (playGesture) {
                s.resizeCanvas(
                    canvasCircleWidth * rms,
                    canvasCircleWidth * rms
                );
                s.dispatch({ type: 'SET_CIRC_RMS', payload: rms });
                s.background(circColour);
            }
            if (!playGesture) {
                s.resizeCanvas(canvasCircleWidth, canvasCircleHeight);
                s.clear();
                // c.class('circ');
            }
            drawCircs();
            if (s.mySound.isPlaying()) {
                const { showGesture } = s.state;
                moveCircs();

                if (showGesture) posCircle(s, posX, posY);
                s.mySound.rate(speed);
            }
            if (!s.mySound.isPlaying()) {
                resetCircs();
            }
        }
    };

    const drawCircs = () => {
        s.strokeWeight(sW);
        s.stroke(255, strokeVal);
        s.noFill();
        for (let i = 1; i < numCircles; i++) {
            const diam =
                (s.deltaTime * offset + i * (s.height / (numCircles - 1))) %
                (s.height - 1);
            s.ellipse(s.width / 2, s.height / 2, diam * rms);
        }
    };

    const moveCircs = () => {
        const { speedScaler } = s.state;
        rms = s.map(analyzer.getLevel(), 0, 1, 0.8, 2);
        rms = s.constrain(rms, 0.5, 1);
        strokeVal = 180 * rms;
        strokeVal = s.constrain(strokeVal, 150, 255);
        offset = s.map(posY, 0, s.height, 20, 5);
        numCircles = s.map(posY, 0, s.height, 20, 5);
        numCircles = s.constrain(numCircles, 6, 20);
        sW = s.map(posY, 0, s.height, 0.1, 4);
        sW = s.constrain(sW, 1, 20);

        s.stroke(255, 127);
        s.strokeWeight(1);

        speed = s.map(posY, 0, s.height, 2, 0.1);
        speed = s.constrain(speed, 0.3, 4);
    };

    const resetCircs = () => {
        numCircles = 6;
        sW = 4;
        offset = 1.1;
        strokeVal = 50;
        rms = 1;
        gArrX = [];
        gArrY = [];
    };
    const handlePlayRecord = () => {
        const {
            recordGesture,
            playGesture,
            recordedData,
            canvasCircleHeight,
            canvasCircleWidth
        } = s.state;
        const hovering = hoverSketch(s);
        const sketchDataX = s.id + '_X';
        const sketchDataY = s.id + '_Y';
        let storedX = s.getItem(sketchDataX);
        let storedY = s.getItem(sketchDataY);
        if (
            hovering ||
            (hovering && recordGesture) ||
            (playGesture && storedX && storedY)
        ) {
            playSketch(s, true);
        }

        if (playGesture && !storedX && !storedY) {
            s.dispatch({ type: 'SET_PAUSE_GESTURE' });
            s.dispatch({ type: 'SHOW_ERROR' });
        }

        if (
            (!playGesture && !hovering) ||
            (!recordGesture && !hovering && !s.mySound.isPlaying) ||
            (!playGesture && !hovering && !recordGesture)
        ) {
            playSketch(s, false);
        }

        if (!playGesture) {
            posX = s.mouseX;
            posY = s.mouseY;
        }

        if (recordGesture) {
            s.dispatch({ type: 'SET_PAUSE_GESTURE' });
        }

        if (recordGesture && hovering) {
            gArrX.push(s.mouseX);
            gArrY.push(s.mouseY);
            s.storeItem(sketchDataX, gArrX);
            s.storeItem(sketchDataY, gArrY);
        }

        if (playGesture && storedX && storedY) {
            if (storedX.length > 0) {
                posX =
                    (storedX[s.frameCount % storedX.length] / 300) *
                    canvasCircleWidth;
            }
            if (storedY.length > 0) {
                posY =
                    (storedY[s.frameCount % storedY.length] / 300) *
                    canvasCircleHeight;
            }
            if (!storedX) {
                posX = 0;
            }
            if (!storedY) {
                posY = 0;
            }
        }
    };
}
