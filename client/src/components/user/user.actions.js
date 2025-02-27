import api from '../../core/api';
import { showToaster } from '../../reducers/toaster.slice';
import { setLoggedIn, setUser } from '../../reducers/user.slice';

export const login = (username, password, callBack) => async (dispatch) => {
    try {
        const { userData } = await api.login(username, password);
        dispatch(setUser(userData));
        dispatch(setLoggedIn(true));
        if (callBack) callBack();
    } catch (error) {
        dispatch(setLoggedIn(false));
        dispatch(setUser({}));
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const logout = (callBack) => async (dispatch) => {
    try {
        await api.logout();
        dispatch(setLoggedIn(false));
        dispatch(setUser({}));
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};
