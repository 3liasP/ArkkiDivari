import db from '../db/index.js';

const create = async (req, res) => {
    try {
        const result = await db.query(
            `INSERT INTO central.Books (
                isbn, sellerid, price, title, author, year, type, genre, mass, buyInPrice, soldDate
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
            ) RETURNING *`,
            [
                req.body.isbn,
                req.body.sellerid,
                req.body.price,
                req.body.title,
                req.body.author,
                req.body.year,
                req.body.type,
                req.body.genre,
                req.body.mass,
                req.body.buyinprice,
                req.body.solddate,
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
            'SELECT * FROM central.Books WHERE bookId = $1',
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

export default { create, findOne };
