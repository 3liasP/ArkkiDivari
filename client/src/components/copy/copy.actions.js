import api from '../../core/api';
import { setEditedCopy } from '../../reducers/contexts.slice';
import { showToaster } from '../../reducers/toaster.slice';

export const prepareCopy = (ctx) => async (dispatch, getState) => {
    const state = getState();

    try {
        const bookid = state.contexts[ctx].currentBook.bookid;
        dispatch(setEditedCopy({ ctx, copy: { bookid, status: 'available' } }));
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const createCopy = (ctx, callBack) => async (dispatch, getState) => {
    const state = getState();

    try {
        const newCopy = { ...state.contexts[ctx].editedCopy };
        if (!validateCopy(newCopy, state.schema.data.copies.properties)) {
            dispatch(
                showToaster({
                    message: 'Täytä kaikki pakolliset kentät!',
                    variant: 'error',
                }),
            );
            return;
        }
        await api.createCopy(newCopy);
        dispatch(setEditedCopy({ ctx, copy: null }));
        dispatch(
            showToaster({
                message: 'Uusi myyntikappale luotu!',
                variant: 'success',
            }),
        );
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

const validateCopy = (copy, propertySchema) => {
    if (!copy) return false;
    const requiredFields = Object.keys(propertySchema).filter(
        (key) => propertySchema[key].required,
    );
    if (requiredFields.some((field) => !copy[field])) {
        return false;
    }
    return true;
};
