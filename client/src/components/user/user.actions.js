import api from '../../core/api';
import { setEditedUser, setEditing } from '../../reducers/contexts.slice';
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
        dispatch(setLoading(false));
    }
};

export const register = (userInfo, callBack) => async (dispatch) => {
    try {
        await api.register(userInfo);
        dispatch(
            showToaster({
                message: 'Käyttäjä luotu onnistuneesti!',
                variant: 'success',
            }),
        );
        dispatch(login(userInfo.userid, userInfo.password, callBack));
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const updateUser = (ctx, callBack) => async (dispatch, getState) => {
    const state = getState();
    try {
        const userInfo = state.contexts[ctx].editedUser;
        const { userData } = await api.updateUser(userInfo);
        dispatch(
            showToaster({
                message: 'Käyttäjätiedot päivitetty!',
                variant: 'success',
            }),
        );
        dispatch(setEditing({ ctx, editing: false }));
        dispatch(setEditedUser({ ctx, user: null }));
        dispatch(setUser(userData));
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};
