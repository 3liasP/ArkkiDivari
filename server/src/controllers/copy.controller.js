import db from '../db/database.js';

const create = async (req, res) => {
    try {
        const result = await db.query(
            `INSERT INTO central.Copies (
                bookid, sellerid, status, price, buyinprice
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *`,
            [
                req.body.bookid,
                req.body.sellerid,
                req.body.status,
                req.body.price,
                req.body.buyinprice,
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

const update = async (req, res) => {
    try {
        const result = await db.query(
            `UPDATE central.Copies SET
                bookid = $1,
                sellerid = $2,
                status = $3,
                price = $4,
                buyinprice = $5
            WHERE copyid = $6 RETURN
            RETURNING *`,
            [
                req.body.bookid,
                req.body.sellerid,
                req.body.status,
                req.body.price,
                req.body.buyinprice,
                req.params.id,
            ],
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

const remove = async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM central.Copies WHERE copyid = $1 RETURNING *',
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

export default { create, findOne, update, remove };
