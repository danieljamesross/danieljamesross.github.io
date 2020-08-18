import React, { useContext }from 'react';

import MainSection from '../MainSection';
import Menu from '../Menu';
import Slider from '../Slider';
import Structure from '../Structure';
import TranslateSketch from '../TranslateSketch';
import Footer from '../Footer';
//import AppStateProvider from '../App/AppStateProvider';
import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

export default function AppContent() {
    const state  = useContext(AppStateContext);
    const { showTitle } = state;
    return (
	<div className="App">
	    {showTitle && 
	     <div className="header">
		 <h1>daniel james ross</h1>
		 <h2>Interactive Sound, Algorithmic Composition & Creative Programming</h2>
	     </div>
	    }
	    <Menu />
	    <MainSection />
	    <TranslateSketch />
	    <Slider />
	    <Structure />
	    {showTitle &&
	     <Footer />
	    }
	</div>
    );
}

// <p className="thanks">
//     Adapted from
//     <a href='https://github.com/atorov/react-hooks-p5js'
//        target="_blank">
// &nbsp; react-hooks-p5js.
//     </a>
// &nbsp; Thank you, Atorov.
// 		   </p>
