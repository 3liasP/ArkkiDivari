import { combineReducers, configureStore } from '@reduxjs/toolkit';
import app from '../reducers/app.slice';
import schema from '../reducers/schema.slice';
import contexts from '../reducers/contexts.slice';
import toaster from '../reducers/toaster.slice';
import user from '../reducers/user.slice';

const rootReducer = combineReducers({
    app,
    schema,
    contexts,
    toaster,
    user,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
