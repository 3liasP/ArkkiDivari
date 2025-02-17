import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    message: '',
    variant: 'success',
    duration: 5000,
};

const toasterSlice = createSlice({
    name: 'toaster',
    initialState,
    reducers: {
        showToaster(state, action) {
            state.open = true;
            state.message = action.payload.message;
            state.variant = action.payload.variant;
            state.duration = action.payload.duration;
        },
        hideToaster(state) {
            state.open = false;
            state.message = '';
        },
    },
});

export const { showToaster, hideToaster } = toasterSlice.actions;
export default toasterSlice.reducer;
