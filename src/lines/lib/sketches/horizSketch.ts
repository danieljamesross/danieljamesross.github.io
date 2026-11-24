import p5 from "./p5Sound";
import { getAudioContext } from "./helpers/audioContext";
import { handlePlayRecord } from "./helpers/gestureController";
import { loadLoopingSound } from "./helpers/loopingSound";
import { drawPositionMarker } from "./helpers/positionMarker";
import type { LinesSketch } from "./types";

export function horizSketch(s: LinesSketch): void {
  let strokeVal = 50;
  let offset = 1.1;
  let numLines = 11;
  let strokeW = 4;
  let speed = 1;
  let analyzer: p5.Amplitude | null = null;
  let rms = 1;
  const gesture = { x: [] as number[], y: [] as number[] };
  const position = { x: s.mouseX, y: s.mouseY };
  let audioContext: AudioContext;

  s.setup = () => {
    const { canvasHorizWidth = 100, canvasHorizHeight = 300 } = s.state;
    s.createCanvas(canvasHorizWidth, canvasHorizHeight).class("horiz");
    audioContext = getAudioContext(s);
    s.userStartAudio();
    s.mySound = loadLoopingSound(s, [
      "/audio/lines/clm-lids.mp3",
      "/audio/lines/clm-lids.ogg",
      "/audio/lines/clm-lids.m4a",
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
        widthKey: "canvasHorizWidth",
        heightKey: "canvasHorizHeight",
        xDivisor: 100,
        yDivisor: 300,
      });
    }

    const {
      canvasHorizWidth = 100,
      canvasHorizHeight = 300,
      playGesture,
      horizColour,
    } = s.state;

    if (playGesture) {
      s.resizeCanvas(canvasHorizWidth * rms, canvasHorizHeight * rms);
      s.dispatch({ type: "SET_HORIZ_RMS", payload: rms });
      s.background(horizColour);
    } else {
      s.resizeCanvas(canvasHorizWidth, canvasHorizHeight);
      s.clear();
    }

    drawLines();

    if (s.mySound.isPlaying()) {
      moveLines();
      if (s.state.showGesture) drawPositionMarker(s, position.x, position.y);
      s.mySound.rate(speed);
    } else {
      resetLines();
    }
  };

  const drawLines = () => {
    s.strokeWeight(strokeW);
    s.stroke(255, strokeVal);
    s.noFill();
    for (let i = 1; i < numLines; i++) {
      const y =
        (s.deltaTime * offset + i * (s.height / (numLines - 1))) % s.height;
      s.line(0, y, s.width, y);
    }
  };

  const moveLines = () => {
    const { speedScaler } = s.state;
    rms = s.map(analyzer!.getLevel(), 0, 1, 0.9, 1.5);
    strokeVal = s.constrain(180 * rms, 150, 255);
    offset = s.map(position.y, 0, s.height, 20, 5) * rms * speedScaler;
    numLines = s.map(position.y, 0, s.height, 20, 6);
    strokeW = s.map(position.y, 0, s.height, 1, 4);
    speed = s.constrain(
      s.map(position.y, 0, s.height, 16, 0.1) * speedScaler,
      0.1,
      16,
    );
  };

  const resetLines = () => {
    numLines = 7;
    strokeW = 4;
    offset = 1.001;
    strokeVal = 50;
    rms = 0.9;
    gesture.x = [];
    gesture.y = [];
  };
}
