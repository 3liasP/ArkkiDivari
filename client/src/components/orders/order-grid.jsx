import {
    Box,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Skeleton,
    Button,
} from '@mui/material';
import { connect } from 'react-redux';
import { cancelOrder, fetchOrderHistory } from './orders.actions';
import { useEffect, useState } from 'react';
import bookIcon from '../../assets/svg/book.svg';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import CancelIcon from '@mui/icons-material/Cancel';

const OrderGrid = ({
    ctx,
    loading,
    orderHistory,
    fetchOrderHistory,
    cancelOrder,
}) => {
    const theme = useTheme();
    const isWindowed = useMediaQuery(theme.breakpoints.down('lg'));

    const [openCard, setOpenCard] = useState(null);

    const handleCardClick = (orderId) => {
        setOpenCard(openCard === orderId ? null : orderId);
    };

    // Placeholder for cancel order functionality
    const handleCancelOrder = (e, orderId) => {
        e.stopPropagation(); // Prevent card from toggling when clicking the button
        cancelOrder(ctx, orderId);
    };

    useEffect(() => {
        fetchOrderHistory(ctx);
    }, [ctx, fetchOrderHistory]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', mt: 4, flexDirection: 'column' }}>
                <Skeleton
                    variant="rectangular"
                    height={140}
                    sx={{ borderRadius: 1, mb: 2 }}
                />
                <Skeleton
                    variant="rectangular"
                    height={140}
                    sx={{ borderRadius: 1, mb: 2 }}
                />
                <Skeleton
                    variant="rectangular"
                    height={140}
                    sx={{ borderRadius: 1, mb: 2 }}
                />
                <Skeleton
                    variant="rectangular"
                    height={140}
                    sx={{ borderRadius: 1, mb: 2 }}
                />
                <Skeleton
                    variant="rectangular"
                    height={140}
                    sx={{ borderRadius: 1, mb: 2 }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            {orderHistory.length === 0 ? (
                <Typography variant="subtitle1" gutterBottom>
                    Ei tehtyjä tilauksia. Näet tilaushistoriasi täällä, kun olet
                    tehnyt tilauksen.
                </Typography>
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    mt={3}
                >
                    {orderHistory.toReversed().map((order) => (
                        <Card key={order.orderid} sx={{ mb: 2, boxShadow: 3 }}>
                            <CardActionArea
                                onClick={() => handleCardClick(order.orderid)}
                            >
                                <CardContent>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        {order.status === 'cancelled' ? (
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{ color: 'error.main' }}
                                            >
                                                {`Tilaus #${order.orderid} (peruutettu)`}
                                            </Typography>
                                        ) : order.status === 'pending' ? (
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{ color: 'warning.main' }}
                                            >
                                                {`Tilaus #${order.orderid} (käsittelyssä)`}
                                            </Typography>
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{ color: 'success.main' }}
                                            >
                                                {`Tilaus #${order.orderid}`}
                                            </Typography>
                                        )}

                                        {order.status === 'pending' && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<CancelIcon />}
                                                onClick={(e) =>
                                                    handleCancelOrder(
                                                        e,
                                                        order.orderid,
                                                    )
                                                }
                                                sx={{ marginLeft: 2 }}
                                            >
                                                Peru tilaus
                                            </Button>
                                        )}
                                    </Box>

                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        {`Tilausaika: ${dayjsFormatTimeStamp(order.time)}`}
                                    </Typography>

                                    <Box display="flex" justifyContent="start">
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ mr: 3 }}
                                        >
                                            {`Välisumma: ${order.subtotal} €`}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ mr: 3 }}
                                        >
                                            {`Toimituskulut: ${order.shipping} €`}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {`Yhteensä: ${order.total} €`}
                                        </Typography>
                                    </Box>
                                    <Collapse
                                        in={openCard === order.orderid}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            mt={2}
                                        >
                                            Tilatut teokset
                                        </Typography>
                                        <List
                                            sx={{
                                                width: '100%',
                                                marginTop: 0,
                                                paddingTop: 0,
                                            }}
                                        >
                                            {order.copies.map((copy, index) => (
                                                <ListItem
                                                    key={copy.copyid}
                                                    sx={
                                                        index === 0
                                                            ? {
                                                                  borderTop:
                                                                      '1px solid #ccc',
                                                                  borderBottom:
                                                                      '1px solid #ccc',
                                                              }
                                                            : {
                                                                  borderBottom:
                                                                      '1px solid #ccc',
                                                              }
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <img
                                                            src={bookIcon}
                                                            alt="Placeholder picture"
                                                            style={{
                                                                width: '50px',
                                                                height: 'auto',
                                                                marginRight:
                                                                    '25px',
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={`${copy.title} ${String.fromCharCode(8226)}
                                                     ${copy.author} ${String.fromCharCode(8226)} ${copy.year}`}
                                                        sx={{ m: 0, p: 0 }}
                                                    />
                                                    <ListItemText
                                                        primary={`Hinta: ${copy.price} €`}
                                                        sx={{
                                                            m: 0,
                                                            p: 0,
                                                            position:
                                                                'absolute',
                                                            right: isWindowed
                                                                ? '5vw'
                                                                : '40vw',
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

const mapStateToProps = (state) => ({
    orderHistory: state.contexts.orders.orderHistory,
    loading: state.contexts.orders.loading,
});

const mapDispatchToProps = (dispatch) => ({
    fetchOrderHistory: (ctx) => dispatch(fetchOrderHistory(ctx)),
    cancelOrder: (ctx, orderId) => dispatch(cancelOrder(ctx, orderId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderGrid);
