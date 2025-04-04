import { Container, Box, Typography } from '@mui/material';
import { connect } from 'react-redux';
import React from 'react';
import OrderGrid from './order-grid';

const Orders = ({ ctx }) => {
    return (
        <Container maxWidth="false">
            <Box mt={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Omat tilaukset
                </Typography>
            </Box>
            <OrderGrid ctx={ctx} />
        </Container>
    );
};

export default connect(null, null)(Orders);
