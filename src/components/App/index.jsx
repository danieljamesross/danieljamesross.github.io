import React, { Suspense, lazy } from 'react';
import { hot } from 'react-hot-loader';
import Spinner from 'react-bootstrap/Spinner';
// import AppContent from '../AppContent';
// import Loader from '../Loader';
// import AppStateProvider from './AppStateProvider';

import './App.css';

const AppContent = lazy(() => import('../AppContent'));
const AppStateProvider = lazy(() => import('./AppStateProvider'));
function App() {
    return (
        <Suspense fallback={<Spinner />}>
            <AppStateProvider>
                <AppContent />
            </AppStateProvider>
        </Suspense>
    );
}

export default module.hot ? hot(module)(App) : App;
