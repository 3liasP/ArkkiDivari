import React from 'react';
import { Snackbar, Alert, useMediaQuery } from '@mui/material';
import { connect } from 'react-redux';
import { hideToaster } from '../../reducers/toaster.slice';

const Toaster = ({ toaster, hideToaster }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        hideToaster();
    };

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Snackbar
            open={toaster.open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: isMobile ? 'bottom' : 'top',
                horizontal: 'center',
            }}
        >
            <Alert
                onClose={handleClose}
                severity={toaster.variant}
                sx={{ width: '100%' }}
            >
                {toaster.message}
            </Alert>
        </Snackbar>
    );
};

const mapStateToProps = (state) => ({
    toaster: state.toaster,
});

const mapDispatchToProps = {
    hideToaster,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toaster);
