import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '../helpers/storage.helpers';

const initialState = {
    userid: null,
    username: null,
    group: null,
    darkMode: getLocalStorage('darkMode', false),
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userid = action.payload.userid;
            state.name = action.payload.name;
            state.group = action.payload.group;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
            setLocalStorage('darkMode', action.payload);
        },
        logout: (state) => {
            state.userid = null;
            state.group = null;
            state.darkMode = false;
        },
    },
});

export const { setDarkMode, setUser, logout } = userSlice.actions;

export default userSlice.reducer;
