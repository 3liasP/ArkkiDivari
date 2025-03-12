import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';

const Review = ({ paymentType, userInfo, order }) => {
    const addresses = [userInfo.address, userInfo.city, userInfo.zip, 'Suomi'];

    const paymentTypes = {
        creditCard: 'Korttimaksu',
        bankTransfer: 'Tilisiirto',
    };

    return (
        <Stack spacing={2}>
            <List disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary="Tuotteet"
                        secondary={`${order.copies.length} valittu`}
                    />
                    <Typography variant="body2">{order.subtotal} €</Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Toimitus" />
                    <Typography variant="body2">{order.shipping} €</Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Yhteensä" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {order.total} €
                    </Typography>
                </ListItem>
            </List>
            <Divider />
            <Stack
                direction="column"
                divider={<Divider flexItem />}
                spacing={2}
                sx={{ my: 2 }}
            >
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Toimitusosoite
                    </Typography>
                    <Typography gutterBottom>{userInfo.name}</Typography>
                    <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                        {addresses.join(', ')}
                    </Typography>
                </div>
                <div>
                    <Typography variant="subtitle2" gutterBottom>
                        Maksutapa
                    </Typography>
                    <Typography gutterBottom>
                        {paymentTypes[paymentType] || 'Tilisiirto'}
                    </Typography>
                </div>
            </Stack>
        </Stack>
    );
};

const mapStateToProps = (state) => ({
    userInfo: state.user.info,
    order: state.user.order.details,
});

export default connect(mapStateToProps, null)(Review);
