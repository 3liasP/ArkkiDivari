import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Skeleton,
    Typography,
} from '@mui/material';
import { connect } from 'react-redux';
import { USER_ROLES } from '../user/user.constants';
import CopyControls from './copy-controls';
import { createCopy } from './copy.actions';

const CopyNew = ({ ctx, schema, userRole, open, onClose, createCopy }) => {
    const handleSubmit = () => {
        createCopy(ctx, onClose);
    };
    const handleClose = () => {
        onClose();
    };

    if (USER_ROLES[userRole]?.privilege < 2) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Ei oikeuksia</DialogTitle>
                <DialogContent>
                    <Box textAlign="center" mt={5}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            Ei oikeuksia
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                            Näyttää siltä, että sinulla ei ole oikeuksia luoda
                            uusia myyntikappaleita. Ota yhteyttä ylläpitoon,
                            mikäli tarvitset lisätietoja.
                        </Typography>
                        <Button onClick={onClose}>Sulje</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    } else if (schema) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Uusi myyntikappale</DialogTitle>

                <DialogContent>
                    <Box mt={3}>
                        <Box display="block">
                            <Typography variant="body1" mt={2}>
                                {`Tähdellä (*) merkityt kentät ovat pakollisia.`}
                            </Typography>
                        </Box>
                    </Box>

                    <CopyControls ctx={ctx} />
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={handleClose} color="error">
                        <CloseIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleSubmit}
                        type="submit"
                        color="info"
                    >
                        <CheckIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        );
    } else {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Uusi myyntikappale</DialogTitle>
                <DialogContent>
                    <Container maxWidth="false" sx={{ pb: 12 }}>
                        <Box mt={3}>
                            <Skeleton variant="text" width={200} height={40} />
                            <Skeleton variant="text" width={300} height={20} />
                        </Box>
                        <Box mt={3}>
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={400}
                            />
                        </Box>
                    </Container>
                </DialogContent>
            </Dialog>
        );
    }
};

const mapStateToProps = (state) => ({
    schema: state.schema.data,
    userRole: state.user.info.role,
});

const mapDispatchToProps = (dispatch) => ({
    createCopy: (ctx, callBack) => dispatch(createCopy(ctx, callBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyNew);
