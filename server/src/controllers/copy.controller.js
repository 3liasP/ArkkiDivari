import db from '../db/database.js';
import {
    getUserSchema,
    insertCopy,
    updateCopy,
    deleteCopy,
    syncBook,
} from '../utils/queries.js';

/**
 * Creates a new copy in central schema and user schema if available
 */
const create = async (req, res) => {
    const { userid } = req.user;
    const copy = req.body;
    try {
        const result = await insertCopy('central', copy);
        const schemaName = await getUserSchema(userid);

        // if the user has a schema, sync the book and insert the copy
        if (schemaName) {
            // Ensure book exists in user schema
            await syncBook(copy.bookid, schemaName);

            copy.copyid = result.rows[0].copyid;
            await insertCopy(schemaName, copy);
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

/**
 * Finds a copy by ID in central schema
 */
const findOne = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM central.Copies WHERE copyid = $1',
            [req.params.id],
        );
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send({ message: 'Copy not found' });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

/**
 * Updates a copy in central schema and user schema if available
 */
const update = async (req, res) => {
    const { userid } = req.user;
    const copyId = req.params.id;
    const copy = { ...req.body, copyid: copyId };

    try {
        // Update in central schema
        const result = await updateCopy('central', copy);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Copy not found' });
        }

        // Update in user schema if available
        const schemaName = await getUserSchema(userid);
        if (schemaName) {
            // Ensure book exists in user schema
            await syncBook(copy.bookid, schemaName);

            await updateCopy(schemaName, copy);
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

/**
 * Removes a copy from central schema and user schema if available
 */
const remove = async (req, res) => {
    const { userid } = req.user;
    const copyId = req.params.id;

    try {
        // Delete from central schema
        const result = await deleteCopy('central', copyId);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Copy not found' });
        }

        // Delete from user schema if available
        const schemaName = await getUserSchema(userid);
        if (schemaName) {
            await deleteCopy(schemaName, copyId);
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default { create, findOne, update, remove };
