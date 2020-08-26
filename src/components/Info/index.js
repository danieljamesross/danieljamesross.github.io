import React, { useContext } from 'react';
import Footer from '../Footer';
import { AppDispatchContext } from '../App/AppStateProvider';

function Info() {
    const dispatch = useContext(AppDispatchContext);
    return (
        <div className='info-page'>
            <h1>LINES</h1>
            <h2>Daniel James Ross, 2020</h2>
            <p>
                Lines is a web-based, interactive, audiovisual composition. It
                invites you to play with five simple line drawings which, when
                touched, produce algorithmically generated sounds. These sounds
                vary and react to the position of your finger or mouse on the
                drawing. The resulting gestures can be recorded and used as the
                basis of a longer form composition where the shapes and sounds
                will be presented in a variety of different combinations,
                speeds, sizes, and colours. Each composition is defined by your
                interaction and is, therefore, unique.
            </p>
            <h3>Instructions to Play</h3>
            <ol>
                <li>Touch the lines to make them wiggle and sing.</li>
                <li>
                    Press the record button and touch each of the sets of lines.
                </li>
                <li>
                    Press play and watch the lines sound, move and change colour
                    and size in varying combinations.
                </li>
                <li>
                    You can delete your saved gestures using the "trash" button.
                </li>
                <li>
                    Tick the checkbox to see the recorded gestures superimosed
                    on the line sketches.
                </li>
            </ol>
            <p className='thanks'>
                With thanks to atorov and his
                <a
                    href='https://github.com/atorov/react-hooks-p5js'
                    target='_blank'>
                    &nbsp;react-hooks-p5js&nbsp;
                </a>
                repo.
            </p>

            <button
                type='button'
                onClick={() => dispatch({ type: 'TOGGLE_INFO' })}>
                Close
            </button>
        </div>
    );
}

export default Info;
