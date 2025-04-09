import EditIcon from '@mui/icons-material/Edit';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputAdornment,
    Radio,
    RadioGroup,
    Stack,
    TextField,
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
    setIdMode,
} from '../../reducers/contexts.slice';
import { USER_ROLES } from '../user/user.constants';
import BookBarcodeScanner from './book-barcode-scanner';

const BookControls = ({
    ctx,
    currentBook,
    editedBook,
    editing,
    schema,
    userRole,
    setEditedBook,
    setEditing,
    setEditedBookProperty,
    setIdMode,
}) => {
    const [localBook, setLocalBook] = useState({});
    const [localIdMode, setLocalIdMode] = useState('manual');
    const [scannerOpen, setScannerOpen] = useState(false);

    const handleIdModeChange = (event) => {
        handleChange('bookid', '');
        const idMode = event.target.value;
        setIdMode({ ctx, idMode });
        setLocalIdMode(idMode);
    };

    const handleChange = useCallback(
        (key, newValue, association) => {
            setEditing({ ctx, editing: true });
            if (!editedBook) setEditedBook({ ctx, book: currentBook || {} });

            setEditedBookProperty({
                ctx,
                key,
                value: association ? newValue.id : newValue,
            });
            setLocalBook((prevValues) => {
                const updatedValues = {
                    ...prevValues,
                    [key]: association ? newValue.id : newValue,
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
        [
            ctx,
            editedBook,
            currentBook,
            setEditedBook,
            setEditing,
            setEditedBookProperty,
        ],
    );

    useEffect(() => {
        if (editedBook) {
            setLocalBook(editedBook);
        } else {
            setLocalBook(currentBook || {});
        }
    }, [editedBook, currentBook]);

    const getAssociationValue = useMemo(
        () => (type, key) => {
            if (!localBook[key]) return null;
            if (!schema.associations[type]) return null;
            return {
                label: schema.associations[type][localBook[key]],
                id: localBook[key],
            };
        },
        [localBook, schema.associations],
    );

    const getAssociationOptions = useMemo(
        () => (type) => {
            const options = Object.entries(schema.associations[type]).map(
                ([id, name]) => {
                    return {
                        label: name,
                        id: Number(id),
                    };
                },
            );
            return options;
        },
        [schema.associations],
    );

    const order = useMemo(() => {
        if (ctx === 'book-new') {
            return [
                'isbn',
                ...schema.books.order.filter((key) => key !== 'isbn'),
            ];
        } else {
            return schema.books.order;
        }
    }, [ctx, schema.books.order]);

    const idModes = {
        manual: {
            label: 'Syötä käsin',
            icon: <EditIcon />,
            helperText: 'Syötä ISBN muodossa 978-3-16-148410-0',
        },
        barcode: {
            label: 'Lue viivakoodi kameralla',
            icon: <QrCodeScannerIcon />,
            helperText: 'Napauta kenttää lukeaksesi viivakoodin',
        },
    };

    const handleBarcodeScan = (scannedId) => {
        handleChange('bookid', scannedId);
        setScannerOpen(false);
    };

    return (
        <Stack spacing={2} mt={4}>
            {ctx === 'book-new' && (
                <FormControl>
                    <FormLabel id="id-row-radio-buttons-group-label">
                        ISBN
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="id-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={localIdMode}
                        onChange={handleIdModeChange}
                    >
                        {Object.entries(idModes).map(([key, mode]) => (
                            <FormControlLabel
                                key={key}
                                value={key}
                                control={<Radio />}
                                label={mode.label}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            )}
            {order.map((key) => {
                const property = schema.books.properties[key];
                if (key === 'isbn' && ctx === 'book-new') {
                    return (
                        <Box key={key}>
                            <TextField
                                sx={{ width: 1 }}
                                label={property?.label || key}
                                value={localBook[key] || ''}
                                multiline={key === 'text'}
                                onChange={(event) => {
                                    if (localIdMode !== 'barcode') {
                                        handleChange(key, event.target.value);
                                    }
                                }}
                                onClick={() => {
                                    if (localIdMode === 'barcode') {
                                        setScannerOpen(true);
                                    }
                                }}
                                required={property?.required}
                                disabled={localIdMode === 'auto'}
                                error={
                                    localIdMode !== 'auto' &&
                                    property?.required &&
                                    editing &&
                                    !localBook[key]
                                }
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {idModes[localIdMode].icon}
                                            </InputAdornment>
                                        ),
                                        readOnly: localIdMode === 'barcode',
                                    },
                                }}
                                helperText={idModes[localIdMode].helperText}
                            />
                            <Dialog
                                open={scannerOpen}
                                onClose={() => setScannerOpen(false)}
                                maxWidth="sm"
                                fullWidth
                            >
                                <DialogTitle>Lue viivakoodi</DialogTitle>
                                <DialogContent>
                                    <BookBarcodeScanner
                                        onScan={handleBarcodeScan}
                                    />
                                    <Button
                                        onClick={() => setScannerOpen(false)}
                                        sx={{ mt: 2 }}
                                    >
                                        Sulje
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    );
                }
                if (property?.editable) {
                    if (property?.type === 'text') {
                        return (
                            <TextField
                                label={property?.label || key}
                                key={key}
                                value={localBook[key] || ''}
                                multiline={key === 'text'}
                                onChange={(event) => {
                                    handleChange(key, event.target.value);
                                }}
                                required={property?.required}
                                error={
                                    property?.required &&
                                    editing &&
                                    !localBook[key]
                                }
                                slotProps={{
                                    input: {
                                        readOnly:
                                            USER_ROLES[userRole]?.privilege < 2,
                                    },
                                }}
                            />
                        );
                    } else if (property?.type === 'number') {
                        return (
                            <TextField
                                key={key}
                                label={property?.label || key}
                                value={localBook[key] || ''}
                                onChange={(event) => {
                                    handleChange(key, event.target.value);
                                }}
                                type="number"
                                required={property?.required}
                                error={
                                    property?.required &&
                                    editing &&
                                    !localBook[key]
                                }
                                slotProps={{
                                    input: {
                                        readOnly:
                                            USER_ROLES[userRole]?.privilege < 2,
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
                                        localBook[key]
                                            ? dayjs(localBook[key])
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
                                                editing &&
                                                !localBook[key],
                                        },
                                    }}
                                    readOnly={
                                        USER_ROLES[userRole]?.privilege < 2
                                    }
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
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={property?.label || key}
                                        required={property?.required}
                                        error={
                                            property?.required &&
                                            editing &&
                                            !localBook[key]
                                        }
                                    />
                                )}
                                readOnly={USER_ROLES[userRole]?.privilege < 2}
                            />
                        );
                    }
                }
                return null;
            })}
        </Stack>
    );
};

const mapStateToProps = (state, ownProps) => ({
    currentBook: state.contexts[ownProps.ctx].currentBook,
    editedBook: state.contexts[ownProps.ctx].editedBook,
    editing: state.contexts[ownProps.ctx].editing,
    schema: state.schema.data,
    userRole: state.user.info.role,
});

const mapDispatchToProps = (dispatch) => ({
    setEditing: (payload) => dispatch(setEditing(payload)),
    setEditedBook: (payload) => dispatch(setEditedBook(payload)),
    setEditedBookProperty: (payload) =>
        dispatch(setEditedBookProperty(payload)),
    setIdMode: (payload) => dispatch(setIdMode(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookControls);
