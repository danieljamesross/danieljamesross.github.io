import React, { useContext, useEffect } from 'react';
import { scaleLinear } from 'd3';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

function ColourSketch() {
    const dispatch = useContext(AppDispatchContext);
    const {
        sectionNum,
        circColour,
        horizColour,
        vertColour,
        canvasCircleHeight,
        canvasHorizHeight,
        canvasVertWidth,
        circDom,
        vertDom,
        horizDom,
        circRms,
        horizRms,
        vertRms,
        numSections,
        slider
    } = useContext(AppStateContext);
    const range = ['#0a1930', '#33648a', '#a21622', '#f6b02c', '#f6ec2c'];
    const dom = [
        0,
        numSections * 0.25,
        numSections * 0.5,
        numSections * 0.75,
        numSections
    ];

    useEffect(() => {
        // const y1Arr = JSON.parse(localStorage.getItem('sketchAudio1_Y'));
        // const x2Arr = JSON.parse(localStorage.getItem('sketchAudio2_X'));
        // const y3Arr = JSON.parse(localStorage.getItem('sketchAudio3_Y'));
        const horizColourScale = scaleLinear().domain(dom).range(range);
        const vertColourScale = scaleLinear().domain(dom).range(range);
        const circColourScale = scaleLinear().domain(dom).range(range);

        if (sectionNum > 0) {
            dispatch({
                type: 'SET_COLOURS',
                payload: {
                    horizColour: horizColourScale(
                        sectionNum * horizRms + slider * 0.01
                    ),
                    vertColour: vertColourScale(
                        sectionNum * vertRms + slider * 0.01
                    ),
                    circColour: circColourScale(
                        sectionNum * circRms + slider * 0.01
                    )
                }
            });
        }
    }, [sectionNum, circRms, horizRms, vertRms, slider]);

    return <></>;
}

export default ColourSketch;
