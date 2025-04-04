import { Container, Box, Typography, Grow } from '@mui/material';
import { connect } from 'react-redux';
import React from 'react';
import OrderGrid from './order-grid';

const Orders = ({ ctx }) => {
    return (
        <Container maxWidth="false">
            <Box mt={3}>
                <Grow in timeout={200} key={'orders'}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Omat tilaukset
                    </Typography>
                </Grow>
            </Box>
            <OrderGrid ctx={ctx} />
        </Container>
    );
};

export default connect(null, null)(Orders);
