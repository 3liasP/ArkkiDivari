import { Autocomplete, Stack, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { selectedLocale } from '../../helpers/dayjs.helpers';
import {
    setEditedCopy,
    setEditedCopyProperty,
} from '../../reducers/contexts.slice';
import { USER_ROLES } from '../user/user.constants';

const CopyControls = ({
    ctx,
    editedCopy,
    schema,
    userGroup,
    setEditedCopy,
    setEditedCopyProperty,
}) => {
    const [localCopy, setLocalCopy] = useState({});

    useEffect(() => {
        if (editedCopy) {
            setLocalCopy(editedCopy);
        } else {
            setLocalCopy({});
        }
    }, [editedCopy]);

    const handleChange = useCallback(
        (key, newValue, association) => {
            setEditedCopyProperty({
                ctx,
                key,
                value: association ? newValue.id : newValue,
            });
            setLocalCopy((prevValues) => {
                const updatedValues = {
                    ...prevValues,
                    [key]: association ? newValue.id : newValue,
                };

                const allEmpty = Object.values(updatedValues).every(
                    (val) =>
                        val === '' || (Array.isArray(val) && val.length === 0),
                );

                if (allEmpty) {
                    setEditedCopy({ ctx, book: null });
                }

                return updatedValues;
            });
        },
        [ctx, setEditedCopy, setEditedCopyProperty],
    );

    const getAssociationValue = useMemo(
        () => (type, key) => {
            if (!localCopy[key]) return null;
            if (!schema.associations[type]) return null;
            return {
                label: schema.associations[type][localCopy[key]],
                id: localCopy[key],
            };
        },
        [localCopy, schema.associations],
    );

    const getAssociationOptions = useMemo(
        () => (type) => {
            const options = Object.entries(schema.associations[type]).map(
                ([id, name]) => {
                    return {
                        label: name,
                        id,
                    };
                },
            );
            return options;
        },
        [schema.associations],
    );

    return (
        <Stack spacing={2} mt={4}>
            {schema.copies.order.map((key) => {
                const property = schema.copies.properties[key];
                if (property?.type === 'text') {
                    return (
                        <TextField
                            label={property?.label || key}
                            key={key}
                            value={localCopy[key] || ''}
                            multiline={key === 'text'}
                            onChange={(event) => {
                                handleChange(key, event.target.value);
                            }}
                            required={property?.required}
                            disabled={!property?.editable}
                            error={property?.required && !localCopy[key]}
                            slotProps={{
                                input: {
                                    readOnly:
                                        USER_ROLES[userGroup]?.privilege < 2,
                                },
                            }}
                        />
                    );
                } else if (property?.type === 'number') {
                    return (
                        <TextField
                            key={key}
                            label={property?.label || key}
                            value={localCopy[key] || ''}
                            onChange={(event) => {
                                handleChange(key, event.target.value);
                            }}
                            type="number"
                            required={property?.required}
                            disabled={!property?.editable}
                            error={property?.required && !localCopy[key]}
                            slotProps={{
                                input: {
                                    readOnly:
                                        USER_ROLES[userGroup]?.privilege < 2,
                                },
                                htmlInput: {
                                    min: 1,
                                },
                            }}
                        />
                    );
                } else if (property?.type === 'date') {
                    return (
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale={selectedLocale}
                            key={key}
                        >
                            <DatePicker
                                key={key}
                                label={property?.label || key}
                                value={
                                    localCopy[key]
                                        ? dayjs(localCopy[key])
                                        : null
                                }
                                onChange={(date) => {
                                    const localizedDate = date
                                        .utc(true)
                                        .toISOString();
                                    handleChange(key, localizedDate);
                                }}
                                slotProps={{
                                    textField: {
                                        required: property?.required,
                                        error:
                                            property?.required &&
                                            !localCopy[key],
                                    },
                                }}
                                readOnly={USER_ROLES[userGroup]?.privilege < 2}
                                disabled={!property?.editable}
                            />
                        </LocalizationProvider>
                    );
                } else {
                    return (
                        <Autocomplete
                            key={key}
                            mt={2}
                            value={getAssociationValue(property?.type, key)}
                            onChange={(event, newValue) => {
                                handleChange(key, newValue, property?.type);
                            }}
                            options={getAssociationOptions(property?.type)}
                            disableClearable={property?.required}
                            disabled={!property?.editable}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={property?.label || key}
                                    required={property?.required}
                                    error={
                                        property?.required && !localCopy[key]
                                    }
                                />
                            )}
                            readOnly={USER_ROLES[userGroup]?.privilege < 2}
                        />
                    );
                }
            })}
        </Stack>
    );
};

const mapStateToProps = (state, ownProps) => ({
    editedCopy: state.contexts[ownProps.ctx].editedCopy,
    schema: state.schema.data,
    userGroup: state.user.group,
});

const mapDispatchToProps = (dispatch) => ({
    setEditedCopy: (payload) => dispatch(setEditedCopy(payload)),
    setEditedCopyProperty: (payload) =>
        dispatch(setEditedCopyProperty(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyControls);
