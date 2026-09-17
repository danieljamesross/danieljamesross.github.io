"use client";

import { memo, useEffect, useRef } from "react";
import p5 from "p5";
import "p5/lib/addons/p5.sound.js";
import type { AppState, Dispatch } from "@/lines/lib/state/types";
import type { LinesSketch } from "@/lines/lib/sketches/types";

interface P5CanvasProps {
  id: string;
  sketch: (s: LinesSketch) => void;
  state: AppState;
  dispatch: Dispatch;
  playing: boolean;
  className: string;
}

function P5CanvasImpl({
  id,
  sketch,
  state,
  dispatch,
  playing,
  className,
}: P5CanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<LinesSketch | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const instance = new p5(
      sketch as (s: p5) => void,
      containerRef.current
    ) as LinesSketch;
    instance.id = id;
    instanceRef.current = instance;

    return () => {
      instance.remove();
      instanceRef.current = null;
    };
    // The p5 instance owns its own draw loop; it should only be torn down
    // and rebuilt if the sketch itself (or its canvas id) changes, not on
    // every state/dispatch/playing update below.
  }, [sketch, id]);

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.state = state;
  }, [state]);

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.dispatch = dispatch;
  }, [dispatch]);

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.p5playing = playing;
  }, [playing]);

  return <div ref={containerRef} className={className} />;
}

const P5Canvas = memo(P5CanvasImpl);
export default P5Canvas;
