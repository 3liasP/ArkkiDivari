import { setAppReady } from './reducers/app.slice';
import { fetchSchemaAndSetUser } from './reducers/schema.slice';

export const initApp = () => {
    return async (dispatch, getState) => {
        const state = getState();

        if (!state.schema?.data) await dispatch(fetchSchemaAndSetUser());
        if (!state.app?.ready) await dispatch(setAppReady({ ready: true }));
    };
};
