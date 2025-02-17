import React, { useEffect } from 'react';
import { Box, Container, Typography, Grow } from '@mui/material';
import SearchGrid from './search-grid';
import { connect } from 'react-redux';
import { setSearchParams } from '../../reducers/contexts.slice';
import { fixUrlCriteria, urlToParams } from '../../helpers/url.helpers';
import { DEFAULT_SEARCH_PARAMS } from './search.constants';

const SearchResults = ({
    ctx,
    pageParam,
    searchParams,
    results,
    setSearchParams,
}) => {
    useEffect(() => {
        if (pageParam && !searchParams) {
            const { query, ...criteria } = urlToParams(pageParam);
            const params = {
                ...DEFAULT_SEARCH_PARAMS,
                query,
                criteria: fixUrlCriteria(criteria),
            };
            setSearchParams({ ctx, params });
        }
    }, [pageParam, searchParams, ctx, setSearchParams]);

    return (
        <Container maxWidth="false">
            <Box display="block" mt={3}>
                <Grow in timeout={200} key={'new'}>
                    <Typography variant="h4" component="h1">
                        {`Hakutulokset`}
                    </Typography>
                </Grow>
                {results && (
                    <Typography variant="body1" mt={2}>
                        {`Löydettiin ${results.length} teosta.`}
                    </Typography>
                )}
            </Box>
            <Box mt={3} mb={4}>
                <SearchGrid ctx={ctx} params={searchParams} />
            </Box>
        </Container>
    );
};

const mapStateToProps = (state, ownProps) => ({
    searchParams: state.contexts[ownProps.ctx].searchParams,
    results: state.contexts[ownProps.ctx].searchResults,
});

const mapDispatchToProps = (dispatch) => ({
    setSearchParams: (ctx, params) => dispatch(setSearchParams(ctx, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
