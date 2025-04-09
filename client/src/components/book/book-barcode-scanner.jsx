import { Box, CircularProgress, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useZxing } from 'react-zxing';
import { showToaster } from '../../reducers/toaster.slice';

const BookBarcodeScanner = ({ showToaster, onScan }) => {
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const { ref } = useZxing({
        onDecodeResult(result) {
            const scannedText = result.getText();
            showToaster({ message: `Tunniste luettu!`, severity: 'success' });
            if (onScan) {
                onScan(scannedText);
            }
        },
    });

    useEffect(() => {
        const videoElement = ref.current;
        if (videoElement) {
            videoElement.onloadeddata = () => {
                setLoading(false);
            };
        }
    }, [ref]);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
            }}
        >
            {loading && <CircularProgress />}
            <Box
                component="video"
                ref={ref}
                sx={{
                    width: '100%',
                    maxHeight: '400px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    display: loading ? 'none' : 'block',
                }}
            />
            {!loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    <Box
                        sx={{
                            width: '80%',
                            height: '50%',
                            border: `2px dashed ${theme.palette.error.main}`,
                            borderRadius: '4px',
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

const mapDispatchToProps = (dispatch) => ({
    showToaster: (payload) => dispatch(showToaster(payload)),
});

export default connect(null, mapDispatchToProps)(BookBarcodeScanner);
