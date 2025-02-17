import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    home: {},
    'book-sheet': {},
    'book-new': {},
    'search-results': {},
    'search-advanced': {},
    user: {},
    support: {},
};

const contextSlice = createSlice({
    name: 'contexts',
    initialState,
    reducers: {
        setCurrentBook: (state, action) => {
            const { ctx, book } = action.payload;
            state[ctx]['currentBook'] = book;
        },
        setEditedBook: (state, action) => {
            const { ctx, book } = action.payload;
            state[ctx]['editedBook'] = book;
        },
        setEditedBookProperty: (state, action) => {
            const { ctx, key, value } = action.payload;
            state[ctx]['editedBook'][key] = value;
        },
        setEditedCopy: (state, action) => {
            const { ctx, copy } = action.payload;
            state[ctx]['editedCopy'] = copy;
        },
        setEditedCopyProperty: (state, action) => {
            const { ctx, key, value } = action.payload;
            state[ctx]['editedCopy'][key] = value;
        },
        setEditing: (state, action) => {
            const { ctx, editing } = action.payload;
            state[ctx]['editing'] = editing;
        },
        setIdMode: (state, action) => {
            const { ctx, idMode } = action.payload;
            state[ctx]['idMode'] = idMode;
        },
        setNotFound: (state, action) => {
            const { ctx, notFound } = action.payload;
            state[ctx]['notFound'] = notFound;
        },
        setSearchParams: (state, action) => {
            const { ctx, params } = action.payload;
            state[ctx]['searchParams'] = params;
        },
        setSearchResults: (state, action) => {
            const { ctx, results } = action.payload;
            state[ctx]['searchResults'] = results;
        },
    },
});

export const {
    setCurrentBook,
    setEditedBook,
    setEditedBookProperty,
    setEditedCopy,
    setEditedCopyProperty,
    setEditing,
    setIdMode,
    setNotFound,
    setSearchParams,
    setSearchResults,
} = contextSlice.actions;

export default contextSlice.reducer;
