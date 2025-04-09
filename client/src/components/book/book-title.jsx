import { Box, Typography, Grow } from '@mui/material';
import React, { useState, useEffect } from 'react';

const BookTitle = ({ editing }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(false);
        const timer = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timer);
    }, [editing]);

    return (
        <Box display="flex" justifyContent="space-between">
            <Grow in={show} timeout={200} key={editing ? 'editing' : 'viewing'}>
                <Typography variant="h4" component="h1">
                    {editing ? 'Muokataan teosta...' : 'Teos'}
                </Typography>
            </Grow>
        </Box>
    );
};

export default BookTitle;
