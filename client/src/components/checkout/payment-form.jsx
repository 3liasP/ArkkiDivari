import React, { useState } from 'react';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SimCardRoundedIcon from '@mui/icons-material/SimCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CardContent,
    FormControl,
    FormLabel,
    OutlinedInput,
    RadioGroup,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    width: '100%',
    '&:hover': {
        background:
            'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)',
        borderColor: 'primary.light',
        boxShadow: '0px 2px 8px hsla(0, 0%, 0%, 0.1)',
        ...theme.applyStyles('dark', {
            background:
                'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
            borderColor: 'primary.dark',
            boxShadow: '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
        }),
    },
    [theme.breakpoints.up('md')]: {
        flexGrow: 1,
        maxWidth: `calc(50% - ${theme.spacing(1)})`,
    },
    variants: [
        {
            props: ({ selected }) => selected,
            style: {
                borderColor: (theme.vars || theme).palette.primary.light,
                ...theme.applyStyles('dark', {
                    borderColor: (theme.vars || theme).palette.primary.dark,
                }),
            },
        },
    ],
}));

const PaymentContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: 375,
    padding: theme.spacing(3),
    borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
    border: '1px solid ',
    borderColor: (theme.vars || theme).palette.divider,
    background:
        'linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)',
    boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
    [theme.breakpoints.up('xs')]: {
        height: 300,
    },
    [theme.breakpoints.up('sm')]: {
        height: 350,
    },
    ...theme.applyStyles('dark', {
        background:
            'linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)',
        boxShadow: '0px 4px 8px hsl(220, 35%, 0%)',
    }),
}));

const FormGrid = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export const PaymentForm = ({ paymentType, setPaymentType }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    const handlePaymentTypeChange = (event) => {
        setPaymentType(event.target.value);
    };

    const handleCardNumberChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        if (value.length <= 16) {
            setCardNumber(formattedValue);
        }
    };

    const handleCvvChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        if (value.length <= 3) {
            setCvv(value);
        }
    };

    const handleExpirationDateChange = (event) => {
        const value = event.target.value.replace(/\D/g, '');
        const formattedValue = value.replace(/(\d{2})(?=\d{2})/, '$1/');
        if (value.length <= 4) {
            setExpirationDate(formattedValue);
        }
    };

    return (
        <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    aria-label="Payment options"
                    name="paymentType"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                    }}
                >
                    <StyledCard selected={paymentType === 'creditCard'}>
                        <CardActionArea
                            onClick={() => setPaymentType('creditCard')}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <CreditCardRoundedIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'creditCard' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>
                                    Korttimaksu
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </StyledCard>
                    <StyledCard selected={paymentType === 'bankTransfer'}>
                        <CardActionArea
                            onClick={() => setPaymentType('bankTransfer')}
                            sx={{
                                '.MuiCardActionArea-focusHighlight': {
                                    backgroundColor: 'transparent',
                                },
                                '&:focus-visible': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <AccountBalanceRoundedIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: 'grey.400',
                                            ...theme.applyStyles('dark', {
                                                color: 'grey.600',
                                            }),
                                        }),
                                        paymentType === 'bankTransfer' && {
                                            color: 'primary.main',
                                        },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: 'medium' }}>
                                    Tilisiirto
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </StyledCard>
                </RadioGroup>
            </FormControl>
            {paymentType === 'creditCard' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <PaymentContainer>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="subtitle2">
                                Luottokortti
                            </Typography>
                            <CreditCardRoundedIcon
                                sx={{ color: 'text.secondary' }}
                            />
                        </Box>
                        <SimCardRoundedIcon
                            sx={{
                                fontSize: { xs: 48, sm: 56 },
                                transform: 'rotate(90deg)',
                                color: 'text.secondary',
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <FormGrid sx={{ flexGrow: 1 }}>
                                <FormLabel htmlFor="card-number" required>
                                    Kortin numero
                                </FormLabel>
                                <OutlinedInput
                                    id="card-number"
                                    autoComplete="card-number"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    size="small"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                />
                            </FormGrid>
                            <FormGrid sx={{ maxWidth: '20%' }}>
                                <FormLabel htmlFor="cvv" required>
                                    CVV
                                </FormLabel>
                                <OutlinedInput
                                    id="cvv"
                                    autoComplete="CVV"
                                    placeholder="123"
                                    required
                                    size="small"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                />
                            </FormGrid>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormGrid sx={{ flexGrow: 1 }}>
                                <FormLabel htmlFor="card-name" required>
                                    Nimi
                                </FormLabel>
                                <OutlinedInput
                                    id="card-name"
                                    autoComplete="card-name"
                                    placeholder="Etunimi Sukunimi"
                                    required
                                    size="small"
                                />
                            </FormGrid>
                            <FormGrid sx={{ flexGrow: 1 }}>
                                <FormLabel htmlFor="card-expiration" required>
                                    Voimassaoloaika
                                </FormLabel>
                                <OutlinedInput
                                    id="card-expiration"
                                    autoComplete="card-expiration"
                                    placeholder="MM/YY"
                                    required
                                    size="small"
                                    value={expirationDate}
                                    onChange={handleExpirationDateChange}
                                />
                            </FormGrid>
                        </Box>
                    </PaymentContainer>
                </Box>
            )}
            {paymentType === 'bankTransfer' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="warning" icon={<WarningRoundedIcon />}>
                        Tilauksesi käsitellään, kun maksusuoritus on
                        vastaanotettu.
                    </Alert>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'medium' }}
                    >
                        Maksu tilisiirtona
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Ole hyvä ja suorita tilisiirto alla olevien tietojen
                        mukaisesti.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                        >
                            Saaja:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 'medium' }}
                        >
                            ARKKIDIVARI
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                        >
                            Pankki:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 'medium' }}
                        >
                            Elias Banking
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                        >
                            Tilinumero:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 'medium' }}
                        >
                            FI2180000012345678
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                        >
                            BIC-koodi:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 'medium' }}
                        >
                            ELBAFIHH
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                        >
                            Viitenumero:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 'medium' }}
                        >
                            {Math.floor(Math.random() * 10000)}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Stack>
    );
};
