import { setOrderHistory, setLoading } from '../../reducers/contexts.slice';
import api from '../../core/api';

export const fetchOrderHistory = (ctx) => async (dispatch) => {
    try {
        dispatch(setLoading({ ctx, loading: true }));
        const orders = await api.getOrderHistory();
        dispatch(setOrderHistory({ ctx, orders }));
    } catch (error) {
        console.error('Error fetching order history:', error.message);
    } finally {
        dispatch(setLoading({ ctx, loading: false }));
    }
};
