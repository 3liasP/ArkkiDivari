import api from '../../core/api';
import {
    setEditedBook,
    setEditing,
    setSearchParams,
    setSearchResults,
} from '../../reducers/contexts.slice';
import { showToaster } from '../../reducers/toaster.slice';
import { DEFAULT_SEARCH_PARAMS } from './search.constants';

export const search = (ctx, params) => async (dispatch) => {
    try {
        if (!params) return;
        const results = await api.search(params);
        dispatch(setSearchResults({ ctx, results }));
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const initSimpleSearch =
    (query, newCtx, callBack) => async (dispatch, getState) => {
        const state = getState();
        const ctx = state.app.ctx;
        try {
            const searchBook = { query };
            const params = bookToSearchParams(searchBook);

            dispatch(setSearchParams({ ctx: newCtx, params }));
            dispatch(setEditing({ ctx, editing: false }));
            dispatch(setEditedBook({ ctx, book: null }));
            if (callBack) callBack(newCtx, params);
        } catch (error) {
            console.error(error);
            dispatch(showToaster({ message: error.message, variant: 'error' }));
        }
    };

export const initAdvancedSearch =
    (ctx, newCtx, callBack) => async (dispatch, getState) => {
        const state = getState();
        try {
            const editedBook = { ...state.contexts[ctx].editedBook };
            const params = bookToSearchParams(editedBook);

            dispatch(setSearchParams({ ctx: newCtx, params }));
            dispatch(setEditing({ ctx, editing: false }));
            dispatch(setEditedBook({ ctx, book: null }));
            if (callBack) callBack(newCtx, params);
        } catch (error) {
            console.error(error);
            dispatch(showToaster({ message: error.message, variant: 'error' }));
        }
    };

const bookToSearchParams = (book) => {
    const params = structuredClone(DEFAULT_SEARCH_PARAMS);
    for (const key in book) {
        if (book[key]) {
            if (key === 'orderby' || key === 'sort') {
                params.args[key] = book[key];
            } else if (key === 'query') {
                params.query = book[key];
            } else if (Array.isArray(book[key])) {
                params.criteria[key] = book[key];
            } else {
                params.criteria[key] = [book[key]];
            }
        }
    }
    return params;
};
