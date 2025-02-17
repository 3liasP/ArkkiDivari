import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '../helpers/storage.helpers';

const initialState = {
    userid: null,
    username: null,
    group: null,
    darkMode: getLocalStorage('darkMode', false),
    loading: false,
    error: null,
    shoppingCart: getLocalStorage('shoppingCart', []),
    shoppingCartOpen: false,
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
        toggleShoppingCartOpen: (state) => {
            state.shoppingCartOpen = !state.shoppingCartOpen;
        },
        addToShoppingCart: (state, action) => {
            state.shoppingCart.push(action.payload);
            setLocalStorage('shoppingCart', state.shoppingCart);
        },
        removeFromShoppingCart: (state, action) => {
            state.shoppingCart = state.shoppingCart.filter(
                ({ copyid }) => copyid !== action.payload,
            );
            setLocalStorage('shoppingCart', state.shoppingCart);
        },
        clearShoppingCart: (state) => {
            state.shoppingCart = [];
            setLocalStorage('shoppingCart', []);
        },
    },
});

export const {
    setDarkMode,
    setUser,
    logout,
    toggleShoppingCartOpen,
    addToShoppingCart,
    removeFromShoppingCart,
    clearShoppingCart,
} = userSlice.actions;

export default userSlice.reducer;
