import {
    Box,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import bookIcon from '../../assets/svg/book.svg';
import { dayjsFormatTimeStamp } from '../../helpers/dayjs.helpers';
import { paramsToUrl } from '../../helpers/url.helpers';
import { search } from './search.actions';

const SearchGrid = ({ ctx, params, schema, results, search }) => {
    const [order, setOrder] = useState('relevance');

    useEffect(() => {
        search(ctx, params);
    }, [ctx, params, search]);

    const navigate = useNavigate();

    const books = useMemo(() => {
        if (!results || !schema) return [];
        return results.map((result) => {
            const book = { ...result };
            book.available = book.copies.filter(
                (copy) => copy.status === 'available',
            ).length;
            book.priceRange = book.copies.reduce(
                (acc, copy) => {
                    if (copy.status === 'available') {
                        acc[0] = Math.min(acc[0], Number(copy.price));
                        acc[1] = Math.max(acc[1], Number(copy.price));
                    }
                    return acc;
                },
                [Infinity, 0],
            );
            return book;
        });
    }, [results, schema]);

    const sortedBooks = useMemo(() => {
        if (!results || !schema) return [];
        const sorted = [...books].sort((a, b) => {
            switch (order) {
                case 'author-asc':
                    return a.author.localeCompare(b.author);
                case 'author-desc':
                    return b.author.localeCompare(a.author);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'price-asc':
                    return a.priceRange[0] - b.priceRange[0];
                case 'price-desc':
                    return b.priceRange[1] - a.priceRange[1];
                default:
                    return 0;
            }
        });
        return sorted.map((result, index) => {
            const book = { id: index, ...result };
            schema.books.order.forEach((key) => {
                const property = schema.books.properties[key];
                const value = book[key];
                if (property.type === 'timestamp') {
                    book[key] = value ? dayjsFormatTimeStamp(value) : '';
                } else if (schema.associations[property.type]) {
                    book[key] = schema.associations[property.type][value];
                } else {
                    book[key] = value;
                }
            });
            return book;
        });
    }, [results, schema, books, order]);

    const subHeaders = ['author', 'year', 'genreid'];

    return (
        <Box>
            {ctx === 'search-results' && results?.length > 0 && (
                <FormControl sx={{ minWidth: 120, mb: 2 }}>
                    <InputLabel id="order-select-label">Järjestä</InputLabel>
                    <Select
                        labelId="order-select-label"
                        id="order-select"
                        value={order}
                        label="Järjestä"
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <MenuItem value="relevance">Osuvimmat</MenuItem>
                        <MenuItem value="author-asc">
                            Tekijän mukaan A - Ö
                        </MenuItem>
                        <MenuItem value="author-desc">
                            Tekijän mukaan Ö - A
                        </MenuItem>
                        <MenuItem value="title-asc">
                            Nimen mukaan A - Ö
                        </MenuItem>
                        <MenuItem value="title-desc">
                            Nimen mukaan Ö - A
                        </MenuItem>
                        <MenuItem value="price-asc">Halvimmat ensin</MenuItem>
                        <MenuItem value="price-desc">Kalleimmat ensin</MenuItem>
                    </Select>
                </FormControl>
            )}
            <Box
                maxWidth="false"
                sx={{
                    mt: 4,
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2,
                }}
            >
                {sortedBooks.map((book) => (
                    <Card key={book.id} sx={{ mb: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Box
                                display="flex"
                                justifyContent="center"
                                mb={2}
                                onClick={() =>
                                    navigate(
                                        paramsToUrl({
                                            page: 'book-sheet',
                                            pageParam: book.bookid,
                                        }),
                                    )
                                }
                            >
                                <img
                                    src={bookIcon}
                                    alt="Teos"
                                    style={{
                                        width: '100px',
                                        height: 'auto',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="start">
                                <span
                                    onClick={() =>
                                        navigate(
                                            paramsToUrl({
                                                page: 'book-sheet',
                                                pageParam: book.bookid,
                                            }),
                                        )
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: 'bolder',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    <Typography variant="h6">
                                        {book.title}
                                    </Typography>
                                </span>
                            </Box>
                            <Box display="flex" justifyContent="start">
                                {subHeaders.map((key, index) => (
                                    <Typography key={key} variant="body2">
                                        {book[key]}
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
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                sx={{ mt: 2 }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    color={
                                        book.available > 0 ? 'info' : 'error'
                                    }
                                >
                                    {`Saatavilla ${book.available} kpl`}
                                </Typography>
                                <Typography variant="h6">
                                    {book.priceRange[0] === Infinity
                                        ? book.priceRange[1] === 0
                                            ? 'Ei hintaa'
                                            : `${book.priceRange[1]} €`
                                        : book.priceRange[1] === 0
                                          ? ''
                                          : book.priceRange[0] ===
                                              book.priceRange[1]
                                            ? `${book.priceRange[0]} €`
                                            : `${book.priceRange[0]} - ${book.priceRange[1]} €`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

const mapStateToProps = (state, ownProps) => ({
    schema: state.schema.data,
    results: state.contexts[ownProps.ctx].searchResults,
});

const mapDispatchToProps = (dispatch) => ({
    search: (ctx, params) => dispatch(search(ctx, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchGrid);
