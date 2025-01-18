import express from 'express';
import bodyParser from 'body-parser';
import db from './db/index.js';
import bookRoutes from './routes/book.routes.js';
import { accessLogMiddleware, errorLogMiddleware } from './utils/logger.js';

const init = () => {
    db.connect();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(accessLogMiddleware);
    app.use(errorLogMiddleware);

    app.use('/api/book', bookRoutes);

    app.get('/api', (req, res) => {
        res.send({ message: 'Server running', time: new Date() });
    });

    const PORT = process.env.NODE_PORT || 8010;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
};

export default { init };
