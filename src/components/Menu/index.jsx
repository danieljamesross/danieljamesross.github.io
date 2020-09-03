import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from 'react-toggle-switch';
import {
    faPlay,
    faCircle,
    faPause,
    faUndo,
    faTrash,
    faInfo
} from '@fortawesome/free-solid-svg-icons';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

export default function Menu() {
    const dispatch = useContext(AppDispatchContext);
    const {
        recordButton,
        clearButton,
        playButton,
        pauseButton,
        recordGesture,
        playGesture,
        playError,
        checkbox,
        sectionNum,
        trashed,
        showGesture
    } = useContext(AppStateContext);

    return (
        <>
            <div className='menu'>
                {recordButton && (
                    <FontAwesomeIcon
                        icon={faCircle}
                        className={
                            recordGesture ? 'faIcon recording' : 'faIcon record'
                        }
                        onClick={() =>
                            dispatch({
                                type: 'TOGGLE_RECORD_GESTURE'
                            })
                        }
                    />
                )}
                {playButton && (
                    <FontAwesomeIcon
                        icon={faPlay}
                        className='faIcon play'
                        onClick={() =>
                            dispatch({
                                type: 'SET_PLAY_GESTURE'
                            })
                        }
                    />
                )}
                {pauseButton && (
                    <FontAwesomeIcon
                        icon={faPause}
                        className='faIcon pause'
                        onClick={() => dispatch({ type: 'SET_PAUSE_GESTURE' })}
                    />
                )}
                {clearButton && (
                    <FontAwesomeIcon
                        icon={faInfo}
                        className='faIcon clear'
                        onClick={() => {
                            dispatch({ type: 'TOGGLE_INFO' });
                        }}
                    />
                )}
                {clearButton && (
                    <FontAwesomeIcon
                        icon={faUndo}
                        className='faIcon clear'
                        onClick={() => {
                            window.location.reload();
                        }}
                    />
                )}
                {clearButton && (
                    <FontAwesomeIcon
                        icon={faTrash}
                        className='faIcon clear'
                        onClick={() => {
                            dispatch({ type: 'TRASHED' });
                            localStorage.clear();
                        }}
                    />
                )}
                {checkbox && (
                    <>
                        <label htmlFor='check'>
                            <input
                                id='check'
                                type='checkbox'
                                className='checkbox'
                                onClick={() =>
                                    dispatch({ type: 'TOGGLE_SHOW_GESTURE' })
                                }
                            />
                            Show Gestures
                        </label>
                    </>
                )}
            </div>
            <div className='info'>
                {recordGesture && <span>Recording...</span>}
                {playError && (
                    <span className='error'>
                        You must first wiggle each sketch.
                    </span>
                )}
                {trashed && <span className='error'>Gestures deleted.</span>}
            </div>
        </>
    );
}
