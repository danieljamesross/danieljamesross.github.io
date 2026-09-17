"use client";

import { AppStateProvider, useAppState } from "@/lines/lib/state/context";
import StartButton from "./StartButton";
import Menu from "./Menu";
import InfoPanel from "./InfoPanel";
import MainSection from "./MainSection";
import SliderEngine from "./SliderEngine";
import StructureEngine from "./StructureEngine";
import ColourEngine from "./ColourEngine";
import Footer from "./Footer";

function AppContent() {
  const { showTitle, showMenu, infoPage } = useAppState();

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
      <MainSection />
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
