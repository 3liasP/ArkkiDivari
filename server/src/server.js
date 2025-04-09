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
import favoriteRoutes from './routes/favorite.routes.js';
import { accessLogMiddleware, errorLogMiddleware } from './utils/logger.js';
import {
    authMiddleware,
    mockAuthMiddleware,
    unless,
} from './auth/auth.middleware.js';

const runProcedure = async (procedureName) => {
    try {
        const result = await db.query(`SELECT ${procedureName}();`);
        const count = result.rows[0][procedureName];
        console.log(
            `Procedure ${procedureName} executed at ${new Date().toISOString()}. Added ${count} records.`,
        );
    } catch (e) {
        console.error(`Error executing procedure ${procedureName}:`, e);
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
    app.use('/api/favorite', favoriteRoutes);

    app.get('/api', (req, res) => {
        res.send({ message: 'Server running', time: new Date() });
    });

    app.listen(PORT, () => {
        console.log(`Server is running in ${MODE} mode on port ${PORT}.`);
    });

    // default is every 10 minutes
    cron.schedule(process.env.CRON_SCHEDULE || '*/10 * * * *', async () => {
        await runProcedure('add_missing_d1_books_to_central');
        await runProcedure('add_missing_d1_copies_to_central');
    });
};

export default { init };
