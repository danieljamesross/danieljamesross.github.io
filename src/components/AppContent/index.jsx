import React, { useContext } from 'react';

import MainSection from '../MainSection';
import Menu from '../Menu';
import StartButton from '../StartButton';
import Slider from '../Slider';
import Structure from '../Structure';
import ColourSketch from '../ColourSketch';
import Info from '../Info';
import Footer from '../Footer';

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider';

export default function AppContent() {
    const state = useContext(AppStateContext);
    const { showTitle, showMenu, infoPage } = state;
    return (
        <div className='App'>
            {showTitle && (
                <>
                    <div className='header'>
                        <h1>daniel james ross</h1>
                    </div>
                    <div className='header'>
                        <h2>
                            Interactive Sound, Algorithmic Composition &
                            Creative Programming
                        </h2>
                    </div>
                </>
            )}
            <StartButton />
            {showMenu && <Menu />}
            {infoPage && (
                <>
                    <Info /> <Footer />
                </>
            )}
            <MainSection />
            <Slider />
            <Structure />
            <ColourSketch />
            {showTitle && <Footer />}
        </div>
    );
}
