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
	sectionNum
    } = useContext(AppStateContext);
    
    useEffect(() => {
	if (playGesture && sectionNum < 21 && sectionNum > 0) {
	    const id = setInterval(() => {
		dispatch({
                    type: 'INC_SLIDER_VALUE',
		});
	    }, 20);
	    if (slider === sliderMax) {
		console.log('sliderMax');
		clearInterval(id);
		dispatch({type: 'SLIDER_MAX'});
	    };
	    return () => clearInterval(id);
	}
	    return () => null;
    }, [playGesture, slider, sliderMax, sectionNum]);

    
    return (
	<>
	    <div className="slider">
		{showSlider &&		 
                 <input
                     type="range"
                     min={0}
                     max={sliderMax}
                     step={1}
                     value={slider}
                     className="slider"
                     onChange={event => dispatch({
                         type: 'SET_SLIDER_VALUE',
                         payload: +event.target.value,
                     })}
                 />
		}
            </div>
	</>
    );
};

export default Slider;
