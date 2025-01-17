import express from 'express';
import bodyParser from 'body-parser';
import db from './db/index.js';

const init = () => {
    db.connect();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api', (req, res) => {
        res.send({ message: 'Server running', time: new Date() });
    });

    const PORT = process.env.NODE_PORT || 8010;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
};

export default { init };
