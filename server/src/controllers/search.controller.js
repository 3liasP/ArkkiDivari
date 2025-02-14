import { SCHEMA } from '../constants/schema.constants.js';
import db from '../db/database.js';

const getQueriableProperties = () =>
    Object.keys(SCHEMA.books).filter(
        (key) => SCHEMA.books[key].type === 'text',
    );

const search = async (req, res) => {
    try {
        const { criteria, args } = req.body;

        // Checking all wanted fields of request exist
        if (!criteria || !args) {
            return res.status(400).send({
                message: 'Invalid request!',
            });
        }

        const { books, copies, query } = criteria;
        const {
            sort = 'asc',
            limit = 1000,
            orderby = 'title',
            copies: includeCopies = true,
        } = args;

        // Constructing the SQL query for books
        let booksQuery = 'SELECT * FROM central.Books WHERE ';
        const booksConditions = [];
        const booksValues = [];
        let valueIndex = 1;

        // Adding query conditions for books
        if (query) {
            const queriableProperties = getQueriableProperties();
            const queryConditions = queriableProperties.map(
                (prop) => `${prop} ILIKE $${valueIndex++}`,
            );
            booksConditions.push(`(${queryConditions.join(' OR ')})`);
            booksValues.push(
                ...Array(queriableProperties.length).fill(`%${query}%`),
            );
        }

        for (const column in books) {
            const values = books[column];
            booksConditions.push(
                `${column} IN (${values.map(() => `$${valueIndex++}`).join(', ')})`,
            );
            booksValues.push(...values);
        }

        if (booksConditions.length === 0) booksConditions.push('TRUE');

        booksQuery += booksConditions.join(' AND ');
        booksQuery += ` ORDER BY ${orderby} ${sort} LIMIT $${valueIndex}`;
        booksValues.push(limit);

        // Execute the books query
        const booksResult = await db.query(booksQuery, booksValues);

        const result = {};

        for (const book of booksResult.rows) {
            result[book.bookid] = {
                ...book,
                copies: [],
            };
        }

        // If copies are to be included, construct the SQL query for copies
        if (includeCopies) {
            let copiesQuery = 'SELECT * FROM central.Copies WHERE bookid IN (';
            copiesQuery += booksResult.rows
                .map((_, index) => `$${index + 1}`)
                .join(', ');
            copiesQuery += ')';
            const copiesValues = booksResult.rows.map((book) => book.bookid);

            // Adding criteria for copies
            const copiesConditions = [];
            for (const column in copies) {
                const values = copies[column];
                copiesConditions.push(
                    `${column} IN (${values.map(() => `$${valueIndex++}`).join(', ')})`,
                );
                copiesValues.push(...values);
            }

            if (copiesConditions.length > 0) {
                copiesQuery += ' AND ' + copiesConditions.join(' AND ');
            }

            // Execute the copies query
            const copiesResult = await db.query(copiesQuery, copiesValues);

            for (const copy of copiesResult.rows) {
                result[copy.bookid].copies.push({
                    ...copy,
                });
            }
        }
        res.status(200).send(Object.values(result));
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default { search };
