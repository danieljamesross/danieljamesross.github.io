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
    let offset = 1.05;
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

    sketchTouchStart(s);
    s.preload = () => {
        s.soundFormats('mp3', 'ogg', 'm4a');
        s.mySound = s.loadSound([
            'audio/sferics.mp3',
            'audio/sferics.ogg',
            'audio/sferics.m4a'
        ]);
    };

    s.setup = () => {
        const { canvasVertWidth, canvasVertHeight } = s.state;
        c = s.createCanvas(canvasVertWidth, canvasVertHeight);
        c.class('vert');
        s.mySound.setLoop(true);
        s.mySound.setVolume(0);
        analyzer = new p5.Amplitude();
        analyzer.setInput(s.mySound);
    };

    s.draw = () => {
        s.clear();
        if (!s.p5playing) {
            s.mySound.stop();
            s.clear();
        } else {
            if (s.getAudioContext().state === 'suspended') {
                s.userStartAudio();
                s.getAudioContext().resume();
            }

            if (s.getAudioContext().state === 'running') {
                handlePlayRecord();
                const {
                    canvasVertWidth,
                    canvasVertHeight,
                    playGesture,
                    vertColour
                } = s.state;

                if (playGesture) {
                    s.resizeCanvas(
                        canvasVertWidth * rms,
                        canvasVertHeight * rms
                    );
                    s.dispatch({ type: 'SET_VERT_RMS', payload: rms });
                    s.background(vertColour);
                }
                if (!playGesture) {
                    s.resizeCanvas(canvasVertWidth, canvasVertHeight);
                    s.clear();
                }
                drawLines();
                if (s.mySound.isPlaying()) {
                    moveLines();
                    const { showGesture } = s.state;
                    if (showGesture) posCircle(s, posX, posY);
                    s.mySound.rate(speed);
                }
                if (!s.mySound.isPlaying()) {
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
            const x =
                (s.deltaTime * offset + i * (s.width / (numLines - 1))) %
                s.width;
            s.line(x, 0, x, s.height);
        }
    };

    const moveLines = () => {
        const { speedScaler } = s.state;
        rms = s.map(analyzer.getLevel(), 0, 1, 0.9, 1.5);
        strokeVal = 180 * rms;
        strokeVal = s.constrain(strokeVal, 150, 255);
        offset = s.map(posX, 0, s.width, 20, 3) * rms;
        numLines = s.map(posX, 0, s.width, 4, 20);
        numLines = s.constrain(numLines, 4, 20);
        sW = s.map(posX, 0, s.width, 4, 0.1);
        sW = s.constrain(sW, 0.5, 4);
        speed = s.map(posX, 0.1, s.width, 0, 8) * speedScaler;
        speed = s.constrain(speed, 0.1, 8);
    };

    const resetLines = () => {
        numLines = 11;
        sW = 4;
        offset = 1.05;
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
            canvasVertWidth,
            canvasVertHeight
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
                    canvasVertWidth;
            }
            if (storedY.length > 0) {
                posY =
                    (storedY[s.frameCount % storedY.length] / 100) *
                    canvasVertHeight;
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
