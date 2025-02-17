import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { initApp } from './app.actions';
import ComponentsSelector from './components/canvas/component-selector';
import LoadingOverlay from './components/canvas/loading-overlay';
import TopBar from './components/menu-bar/top-bar';
import ErrorBoundary from './routes/error-boundary';
import { lightTheme, darkTheme } from './themes/theme';
import Toaster from './components/toaster/toaster';
import { dayjsSetup } from './helpers/dayjs.helpers';

const App = ({ ready, initApp, darkMode }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp]);

    if (loading) {
        return <LoadingOverlay />;
    }

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
                        <TopBar />
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
});

const mapDispatchToProps = (dispatch) => ({
    initApp: () => dispatch(initApp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
