import db from '../db/database.js';
import { AsyncParser } from '@json2csv/node';

const get = async (req, res) => {
    const { id } = req.params;

    let query;
    switch (id) {
        case 'R2':
            query = 'SELECT * FROM central.GenreSalesSummary';
            break;
        case 'R3':
            query = 'SELECT * FROM central.CustomerPurchasesLastYear';
            break;
        default:
            res.status(404).send({ message: 'Report not found' });
            return;
    }

    try {
        const result = await db.query(query);
        const data = result.rows;

        if (data.length === 0) {
            res.status(404).send({ message: 'No data found for the report' });
            return;
        }

        const json2csvParser = new AsyncParser();
        const csv = await json2csvParser.parse(data).promise();

        res.header('Content-Type', 'text/csv');
        res.attachment(`${id}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).send({ message: 'Error getting report', error });
    }
};

export default {
    get,
};
