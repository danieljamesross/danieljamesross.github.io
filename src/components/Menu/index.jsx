import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCircle, faPause, faRedo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

export default function Menu() {
    const dispatch = useContext(AppDispatchContext);
    const {
	startButton,
	recordButton,
	clearButton,
	playButton,
	pauseButton,
	recordGesture,
	playGesture,
	playError,
	checkbox,
	sectionNum,
    } = useContext(AppStateContext);
  
    return (
	<>
            <div className="menu">
		{startButton &&
		 <button
		     type="button"
		     onClick={() => {
			 dispatch({
			     type: 'START',
			 });
		     }}
		 >
		     start
		 </button>}
		{recordButton &&
		 <FontAwesomeIcon icon={faCircle}
				  className={recordGesture ?
					     "faIcon recording" : "faIcon record"}
				  onClick={() => dispatch({
				      type: 'TOGGLE_RECORD_GESTURE',
				  })}
		 />}
		{playButton &&
		 <FontAwesomeIcon icon={faPlay}
				  className="faIcon play"
				  onClick={() => dispatch({
				      type: 'SET_PLAY_GESTURE',
				  })}
		 />}
		{pauseButton &&
		 <FontAwesomeIcon icon={faPause}
				  className="faIcon pause"
				  onClick={() => dispatch({
				      type: 'SET_PAUSE_GESTURE',
				  })}
		 />}
		{checkbox &&
		 <label className="checkbox">
		     <input type="checkbox" className="checkbox"
			    onClick={() =>
				dispatch({type: 'TOGGLE_SHOW_GESTURE'})}
		     />Show Gestures</label>}
		{clearButton &&
		 <FontAwesomeIcon icon={faRedo}
				  className="faIcon clear"
				  onClick={() => {
				      dispatch({type: 'START'});
				  }}
		 />}
		{clearButton &&
		 <FontAwesomeIcon icon={faTrash}
				  className="faIcon clear"
				  onClick={() => {
				      localStorage.clear();
				  }}
		 />}
	    </div>
	    <div className="info">
		{recordGesture && <span>Recording...</span>}
		{playGesture && <span>Playing...</span>}
		{playError &&
		 <span className="error">You must first record a gesture for each sketch.</span>}
	    </div>
	</>
    );
}
