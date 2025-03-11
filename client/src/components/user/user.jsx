import {
    Grid2,
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Divider,
    Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import UserSettings from '../user/user-settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { USER_ROLES } from './user.constants';
import { logout } from './user.actions';
import { useNavigate } from 'react-router-dom';
import UserControls from './user-controls';
import SummaryButtons from '../summary/summary-buttons';

const User = ({ ctx, userName, userId, userRole, editing, logout }) => {
    const navigate = useNavigate();

    const theme = useTheme();
    const isWindowed = useMediaQuery(theme.breakpoints.down('lg'));

    const userData = [
        {
            label: 'Nimi',
            value: userName,
        },
        {
            label: 'Käyttäjätunnus',
            value: userId,
        },
        {
            label: 'Käyttäjäryhmä',
            value: USER_ROLES[userRole]?.label || 'Tuntematon',
        },
    ];

    const handleLogout = () => {
        const callback = () => navigate('/');
        logout(callback);
    };

    return (
        <Container maxWidth="false" sx={{ pb: 12 }}>
            <Grid2 container spacing={{ xs: 2, md: 3 }}>
                <Grid2 size={isWindowed ? 12 : 3}>
                    <Box mt={3}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Käyttäjä
                        </Typography>
                    </Box>
                    <Box mt={3}>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {userData.map((row) => (
                                        <TableRow key={row.label}>
                                            <TableCell>{row.label}</TableCell>
                                            <TableCell>{row.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        >
                            Kirjaudu ulos
                        </Button>
                    </Box>
                </Grid2>
                <Divider orientation="vertical" flexItem />
                <Grid2 size={isWindowed ? 12 : 'grow'}>
                    <UserSettings />
                    <UserControls ctx={ctx} />
                </Grid2>
            </Grid2>
            {editing && <SummaryButtons ctx={ctx} />}
        </Container>
    );
};

const mapStateToProps = (state, ownProps) => ({
    userName: state.user.info.name,
    userId: state.user.info.userid,
    userRole: state.user.info.role,
    editing: state.contexts[ownProps.ctx].editing,
});

const mapDispatchToProps = (dispatch) => ({
    logout: (callback) => dispatch(logout(callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
