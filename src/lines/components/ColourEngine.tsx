"use client";

import { useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { useAppDispatch, useAppState } from "@/lines/lib/state/context";

const RANGE_CIRCLE = ["#0a1930", "#33648a", "#a21622", "#f6b02c", "#f6ec2c"];
const RANGE_HORIZ = ["#0a1930", "#a21622", "#33648a", "#f6b02c", "#00e673"];
const RANGE_VERT = ["#0a1930", "#f6b02c", "#a21622", "#ff4da6", "#33648a"];

/** Side-effect-only component: derives canvas colours from playback progress. */
export default function ColourEngine() {
  const dispatch = useAppDispatch();
  const {
    sectionNum,
    circRms,
    horizRms,
    vertRms,
    numSections,
    slider,
  } = useAppState();

  useEffect(() => {
    const domain = [0, numSections * 0.25, numSections * 0.5, numSections * 0.75, numSections];
    const horizColourScale = scaleLinear<string>().domain(domain).range(RANGE_HORIZ);
    const vertColourScale = scaleLinear<string>().domain(domain).range(RANGE_VERT);
    const circColourScale = scaleLinear<string>().domain(domain).range(RANGE_CIRCLE);

    if (sectionNum > 0) {
      dispatch({
        type: "SET_COLOURS",
        payload: {
          horizColour: horizColourScale(sectionNum * horizRms + slider * 0.01),
          vertColour: vertColourScale(sectionNum * vertRms + slider * 0.01),
          circColour: circColourScale(sectionNum * circRms + slider * 0.01),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionNum, circRms, horizRms, vertRms, slider, numSections]);

  return null;
}
