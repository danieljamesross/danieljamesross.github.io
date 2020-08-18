import React, { useContext, useEffect } from 'react';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
function TranslateSketch() {
    const dispatch = useContext(AppDispatchContext);
    const state  = useContext(AppStateContext);
    const {
	canvasCircleWidth,
	canvasCircleHeight,
	canvasVertWidth,
	canvasVertHeight,
	canvasHorizWidth,
	canvasHorizHeight,
	g1, g2, g3, g4, g5,
	slider,playGesture,
    } = state;

    const P51X = g1 + '_X';
    const P51Y = g1 + '_Y';
    // const P52X = g2 + '_X';
    // const P52Y = g2 + '_Y';
    // const P53X = g3 + '_X';
    // const P53Y = g3 + '_Y';
    // const P54X = g4 + '_X';
    // const P54Y = g4 + '_Y';
    // const P55X = g5 + '_X';
    // const P55Y = g5 + '_Y';
    useEffect(() => {
	let x1 = 0;
	let y1 = 0;
	if(playGesture) {
	    let posX1 = slider % localStorage.getItem(P51X).length;
	    let posY1 = slider % localStorage.getItem(P51Y).length;

	    x1 = convertRange(posX1,
			      [0, canvasHorizWidth], [0, window.innerWidth]);
	    y1 = convertRange(posY1,
			      [0, canvasHorizHeight], [0, window.innerHeight]);
	};

	dispatch({type: 'MOVE_SKETCH_1',
		  payload: `translate(${Math.round(x1)}px, ${Math.round(y1)}px)`,
		 });
    },[slider, P51X, P51Y, playGesture]);
    return (
	    <div></div>
    );
};

export default TranslateSketch;
