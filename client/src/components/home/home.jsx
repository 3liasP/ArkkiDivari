import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import SearchGrid from '../search/search-grid';

const Home = ({ ctx, username }) => {
    const searchParams = {
        criteria: {},
        args: {
            limit: 10,
            sort: 'desc',
            orderBy: 'createdat',
        },
    };

    return (
        <Container maxWidth="false">
            <Box mt={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Etusivu
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {`Tervetuloa, ${username}!`}
                </Typography>
                <Typography variant="subitle1" gutterBottom>
                    Viimeisimmät lisäykset
                </Typography>
                <SearchGrid ctx={ctx} params={searchParams} />
            </Box>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    userId: state.user.userId,
    username: state.user.name,
});

export default connect(mapStateToProps, null)(Home);
