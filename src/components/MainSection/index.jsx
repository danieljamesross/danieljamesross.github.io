import React, { useContext, useEffect } from 'react';
import { generate } from 'shortid';
import sketchCircSrc from '../../sketches/sketchCircles';
import sketchHorizSrc from '../../sketches/sketchHoriz';
import sketchVertSrc from '../../sketches/sketchVerts';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';
import p5Wrapper from '../P5Wrapper';

const gen1 = generate();
const gen2 = generate();
const gen3 = generate();
const gen4 = generate();
const gen5 = generate();

const P5Wrapper1 = p5Wrapper(gen1);
const P5Wrapper2 = p5Wrapper(gen2);
const P5Wrapper3 = p5Wrapper(gen3);
const P5Wrapper4 = p5Wrapper(gen4);
const P5Wrapper5 = p5Wrapper(gen5);



export default function MainSection() {
    const dispatch = useContext(AppDispatchContext);
    const state  = useContext(AppStateContext);
    const {
        sketchAudio1,
        sketchAudio2,
	sketchAudio3,
	sketchAudio4,
	sketchAudio5,
	sketch1Transform, 
    } = state;
    let styles = null;
    useEffect(() => {
	for (var i = 1; i < 6; i++) {
	    dispatch({type: 'GEN_IDS',
		      payload: {
			  key: 'g' + i,
			  value: gen1
		      }});
	}
    },[]);
    useEffect(() => {
	styles = {
	    transform: sketch1Transform
	};
	console.dir(styles);
    },[sketch1Transform]);
    
    
    return (
        <div className="section-container">
	    <div className={sketchAudio1 ? "horiz" : "horiz hide"}
	style={styles}>
		<P5Wrapper1
		dispatch={dispatch}
		sketch={sketchHorizSrc}
		state={state}
		playing={sketchAudio1}
		classTitle={"horiz"}
		/>
	    </div>
	    <div className={sketchAudio2 ? "vert" : "vert hide"}
		style={styles}>
		<P5Wrapper2
		dispatch={dispatch}
		sketch={sketchVertSrc}
		state={state}
		playing={sketchAudio2}
		classTitle={"vert"}
		/>
	    </div>
	    <div className={sketchAudio3 ? "circ" : "circ hide"}
		style={styles}>
		<P5Wrapper3
		dispatch={dispatch}
		sketch={sketchCircSrc}
		state={state}
		playing={sketchAudio3}
		classTitle={"circ"}
		/>
	    </div>
	    <div className={sketchAudio4 ? "vert" : "vert hide"}
		style={styles}>
		<P5Wrapper4
		dispatch={dispatch}
		sketch={sketchVertSrc}
		state={state}
		playing={sketchAudio4}
		classTitle={"vert"}
		/>
	    </div>
	    <div className={sketchAudio5 ? "horiz" : "horiz hide"}
		style={styles}>
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
