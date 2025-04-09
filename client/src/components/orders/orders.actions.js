import { setOrderHistory, setLoading } from '../../reducers/contexts.slice';
import api from '../../core/api';
import { showToaster } from '../../reducers/toaster.slice';

export const fetchOrderHistory = (ctx) => async (dispatch) => {
    try {
        dispatch(setLoading({ ctx, loading: true }));
        const orders = await api.getOrderHistory();
        dispatch(setOrderHistory({ ctx, orders }));
    } catch (error) {
        console.error('Error fetching order history:', error.message);
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    } finally {
        dispatch(setLoading({ ctx, loading: false }));
    }
};

export const cancelOrder = (ctx, orderId) => async (dispatch) => {
    try {
        dispatch(setLoading({ ctx, loading: true }));
        await api.cancelOrder(orderId);
        dispatch(fetchOrderHistory(ctx));
    } catch (error) {
        console.error('Error canceling order:', error.message);
        dispatch(showToaster({ message: error.message, variant: 'error' }));
    } finally {
        dispatch(setLoading({ ctx, loading: false }));
    }
};
