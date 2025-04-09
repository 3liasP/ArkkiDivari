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

const mockAuthMiddleware = async (req, res, next) => {
    if (process.env.NODE_ENV === 'dev') {
        req.user = {
            userid: 'admin@arkkidivari.com',
        };
        next();
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
};

const unless = (paths, middleware) => {
    return (req, res, next) => {
        if (paths.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

export { authMiddleware, mockAuthMiddleware, unless };
