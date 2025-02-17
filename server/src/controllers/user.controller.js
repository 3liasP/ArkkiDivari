import db from '../database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid token' });
    }
};


const login = async (req, res) => {
    try {

        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).send({
                message: 'Invalid request!',
            });
        }

        const result = await db.query(
            'SELECT * FROM central.Users WHERE username = $1 AND password = $2',
            [username, password],
        );

        if (!result.rows.length) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        // For now, token is valid for 1 hour. Change if you will.
        const token = jwt.sign({userId: user.userid }, SECRET_KEY, { expiresIn: '1h' });

        //Another way would be to use the cookie-parser library
        // --> res.cookie('authToken', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Max-Age=${60 * 60}`);
        res.json({ message: 'Login succesful' });

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const register = async (req, res) => {
    const { userid, sellerid, role, password, name, address, zip, city, phone } = req.body;

    if (!userid || !password || !role || !name) {
        return res.status(400).send({
            message: 'Invalid request!',
        });
    }

    try {
        const findExisting = await db.query(
            `SELECT * FROM central.Users WHERE username = $1`,
            [userid],
        );

        if (findExisting.rows.length) {
            return res.status(400).send({ message: 'User already exists' });
        };

        const result = await db.query (
            `INSERT INTO central.Users (userid, sellerid, role, password, name, address, zip, city, phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                userid,
                sellerid || null,
                role,
                password,
                name,
                address || null,
                zip || null,
                city || null,
                phone || null
            ],
        );

        res.status(201).json({ message: 'User created succesfully' }, result.rows[0]);

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default { authMiddleware, login, register };