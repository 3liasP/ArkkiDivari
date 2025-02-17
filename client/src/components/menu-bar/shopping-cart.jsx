import { connect } from 'react-redux';
import {
    clearShoppingCart,
    removeFromShoppingCart,
} from '../../reducers/user.slice';
import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';

const ShoppingCart = ({
    schema,
    shoppingCart,
    removeFromShoppingCart,
    clearShoppingCart,
}) => {
    const total = useMemo(
        () =>
            parseFloat(
                shoppingCart.reduce((acc, copy) => acc + Number(copy.price), 0),
            ).toFixed(2),
        [shoppingCart],
    );

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const subHeaders = ['author', 'year'];

    return (
        <Box
            sx={{
                width: isMobile ? 250 : 400,
                m: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100vh',
            }}
            role="presentation"
        >
            <List>
                {shoppingCart.length > 0 ? (
                    shoppingCart.map((copy) => (
                        <ListItem key={copy.copyid}>
                            <ListItemText
                                primary={copy.book.title}
                                secondary={
                                    <>
                                        {subHeaders.map((key, index) => (
                                            <Typography
                                                key={key}
                                                variant="body2"
                                                component="span"
                                            >
                                                {copy.book?.[key]}
                                                {index <
                                                    subHeaders.length - 1 && (
                                                    <span>
                                                        &nbsp;
                                                        {String.fromCharCode(
                                                            8226,
                                                        )}
                                                        &nbsp;
                                                    </span>
                                                )}{' '}
                                            </Typography>
                                        ))}
                                        <Typography
                                            variant="subtitle2"
                                            component="span"
                                            sx={{ display: 'block' }}
                                        >
                                            {`Myyjä: ${schema.associations.seller[copy.sellerid]}`}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            component="span"
                                            sx={{ display: 'block', mt: 2 }}
                                        >
                                            {copy.price} €
                                        </Typography>
                                    </>
                                }
                            />
                            <IconButton
                                edge="end"
                                onClick={() =>
                                    removeFromShoppingCart(copy.copyid)
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="h6">Ostoskori on tyhjä</Typography>
                )}
            </List>
            <Box
                sx={{
                    mt: 2,
                }}
            >
                <Divider sx={{ mb: 2 }} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6">{`Yhteensä`}</Typography>
                    <Typography variant="h6">{`${total} €`}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Toimituskulut lisätään tilauksen loppusummaan kassalla.
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        mt: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<RemoveShoppingCartIcon />}
                        onClick={clearShoppingCart}
                        sx={{ mb: isMobile ? 2 : 0 }}
                    >
                        Tyhjennä ostoskori
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<ShoppingCartCheckoutIcon />}
                        disabled={shoppingCart.length === 0}
                    >
                        Siirry kassalle
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    schema: state.schema.data,
    shoppingCart: state.user.shoppingCart,
});

const mapDispatchToProps = (dispatch) => ({
    removeFromShoppingCart: (copyid) =>
        dispatch(removeFromShoppingCart(copyid)),
    clearShoppingCart: () => dispatch(clearShoppingCart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
