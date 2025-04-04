import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import db from './db/database.js';
import bookRoutes from './routes/book.routes.js';
import copyRoutes from './routes/copy.routes.js';
import schemaRoutes from './routes/schema.routes.js';
import searchRoutes from './routes/search.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import reportRoutes from './routes/report.routes.js';
import { accessLogMiddleware, errorLogMiddleware } from './utils/logger.js';
import {
    authMiddleware,
    mockAuthMiddleware,
    unless,
} from './auth/auth.middleware.js';

const runProcedure = async () => {
    try {
        await db.query(`SELECT ${procedureName}();`); //eslint-disable-line
        console.log(
            `Procedure ${procedureName} executed at ${new Date().toISOString}.`, //eslint-disable-line
        );
    } catch (e) {
        console.error(`Error executing procedure ${procedureName}:`, e); //eslint-disable-line
    }
};

const init = () => {
    const PORT = process.env.NODE_PORT || 8010;
    const MODE = process.env.NODE_ENV || 'prod';

    db.connect();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(accessLogMiddleware);
    app.use(errorLogMiddleware);

    if (MODE === 'dev') {
        app.use(mockAuthMiddleware);
    } else {
        const excludePaths = [
            '/api/user/login',
            '/api/user/register',
            '/api/user/logout',
            '/api',
        ];
        app.use(unless(excludePaths, authMiddleware));
    }

    app.use('/api/book', bookRoutes);
    app.use('/api/copy', copyRoutes);
    app.use('/api/schema', schemaRoutes);
    app.use('/api/search', searchRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/order', orderRoutes);
    app.use('/api/report', reportRoutes);

    app.get('/api', (req, res) => {
        res.send({ message: 'Server running', time: new Date() });
    });

    app.listen(PORT, () => {
        console.log(`Server is running in ${MODE} mode on port ${PORT}.`);
    });

    cron.schedule('* * * * *', () => {
        runProcedure('add_missing_d1_books_to_central');
        runProcedure('add_missing_d1_copies_to_central');
    });
};

export default { init };
