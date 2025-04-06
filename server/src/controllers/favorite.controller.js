import db from '../db/database.js';

const add = async (req, res) => {
    const { copyid } = req.body;
    const { userid } = req.user;

    if (!copyid) {
        return res.status(400).send({ message: 'Request missing copyid!' });
    }
    // Maybe should check if the copyid already exists in the favorites ?

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

const getAll = async (req, res) => {
    const { userid } = req.user;

    try {
        const copyids = await db.query(
            'SELECT central.Favorites.copyid FROM central.Favorites ' +
                'JOIN central.Copies ON central.Favorites.copyid = central.Copies.copyid ' +
                'JOIN central.Books ON central.Copies.bookid = central.Books.bookid ' +
                'WHERE userid = $1 ' +
                'ORDER BY central.Books.title, central.Copies.price ASC',
            [userid],
        );

        if (copyids.rows.length === 0) {
            return res.status(200).send([]);
        }

        const favoriteData = await Promise.all(
            copyids.rows.map(async (row) => {
                const copyid = row.copyid;
                const copyData = await db.query(
                    'SELECT * FROM central.Copies ' +
                        'JOIN central.Books ON central.Copies.bookid = central.Books.bookid ' +
                        'WHERE copyid = $1',
                    [copyid],
                );
                return { copyid, ...copyData.rows[0] };
            }),
        );

        res.status(200).json(favoriteData);
    } catch (error) {
        console.error('Error fetching all favorite data:', error);
        res.status(500).json({ message: 'Error fetching all favorite data' });
    }
};

export default {
    add,
    get,
    remove,
    getAll,
};
