import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { initApp } from './app.actions';
import ComponentsSelector from './components/canvas/component-selector';
import TopBar from './components/menu-bar/top-bar';
import Toaster from './components/toaster/toaster';
import { dayjsSetup } from './helpers/dayjs.helpers';
import ErrorBoundary from './routes/error-boundary';
import { darkTheme, lightTheme } from './themes/theme';

const App = ({ ready, initApp, darkMode, loggedIn }) => {
    useEffect(() => {
        if (loggedIn) initApp();
    }, [initApp, loggedIn]);

    dayjsSetup();

    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <ErrorBoundary>
                <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                    <CssBaseline />
                    <div>
                        <Toaster />
                        {loggedIn && <TopBar />}
                        <Routes>
                            <Route
                                path="*"
                                element={<ComponentsSelector ready={ready} />}
                            />
                        </Routes>
                    </div>
                </ThemeProvider>
            </ErrorBoundary>
        </Router>
    );
};

const mapStateToProps = (state) => ({
    ready: state.app?.ready,
    darkMode: state.user.darkMode,
    loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = (dispatch) => ({
    initApp: () => dispatch(initApp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
