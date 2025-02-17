import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useEffect, useMemo } from 'react';
import bookIcon from '../../assets/svg/book.svg';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { connect } from 'react-redux';
import { search } from '../search/search.actions';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import {
    addToShoppingCart,
    toggleShoppingCartOpen,
} from '../../reducers/user.slice';

const BookCopies = ({
    ctx,
    params,
    schema,
    results,
    search,
    addToShoppingCart,
    toggleShoppingCartOpen,
}) => {
    useEffect(() => {
        search(ctx, params);
    }, [ctx, params, search]);

    const bookCopies = useMemo(() => {
        if (!results || !schema) return [];
        return results.reduce((acc, result) => {
            const { copies, ...book } = result;
            copies.forEach((copy) => {
                acc.push({ ...copy, book });
            });
            return acc;
        }, []);
    }, [results, schema]);

    const statuses = {
        available: 'Saatavilla',
        reserved: 'Varattu',
        sold: 'Myyty',
    };

    const subHeaders = ['author', 'year'];

    const handleAddToCart = (copy) => {
        toggleShoppingCartOpen();
        addToShoppingCart(copy);
    };

    const handleAddToFavorites = (copy) => {
        // Implement add to favorites functionality
        console.log('Add to favorites:', copy);
    };

    if (!bookCopies.length) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '100vh' }}
            >
                <Typography variant="h6">Ei myyntikappaleita</Typography>
            </Box>
        );
    }

    return (
        <Box
            maxWidth="false"
            sx={{
                mt: 4,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
            }}
        >
            {bookCopies.map((copy) => (
                <Card key={copy.copyid} sx={{ mb: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <img
                                src={bookIcon}
                                alt="Teos"
                                style={{
                                    width: '100px',
                                    height: 'auto',
                                }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="start">
                            <span>
                                <Typography variant="h6">
                                    {copy.book?.title}
                                </Typography>
                            </span>
                        </Box>
                        <Box display="flex" justifyContent="start">
                            {subHeaders.map((key, index) => (
                                <Typography key={key} variant="body2">
                                    {copy.book?.[key]}
                                    {index < subHeaders.length - 1 && (
                                        <span>
                                            &nbsp;
                                            {String.fromCharCode(8226)}
                                            &nbsp;
                                        </span>
                                    )}
                                </Typography>
                            ))}
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{ mt: 2 }}
                        >
                            <Box display="block">
                                <Typography
                                    variant="subtitle2"
                                    color={
                                        copy.status === 'available'
                                            ? 'info'
                                            : 'error'
                                    }
                                >
                                    {statuses[copy.status]}
                                </Typography>
                                <Typography variant="subtitle2">
                                    {`Myyjä: ${schema.associations.seller[copy.sellerid]}`}
                                </Typography>
                                <Typography variant="subtitle2">
                                    {`Lisätty: ${dayjsFormatTimeStamp(copy.createdat)}`}
                                </Typography>
                            </Box>
                            <Typography variant="h6">
                                {`${copy.price} €`}
                            </Typography>
                        </Box>
                        <Box display="block" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<AddShoppingCartIcon />}
                                onClick={() => handleAddToCart(copy)}
                                disabled={copy.status !== 'available'}
                                sx={{ mb: 2 }}
                            >
                                Lisää ostoskoriin
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<FavoriteIcon />}
                                onClick={() => handleAddToFavorites(copy)}
                            >
                                Lisää suosikiksi
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

const mapStateToProps = (state, ownProps) => ({
    schema: state.schema.data,
    results: state.contexts[ownProps.ctx].searchResults,
});

const mapDispatchToProps = (dispatch) => ({
    search: (ctx, params) => dispatch(search(ctx, params)),
    addToShoppingCart: (item) => dispatch(addToShoppingCart(item)),
    toggleShoppingCartOpen: () => dispatch(toggleShoppingCartOpen()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookCopies);
