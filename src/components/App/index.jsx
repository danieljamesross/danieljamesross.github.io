import React, { Suspense, lazy } from 'react';
import { hot } from 'react-hot-loader';
import Spinner from 'react-bootstrap/Spinner';

//import './App.css';
import '../../stylesheets/main.scss';

const AppContent = lazy(() => import('../AppContent'));
const AppStateProvider = lazy(() => import('./AppStateProvider'));
function App() {
    return (
        <Suspense
            fallback={
                <Spinner
                // as='span'
                // animation='border'
                // size='sm'
                // role='status'
                // aria-hidden='true'
                />
            }>
            <AppStateProvider>
                <AppContent />
            </AppStateProvider>
        </Suspense>
    );
}

export default module.hot ? hot(module)(App) : App;
