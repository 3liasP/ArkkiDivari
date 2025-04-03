import db from '../db/database.js';

const search = async (req, res) => {
    try {
        const { query, criteria, args } = req.body;

        // Checking all wanted fields of request exist
        if (!criteria || !args) {
            return res.status(400).send({
                message: 'Invalid request!',
            });
        }

        let { sort = 'asc', orderby } = args;
        const { limit = 1000, copies: includeCopies = true } = args;

        // Constructing the SQL query for books
        let booksQuery = 'SELECT * FROM central.Books WHERE ';
        const booksConditions = [];
        const booksValues = [];
        let valueIndex = 1;

        // Adding query conditions for books using tsvector
        if (query) {
            booksQuery =
                "SELECT *, ts_rank(tsv, plainto_tsquery('english', $1)) AS rank FROM central.Books WHERE ";
            booksValues.push(query);
            valueIndex++;

            booksConditions.push(
                `tsv @@ plainto_tsquery('english', $${valueIndex++})`,
            );
            booksValues.push(query);

            if (!orderby) {
                orderby = 'rank';
                sort = 'desc';
            }
        }

        for (const column in criteria) {
            const values = criteria[column];
            if (!values || values.length === 0) continue;
            booksConditions.push(
                `${column} IN (${values.map(() => `$${valueIndex++}`).join(', ')})`,
            );
            booksValues.push(...values);
        }

        if (booksConditions.length === 0) booksConditions.push('TRUE');

        booksQuery += booksConditions.join(' AND ');
        booksQuery += ` ORDER BY ${orderby ?? 'title'} ${sort} LIMIT $${valueIndex}`;
        booksValues.push(limit);

        // Execute the books query
        const booksResult = await db.query(booksQuery, booksValues);

        const result = {};

        for (const book of booksResult.rows) {
            // eslint-disable-next-line no-unused-vars
            const { tsv, rank, ...rest } = book;
            result[book.bookid] = {
                ...rest,
                copies: [],
            };
        }

        if (booksResult.rows.length === 0) {
            return res.status(200).send([]);
        }

        // If copies are to be included, construct the SQL query for copies
        if (includeCopies) {
            let copiesQuery = 'SELECT * FROM central.Copies WHERE bookid IN (';
            copiesQuery += booksResult.rows
                .map((_, index) => `$${index + 1}`)
                .join(', ');
            copiesQuery += ')';
            const copiesValues = booksResult.rows.map((book) => book.bookid);

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
