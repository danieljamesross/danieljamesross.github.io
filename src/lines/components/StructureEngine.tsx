"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppState } from "@/lines/lib/state/context";
import type { SketchAudioKey } from "@/lines/lib/state/types";

function readRecordedAxis(key: string): number[] | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as number[];
  } catch {
    return null;
  }
}

/** Side-effect-only component: drives the auto-playing "structure" once the piece is running. */
export default function StructureEngine() {
  const dispatch = useAppDispatch();
  const { sectionNum, readyToGo, numSections, canvasScaler } = useAppState();

  useEffect(() => {
    let scaler: number | null = null;
    const w = window.innerWidth;
    if (sectionNum > 0) {
      if (w < 600) scaler = 0.9;
      else if (w < 769) scaler = 1.1;
      else scaler = 2.5;
    } else {
      if (w < 600) scaler = 0.45;
      else if (w < 769) scaler = 0.8;
      else scaler = 1;
    }
    dispatch({ type: "SET_CANVAS_SCALER", payload: scaler });
  }, [sectionNum, dispatch]);

  useEffect(() => {
    if (sectionNum > 0 && sectionNum < numSections && canvasScaler) {
      const axes: Record<SketchAudioKey, { x: number[] | null; y: number[] | null }> = {
        sketchAudio1: {
          x: readRecordedAxis("sketchAudio1_X"),
          y: readRecordedAxis("sketchAudio1_Y"),
        },
        sketchAudio2: {
          x: readRecordedAxis("sketchAudio2_X"),
          y: readRecordedAxis("sketchAudio2_Y"),
        },
        sketchAudio3: {
          x: readRecordedAxis("sketchAudio3_X"),
          y: readRecordedAxis("sketchAudio3_Y"),
        },
        sketchAudio4: {
          x: readRecordedAxis("sketchAudio4_X"),
          y: readRecordedAxis("sketchAudio4_Y"),
        },
        sketchAudio5: {
          x: readRecordedAxis("sketchAudio5_X"),
          y: readRecordedAxis("sketchAudio5_Y"),
        },
      };

      const complete = Object.values(axes).every((a) => a.x && a.y);

      if (!complete) {
        dispatch({ type: "SHOW_ERROR" });
        return;
      }

      const x1 = axes.sketchAudio1.x!;
      const y1 = axes.sketchAudio1.y!;
      const x2 = axes.sketchAudio2.x!;
      const y2 = axes.sketchAudio2.y!;
      const x3 = axes.sketchAudio3.x!;
      const y3 = axes.sketchAudio3.y!;
      const x4 = axes.sketchAudio4.x!;
      const x5 = axes.sketchAudio5.x!;

      const shouldPlay = (values: number[]) =>
        Math.round(values[sectionNum % values.length]) % 3 !== 0;

      const sA1Play = shouldPlay(x1);
      let sA2Play = shouldPlay(x2);
      const sA3Play = shouldPlay(x3);
      const sA4Play = shouldPlay(x4);
      const sA5Play = shouldPlay(x5);
      if (!sA1Play && !sA2Play && !sA3Play && !sA4Play && !sA5Play) {
        sA2Play = true;
      }

      const speed = x3[sectionNum % x3.length] / 300;
      const sliderMax = Math.round(x3[sectionNum % x3.length]);
      const circleSize = y3[sectionNum % y3.length] * canvasScaler;
      const vertWidth = x2[sectionNum % x2.length] * 2 * canvasScaler;
      const vertHeight = y2[sectionNum % y2.length] * 1.5 * canvasScaler;
      const horizWidth = x1[sectionNum % x1.length] * 1.5 * canvasScaler;
      const horizHeight = y1[sectionNum % y1.length] * 2 * canvasScaler;

      dispatch({
        type: "SET_SECTION",
        payload: {
          sketchAudio1: sA1Play,
          sketchAudio2: sA2Play,
          sketchAudio3: sA3Play,
          sketchAudio4: sA4Play,
          sketchAudio5: sA5Play,
          readyToGo: true,
          playGesture: true,
          showSlider: true,
          speedScaler: speed,
          sliderMax,
          slider: 0,
          changeSection: false,
          canvasCircleWidth: circleSize,
          canvasCircleHeight: circleSize,
          canvasVertWidth: vertWidth,
          canvasVertHeight: vertHeight,
          canvasHorizWidth: horizWidth,
          canvasHorizHeight: horizHeight,
          showTitle: false,
        },
      });
    }

    if (sectionNum === numSections) {
      dispatch({ type: "SET_PAUSE_GESTURE" });
      dispatch({ type: "END" });
      new AudioContext().suspend();
    }
  }, [sectionNum, numSections, canvasScaler, dispatch]);

  useEffect(() => {
    if (readyToGo && sectionNum > 0) {
      dispatch({ type: "SET_PLAY_GESTURE" });
    }
  }, [readyToGo, sectionNum, dispatch]);

  return null;
}
