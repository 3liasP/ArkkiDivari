import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import BookBarcodeScanner from '../book/book-barcode-scanner';
import { paramsToUrl } from '../../helpers/url.helpers';

const SearchBarcode = () => {
    const navigate = useNavigate();

    const handleBarcodeScan = useCallback(
        (scannedId) => {
            navigate(
                paramsToUrl({
                    page: 'book-sheet',
                    pageParam: encodeURIComponent(scannedId),
                }),
            );
        },
        [navigate],
    );

    return (
        <Container maxWidth="sm">
            <Box mt={3}>
                <Typography variant="h4" component="h1">
                    Hae viivakoodilla
                </Typography>
                <Typography variant="body1" mt={2} mb={2}>
                    {`Sovellus lukee viivakoodin ja hakee siihen liittyvän irtaimen tiedot.`}
                </Typography>
                <BookBarcodeScanner onScan={handleBarcodeScan} />
            </Box>
        </Container>
    );
};

export default SearchBarcode;
