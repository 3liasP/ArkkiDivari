import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    home: {},
    'book-sheet': {},
    'book-new': {},
    'search-results': {},
    'search-advanced': {},
    user: {},
    orders: {
        orderHistory: [],
        loading: false,
    },
    support: {},
    checkout: {},
    favorites: {},
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
        setCopyModalOpen: (state, action) => {
            const { ctx, open } = action.payload;
            state[ctx]['copyModalOpen'] = open;
        },
        setEditedCopy: (state, action) => {
            const { ctx, copy } = action.payload;
            state[ctx]['editedCopy'] = copy;
        },
        setEditedCopyProperty: (state, action) => {
            const { ctx, key, value } = action.payload;
            state[ctx]['editedCopy'][key] = value;
        },
        setEditedUser: (state, action) => {
            const { ctx, user } = action.payload;
            state[ctx]['editedUser'] = user;
        },
        setEditedUserProperty: (state, action) => {
            const { ctx, key, value } = action.payload;
            state[ctx]['editedUser'][key] = value;
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
        setOrderHistory: (state, action) => {
            const { ctx, orders } = action.payload;
            state[ctx]['orderHistory'] = orders;
        },
        setLoading: (state, action) => {
            const { ctx, loading } = action.payload;
            state[ctx]['loading'] = loading;
        },
        setFavoriteIDs: (state, action) => {
            const { ctx, copyids } = action.payload;
            state[ctx]['favoriteIDs'] = copyids;
        },
    },
});

export const {
    setCurrentBook,
    setEditedBook,
    setEditedBookProperty,
    setCopyModalOpen,
    setEditedCopy,
    setEditedCopyProperty,
    setEditedUser,
    setEditedUserProperty,
    setEditing,
    setIdMode,
    setNotFound,
    setSearchParams,
    setSearchResults,
    setOrderHistory,
    setLoading,
    setFavoriteIDs,
} = contextSlice.actions;

export default contextSlice.reducer;
