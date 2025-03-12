import { FormLabel, Grid2, OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    setEditedUser,
    setEditedUserProperty,
} from '../../reducers/contexts.slice';

const FormGrid = styled(Grid2)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

const AddressForm = ({
    ctx,
    userInfo,
    editedUser,
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
        [ctx, setEditedUser, setEditedUserProperty, editedUser, userInfo],
    );
    return (
        <Grid2 container spacing={3}>
            <FormGrid size={{ xs: 12 }}>
                <FormLabel htmlFor="name" required>
                    Nimi
                </FormLabel>
                <OutlinedInput
                    id="name"
                    name="name"
                    type="name"
                    placeholder="Etunimi Sukunimi"
                    autoComplete="full name"
                    required
                    size="small"
                    value={userInfo.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
                <FormLabel htmlFor="address" required>
                    Osoite
                </FormLabel>
                <OutlinedInput
                    id="address"
                    name="address"
                    type="address"
                    placeholder="Katuosoite"
                    autoComplete="shipping address-line1"
                    required
                    size="small"
                    value={localUser.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                />
            </FormGrid>
            <FormGrid size={{ xs: 6 }}>
                <FormLabel htmlFor="city" required>
                    Kaupunki
                </FormLabel>
                <OutlinedInput
                    id="city"
                    name="city"
                    type="city"
                    placeholder="Kaupunki"
                    autoComplete="City"
                    required
                    size="small"
                    value={localUser.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                />
            </FormGrid>
            <FormGrid size={{ xs: 6 }}>
                <FormLabel htmlFor="zip" required>
                    Postinumero
                </FormLabel>
                <OutlinedInput
                    id="zip"
                    name="zip"
                    type="zip"
                    placeholder="12345"
                    autoComplete="shipping postal-code"
                    required
                    size="small"
                    value={localUser.zip || ''}
                    onChange={(e) => handleChange('zip', e.target.value)}
                />
            </FormGrid>
        </Grid2>
    );
};

const mapStateToProps = (state, ownProps) => ({
    editedUser: state.contexts[ownProps.ctx].editedUser,
    userInfo: state.user.info,
});

const mapDispatchToProps = (dispatch) => ({
    setEditedUser: (payload) => dispatch(setEditedUser(payload)),
    setEditedUserProperty: (payload) =>
        dispatch(setEditedUserProperty(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);
