"use client";

import { memo, useEffect, useRef } from "react";
import p5, { whenSoundReady } from "@/lines/lib/sketches/p5Sound";
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
  // The instance is created asynchronously, so it needs the props as they
  // are at creation time, not as they were when the effect ran.
  const latestRef = useRef({ state, dispatch, playing });
  useEffect(() => {
    latestRef.current = { state, dispatch, playing };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // p5's remove() is a no-op while preload() is still pending, so an
    // instance torn down mid-load would otherwise still run setup() later
    // and append an orphan canvas. Calling remove() at that point isn't an
    // option either: p5.sound's remove hook disposes every sketch's sounds.
    let removed = false;
    const guardedSketch = (s: LinesSketch) => {
      s.id = id;
      s.state = latestRef.current.state;
      s.dispatch = latestRef.current.dispatch;
      s.p5playing = latestRef.current.playing;
      sketch(s);
      const { setup, draw } = s;
      s.setup = () => {
        if (removed) {
          s.noLoop();
          s.noCanvas();
          return;
        }
        setup();
      };
      s.draw = () => {
        if (!removed) draw();
      };
    };

    whenSoundReady().then(() => {
      if (removed) return;
      instanceRef.current = new p5(
        guardedSketch as (s: p5) => void,
        container
      ) as LinesSketch;
    });

    return () => {
      removed = true;
      instanceRef.current?.remove();
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
