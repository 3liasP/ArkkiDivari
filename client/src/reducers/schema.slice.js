import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../core/api';

// Async thunk to fetch book model
export const fetchSchema = createAsyncThunk(
    'schema/fetchSchema',
    async (_, { rejectWithValue }) => {
        try {
            return await api.getSchema();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const schemaSlice = createSlice({
    name: 'schema',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchema.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSchema.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchSchema.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default schemaSlice.reducer;
