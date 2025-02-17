import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Box,
    Collapse,
    Container,
    IconButton,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Error = ({ error, errorInfo }) => {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };

    const sadFace = String.fromCodePoint(0x1f615);
    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Hmm, jotain meni pieleen. {sadFace}
                </Typography>
                <Typography variant="subtitle1" component="p">
                    <Link to="/">Palaa etusivulle</Link> ja kokeile ladata sivu
                    uudelleen. Ota yhteyttä ylläpitoon, jos ongelma toistuu.
                </Typography>
                <Box mt={2} />
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open details"
                    sx={{ mr: 2 }}
                    onClick={handleToggle}
                >
                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Collapse in={open}>
                    <Box mt={2} component="pre">
                        <Typography variant="body1" gutterBottom>
                            {error && error.toString()}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {errorInfo && errorInfo.componentStack}
                        </Typography>
                    </Box>
                </Collapse>
                <Box />
            </Box>
        </Container>
    );
};

export default Error;
