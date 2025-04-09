import { Box, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    setEditedUser,
    setEditedUserProperty,
    setEditing,
} from '../../reducers/contexts.slice';

const UserControls = ({
    ctx,
    userInfo,
    editedUser,
    editing,
    setEditing,
    setEditedUser,
    setEditedUserProperty,
}) => {
    const [localUser, setLocalUser] = useState({});

    useEffect(() => {
        const user = editedUser || userInfo || {};
        setLocalUser(user);
    }, [editedUser, userInfo]);

    const handleChange = useCallback(
        (key, newValue) => {
            setEditing({ ctx, editing: true });
            if (!editedUser) setEditedUser({ ctx, user: userInfo || {} });

            setEditedUserProperty({
                ctx,
                key,
                value: newValue,
            });
            setLocalUser((prevValues) => {
                const updatedValues = {
                    ...prevValues,
                    [key]: newValue,
                };

                const allEmpty = Object.values(updatedValues).every(
                    (val) =>
                        val === '' || (Array.isArray(val) && val.length === 0),
                );

                if (allEmpty) {
                    setEditedUser({ ctx, user: null });
                }

                return updatedValues;
            });
        },
        [
            ctx,
            setEditing,
            setEditedUser,
            setEditedUserProperty,
            editedUser,
            userInfo,
        ],
    );

    const properties = [
        { key: 'address', label: 'Osoite', type: 'text', required: false },
        { key: 'zip', label: 'Postinumero', type: 'number', required: false },
        { key: 'city', label: 'Kaupunki', type: 'text', required: false },
        {
            key: 'phone',
            label: 'Puhelinnumero',
            type: 'number',
            required: false,
        },
    ];

    return (
        <Box mt={4}>
            <Box>
                <Typography variant="h5" component="h1">
                    Yhteystiedot
                </Typography>
            </Box>
            <Stack spacing={2} mt={2}>
                {properties.map(({ key, label, type, required }) => (
                    <TextField
                        label={label ?? key}
                        key={key}
                        type={type}
                        value={localUser[key] || ''}
                        onChange={(event) => {
                            handleChange(key, event.target.value);
                        }}
                        required={required}
                        error={required && editing && !localUser[key]}
                    />
                ))}
            </Stack>
        </Box>
    );
};

const mapStateToProps = (state, ownProps) => ({
    editedUser: state.contexts[ownProps.ctx].editedUser,
    userInfo: state.user.info,
    editing: state.contexts[ownProps.ctx].editing,
});

const mapDispatchToProps = (dispatch) => ({
    setEditing: (payload) => dispatch(setEditing(payload)),
    setEditedUser: (payload) => dispatch(setEditedUser(payload)),
    setEditedUserProperty: (payload) =>
        dispatch(setEditedUserProperty(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserControls);
