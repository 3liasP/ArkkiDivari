import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './core/store';
import App from './app';

if (import.meta.env.MODE === 'development') {
    window.store = store;
}

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <StrictMode>
            <App />
        </StrictMode>
    </Provider>,
);
