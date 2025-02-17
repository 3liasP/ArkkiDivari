import MenuIcon from '@mui/icons-material/Menu';
import {
    Button,
    Drawer,
    styled,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import textLogo from '../../assets/svg/logo-no-background.svg';
import { paramsToUrl } from '../../helpers/url.helpers';
import MenuDrawer from './menu-drawer';
import SearchBox from './search-box';
import { initSimpleSearch } from '../search/search.actions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledLogo = styled('img')(({ theme }) => ({
    width: '80px',
    height: 'auto',
    [theme.breakpoints.up('sm')]: {
        width: '100px',
    },
    [theme.breakpoints.up('md')]: {
        width: '160px',
    },
}));

const TopBar = ({ darkMode, initSimpleSearch }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const toggleDrawer = () => () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const callBack = (newCtx, params) => {
            const urlParams = { ...params.criteria };
            if (params.query) urlParams.query = params.query;
            navigate(
                paramsToUrl({
                    page: newCtx,
                    pageParam: encodeURIComponent(paramsToUrl(urlParams)),
                }),
            );
        };
        initSimpleSearch(searchQuery, 'search-results', callBack);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                color={darkMode ? 'dark' : 'primary'}
                enableColorOnDark
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'flex' },
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="drawerOpen drawer"
                            onClick={toggleDrawer()}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer open={drawerOpen} onClose={toggleDrawer()}>
                            <MenuDrawer toggleDrawer={toggleDrawer()} />
                        </Drawer>
                        {isMobile ? (
                            <Button>
                                <StyledLogo
                                    src={textLogo}
                                    alt="ArkkiDivari"
                                    onClick={() => navigate('/')}
                                />
                            </Button>
                        ) : (
                            <Link to="/">
                                <Tooltip title="Koti">
                                    <Button>
                                        <StyledLogo
                                            src={textLogo}
                                            alt="ArkkiDivari"
                                        />
                                    </Button>
                                </Tooltip>
                            </Link>
                        )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <SearchBox
                        searchQuery={searchQuery}
                        handleInputChange={handleInputChange}
                        handleSearchSubmit={handleSearchSubmit}
                    />
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => navigate('/shopping-cart')}
                    >
                        <ShoppingCartIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    darkMode: state.user.darkMode,
});

const mapDispatchToProps = (dispatch) => ({
    initSimpleSearch: (query, newCtx, callBack) =>
        dispatch(initSimpleSearch(query, newCtx, callBack)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
