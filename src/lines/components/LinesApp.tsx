"use client";

import dynamic from "next/dynamic";
import { AppStateProvider, useAppState } from "@/lines/lib/state/context";
import StartButton from "./StartButton";
import Menu from "./Menu";
import InfoPanel from "./InfoPanel";
import SliderEngine from "./SliderEngine";
import StructureEngine from "./StructureEngine";
import ColourEngine from "./ColourEngine";
import Footer from "./Footer";

// MainSection is the only thing that pulls in p5.sound, which creates its
// AudioContext as soon as it's evaluated. Chrome refuses to start one before
// the page has had a user gesture, so it's only loaded once START is clicked.
const MainSection = dynamic(() => import("./MainSection"), { ssr: false });

function AppContent() {
  const { showTitle, showMenu, infoPage, startButton } = useAppState();

  return (
    <div className="lines-root">
      {showTitle && (
        <>
          <div className="header">
            <h1>daniel james ross</h1>
          </div>
          <div className="header">
            <h2>
              Interactive Sound, Algorithmic Composition &amp; Creative
              Programming
            </h2>
          </div>
        </>
      )}
      <StartButton />
      {showMenu && <Menu />}
      {infoPage && <InfoPanel />}
      {!startButton && <MainSection />}
      <SliderEngine />
      <StructureEngine />
      <ColourEngine />
      {showTitle && <Footer />}
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
