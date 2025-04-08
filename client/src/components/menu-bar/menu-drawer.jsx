import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { paramsToUrl } from '../../helpers/url.helpers';
import { USER_ROLES } from '../user/user.constants';

export const MenuDrawer = ({ toggleDrawer, userRole }) => {
    const navigate = useNavigate();

    const userPrivilege = USER_ROLES[userRole]?.privilege || 0;
    const options = [
        { text: 'Koti', icon: <HomeIcon />, onClick: () => navigate('/') },
        {
            text: 'Suosikit',
            icon: <FavoriteIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'favorites' })),
        },
        userPrivilege >= 2 && {
            text: 'Uusi teos',
            icon: <AddIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'book-new' })),
        },
        {
            text: 'Hae viivakoodilla',
            icon: <QrCodeScannerIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'search-barcode' })),
        },
        {
            text: 'Laajennettu haku',
            icon: <ManageSearchIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'search-advanced' })),
        },
        {
            text: 'Omat tilaukset',
            icon: <InventoryIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'orders' })),
        },
        userPrivilege >= 2 && {
            text: 'Raportit',
            icon: <QueryStatsIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'reports' })),
        },
        {
            text: 'Käyttäjä',
            icon: <AccountCircleIcon />,
            onClick: () => navigate(paramsToUrl({ page: 'user' })),
        },
    ].filter(Boolean);

    return (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => toggleDrawer(false)}
        >
            <List>
                {options.map(({ text, icon, onClick }) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={onClick}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    userRole: state.user.info.role,
});

export default connect(mapStateToProps, null)(MenuDrawer);
