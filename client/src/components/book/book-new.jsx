import {
    Box,
    Button,
    Container,
    Grow,
    Skeleton,
    Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import SummaryButtons from '../summary/summary-buttons';
import BookControls from './book-controls';
import { USER_ROLES } from '../user/user.constants';
import { Link } from 'react-router-dom';

const BookNew = ({ ctx, schema, editing, userGroup }) => {
    if (USER_ROLES[userGroup]?.privilege < 2) {
        return (
            <Container>
                <Box textAlign="center" mt={5}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        Ei oikeuksia
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        Näyttää siltä, että sinulla ei ole oikeuksia luoda uusia
                        teoksia. Ota yhteyttä ylläpitoon, mikäli tarvitset
                        lisätietoja.
                    </Typography>
                    <Button>
                        <Link to="/">Palaa etusivulle</Link>
                    </Button>
                </Box>
            </Container>
        );
    } else if (schema) {
        return (
            <Container maxWidth="false" sx={{ pb: 12 }}>
                <Box mt={3}>
                    <Box display="block">
                        <Grow in timeout={200} key={'new'}>
                            <Typography variant="h4" component="h1">
                                {`Uusi teos`}
                            </Typography>
                        </Grow>
                        <Typography variant="body1" mt={2}>
                            {`Tähdellä (*) merkityt kentät ovat pakollisia.`}
                        </Typography>
                    </Box>
                </Box>

                <BookControls ctx={ctx} />

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
    userGroup: state.user.group,
});

export default connect(mapStateToProps, null)(BookNew);
