import express from 'express';
import bodyParser from 'body-parser';
import db from './db/database.js';
import bookRoutes from './routes/book.routes.js';
import copyRoutes from './routes/copy.routes.js';
import schemaRoutes from './routes/schema.routes.js';
import searchRoutes from './routes/search.routes.js';
import userRoutes from './routes/user.routes.js';
import { accessLogMiddleware, errorLogMiddleware } from './utils/logger.js';
import authMiddleware from './auth/auth.middleware.js';

const init = () => {
    db.connect();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(accessLogMiddleware);
    app.use(errorLogMiddleware);

    app.use('/api/book', authMiddleware, bookRoutes);
    app.use('/api/copy', authMiddleware, copyRoutes);
    app.use('/api/schema', authMiddleware, schemaRoutes);
    app.use('/api/search', authMiddleware, searchRoutes);
    // User routes are protected directly in user.routes.js
    app.use('/api/user', userRoutes);

    app.get('/api', (req, res) => {
        res.send({ message: 'Server running', time: new Date() });
    });

    const PORT = process.env.NODE_PORT || 8010;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
};

export default { init };
