import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '../helpers/storage.helpers';

const initialState = {
    loggedIn: false,
    userInfo: {
        userid: null,
        username: null,
        role: null,
        sellerid: null,
        address: null,
        zip: null,
        city: null,
        phone: null,
    },
    darkMode: getLocalStorage('darkMode', false),
    shoppingCart: [],
    shoppingCartOpen: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo.userid = action.payload.userid;
            state.userInfo.name = action.payload.name;
            state.userInfo.role = action.payload.role;
            state.userInfo.sellerid = action.payload.sellerid;
            state.userInfo.address = action.payload.address;
            state.userInfo.zip = action.payload.zip;
            state.userInfo.city = action.payload.city;
            state.userInfo.phone = action.payload.phone;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
            setLocalStorage('darkMode', action.payload);
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        toggleShoppingCartOpen: (state) => {
            state.shoppingCartOpen = !state.shoppingCartOpen;
        },
        addToShoppingCart: (state, action) => {
            state.shoppingCart.push(action.payload);
        },
        removeFromShoppingCart: (state, action) => {
            state.shoppingCart = state.shoppingCart.filter(
                ({ copyid }) => copyid !== action.payload,
            );
        },
        clearShoppingCart: (state) => {
            state.shoppingCart = [];
        },
    },
});

export const {
    setDarkMode,
    setLoggedIn,
    setUser,
    logout,
    toggleShoppingCartOpen,
    addToShoppingCart,
    removeFromShoppingCart,
    clearShoppingCart,
} = userSlice.actions;

export default userSlice.reducer;
