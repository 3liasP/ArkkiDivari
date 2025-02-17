import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ctx: 'home',
    ready: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCtx: (state, action) => {
            const { ctx } = action.payload;
            state.ctx = ctx;
        },
        setAppReady: (state, action) => {
            const { ready } = action.payload;
            state.ready = ready;
        },
    },
});

export const { setCtx, setAppReady } = appSlice.actions;

export default appSlice.reducer;
