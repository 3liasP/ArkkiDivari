import { Container, Box, Typography, Grow } from '@mui/material';
import { connect } from 'react-redux';
import React from 'react';
import FavoriteGrid from './favorite-grid';

const Favorites = ({ ctx }) => {
    return (
        <Container maxWidth="false">
            <Box mt={3}>
                <Grow in timeout={200} key={'orders'}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Suosikit
                    </Typography>
                </Grow>
            </Box>
            <FavoriteGrid ctx={ctx} />
        </Container>
    );
};

export default connect(null, null)(Favorites);
