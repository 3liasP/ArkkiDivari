import {
    Box,
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Button,
    Skeleton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useEffect } from 'react';
import bookIcon from '../../assets/svg/book.svg';
import { connect } from 'react-redux';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import { removeFavorite, fetchFavoriteData } from './favorite.actions';
import { COPY_STATUSES } from '../copy/copy.constants';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { paramsToUrl } from '../../helpers/url.helpers';
import {
    addToShoppingCart,
    toggleShoppingCartOpen,
} from '../../reducers/user.slice';

const FavoriteGrid = ({
    ctx,
    loading,
    schema,
    shoppingCart,
    favoriteData,
    removeFavorite,
    fetchFavoriteData,
    addToShoppingCart,
    toggleShoppingCartOpen,
}) => {
    useEffect(() => {
        fetchFavoriteData(ctx);
    }, [ctx, fetchFavoriteData]);

    const theme = useTheme();
    const isWindowed = useMediaQuery(theme.breakpoints.up('md'));

    const subHeaders = ['author', 'year'];

    const navigate = useNavigate();

    const handleNavigate = (copy) => {
        navigate(
            paramsToUrl({
                page: 'book-sheet',
                pageParam: copy.bookid,
            }),
        );
    };

    const handleAddToCart = (copy) => {
        addToShoppingCart(copy);
        toggleShoppingCartOpen();
    };

    const inCart = (copy) => {
        shoppingCart.some((item) => item.copyid === copy.copyid);
    };

    if (loading || !schema) {
        return (
            <Box
                maxWidth="false"
                sx={{
                    display: 'grid',
                    mt: 4,
                    gridTemplateColumns:
                        'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2,
                }}
            >
                {Array.from(
                    { length: isWindowed ? 12 : 6 },
                    (_, i) => i + 1,
                ).map((i) => (
                    <Skeleton
                        variant="rectangular"
                        key={i}
                        height={430}
                        sx={{ borderRadius: 1 }}
                    />
                ))}
            </Box>
        );
    }

    if (!favoriteData || favoriteData.length === 0) {
        return (
            <Box display="flex" flexDirection="column" mt={4}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Näyttää siltä, ettet ole vielä lisännyt suosikkeja. Näet
                    jatkossa kaikki lisäämäsi suosikit tältä sivulta.
                </Typography>
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
            {favoriteData.map((copy) => (
                <Card key={copy.copyid} sx={{ mb: 2, boxShadow: 3 }}>
                    <CardContent>
                        <CardActionArea onClick={() => handleNavigate(copy)}>
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
                        </CardActionArea>
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
                                    {index < 1 && (
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
                            >
                                Lisää ostoskoriin
                            </Button>
                        </Box>
                        <Box display="block" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FavoriteIcon />}
                                onClick={() => {
                                    removeFavorite(ctx, copy.copyid);
                                    setTimeout(() => {
                                        fetchFavoriteData(ctx);
                                    }, 100);
                                }}
                            >
                                Poista suosikeista
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

const mapStateToProps = (state) => ({
    schema: state.schema.data,
    favoriteData: state.contexts.favorites.favoriteData,
    loading: state.contexts.favorites.loading,
    shoppingCart: state.user.shoppingCart,
});

const mapDispatchToProps = (dispatch) => ({
    removeFavorite: (ctx, copyid) => dispatch(removeFavorite(ctx, copyid)),
    fetchFavoriteData: (ctx) => dispatch(fetchFavoriteData(ctx)),
    addToShoppingCart: (item) => dispatch(addToShoppingCart(item)),
    toggleShoppingCartOpen: () => dispatch(toggleShoppingCartOpen()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteGrid);
