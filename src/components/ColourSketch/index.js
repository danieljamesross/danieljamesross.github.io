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
    const rangeC = ['#0a1930', '#33648a', '#a21622', '#f6b02c', '#f6ec2c'];
    const rangeH = ['#0a1930', '#a21622', '#33648a', '#f6b02c', '#00e673'];
    const rangeV = ['#0a1930', '#f6b02c', '#a21622', '#ff4da6', '#33648a'];

    const dom = [
        0,
        numSections * 0.25,
        numSections * 0.5,
        numSections * 0.75,
        numSections
    ];

    useEffect(() => {
        const horizColourScale = scaleLinear().domain(dom).range(rangeH);
        const vertColourScale = scaleLinear().domain(dom).range(rangeV);
        const circColourScale = scaleLinear().domain(dom).range(rangeC);

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
