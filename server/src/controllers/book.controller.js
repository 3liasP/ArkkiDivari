import db from '../db/database.js';
import {
    getUserSchema,
    insertBook,
    updateBook,
    deleteBook,
} from '../utils/queries.js';

/**
 * Creates a new book in central schema and user schema if available
 */
const create = async (req, res) => {
    const { userid } = req.user;
    const book = req.body;
    try {
        const result = await insertBook('central', book);
        const schemaName = await getUserSchema(userid);
        // if the user has a schema, insert the book into that schema
        if (schemaName) {
            book.bookid = result.rows[0].bookid;
            await insertBook(schemaName, book);
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

/**
 * Finds a book by ID in central schema
 */
const findOne = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM central.Books WHERE bookid = $1',
            [req.params.id],
        );
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

/**
 * Updates a book in central schema and user schema if available
 */
const update = async (req, res) => {
    const { userid } = req.user;
    const bookId = req.params.id;
    const book = { ...req.body, bookid: bookId };

    try {
        // Update in central schema
        const result = await updateBook('central', book);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Book not found' });
        }

        // Update in user schema if available
        const schemaName = await getUserSchema(userid);
        if (schemaName) {
            await updateBook(schemaName, book);
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

/**
 * Removes a book from central schema and user schema if available
 */
const remove = async (req, res) => {
    const { userid } = req.user;
    const bookId = req.params.id;

    try {
        // Delete from central schema
        const result = await deleteBook('central', bookId);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Book not found' });
        }

        // Delete from user schema if available
        const schemaName = await getUserSchema(userid);
        if (schemaName) {
            await deleteBook(schemaName, bookId);
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default { create, findOne, update, remove };
