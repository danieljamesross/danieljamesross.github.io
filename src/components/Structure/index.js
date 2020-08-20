import React, { useState, useContext, useEffect } from 'react';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';


function Structure() {
    const dispatch = useContext(AppDispatchContext);
    const {
	sectionNum,
	speeds,
	readyToGo,
	playGesture,
	slider,
	sliderMax,
	changeSection,
    } = useContext(AppStateContext);

    useEffect(() => {
	if (sectionNum < 21 && sectionNum > 0) {
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
	    if (x1Arr && y1Arr &&
		x2Arr && y2Arr &&
		x3Arr && y3Arr &&
		x4Arr && y4Arr &&
		x5Arr && y5Arr) {
		console.log('structure useEffect sectionNum ' + sectionNum);
    		dispatch({type: 'SET_SECTION',
			  payload: {
			      sketchAudio1:
			  x1Arr[sectionNum % x1Arr.length] % 2 === 0 ? true : false,
			      sketchAudio2:
			  x2Arr[sectionNum % x2Arr.length] % 2 === 0 ? true : false,
			      sketchAudio3:
			  x3Arr[sectionNum % x3Arr.length] % 2 === 0 ? true : false,
			      sketchAudio4:
			  x4Arr[sectionNum % x4Arr.length] % 2 === 0 ? true : false,
			      sketchAudio5:
			  x5Arr[sectionNum % x5Arr.length] % 2 === 0 ? true : false,
			      readyToGo: true,
			      playGesture: true,
			      showSlider: true,
			      speedScaler: 1 + x3Arr[sectionNum % x3Arr.length] * 0.01,
			      sliderMax: x3Arr[sectionNum % x3Arr.length],
			      slider: 0,
			      changeSection: false,
			      canvasCircleWidth: x3Arr[sectionNum % x3Arr.length] * 3,
			      canvasCircleHeight: y3Arr[sectionNum % y3Arr.length] * 3,
			      canvasVertWidth: x2Arr[sectionNum % x3Arr.length] * 3,
			      canvasVertHeight: y2Arr[sectionNum % y3Arr.length] * 3,
			      canvasHorizWidth: x1Arr[sectionNum % x3Arr.length] * 3,
			      canvasHorizHeight: y1Arr[sectionNum % y3Arr.length] * 3,
			      showTitle: false,
			  }
		});
	    } else dispatch({type: 'SHOW_ERROR'});
    	    return () => null;
    	}
	if (sectionNum === 21){
	    dispatch({type: 'END'});
	    console.log("ended");
	}
	console.log("sectionNum: " + sectionNum);
    	return () => null;// console.log("section change");
    },[sectionNum]);


    useEffect(() => {
    	if (readyToGo && sectionNum > 0){
    	    console.log("structure useEffect triggering playback");
    	    dispatch({type: 'SET_PLAY_GESTURE'});
	}
    	return () => null;
    },[readyToGo, sectionNum]);
    

    return <></>;
};

export default Structure;
