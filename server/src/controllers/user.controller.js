import db from '../db/database.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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

        const {userid, password} = req.body;

        if (!userid || !password) {
            return res.status(400).send({
                message: 'Invalid request!',
            });
        }

        const result = await db.query(
            'SELECT * FROM central.Users WHERE userid = $1',
            [userid],
        );

        if (!result.rows.length) {
            return res.status(401).send({ message: 'Invalid username' });
        };

        const user = result.rows[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({ message: 'Invalid password' });
        };

        // For now, token is valid for 1 hour. Change if you will.
        const token = jwt.sign({userId: user.userid }, SECRET_KEY, { expiresIn: '1h' });

        //Another way would be to use the cookie-parser library
        // --> res.cookie('authToken', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Max-Age=${60 * 60}`);
        res.status(200).send({ message: 'Login succesful' });

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
            `SELECT * FROM central.Users WHERE userid = $1`,
            [userid],
        );

        if (findExisting.rows.length) {
            return res.status(400).send({ message: 'User already exists' });
        };

        const hashedPassword = bcrypt.hashSync(password, 10);

        const result = await db.query (
            `INSERT INTO central.Users (userid, sellerid, role, password, name, address, zip, city, phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                userid,
                sellerid || null,
                role,
                hashedPassword,
                name,
                address || null,
                zip || null,
                city || null,
                phone || null
            ],
        );

        res.status(201).send({ message: 'User created succesfully' }, result.rows[0]);

    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};


const logout = async (req, res) => {
    res.clearCookie('authToken');
    res.send({ message: 'Logged out' });
}


export default { authMiddleware, login, register, logout };