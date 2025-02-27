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

const User = ({ username, userId, userGroup, logout }) => {
    const navigate = useNavigate();

    const theme = useTheme();
    const isWindowed = useMediaQuery(theme.breakpoints.down('lg'));

    const userData = [
        {
            label: 'Nimi',
            value: username,
        },
        {
            label: 'Käyttäjätunnus',
            value: userId,
        },
        {
            label: 'Käyttäjäryhmä',
            value: USER_ROLES[userGroup]?.label || 'Tuntematon',
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
                </Grid2>
            </Grid2>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    username: state.user.name,
    userId: state.user.userid,
    userGroup: state.user.group,
});

const mapDispatchToProps = (dispatch) => ({
    logout: (callback) => dispatch(logout(callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
