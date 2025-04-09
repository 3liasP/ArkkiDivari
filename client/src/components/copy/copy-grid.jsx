import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useEffect, useMemo } from 'react';
import bookIcon from '../../assets/svg/book.svg';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { connect } from 'react-redux';
import { search } from '../search/search.actions';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import {
    addToShoppingCart,
    toggleShoppingCartOpen,
} from '../../reducers/user.slice';
import { COPY_STATUSES } from './copy.constants';
import { setCopyModalOpen } from '../../reducers/contexts.slice';
import { prepareCopy } from './copy.actions';
import {
    fetchFavoriteIDs,
    addFavorite,
    removeFavorite,
} from '../favorites/favorite.actions';

const CopyGrid = ({
    ctx,
    params,
    schema,
    results,
    shoppingCart,
    favoriteIDs,
    search,
    addToShoppingCart,
    toggleShoppingCartOpen,
    prepareCopy,
    setCopyModalOpen,
    fetchFavoriteIDs,
    addFavorite,
    removeFavorite,
}) => {
    useEffect(() => {
        search(ctx, params);
    }, [ctx, params, search]);

    // Fetch favorite IDs when the component mounts
    useEffect(() => {
        fetchFavoriteIDs(ctx);
    }, [ctx, fetchFavoriteIDs]);

    const bookCopies = useMemo(() => {
        if (!results || !schema) return [];
        const copies = results.reduce((acc, result) => {
            const { copies, ...book } = result;
            copies.forEach((copy) => {
                acc.push({ ...copy, book });
            });
            return acc;
        }, []);
        return copies.sort((a, b) => {
            if (a.status === 'available' && b.status !== 'available') return -1;
            if (a.status !== 'available' && b.status === 'available') return 1;
            return a.price - b.price;
        });
    }, [results, schema]);

    const subHeaders = ['author', 'year'];

    const handleAddToCart = (copy) => {
        addToShoppingCart(copy);
        toggleShoppingCartOpen();
    };

    const handleAddToFavorites = (copy) => {
        addFavorite(ctx, copy.copyid);
    };

    const handleRemoveFromFavorites = (copy) => {
        removeFavorite(ctx, copy.copyid);
    };

    const inCart = (copy) =>
        shoppingCart.some((item) => item.copyid === copy.copyid);

    const handleCopyModalOpen = () => {
        prepareCopy(ctx);
        setCopyModalOpen({ ctx, open: true });
    };

    if (!bookCopies.length) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <Typography variant="h6" mb={2}>
                    Ei myyntikappaleita
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LibraryAddIcon />}
                    onClick={handleCopyModalOpen} // Add onClick handler for the button
                >
                    Luo uusi myyntikappale
                </Button>
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
                                            ? 'success'
                                            : 'error'
                                    }
                                >
                                    {COPY_STATUSES[copy.status]}
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
                                color="secondary"
                                startIcon={<AddShoppingCartIcon />}
                                onClick={() => handleAddToCart(copy)}
                                disabled={
                                    copy.status !== 'available' || inCart(copy)
                                }
                                sx={{ mb: 2 }}
                            >
                                Lisää ostoskoriin
                            </Button>
                            {favoriteIDs?.includes(copy.copyid) ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FavoriteIcon />}
                                    onClick={() =>
                                        handleRemoveFromFavorites(copy)
                                    }
                                    disabled={copy.status !== 'available'}
                                >
                                    Poista suosikeista
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<FavoriteIcon />}
                                    onClick={() => handleAddToFavorites(copy)}
                                    disabled={copy.status !== 'available'}
                                >
                                    Lisää suosikiksi
                                </Button>
                            )}
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
    shoppingCart: state.user.shoppingCart,
    favoriteIDs: state.contexts[ownProps.ctx].favoriteIDs,
});

const mapDispatchToProps = (dispatch) => ({
    search: (ctx, params) => dispatch(search(ctx, params)),
    addToShoppingCart: (item) => dispatch(addToShoppingCart(item)),
    toggleShoppingCartOpen: () => dispatch(toggleShoppingCartOpen()),
    prepareCopy: (ctx) => dispatch(prepareCopy(ctx)),
    setCopyModalOpen: (paylaod) => dispatch(setCopyModalOpen(paylaod)),
    fetchFavoriteIDs: (ctx) => dispatch(fetchFavoriteIDs(ctx)),
    addFavorite: (ctx, copyid) => dispatch(addFavorite(ctx, copyid)),
    removeFavorite: (ctx, copyid) => dispatch(removeFavorite(ctx, copyid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyGrid);
