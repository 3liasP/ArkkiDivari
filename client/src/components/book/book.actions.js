import api from '../../core/api';
import { urlToParams } from '../../helpers/url.helpers';
import {
    setCurrentBook,
    setEditedBook,
    setEditing,
    setNotFound,
} from '../../reducers/contexts.slice';
import { showToaster } from '../../reducers/toaster.slice';

export const fetchBook = (ctx, pageParam) => async (dispatch) => {
    try {
        dispatch(setNotFound({ ctx, notFound: false }));
        dispatch(setEditing({ ctx, editing: false }));
        dispatch(setEditedBook({ ctx, book: null }));
        const searchQuery =
            pageParam || urlToParams(window.location.search)?.pageParam;
        const book = await api.getBookById(searchQuery);
        dispatch(setCurrentBook({ ctx, book }));
    } catch (error) {
        dispatch(setNotFound({ ctx, notFound: true }));
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const createBook =
    (ctx, newCtx, callBack) => async (dispatch, getState) => {
        const state = getState();

        const requireId = state.contexts[ctx].idMode !== 'auto';
        try {
            const newBook = { ...state.contexts[ctx].editedBook };
            newBook.userId = state.user.userId;
            if (
                !validateBook(newBook, state.schema.data.properties, requireId)
            ) {
                dispatch(
                    showToaster({
                        message: 'Täytä kaikki pakolliset kentät!',
                        variant: 'error',
                    }),
                );
                return;
            }
            const result = await api.createBook(newBook);
            dispatch(setCurrentBook({ ctx: newCtx, book: result }));
            dispatch(setEditing({ ctx, editing: false }));
            dispatch(setEditedBook({ ctx, book: null }));
            dispatch(
                showToaster({
                    message: 'Uusi teos luotu!',
                    variant: 'success',
                }),
            );
            if (callBack) callBack(result);
        } catch (error) {
            dispatch(showToaster({ message: error.message, variant: 'error' }));
        }
    };

export const updateBook = (ctx) => async (dispatch, getState) => {
    const state = getState();

    try {
        const updatedBook = { ...state.contexts[ctx].editedBook };
        updatedBook.userId = state.user.userId;
        if (!validateBook(updatedBook, state.schema.data.books.properties)) {
            dispatch(
                showToaster({
                    message: 'Täytä kaikki pakolliset kentät!',
                    variant: 'error',
                }),
            );
            return;
        }
        const result = await api.updateBook(updatedBook);
        dispatch(setCurrentBook({ ctx, book: result }));
        dispatch(setEditing({ ctx, editing: false }));
        dispatch(setEditedBook({ ctx, book: null }));
        dispatch(
            showToaster({
                message: 'Teos päivitetty!',
                variant: 'success',
            }),
        );
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const cloneBook =
    (ctx, newCtx, callBack) => async (dispatch, getState) => {
        const state = getState();

        const requireId = false;
        try {
            // eslint-disable-next-line no-unused-vars
            const { bookid, createdAt, ...rest } =
                state.contexts[ctx].currentBook;
            const clonedBook = { ...rest };
            if (
                !validateBook(
                    clonedBook,
                    state.schema.data.books.properties,
                    requireId,
                )
            ) {
                dispatch(
                    showToaster({
                        message: 'Täytä kaikki pakolliset kentät!',
                        variant: 'error',
                    }),
                );
                return;
            }
            dispatch(setEditedBook({ ctx: newCtx, book: clonedBook }));
            dispatch(setEditing({ ctx: newCtx, editing: true }));
            dispatch(
                showToaster({
                    message: 'Teos kopioitu!',
                    variant: 'info',
                }),
            );
            if (callBack) callBack();
        } catch (error) {
            dispatch(showToaster({ message: error.message, variant: 'error' }));
        }
    };

export const deleteBook = (ctx, callBack) => async (dispatch, getState) => {
    const state = getState();

    try {
        await api.deleteBook(state.contexts[ctx].currentBook.bookid);
        dispatch(setCurrentBook({ ctx: ctx, book: null }));
        dispatch(
            showToaster({
                message: 'Teos poistettu!',
                variant: 'info',
            }),
        );
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

const validateBook = (book, propertySchema, requireId = true) => {
    if (!book) return false;
    const requiredFields = Object.keys(propertySchema).filter((key) =>
        requireId
            ? propertySchema[key].required
            : propertySchema[key].required && key !== 'bookid',
    );
    if (requiredFields.some((field) => !book[field])) {
        return false;
    }
    return true;
};
