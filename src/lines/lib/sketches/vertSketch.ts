import p5 from "p5";
import { getAudioContext } from "./helpers/audioContext";
import { handlePlayRecord } from "./helpers/gestureController";
import { drawPositionMarker } from "./helpers/positionMarker";
import type { LinesSketch } from "./types";

export function vertSketch(s: LinesSketch): void {
  let strokeVal = 50;
  let offset = 1.05;
  let numLines = 11;
  let strokeW = 4;
  let speed = 1;
  let analyzer: p5.Amplitude | null = null;
  let rms = 1;
  const gesture = { x: [] as number[], y: [] as number[] };
  const position = { x: s.mouseX, y: s.mouseY };
  let audioContext: AudioContext;

  s.preload = () => {
    s.mySound = s.loadSound([
      "/audio/lines/sferics.mp3",
      "/audio/lines/sferics.ogg",
      "/audio/lines/sferics.m4a",
    ]);
  };

  s.setup = () => {
    const { canvasVertWidth = 300, canvasVertHeight = 100 } = s.state;
    s.createCanvas(canvasVertWidth, canvasVertHeight).class("vert");
    audioContext = getAudioContext(s);
    s.userStartAudio();
    s.mySound.setLoop(true);
    s.mySound.setVolume(0);
    analyzer = new p5.Amplitude();
    analyzer.setInput(s.mySound);
  };

  s.draw = () => {
    s.clear();

    if (audioContext.state === "suspended" && s.p5playing) {
      audioContext.resume();
    }

    if (audioContext.state === "running" && s.p5playing) {
      handlePlayRecord(s, position, gesture, {
        widthKey: "canvasVertWidth",
        heightKey: "canvasVertHeight",
        xDivisor: 300,
        yDivisor: 100,
      });

      const {
        canvasVertWidth = 300,
        canvasVertHeight = 100,
        playGesture,
        vertColour,
      } = s.state;

      if (playGesture) {
        s.resizeCanvas(canvasVertWidth * rms, canvasVertHeight * rms);
        s.dispatch({ type: "SET_VERT_RMS", payload: rms });
        s.background(vertColour);
      } else {
        s.resizeCanvas(canvasVertWidth, canvasVertHeight);
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
    }
  };

  const drawLines = () => {
    s.strokeWeight(strokeW);
    s.stroke(255, strokeVal);
    s.noFill();
    for (let i = 1; i < numLines; i++) {
      const x =
        (s.deltaTime * offset + i * (s.width / (numLines - 1))) % s.width;
      s.line(x, 0, x, s.height);
    }
  };

  const moveLines = () => {
    const { speedScaler } = s.state;
    rms = s.map(analyzer!.getLevel(), 0, 1, 0.9, 1.5);
    strokeVal = s.constrain(180 * rms, 150, 255);
    offset = s.map(position.x, 0, s.width, 20, 3) * rms;
    numLines = s.constrain(s.map(position.x, 0, s.width, 4, 20), 4, 20);
    strokeW = s.constrain(s.map(position.x, 0, s.width, 4, 0.1), 0.5, 4);
    speed = s.constrain(
      s.map(position.x, 0.1, s.width, 0, 8) * speedScaler,
      0.1,
      8
    );
  };

  const resetLines = () => {
    numLines = 11;
    strokeW = 4;
    offset = 1.05;
    strokeVal = 50;
    rms = 1;
    gesture.x = [];
    gesture.y = [];
  };
}
