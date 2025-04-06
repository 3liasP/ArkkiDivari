import {
    setFavoriteIDs,
    setFavoriteData,
    setLoading,
} from '../../reducers/contexts.slice';
import api from '../../core/api';
import { showToaster } from '../../reducers/toaster.slice';

export const fetchFavoriteIDs = (ctx) => async (dispatch) => {
    try {
        const copyids = await api.getFavoriteIDs();
        dispatch(setFavoriteIDs({ ctx, copyids }));
    } catch (error) {
        console.error('Error fetching favorite IDs:', error.message);
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const addFavorite = (ctx, copyid) => async (dispatch) => {
    try {
        await api.addFavorite(copyid);
        dispatch(fetchFavoriteIDs(ctx));
        dispatch(
            showToaster({ message: 'Suosikki lisätty', variant: 'success' }),
        );
    } catch (error) {
        console.error('Error adding favorite:', error.message);
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const removeFavorite = (ctx, copyid) => async (dispatch) => {
    try {
        await api.removeFavorite(copyid);
        dispatch(fetchFavoriteIDs(ctx));
        dispatch(
            showToaster({ message: 'Suosikki poistettu', variant: 'success' }),
        );
    } catch (error) {
        console.error('Error removing favorite:', error.message);
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const fetchFavoriteData = (ctx) => async (dispatch) => {
    try {
        dispatch(setLoading({ ctx, loading: true }));
        const data = await api.getFavoriteData();
        dispatch(setFavoriteData({ ctx, data }));
    } catch (error) {
        console.error('Error fetching favorite data:', error.message);
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    } finally {
        dispatch(setLoading({ ctx, loading: false }));
    }
};
