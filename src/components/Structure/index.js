import React, { useState, useContext, useEffect } from 'react';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

function Structure() {
    const dispatch = useContext(AppDispatchContext);
    const { sectionNum, readyToGo, numSections } = useContext(AppStateContext);

    useEffect(() => {
        if (sectionNum < numSections && sectionNum > 0) {
            const x1Arr = JSON.parse(localStorage.getItem('sketchAudio1_X'));
            const y1Arr = JSON.parse(localStorage.getItem('sketchAudio1_Y'));
            const x2Arr = JSON.parse(localStorage.getItem('sketchAudio2_X'));
            const y2Arr = JSON.parse(localStorage.getItem('sketchAudio2_Y'));
            const x3Arr = JSON.parse(localStorage.getItem('sketchAudio3_X'));
            const y3Arr = JSON.parse(localStorage.getItem('sketchAudio3_Y'));
            const x4Arr = JSON.parse(localStorage.getItem('sketchAudio4_X'));
            const y4Arr = JSON.parse(localStorage.getItem('sketchAudio4_Y'));
            const x5Arr = JSON.parse(localStorage.getItem('sketchAudio5_X'));
            const y5Arr = JSON.parse(localStorage.getItem('sketchAudio5_Y'));
            if (
                x1Arr &&
                y1Arr &&
                x2Arr &&
                y2Arr &&
                x3Arr &&
                y3Arr &&
                x4Arr &&
                y4Arr &&
                x5Arr &&
                y5Arr
            ) {
                const sA1Play =
                    Math.round(x1Arr[sectionNum % x1Arr.length]) % 3 === 0
                        ? false
                        : true;
                const sA2Play =
                    Math.round(x2Arr[sectionNum % x2Arr.length]) % 3 === 0
                        ? false
                        : true;
                const sA3Play =
                    Math.round(x3Arr[sectionNum % x3Arr.length]) % 3 === 0
                        ? false
                        : true;
                const sA4Play =
                    Math.round(x4Arr[sectionNum % x4Arr.length]) % 3 === 0
                        ? false
                        : true;
                const sA5Play =
                    Math.round(x5Arr[sectionNum % x5Arr.length]) % 3 === 0
                        ? false
                        : true;
                const speed = x3Arr[sectionNum % x3Arr.length] / 300;
                const sliderM = Math.round(x3Arr[sectionNum % x3Arr.length]);
                const cW = y3Arr[sectionNum % y3Arr.length];
                const cH = y3Arr[sectionNum % y3Arr.length];
                const vW = x2Arr[sectionNum % x2Arr.length] * 2;
                const vH = y2Arr[sectionNum % y2Arr.length] * 1.5;
                const hW = x1Arr[sectionNum % x1Arr.length] * 1.5;
                const hH = y1Arr[sectionNum % y1Arr.length] * 2;
                dispatch({
                    type: 'SET_SECTION',
                    payload: {
                        sketchAudio1: sA1Play,
                        sketchAudio2: sA2Play,
                        sketchAudio3: sA3Play,
                        sketchAudio4: sA4Play,
                        sketchAudio5: sA5Play,
                        readyToGo: true,
                        playGesture: true,
                        showSlider: true,
                        speedScaler: speed,
                        sliderMax: sliderM,
                        slider: 0,
                        changeSection: false,
                        canvasCircleWidth: cW,
                        canvasCircleHeight: cH,
                        canvasVertWidth: vW,
                        canvasVertHeight: vH,
                        canvasHorizWidth: hW,
                        canvasHorizHeight: hH,
                        showTitle: false
                    }
                });
            } else dispatch({ type: 'SHOW_ERROR' });
            return () => null;
        }
        if (sectionNum === numSections) {
            dispatch({ type: 'END' });
            dispatch({ type: 'SET_PAUSE_GESTURE' });
        }
        return () => null;
    }, [sectionNum, numSections]);

    useEffect(() => {
        if (readyToGo && sectionNum > 0) {
            dispatch({ type: 'SET_PLAY_GESTURE' });
        }
        return () => null;
    }, [readyToGo, sectionNum]);

    return <></>;
}

export default Structure;
