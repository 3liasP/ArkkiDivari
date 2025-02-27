import db from '../db/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const me = async (req, res) => {
    try {
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).send({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { userid } = decoded;

        const result = await db.query(
            'SELECT * FROM central.Users WHERE userid = $1',
            [userid],
        );

        if (!result.rows.length) {
            return res.status(404).send({ message: 'User not found' });
        }

        const userData = result.rows[0];
        delete userData.password;

        res.status(200).send({ userData });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { userid, password } = req.body;

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
        }

        const user = result.rows[0];

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        // For now, token is valid for 1 hour. Change if you will.
        const token = jwt.sign(
            { userid: user.userid },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h',
            },
        );

        //Another way would be to use the cookie-parser library
        // --> res.cookie('authToken', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.setHeader(
            'Set-Cookie',
            `authToken=${token}; HttpOnly; Max-Age=${60 * 60}; Path=/`,
        );

        const userData = { ...user };
        delete userData.password;

        res.status(200).send({ message: 'Logged in', userData });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const register = async (req, res) => {
    const {
        userid,
        password,
        name,
        role = 'customer',
        sellerid = null,
        address = null,
        zip = null,
        city = null,
        phone = null,
    } = req.body;

    if (![userid, password, name].every(Boolean)) {
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
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO central.Users (userid, sellerid, role, password, name, address, zip, city, phone)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                userid,
                sellerid,
                role,
                hashedPassword,
                name,
                address,
                zip,
                city,
                phone,
            ],
        );

        const userData = result.rows[0];
        delete userData.password;

        res.status(201).send({
            message: 'User created succesfully',
            userData,
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('authToken');
    res.send({ message: 'Logged out' });
};

const remove = async (req, res) => {
    const { userid } = req.body;

    if (!userid) {
        return res.status(400).send({ message: 'Invalid request' });
    }

    try {
        // first check if user exists
        const result = await db.query(
            'SELECT * FROM central.Users WHERE userid = $1',
            [userid],
        );

        if (!result.rows.length) {
            return res.status(403).send({ message: 'User not found' });
        }

        // then delete user
        await db.query('DELETE FROM central.Users WHERE userid = $1', [userid]);

        res.status(200).send({ message: 'User deleted' });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default { me, login, register, logout, remove };
