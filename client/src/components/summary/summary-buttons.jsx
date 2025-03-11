import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Fab } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { connect } from 'react-redux';
import {
    setEditing,
    setEditedBook,
    setEditedUser,
} from '../../reducers/contexts.slice';
import { createBook, updateBook } from '../book/book.actions';
import { useNavigate } from 'react-router-dom';
import { paramsToUrl } from '../../helpers/url.helpers';
import { initAdvancedSearch } from '../search/search.actions';
import { updateUser } from '../user/user.actions';

const SummaryButtons = ({
    ctx,
    setEditing,
    setEditedBook,
    setEditedUser,
    createBook,
    updateBook,
    updateUser,
    initAdvancedSearch,
}) => {
    const navigate = useNavigate();

    const handleClear = () => {
        setEditing({ ctx, editing: false });
        setEditedBook({ ctx, book: null });
        setEditedUser({ ctx, user: null });
    };

    const handleSubmit = async () => {
        switch (ctx) {
            case 'book-sheet': {
                updateBook(ctx);
                break;
            }
            case 'book-new': {
                const callBack = (result) => {
                    navigate(
                        paramsToUrl({
                            page: 'book-sheet',
                            pageParam: result.bookid,
                        }),
                    );
                };
                createBook(ctx, 'book-sheet', callBack);
                break;
            }
            case 'search-advanced': {
                const callBack = (newCtx, params) => {
                    const urlParams = { ...params.criteria };
                    if (params.query) urlParams.query = params.query;
                    navigate(
                        paramsToUrl({
                            page: newCtx,
                            pageParam: encodeURIComponent(
                                paramsToUrl(urlParams),
                            ),
                        }),
                    );
                };
                initAdvancedSearch(ctx, 'search-results', callBack);
                break;
            }
            case 'user': {
                updateUser(ctx);
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            <Fab color="error" aria-label="clear" onClick={handleClear}>
                <ClearIcon />
            </Fab>
            <Fab
                color="info"
                aria-label="submit"
                onClick={handleSubmit}
                sx={{ ml: 2 }}
            >
                {ctx === 'search-advanced' ? <SearchIcon /> : <CheckIcon />}
            </Fab>
        </Box>
    );
};

const mapDispatchToProps = (dispatch) => ({
    setEditing: (payload) => dispatch(setEditing(payload)),
    setEditedBook: (payload) => dispatch(setEditedBook(payload)),
    createBook: (ctx, newCtx, callback) =>
        dispatch(createBook(ctx, newCtx, callback)),
    updateBook: (ctx) => dispatch(updateBook(ctx)),
    initAdvancedSearch: (ctx, newCtx, callback) =>
        dispatch(initAdvancedSearch(ctx, newCtx, callback)),
    updateUser: (ctx) => dispatch(updateUser(ctx)),
    setEditedUser: (payload) => dispatch(setEditedUser(payload)),
});

export default connect(null, mapDispatchToProps)(SummaryButtons);
