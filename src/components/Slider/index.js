import React, { useContext, useEffect } from 'react';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

function Slider() {
    const dispatch = useContext(AppDispatchContext);
    const {
        slider,
        showSlider,
        playGesture,
        pauseGesture,
        sliderMax,
        sectionNum,
        numSections
    } = useContext(AppStateContext);

    useEffect(() => {
        if (playGesture && sectionNum < numSections && sectionNum > 0) {
            const id = setInterval(() => {
                dispatch({
                    type: 'INC_SLIDER_VALUE'
                });
            }, 20);
            if (slider === sliderMax) {
                clearInterval(id);
                dispatch({ type: 'SLIDER_MAX' });
            }
            return () => clearInterval(id);
        }
        return () => null;
    }, [playGesture, slider, sliderMax, sectionNum]);

    return <></>;
}

export default Slider;
