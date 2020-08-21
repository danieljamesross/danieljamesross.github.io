import React, { useContext } from 'react';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';
function StartButton() {
    const dispatch = useContext(AppDispatchContext);
    const { startButton } = useContext(AppStateContext);
    return (
        <div className='start'>
            {startButton && (
                <button
                    type='button'
                    onClick={() => dispatch({ type: 'START' })}>
                    play
                </button>
            )}
        </div>
    );
}

export default StartButton;
