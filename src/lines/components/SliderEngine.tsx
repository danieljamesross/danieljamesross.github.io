"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppState } from "@/lines/lib/state/context";

const TICK_MS = 20;

/** Side-effect-only component: advances the progress slider while a gesture plays. */
export default function SliderEngine() {
  const dispatch = useAppDispatch();
  const { slider, playGesture, sliderMax, sectionNum, numSections } =
    useAppState();

  useEffect(() => {
    if (!(playGesture && sectionNum > 0 && sectionNum < numSections)) {
      return undefined;
    }

    if (slider === sliderMax) {
      dispatch({ type: "SLIDER_MAX" });
      return undefined;
    }

    const id = setInterval(() => {
      dispatch({ type: "INC_SLIDER_VALUE" });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playGesture, slider, sliderMax, sectionNum, numSections, dispatch]);

  return null;
}
