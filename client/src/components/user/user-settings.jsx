import {
    Box,
    ListItem,
    ListItemText,
    Stack,
    Switch,
    Typography,
} from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { setDarkMode } from '../../reducers/user.slice';

const UserSettings = ({ darkMode, setDarkMode }) => {
    const handleToggle = (event) => {
        const { id, checked } = event.target;
        if (id === 'darkMode') {
            setDarkMode(checked);
        }
    };

    return (
        <Box mt={4}>
            <Box>
                <Typography variant="h5" component="h1">
                    Asetukset
                </Typography>
            </Box>
            <Stack mt={2}>
                <ListItem sx={{ pl: 0, pr: 0 }}>
                    <ListItemText
                        primary="Tumma tila"
                        secondary="Vaihtaa teeman värit tummempiin ja silmäystävällisempiin sävyihin"
                    />
                    <Switch
                        id="darkMode"
                        checked={darkMode}
                        onChange={handleToggle}
                    />
                </ListItem>
            </Stack>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    darkMode: state.user.darkMode,
});

const mapDispatchToProps = (dispatch) => ({
    setDarkMode: (payload) => dispatch(setDarkMode(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
