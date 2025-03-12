import { List, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';

const Info = ({ schema, shoppingCart, order }) => {
    const products = shoppingCart.map((copy) => ({
        key: copy.copyid,
        name: copy.book.title,
        desc: copy.book.author,
        seller: copy.sellerid,
        price: copy.price,
    }));

    if (shoppingCart.length === 0) return null;

    return (
        <>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Välisumma
            </Typography>
            <Typography variant="h4" gutterBottom>
                {`${order?.subtotal || 0} €`}
            </Typography>
            <List disablePadding>
                {products.map((product) => (
                    <ListItem key={product.key} sx={{ py: 1, px: 0 }}>
                        <ListItemText
                            sx={{ mr: 2 }}
                            primary={product.name}
                            secondary={
                                <>
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {product.desc}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        component="span"
                                        sx={{ display: 'block' }}
                                    >
                                        {`Myyjä: ${schema?.associations.seller[product.seller]}`}
                                    </Typography>
                                </>
                            }
                        />
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 'medium' }}
                        >
                            {`${product.price} €`}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

const mapStateToProps = (state) => ({
    schema: state.schema.data,
    shoppingCart: state.user.shoppingCart,
    order: state.user.order.details,
});

export default connect(mapStateToProps, null)(Info);
