import api from '../../core/api';
import { showToaster } from '../../reducers/toaster.slice';
import { setLoading, setLoggedIn, setUser } from '../../reducers/user.slice';

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

export const me = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { userData } = await api.me();
        dispatch(setUser(userData));
        dispatch(setLoggedIn(true));
        dispatch(setLoading(false));
    } catch (error) {
        console.warn('Error getting user info:', error.message);
        dispatch(logout());
        dispatch(setLoading(false));
    }
};
