import {
    Box,
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Button,
    Skeleton,
} from '@mui/material';
import { useEffect } from 'react';
import bookIcon from '../../assets/svg/book.svg';
import { connect } from 'react-redux';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import { removeFavorite, fetchFavoriteData } from './favorite.actions';
import { COPY_STATUSES } from '../copy/copy.constants';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { paramsToUrl } from '../../helpers/url.helpers';

const FavoriteGrid = ({
    ctx,
    loading,
    schema,
    favoriteData,
    removeFavorite,
    fetchFavoriteData,
}) => {
    useEffect(() => {
        fetchFavoriteData(ctx);
    }, [ctx, fetchFavoriteData, removeFavorite]);

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', mt: 2, flexDirection: 'column' }}>
                <Skeleton
                    variant="rectangular"
                    height="80vh"
                    sx={{ borderRadius: 1 }}
                />
            </Box>
        );
    }

    if (!favoriteData || favoriteData.length === 0) {
        return (
            <Box display="flex" flexDirection="column" mt={4}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Näyttää siltä, ettet ole vielä lisännyt suosikkeja. Näet
                    jatkossa lisäämäsi suosikit tältä sivulta.
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
                                    {copy.title}
                                </Typography>
                            </span>
                        </Box>
                        <Box display="flex" justifyContent="start">
                            {subHeaders.map((key, index) => (
                                <Typography key={key} variant="body2">
                                    {copy[key]}
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
                                color="primary"
                                startIcon={<FavoriteIcon />}
                                onClick={() => {
                                    removeFavorite(ctx, copy.copyid);
                                    fetchFavoriteData(ctx);
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
});

const mapDispatchToProps = (dispatch) => ({
    removeFavorite: (ctx, copyid) => dispatch(removeFavorite(ctx, copyid)),
    fetchFavoriteData: (ctx) => dispatch(fetchFavoriteData(ctx)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteGrid);
