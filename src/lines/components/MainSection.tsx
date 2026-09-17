"use client";

import { horizSketch } from "@/lines/lib/sketches/horizSketch";
import { vertSketch } from "@/lines/lib/sketches/vertSketch";
import { circleSketch } from "@/lines/lib/sketches/circleSketch";
import { useAppDispatch, useAppState } from "@/lines/lib/state/context";
import P5Canvas from "./P5Canvas";

export default function MainSection() {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const {
    sketchAudio1,
    sketchAudio2,
    sketchAudio3,
    sketchAudio4,
    sketchAudio5,
  } = state;

  return (
    <div className="section-container">
      <div className={sketchAudio1 ? "horiz" : "horiz hide"}>
        <P5Canvas
          id="sketchAudio1"
          dispatch={dispatch}
          sketch={horizSketch}
          state={state}
          playing={sketchAudio1}
          className="horiz"
        />
      </div>
      <div className={sketchAudio2 ? "vert" : "vert hide"}>
        <P5Canvas
          id="sketchAudio2"
          dispatch={dispatch}
          sketch={vertSketch}
          state={state}
          playing={sketchAudio2}
          className="vert"
        />
      </div>
      <div className={sketchAudio3 ? "circ" : "circ hide"}>
        <P5Canvas
          id="sketchAudio3"
          dispatch={dispatch}
          sketch={circleSketch}
          state={state}
          playing={sketchAudio3}
          className="circ"
        />
      </div>
      <div className={sketchAudio4 ? "vert" : "vert hide"}>
        <P5Canvas
          id="sketchAudio4"
          dispatch={dispatch}
          sketch={vertSketch}
          state={state}
          playing={sketchAudio4}
          className="vert"
        />
      </div>
      <div className={sketchAudio5 ? "horiz" : "horiz hide"}>
        <P5Canvas
          id="sketchAudio5"
          dispatch={dispatch}
          sketch={horizSketch}
          state={state}
          playing={sketchAudio5}
          className="horiz"
        />
      </div>
    </div>
  );
}
