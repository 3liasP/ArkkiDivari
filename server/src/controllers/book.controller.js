import db from '../db/database.js';

const create = async (req, res) => {
    try {
        const result = await db.query(
            `INSERT INTO central.Books (
                isbn, title, author, year, weight, typeid, genreid
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING *`,
            [
                req.body.isbn,
                req.body.title,
                req.body.author,
                req.body.year,
                req.body.weight,
                req.body.typeid,
                req.body.genreid,
            ],
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

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

const update = async (req, res) => {
    try {
        const result = await db.query(
            `UPDATE central.Books SET
                isbn = $1,
                title = $2,
                author = $3,
                year = $4,
                weight = $5,
                typeid = $6,
                genreid = $7
            WHERE bookid = $8 RETURNING *`,
            [
                req.body.isbn,
                req.body.title,
                req.body.author,
                req.body.year,
                req.body.weight,
                req.body.typeid,
                req.body.genreid,
                req.params.id,
            ],
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

const remove = async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM central.Books WHERE bookid = $1 RETURNING *',
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

export default { create, findOne, update, remove };
