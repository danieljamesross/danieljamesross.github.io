import React, { useContext } from 'react';
import Footer from '../Footer';
import { AppDispatchContext } from '../App/AppStateProvider';
function Info() {
    const dispatch = useContext(AppDispatchContext);
    return (
        <div className='info-page'>
            <h1>LINES</h1>
            <h2>Daniel James Ross, 2020</h2>
            <p className='thanks'>
                Adapted from
                <a
                    href='https://github.com/atorov/react-hooks-p5js'
                    target='_blank'>
                    &nbsp;react-hooks-p5js.
                </a>
                &nbsp;Thank you, Atorov.
            </p>
            <Footer />
            <button
                type='button'
                onClick={() => dispatch({ type: 'TOGGLE_INFO' })}>
                Close
            </button>
        </div>
    );
}

export default Info;
