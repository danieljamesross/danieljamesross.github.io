"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import {
  AppStateProvider,
  useAppDispatch,
  useAppState,
} from "@/lines/lib/state/context";
import Menu from "./Menu";
import InfoPanel from "./InfoPanel";
import SliderEngine from "./SliderEngine";
import StructureEngine from "./StructureEngine";
import ColourEngine from "./ColourEngine";

// MainSection is the only thing that pulls in p5.sound, which creates its
// AudioContext as soon as it's evaluated. Chrome refuses to start one before
// the page has had a user gesture, so it's only loaded once START fires.
const MainSection = dynamic(() => import("./MainSection"), { ssr: false });

const GESTURE_EVENTS = ["pointerdown", "keydown"] as const;

/**
 * Start the piece as soon as audio is allowed. Arriving via the site
 * header's "Lines" link is a client-side navigation, so that click already
 * counts as the gesture; on a direct page load, wait for the first one.
 */
function useAutoStart() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const start = () => dispatch({ type: "START" });

    if (navigator.userActivation?.hasBeenActive) {
      start();
      return undefined;
    }

    const onGesture = () => {
      removeListeners();
      start();
    };
    const removeListeners = () =>
      GESTURE_EVENTS.forEach((e) => window.removeEventListener(e, onGesture));
    GESTURE_EVENTS.forEach((e) => window.addEventListener(e, onGesture));
    return removeListeners;
  }, [dispatch]);
}

function AppContent() {
  const { showMenu, infoPage, startButton } = useAppState();
  useAutoStart();

  return (
    <div className="lines-root">
      {showMenu && <Menu />}
      {infoPage && <InfoPanel />}
      {!startButton && <MainSection />}
      <SliderEngine />
      <StructureEngine />
      <ColourEngine />
    </div>
  );
}

export default function LinesApp() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
