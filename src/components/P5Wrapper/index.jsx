import React, { memo, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

import { generate } from 'shortid';

export default function (id = generate()) {
    
    let canvas = null;

    function P5Wrapper({
        sketch = () => { },
        state = {},
        dispatch = () => { },
	playing = bool,
	classTitle='',
    }) {

        // console.log(`::: P5Wrapper(${id}) component has been re-rendered`);
        const sketchContainer = useRef(null);

	useEffect(() => {
	    canvas = new window.p5(sketch, sketchContainer.current);
	    canvas.state = state;
	    canvas.dispatch = dispatch;
	    canvas.id = id;
	    canvas.p5playing = playing;
	    return () => {
                // console.log(`::: P5Wrapper(${id})/useEffect.return()`);
		canvas.remove();
	    };

	}, [dispatch, sketch, state, id, playing]);
	

        return (
	    <div ref={sketchContainer} className={classTitle}>
	    </div>
        );
    }
    
    P5Wrapper.propTypes = {
        state: PropTypes.object,
        dispatch: PropTypes.func,
        sketch: PropTypes.func,
	id: PropTypes.string,
	playing: PropTypes.bool.isRequired,
	classTitle: PropTypes.string,
    };
    
    P5Wrapper.defaultProps = {
        state: {},
        dispatch: () => { },
        sketch: () => { },
	id: "",
	playing: false,
	classTitle: "",
    };
    
    return memo(P5Wrapper, (_, nextProps) => {
        canvas.state = { ...nextProps.state };
	canvas.p5playing = nextProps.playing;
        return true;
    });
};
