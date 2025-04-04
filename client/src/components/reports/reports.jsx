import {
    Box,
    Container,
    Grow,
    Typography,
    Button,
    List,
    ListItem,
    Paper,
    Grid2,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import api from '../../core/api';
import { showToaster } from '../../reducers/toaster.slice';
import { USER_ROLES } from '../user/user.constants';
import { Link } from 'react-router-dom';

const Reports = ({ userRole, showToaster }) => {
    const [loading, setLoading] = useState({});

    const availableReports = [
        {
            id: 'R2',
            name: 'R2: Myynnin yhteenveto',
            description: 'Yhteenveto myydyistä myyntikappaleista genreittäin',
        },
        {
            id: 'R3',
            name: 'R3: Viime vuoden myynti',
            description: 'Asiakkaiden tekemät ostokset viime vuoden ajalta',
        },
    ];

    const downloadReport = async (reportId) => {
        setLoading((prev) => ({ ...prev, [reportId]: true }));
        try {
            await api.downloadReport(reportId);
        } catch (error) {
            showToaster({ message: error.message, variant: 'error' });
        } finally {
            setLoading((prev) => ({ ...prev, [reportId]: false }));
        }
    };

    const userPrivilege = USER_ROLES[userRole]?.privilege || 0;
    if (userPrivilege < 2) {
        return (
            <Container>
                <Box textAlign="center" mt={5}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        Ei oikeuksia
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        Näyttää siltä, että sinulla ei ole oikeuksia tarkastella
                        raportteja. Ota yhteyttä ylläpitoon, mikäli tarvitset
                        lisätietoja.
                    </Typography>
                    <Button>
                        <Link to="/">Palaa etusivulle</Link>
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="false">
            <Box display="block" mt={3}>
                <Grow in timeout={200} key={'new'}>
                    <Typography variant="h4" component="h1">
                        {`Raportit`}
                    </Typography>
                </Grow>
            </Box>
            <Box mt={3} mb={4}>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Saatavilla olevat raportit
                    </Typography>
                    <List>
                        {availableReports.map((report) => (
                            <ListItem key={report.id} divider sx={{ py: 2 }}>
                                <Grid2
                                    container
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ width: '100%' }}
                                >
                                    <Grid2>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            {report.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {report.description}
                                        </Typography>
                                    </Grid2>
                                    <Grid2>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<DownloadIcon />}
                                            onClick={() =>
                                                downloadReport(report.id)
                                            }
                                            disabled={loading[report.id]}
                                        >
                                            {loading[report.id]
                                                ? 'Ladataan...'
                                                : 'Lataa CSV-tiedosto'}
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    userRole: state.user.info.role,
});

const mapDispatchToProps = (dispatch) => ({
    showToaster: (payload) => dispatch(showToaster(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
