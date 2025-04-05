import db from '../db/database.js';

const add = async (req, res) => {
    const { copyid } = req.body;
    const { userid } = req.user;

    if (!copyid) {
        return res.status(400).send({ message: 'Request missing copyid!' });
    }

    try {
        await db.query(
            'INSERT INTO central.Favorites (userid, copyid) VALUES ($1, $2)',
            [userid, copyid],
        );
        res.status(201).send({ message: 'Favorite added successfully' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding favorite' });
    }
};

const get = async (req, res) => {
    const { userid } = req.user;

    try {
        const favorites = await db
            .query('SELECT copyid FROM central.Favorites WHERE userid = $1', [
                userid,
            ])
            .then((result) => result.rows.map((row) => row.copyid));

        if (favorites.length === 0) {
            return res.status(200).send([]);
        }

        res.status(200).json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
};

const remove = async (req, res) => {
    const { copyid } = req.body;
    const { userid } = req.user;

    if (!copyid) {
        return res.status(400).send({ message: 'Request missing copyid!' });
    }

    try {
        await db.query(
            'DELETE FROM central.Favorites WHERE userid = $1 AND copyid = $2',
            [userid, copyid],
        );

        res.status(200).send({ message: 'Favorite removed successfully' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Error removing favorite' });
    }
};

export default {
    add,
    get,
    remove,
};
