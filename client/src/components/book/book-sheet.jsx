import { useTheme } from '@emotion/react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid2,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Skeleton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tabs,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import { paramsToUrl } from '../../helpers/url.helpers';
import NoMatch from '../../routes/no-match';
import SummaryButtons from '../summary/summary-buttons';
import { USER_ROLES } from '../user/user.constants';
import BookControls from './book-controls';
import BookTitle from './book-title';
import { cloneBook, deleteBook, fetchBook } from './book.actions';
import CopyGrid from '../copy/copy-grid';
import CopyNew from '../copy/copy-new'; // Import CopyNew component
import { prepareCopy } from '../copy/copy.actions';

const BookSheet = ({
    ctx,
    currentBook,
    pageParam,
    editing,
    schema,
    userGroup,
    fetchBook,
    cloneBook,
    deleteBook,
    prepareCopy,
    notFound,
}) => {
    useEffect(() => {
        fetchBook(ctx, pageParam);
    }, [ctx, pageParam, fetchBook]);

    const navigate = useNavigate();

    const [state, setState] = useState({
        anchorEl: null,
        selectedTab: 0,
        dialogOpen: false,
        copyModalOpen: false, // State to manage CopyNew modal
    });

    const handleMenuClick = (event) => {
        setState((prevState) => ({
            ...prevState,
            anchorEl: event.currentTarget,
        }));
    };

    const handleMenuClose = () => {
        setState((prevState) => ({
            ...prevState,
            anchorEl: null,
        }));
    };

    const handleTabChange = (event, newValue) => {
        setState((prevState) => ({
            ...prevState,
            selectedTab: newValue,
        }));
    };

    const handleMenuItemClick = (event) => {
        switch (event.currentTarget.id) {
            case 'clone': {
                const callBack = () => {
                    navigate(
                        paramsToUrl({
                            page: 'book-new',
                        }),
                    );
                };
                cloneBook(ctx, 'book-new', callBack);
                break;
            }
            case 'copy': {
                prepareCopy(ctx);
                setState((prevState) => ({
                    ...prevState,
                    copyModalOpen: true,
                }));
                break;
            }
            case 'delete': {
                setState((prevState) => ({
                    ...prevState,
                    dialogOpen: true,
                }));
                break;
            }
            default: {
                break;
            }
        }
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setState((prevState) => ({
            ...prevState,
            dialogOpen: false,
        }));
    };

    const handleCopyModalClose = () => {
        setState((prevState) => ({
            ...prevState,
            copyModalOpen: false, // Close the CopyNew modal
        }));
    };

    const handleConfirmDelete = () => {
        const callBack = () => {
            navigate(
                paramsToUrl({
                    page: 'home',
                }),
            );
        };
        deleteBook(ctx, callBack);
        handleDialogClose();
    };

    const theme = useTheme();
    const isWindowed = useMediaQuery(theme.breakpoints.down('lg'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const searchParams = {
        criteria: {
            bookid: [currentBook?.bookid],
        },
        args: {
            limit: 100,
            offset: 0,
            orderBy: 'createdat',
            sort: 'asc',
        },
    };

    if (notFound) {
        return <NoMatch />;
    }

    const subHeaders = ['title', 'author', 'year'];

    if (currentBook && schema) {
        return (
            <Container maxWidth="false" sx={{ pb: 12 }}>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                    <Grid2 size={isWindowed ? 12 : 3}>
                        <Box mt={3}>
                            <BookTitle editing={editing} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box display="flex" justifyContent="start">
                                    {subHeaders.map((key, index) => (
                                        <Typography
                                            key={key}
                                            variant="subtitle1"
                                        >
                                            {currentBook[key]}
                                            {index < subHeaders.length - 1 && (
                                                <span>
                                                    &nbsp;
                                                    {String.fromCharCode(8226)}
                                                    &nbsp;
                                                </span>
                                            )}
                                        </Typography>
                                    ))}
                                </Box>
                                {USER_ROLES[userGroup]?.privilege >= 2 ? (
                                    <>
                                        <IconButton
                                            aria-controls={
                                                state.anchorEl
                                                    ? 'simple-menu'
                                                    : undefined
                                            }
                                            aria-haspopup="true"
                                            onClick={handleMenuClick}
                                            disabled={editing}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>

                                        <Menu
                                            id="simple-menu"
                                            anchorEl={state.anchorEl}
                                            open={Boolean(state.anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuList>
                                                <MenuItem
                                                    id="clone"
                                                    onClick={
                                                        handleMenuItemClick
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <ContentCopyIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        Luo uusi kopio
                                                    </ListItemText>
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem
                                                    id="copy"
                                                    onClick={
                                                        handleMenuItemClick
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <LibraryAddIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        Luo uusi myyntikappale
                                                    </ListItemText>
                                                </MenuItem>
                                                {USER_ROLES[userGroup]
                                                    ?.privilege >= 3 && [
                                                    <Divider key="divider" />,
                                                    <MenuItem
                                                        key="delete"
                                                        id="delete"
                                                        onClick={
                                                            handleMenuItemClick
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <DeleteForeverIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            Poista pysyvästi
                                                        </ListItemText>
                                                    </MenuItem>,
                                                ]}
                                            </MenuList>
                                        </Menu>
                                    </>
                                ) : (
                                    <Tooltip title="Sinulla ei ole oikeuksia muokata teosta">
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                        <Box mt={3}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {schema.books.order.map((key) => {
                                            const property =
                                                schema.books.properties[key];
                                            const value = currentBook[key];
                                            if (!property?.editable) {
                                                return (
                                                    <TableRow key={key}>
                                                        <TableCell>
                                                            {property?.label ||
                                                                key}
                                                        </TableCell>
                                                        <TableCell>
                                                            {property.type ===
                                                            'timestamp'
                                                                ? dayjsFormatTimeStamp(
                                                                      value,
                                                                  )
                                                                : value}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid2>
                    <Divider orientation="vertical" flexItem />
                    <Grid2 size={isWindowed ? 12 : 'grow'}>
                        <>
                            <Tabs
                                value={state.selectedTab}
                                onChange={handleTabChange}
                                variant={isMobile ? 'fullWidth' : 'standard'}
                            >
                                <Tab label="Myynnissä" />
                                <Tab
                                    label={
                                        USER_ROLES[userGroup]?.privilege >= 2
                                            ? 'Muokkaa'
                                            : 'Lisätiedot'
                                    }
                                />
                            </Tabs>
                            {state.selectedTab === 0 && (
                                <CopyGrid ctx={ctx} params={searchParams} />
                            )}
                            {state.selectedTab === 1 && (
                                <BookControls ctx={ctx} />
                            )}
                        </>
                    </Grid2>
                </Grid2>
                <Dialog open={state.dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Poista teos</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`Haluatko varmasti poistaa teoksen ${currentBook?.bookid || ''} pysyvästi?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Peru
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="error"
                            variant="contained"
                            autoFocus
                        >
                            Poista
                        </Button>
                    </DialogActions>
                </Dialog>
                <CopyNew
                    ctx={ctx}
                    schema={schema}
                    editing={editing}
                    userGroup={userGroup}
                    open={state.copyModalOpen}
                    onClose={handleCopyModalClose}
                />
                {editing && <SummaryButtons ctx={ctx} />}
            </Container>
        );
    } else {
        return (
            <Container maxWidth="false" sx={{ pb: 12 }}>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                    <Grid2 size={isWindowed ? 12 : 3}>
                        <Box mt={3}>
                            <Skeleton variant="text" width={200} height={40} />
                            <Skeleton variant="text" width={300} height={20} />
                        </Box>
                        <Box mt={3}>
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={200}
                            />
                        </Box>
                    </Grid2>
                    <Divider orientation="vertical" flexItem />
                    <Grid2 size={isWindowed ? 12 : 'grow'} mt={3}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={400}
                        />
                    </Grid2>
                </Grid2>
            </Container>
        );
    }
};

const mapStateToProps = (state, ownProps) => ({
    currentBook: state.contexts[ownProps.ctx].currentBook,
    editing: state.contexts[ownProps.ctx].editing,
    schema: state.schema.data,
    notFound: state.contexts[ownProps.ctx].notFound,
    userGroup: state.user.group,
});

const mapDispatchToProps = (dispatch) => ({
    fetchBook: (pageParam) => dispatch(fetchBook(pageParam)),
    cloneBook: (ctx, newCtx, callBack) =>
        dispatch(cloneBook(ctx, newCtx, callBack)),
    deleteBook: (ctx, callBack) => dispatch(deleteBook(ctx, callBack)),
    prepareCopy: (ctx) => dispatch(prepareCopy(ctx)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookSheet);
