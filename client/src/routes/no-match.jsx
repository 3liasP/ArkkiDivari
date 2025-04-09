import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NoMatch = () => {
    return (
        <Container>
            <Box textAlign="center" mt={5}>
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="subtitle1" component="p">
                    Näyttää siltä, että tätä sivua ei ole olemassa. Seurasit
                    luultavasti rikkinäistä linkkiä.
                </Typography>
                <Button>
                    <Link to="/">Palaa etusivulle</Link>
                </Button>
            </Box>
        </Container>
    );
};

export default NoMatch;
