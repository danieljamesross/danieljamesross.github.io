import p5 from "./p5Sound";
import { getAudioContext } from "./helpers/audioContext";
import { handlePlayRecord } from "./helpers/gestureController";
import { loadLoopingSound } from "./helpers/loopingSound";
import { drawPositionMarker } from "./helpers/positionMarker";
import type { LinesSketch } from "./types";

export function circleSketch(s: LinesSketch): void {
  let strokeVal = 50;
  let offset = 1.1;
  let numCircles = 6;
  let strokeW = 4;
  let speed = 1;
  let analyzer: p5.Amplitude | null = null;
  let rms = 1;
  const gesture = { x: [] as number[], y: [] as number[] };
  const position = { x: s.mouseX, y: s.mouseY };
  let audioContext: AudioContext;

  s.setup = () => {
    const { canvasCircleWidth = 300, canvasCircleHeight = 300 } = s.state;
    s.createCanvas(canvasCircleWidth, canvasCircleHeight).class("circ");
    audioContext = getAudioContext(s);
    s.userStartAudio();
    s.mySound = loadLoopingSound(s, [
      "/audio/lines/choir.mp3",
      "/audio/lines/choir.ogg",
      "/audio/lines/choir.m4a",
    ]);
    analyzer = new p5.Amplitude();
    analyzer.setInput(s.mySound);
  };

  s.draw = () => {
    s.clear();

    if (!s.p5playing) return;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Gestures and sound wait for audio to be running, but the lines are
    // drawn every frame regardless: skipping them blanked every sketch for
    // a few frames whenever the AudioContext they share paused.
    if (audioContext.state === "running") {
      handlePlayRecord(s, position, gesture, {
        widthKey: "canvasCircleWidth",
        heightKey: "canvasCircleHeight",
        xDivisor: 300,
        yDivisor: 300,
      });
    }

    const {
      canvasCircleWidth = 300,
      canvasCircleHeight = 300,
      playGesture,
      circColour,
    } = s.state;

    if (playGesture) {
      s.resizeCanvas(canvasCircleWidth * rms, canvasCircleWidth * rms);
      s.dispatch({ type: "SET_CIRC_RMS", payload: rms });
      s.background(circColour);
    } else {
      s.resizeCanvas(canvasCircleWidth, canvasCircleHeight);
      s.clear();
    }

    drawCircles();

    if (s.mySound.isPlaying()) {
      moveCircles();
      if (s.state.showGesture) drawPositionMarker(s, position.x, position.y);
      s.mySound.rate(speed * s.state.speedScaler);
    } else {
      resetCircles();
    }
  };

  const drawCircles = () => {
    s.strokeWeight(strokeW);
    s.stroke(255, strokeVal);
    s.noFill();
    for (let i = 1; i < numCircles; i++) {
      const diam =
        (s.deltaTime * offset + i * (s.height / (numCircles - 1))) %
        (s.height - 1);
      s.ellipse(s.width / 2, s.height / 2, diam * rms);
    }
  };

  const moveCircles = () => {
    rms = s.constrain(s.map(analyzer!.getLevel(), 0, 1, 0.8, 2), 0.5, 1);
    strokeVal = s.constrain(180 * rms, 150, 255);
    offset = s.map(position.y, 0, s.height, 20, 5);
    numCircles = s.constrain(s.map(position.y, 0, s.height, 20, 5), 6, 20);
    strokeW = s.constrain(s.map(position.y, 0, s.height, 0.1, 4), 1, 20);
    speed = s.constrain(s.map(position.y, 0, s.height, 2, 0.1), 0.3, 4);
  };

  const resetCircles = () => {
    numCircles = 6;
    strokeW = 4;
    offset = 1.1;
    strokeVal = 50;
    rms = 1;
    gesture.x = [];
    gesture.y = [];
  };
}
