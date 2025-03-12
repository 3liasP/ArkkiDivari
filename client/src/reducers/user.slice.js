import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage, setLocalStorage } from '../helpers/storage.helpers';

const initialState = {
    loggedIn: false,
    loading: false,
    info: {
        userid: null,
        role: null,
        sellerid: null,
        address: null,
        zip: null,
        city: null,
        phone: null,
    },
    darkMode: getLocalStorage('darkMode', false),
    shoppingCart: getLocalStorage('shoppingCart', []),
    shoppingCartOpen: false,
    order: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.info.userid = action.payload.userid;
            state.info.name = action.payload.name;
            state.info.role = action.payload.role;
            state.info.sellerid = action.payload.sellerid;
            state.info.address = action.payload.address;
            state.info.zip = action.payload.zip;
            state.info.city = action.payload.city;
            state.info.phone = action.payload.phone;
        },
        setLoading(state, action) {
            state.loading = action.payload;
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
        setOrder: (state, action) => {
            state.order = action.payload;
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
    setLoading,
    setOrder,
} = userSlice.actions;

export default userSlice.reducer;
