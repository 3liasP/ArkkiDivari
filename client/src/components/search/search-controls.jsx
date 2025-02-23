import SearchIcon from '@mui/icons-material/Search';
import {
    Autocomplete,
    Box,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { selectedLocale } from '../../helpers/dayjs.helpers';
import {
    setEditedBook,
    setEditedBookProperty,
    setEditing,
} from '../../reducers/contexts.slice';

const SearchControls = ({
    ctx,
    editedBook,
    schema,
    setEditedBook,
    setEditing,
    setEditedBookProperty,
}) => {
    const [localBook, setLocalBook] = useState({});

    const handleChange = useCallback(
        (key, newValue, association) => {
            setEditing({ ctx, editing: true });
            if (!editedBook) setEditedBook({ ctx, book: {} });

            const value = association
                ? newValue.map((val) => val.id)
                : newValue;

            setEditedBookProperty({
                ctx,
                key,
                value,
            });

            setLocalBook((prevValues) => {
                const updatedValues = {
                    ...prevValues,
                    [key]: value,
                };

                const allEmpty = Object.values(updatedValues).every(
                    (val) =>
                        val === '' || (Array.isArray(val) && val.length === 0),
                );

                if (allEmpty) {
                    setEditing({ ctx, editing: false });
                    setEditedBook({ ctx, book: null });
                }

                return updatedValues;
            });
        },
        [ctx, editedBook, setEditedBook, setEditing, setEditedBookProperty],
    );

    useEffect(() => {
        if (editedBook) {
            setLocalBook(editedBook);
        } else {
            setLocalBook({});
        }
    }, [editedBook]);

    const getAssociationValue = useMemo(
        () => (type, key) => {
            if (!localBook[key]) return [];
            const value = localBook[key].map((id, index) => ({
                label: schema.associations[type][localBook[key][index]],
                id,
            }));
            return value;
        },
        [localBook, schema.associations],
    );

    const getAssociationOptions = useMemo(
        () => (type, key) => {
            const selectedIds = localBook[key] || [];
            console.log('selectedIds', selectedIds);
            const options = Object.entries(schema.associations[type])
                .map(([id, label]) => {
                    return {
                        label,
                        id: Number(id),
                    };
                })
                .filter((option) => !selectedIds.includes(option.id));
            return options;
        },
        [localBook, schema.associations],
    );

    return (
        <Stack spacing={2} mt={4}>
            <Box sx={{ width: 1 }}>
                <TextField
                    sx={{ width: 1 }}
                    label="Hakusana"
                    value={localBook['query'] || ''}
                    multiline
                    onChange={(event) => {
                        handleChange('query', event.target.value);
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>
            <Typography variant="body1" mt={2}>
                {`Suodattimet`}
            </Typography>
            {schema.books.order.map((key) => {
                const property = schema.books.properties[key];
                if (property?.type === 'text') {
                    return (
                        <TextField
                            multiline
                            label={property?.label || key}
                            key={key}
                            value={localBook[key] || ''}
                            onChange={(event) => {
                                handleChange(key, event.target.value);
                            }}
                            helperText="Voit syöttää usean vaihtoehdon erottamalla ne pilkulla (,)"
                        />
                    );
                }
                if (property?.type === 'number') {
                    return (
                        <TextField
                            label={property?.label || key}
                            key={key}
                            value={localBook[key] || ''}
                            type="number"
                            onChange={(event) => {
                                handleChange(key, event.target.value);
                            }}
                        />
                    );
                } else if (
                    property?.type === 'date' ||
                    property?.type === 'timestamp'
                ) {
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
                                    localBook[key]
                                        ? dayjs(localBook[key])
                                        : null
                                }
                                onChange={(date) => {
                                    handleChange(key, date.toISOString());
                                }}
                            />
                        </LocalizationProvider>
                    );
                } else {
                    return (
                        <Autocomplete
                            multiple
                            key={key}
                            mt={2}
                            value={getAssociationValue(property?.type, key)}
                            onChange={(event, newValue) => {
                                handleChange(key, newValue, property?.type);
                            }}
                            options={getAssociationOptions(property?.type, key)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={property?.label || key}
                                />
                            )}
                        />
                    );
                }
            })}
            <Typography variant="body1" mt={2}>
                {`Järjestys`}
            </Typography>
            <Box sx={{ width: 1 }}>
                <Select
                    sx={{ mr: 2 }}
                    value={localBook['orderby'] || 'createdat'}
                    onChange={(event) => {
                        handleChange('orderby', event.target.value);
                    }}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Valitse kenttä
                    </MenuItem>
                    {schema.books.order.map((key) => (
                        <MenuItem key={key} value={key}>
                            {schema.books.properties[key]?.label || key}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    value={localBook['sort'] || 'desc'}
                    onChange={(event) =>
                        handleChange('sort', event.target.value)
                    }
                >
                    <MenuItem value="asc">Nouseva</MenuItem>
                    <MenuItem value="desc">Laskeva</MenuItem>
                </Select>
            </Box>
        </Stack>
    );
};

const mapStateToProps = (state, ownProps) => ({
    editedBook: state.contexts[ownProps.ctx].editedBook,
    editing: state.contexts[ownProps.ctx].editing,
    schema: state.schema.data,
});

const mapDispatchToProps = (dispatch) => ({
    setEditing: (payload) => dispatch(setEditing(payload)),
    setEditedBook: (payload) => dispatch(setEditedBook(payload)),
    setEditedBookProperty: (payload) =>
        dispatch(setEditedBookProperty(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchControls);
