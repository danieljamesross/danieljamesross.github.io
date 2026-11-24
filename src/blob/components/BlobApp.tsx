"use client";

import { useEffect, useRef, useState } from "react";
import {
  faVolumeMute,
  faVolumeUp,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import BlobScene from "@/blob/lib/blobScene";
import BlobSynth from "@/blob/lib/blobSynth";

const HINT =
  "Drag the blob · press around it to pull it out of shape · scroll to roughen";

/** A Font Awesome icon drawn inline. Its React component sizes icons with CSS
 *  injected from script, so rendered on the server they'd jump on hydrating. */
function Icon({ icon }: { icon: IconDefinition }) {
  const [width, height, , , path] = icon.icon;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="h-[1em] w-auto fill-current"
    >
      {[path].flat().map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * The Blob piece. Its frame, controls and hint are rendered with the page, so
 * they show at once; the scene and synth need WebGL and Web Audio, so they
 * start in the browser.
 */
export default function BlobApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const synthRef = useRef<BlobSynth>(null);
  const [muted, setMuted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const synth = new BlobSynth();
    synthRef.current = synth;

    let scene: BlobScene;
    try {
      scene = new BlobScene(canvas, overlayRef.current!, synth);
    } catch (e) {
      console.error(e);
      // Reported asynchronously so the effect doesn't set state as it runs.
      queueMicrotask(() =>
        setError("Your browser can't show this piece: it needs WebGL."),
      );
      return () => synth.close();
    }

    let active = true;
    const startAudio = () =>
      synth.start().catch((e: unknown) => {
        if (!active) return;
        console.error(e);
        setError("Your browser doesn't support AudioWorklet, so it's silent.");
      });

    // Arriving through the site header is a client-side navigation, so that
    // click already lets audio start; on a direct load, wait for a touch.
    if (navigator.userActivation?.hasBeenActive) startAudio();

    const onDown = (e: PointerEvent) => {
      startAudio();
      canvas.setPointerCapture(e.pointerId);
      scene.pointerDown(e);
      setTouched(true);
    };
    const onMove = (e: PointerEvent) => scene.pointerMove(e);
    const onUp = () => scene.pointerUp();
    const onLeave = () => scene.pointerLeave();
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scene.wheel(e.deltaY);
    };
    const resizeObserver = new ResizeObserver(() => scene.resize());
    resizeObserver.observe(canvas);

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      active = false;
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
      scene.destroy();
      synth.close();
    };
  }, []);

  const toggleMute = () => {
    synthRef.current?.setMuted(!muted);
    setMuted(!muted);
  };

  return (
    <div className="relative min-h-[28rem] flex-1 overflow-hidden bg-[#0a1930] text-white/70">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full cursor-grab touch-none active:cursor-grabbing"
        role="img"
        aria-label="A glossy 3D blob that plays a synthesiser. Drag it to move it and change the pitch, or press around it to pull it out of shape and open the filter."
      />
      <canvas
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 block h-full w-full"
        aria-hidden
      />
      <button
        type="button"
        className="absolute top-4 right-4 p-2 text-2xl transition-colors hover:text-[#eab01a] focus-visible:text-[#eab01a]"
        aria-label="Mute"
        aria-pressed={muted}
        onClick={toggleMute}
      >
        <Icon icon={muted ? faVolumeMute : faVolumeUp} />
      </button>
      <p
        className={`pointer-events-none absolute inset-x-4 bottom-6 text-center font-mono text-sm transition-opacity duration-[1500ms] ${
          touched && !error ? "opacity-0" : ""
        }`}
      >
        {error ?? HINT}
      </p>
    </div>
  );
}
