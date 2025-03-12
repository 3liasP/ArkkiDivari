import React, { useState } from 'react';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid2,
    Stack,
    Step,
    StepLabel,
    Stepper,
    styled,
    Typography,
} from '@mui/material';

import { CustomDropdown } from './custom-dropdown';
import { PaymentForm } from './payment-form';
import { connect } from 'react-redux';
import textLogo from '../../assets/svg/logo-no-background.svg';
import { InfoMobile } from './info-mobile';
import AddressForm from './address-form';
import { updateUser } from '../user/user.actions';
import Review from './review';
import Info from './info';
import { cancelOrder, completeOrder } from './checkout.actions';
import { useNavigate } from 'react-router-dom';
import { paramsToUrl } from '../../helpers/url.helpers';

const StyledLogo = styled('img')(() => ({
    alignSelf: 'center',
    width: '250px',
    height: 'auto',
}));

const CheckOut = ({ ctx, order, updateUser, cancelOrder, completeOrder }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [paymentType, setPaymentType] = useState('creditCard');

    const navigate = useNavigate();

    const steps = ['Toimitusosoite', 'Maksutiedot', 'Vahvista tilaus'];
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <AddressForm ctx={ctx} />;
            case 1:
                return (
                    <PaymentForm
                        ctx={ctx}
                        paymentType={paymentType}
                        setPaymentType={setPaymentType}
                    />
                );
            case 2:
                return <Review ctx={ctx} paymentType={paymentType} />;
            default:
                throw new Error('Unknown step');
        }
    };

    const handleNext = () => {
        switch (activeStep) {
            case 0:
                updateUser(ctx);
                break;
            case 1:
                // Validate payment form
                break;
            case 2:
                completeOrder();
                break;
            default:
                break;
        }
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleCancel = () => {
        const callBack = () => {
            navigate(
                paramsToUrl({
                    page: 'home',
                }),
            );
        };
        cancelOrder(callBack);
    };

    return (
        <Container maxWidth="false">
            <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
                <CustomDropdown />
            </Box>

            <Grid2
                container
                sx={{
                    height: {
                        xs: '100%',
                        sm: 'calc(100dvh - var(--template-frame-height, 0px) - 80px)',
                    },
                    mt: {
                        xs: 4,
                        sm: 0,
                    },
                }}
            >
                <Grid2
                    size={{ xs: 12, sm: 5, lg: 4 }}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRight: { sm: 'none', md: '1px solid' },
                        borderColor: { sm: 'none', md: 'divider' },
                        alignItems: 'start',
                        pt: 16,
                        px: 4,
                        gap: 4,
                    }}
                >
                    <StyledLogo src={textLogo} alt="ArkkiDivari" />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: 500,
                        }}
                    >
                        <Info />
                    </Box>
                </Grid2>
                <Grid2
                    size={{ sm: 12, md: 7, lg: 8 }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: {
                            xs: 'transparent',
                            sm: 'background.default',
                        },
                        alignItems: 'start',
                        pt: { xs: 0, sm: 16 },
                        px: { xs: 2, sm: 10 },
                        gap: { xs: 4, md: 8 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: {
                                sm: 'space-between',
                                md: 'flex-end',
                            },
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                flexGrow: 1,
                            }}
                        >
                            <Stepper
                                id="desktop-stepper"
                                activeStep={activeStep}
                                sx={{ width: '100%', height: 40 }}
                            >
                                {steps.map((label) => (
                                    <Step
                                        sx={{
                                            ':first-of-type': { pl: 0 },
                                            ':last-of-type': { pr: 0 },
                                        }}
                                        key={label}
                                    >
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>
                    <Card
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            width: '100%',
                        }}
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected products
                                </Typography>
                                <Typography variant="body1">
                                    {activeStep >= 2 ? '$144.97' : '$134.98'}
                                </Typography>
                            </div>
                            <InfoMobile />
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: { sm: '100%', md: 600 },
                            maxHeight: '720px',
                            gap: { xs: 5, md: 'none' },
                        }}
                    >
                        <Stepper
                            id="mobile-stepper"
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{ display: { sm: 'flex', md: 'none' } }}
                        >
                            {steps.map((label) => (
                                <Step
                                    sx={{
                                        ':first-of-type': { pl: 0 },
                                        ':last-of-type': { pr: 0 },
                                        '& .MuiStepConnector-root': {
                                            top: { xs: 6, sm: 12 },
                                        },
                                    }}
                                    key={label}
                                >
                                    <StepLabel
                                        sx={{
                                            '.MuiStepLabel-labelContainer': {
                                                maxWidth: '70px',
                                            },
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <Stack spacing={2} useFlexGap>
                                <Typography variant="h1">📦</Typography>
                                <Typography variant="h5">
                                    Kiitos tilauksestasi!
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Tilausnumerosi on{' '}
                                    <strong>#{order.orderid}</strong>. Voit
                                    tarkastella tilauksiasi Omat tilaukset
                                    -osiossa.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        alignSelf: 'start',
                                        width: { xs: '100%', sm: 'auto' },
                                    }}
                                >
                                    Siirry omiin tilauksiin
                                </Button>
                            </Stack>
                        ) : (
                            <>
                                {getStepContent(activeStep)}
                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            flexDirection: {
                                                xs: 'column-reverse',
                                                sm: 'row',
                                            },
                                            alignItems: 'end',
                                            flexGrow: 1,
                                            gap: 1,
                                            pb: { xs: 12, sm: 0 },
                                            mt: { xs: 2, sm: 0 },
                                            justifyContent: 'space-between',
                                        },
                                    ]}
                                >
                                    {activeStep === 0 ? (
                                        <Button
                                            variant="contained"
                                            startIcon={<CancelIcon />}
                                            onClick={handleCancel}
                                            color="error"
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    sm: 'flex',
                                                },
                                            }}
                                        >
                                            Peru tilaus
                                        </Button>
                                    ) : (
                                        <Button
                                            startIcon={
                                                <ChevronLeftRoundedIcon />
                                            }
                                            onClick={handleBack}
                                            variant="text"
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    sm: 'flex',
                                                },
                                            }}
                                        >
                                            Takaisin
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        endIcon={<ChevronRightRoundedIcon />}
                                        onClick={handleNext}
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                sm: 'fit-content',
                                            },
                                        }}
                                    >
                                        {activeStep === steps.length - 1
                                            ? 'Vahvista tilaus'
                                            : 'Seuraava'}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Grid2>
            </Grid2>
        </Container>
    );
};

const mapStateToProps = (state) => ({
    schema: state.schema.data,
    shoppingCart: state.user.shoppingCart,
    order: state.user.order.details,
});

const mapDispatchToProps = (dispatch) => ({
    updateUser: (ctx) => dispatch(updateUser(ctx)),
    cancelOrder: (callBack) => dispatch(cancelOrder(callBack)),
    completeOrder: (callBack) => dispatch(completeOrder(callBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);
