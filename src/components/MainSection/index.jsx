import React, { useContext, useEffect, useState } from 'react';
import { generate } from 'shortid';
import sketchCircSrc from '../../sketches/sketchCircles';
import sketchHorizSrc from '../../sketches/sketchHoriz';
import sketchVertSrc from '../../sketches/sketchVerts';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';
import p5Wrapper from '../P5Wrapper';

// import Tweenful, { elastic } from 'react-tweenful';
// import Observer from '../Tweenful/Observer.js';

// const gen1 = generate();
// const gen2 = generate();
// const gen3 = generate();
// const gen4 = generate();
// const gen5 = generate();

const P5Wrapper1 = p5Wrapper('sketchAudio1');
const P5Wrapper2 = p5Wrapper('sketchAudio2');
const P5Wrapper3 = p5Wrapper('sketchAudio3');
const P5Wrapper4 = p5Wrapper('sketchAudio4');
const P5Wrapper5 = p5Wrapper('sketchAudio5');



export default function MainSection() {
    const dispatch = useContext(AppDispatchContext);
    const state  = useContext(AppStateContext);
    const {
        sketchAudio1,
        sketchAudio2,
	sketchAudio3,
	sketchAudio4,
	sketchAudio5,
    } = state;

    return (
        <div className="section-container">
	    <div className={sketchAudio1 ? "horiz" : "horiz hide"}>
		<P5Wrapper1
		dispatch={dispatch}
		sketch={sketchHorizSrc}
		state={state}
		playing={sketchAudio1}
		classTitle={"horiz"}
		/>
	    </div>
	    <div className={sketchAudio2 ? "vert" : "vert hide"}>
		<P5Wrapper2
		    dispatch={dispatch}
		    sketch={sketchVertSrc}
		    state={state}
		    playing={sketchAudio2}
		    classTitle={"vert"}
		/>
	    </div>
	    <div className={sketchAudio3 ? "circ" : "circ hide"}>
		<P5Wrapper3
		    dispatch={dispatch}
		    sketch={sketchCircSrc}
		    state={state}
		    playing={sketchAudio3}
		    classTitle={"circ"}
		/>
	    </div>
	    <div className={sketchAudio4 ? "vert" : "vert hide"}>
		<P5Wrapper4
		    dispatch={dispatch}
		    sketch={sketchVertSrc}
		    state={state}
		    playing={sketchAudio4}
		    classTitle={"vert"}
		/>
	    </div>
	    <div className={sketchAudio5 ? "horiz" : "horiz hide"}>
		<P5Wrapper5
		    dispatch={dispatch}
		    sketch={sketchHorizSrc}
		    state={state}
		    playing={sketchAudio5}
		    classTitle={"horiz"}
		/>
	    </div>
        </div>
    )
}
