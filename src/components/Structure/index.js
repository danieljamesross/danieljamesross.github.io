import React, { useState, useContext, useEffect } from 'react';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';


function Structure() {
    const dispatch = useContext(AppDispatchContext);
    const {
	sectionNum,
	speeds,
	readyToGo,
	playGesture,
	slider
    } = useContext(AppStateContext);

    useEffect(() => {
	if (sectionNum > 1 && playGesture && slider > 0) {
	    dispatch({type: 'RANDOM_POS'});
	}
    },[sectionNum, playGesture, slider]);
    
    useEffect(() => {
    	if (sectionNum < 15 && sectionNum > 0) {
    	    const sectionType = 'SET_SECTION_' + sectionNum;
    	    dispatch({type: sectionType});
    	    return () => null;
    	}
	if (sectionNum === 15) {
    	    dispatch({type: 'START'});
    	    return () => null;
    	}
    	return () => null;// console.log("section change");
    },[sectionNum]);

    useEffect(() => {
	if (readyToGo)
	    dispatch({type: 'SET_PLAY_GESTURE'});
	return () => null;
    },[readyToGo]);

    useEffect(() => {
    	dispatch({type: 'SET_SPEED_SCALER',
    		  payload: speeds[sectionNum],
    		 });
    	return () => null;
    },[sectionNum, speeds]);
    

    return <></>;
};

export default Structure;
