import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingOverlay = ({ isVisible }) => {
    const [visible, setVisible] = useState(isVisible);

    useEffect(() => {
        if (!isVisible) {
            const timeout = setTimeout(() => setVisible(false), 500); // Duration of the fade-out animation
            return () => clearTimeout(timeout);
        } else {
            setVisible(true);
        }
    }, [isVisible]);

    return (
        visible && (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out', // Fade-out transition
                }}
            >
                <CircularProgress />
            </Box>
        )
    );
};

export default LoadingOverlay;
