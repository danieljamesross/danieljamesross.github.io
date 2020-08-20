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

	slider,playGesture,
	playError,
    } = state;

    /* const P51X = g1 + '_X';
     * const P51Y = g1 + '_Y'; */
    // const P52X = g2 + '_X';
    // const P52Y = g2 + '_Y';
    // const P53X = g3 + '_X';
    // const P53Y = g3 + '_Y';
    // const P54X = g4 + '_X';
    // const P54Y = g4 + '_Y';
    // const P55X = g5 + '_X';
    // const P55Y = g5 + '_Y';
    /* let x1 = 0;
     * let y1 = 0;
     * let translateMessage;
     * useEffect(() => {

       if(playGesture && !playError && slider % 10 === 0) {
       let posX1 = slider % localStorage.getItem(P51X).length;
       let posY1 = slider % localStorage.getItem(P51Y).length;

       x1 = convertRange(posX1,
       [0, canvasHorizWidth], [0, window.innerWidth]);
       y1 = convertRange(posY1,
       [0, canvasHorizHeight], [0, window.innerHeight]);
       } else {
       x1 = 0.;
       y1 = 0.;
       }
       translateMessage = [x1,y1];

     * },[slider, P51X, P51Y, playGesture, playError]); */
    return (
	<div>
	    <button
		type="button"
		onClick={() =>{

		    dispatch({
			type: 'INC_SECTION_NUM',
		    });
		}}
	    >
		inc section
	    </button>
	</div>
    );
};

export default TranslateSketch;
