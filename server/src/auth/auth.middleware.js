import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.authToken) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const token = cookies.authToken;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ message: error.message || 'Invalid token' });
    }
};

export default authMiddleware;
