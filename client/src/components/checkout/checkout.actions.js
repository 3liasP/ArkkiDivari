import api from '../../core/api';
import { showToaster } from '../../reducers/toaster.slice';
import { clearShoppingCart, setOrder } from '../../reducers/user.slice';

export const createOrder = (callBack) => async (dispatch, getState) => {
    const state = getState();
    try {
        if (state.user.order?.details.status === 'pending') {
            await api.cancelOrder(state.user.order.details.orderid);
        }
        const copyids = state.user.shoppingCart.map(({ copyid }) => copyid);
        const result = await api.createOrder(copyids);
        dispatch(setOrder(result));
        dispatch(
            showToaster({
                message: 'Tilaus luotu!',
                variant: 'success',
            }),
        );
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const cancelOrder = (callBack) => async (dispatch, getState) => {
    const state = getState();
    try {
        const result = await api.cancelOrder(state.user.order.details.orderid);
        dispatch(setOrder(result));
        dispatch(clearShoppingCart());
        dispatch(
            showToaster({
                message: 'Tilaus peruutettu!',
                variant: 'info',
            }),
        );
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};

export const completeOrder = (callBack) => async (dispatch, getState) => {
    const state = getState();
    try {
        const result = await api.completeOrder(
            state.user.order.details.orderid,
        );
        dispatch(setOrder(result));
        dispatch(clearShoppingCart());
        dispatch(
            showToaster({
                message: 'Tilaus valmis!',
                variant: 'success',
            }),
        );
        if (callBack) callBack();
    } catch (error) {
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    }
};
