import { Box, Container, Grow, Skeleton, Typography } from '@mui/material';
import { connect } from 'react-redux';
import SummaryButtons from '../summary/summary-buttons';
import SearchControls from './search-controls';

const SearchAdvanced = ({ ctx, schema, editing }) => {
    if (schema) {
        return (
            <Container maxWidth="false" sx={{ pb: 12 }}>
                <Box mt={3}>
                    <Box display="block">
                        <Grow in timeout={200} key={'new'}>
                            <Typography variant="h4" component="h1">
                                {`Laajennettu haku`}
                            </Typography>
                        </Grow>
                        <Typography variant="body1" mt={2}>
                            {`Hakusanalla voit etsiä tekstimuotoisista kentistä. Voit rajata tuloksia lisäämällä suodattimia.`}
                        </Typography>
                    </Box>
                </Box>

                <SearchControls ctx={ctx} />

                {editing && <SummaryButtons ctx={ctx} />}
            </Container>
        );
    } else {
        return (
            <Container maxWidth="false" sx={{ pb: 12 }}>
                <Box mt={3}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={300} height={20} />
                </Box>
                <Box mt={3}>
                    <Skeleton variant="rectangular" width="100%" height={400} />
                </Box>
            </Container>
        );
    }
};

const mapStateToProps = (state, ownProps) => ({
    schema: state.schema.data,
    editing: state.contexts[ownProps.ctx].editing,
});

export default connect(mapStateToProps, null)(SearchAdvanced);
