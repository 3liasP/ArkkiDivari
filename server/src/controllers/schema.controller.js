import { SCHEMA } from '../constants/schema.constants.js';
import db from '../db/database.js';

const get = async (req, res) => {
    try {
        const schema = structuredClone(SCHEMA);

        // missing admin schema properties...
        const promises = await Promise.all(
            Object.entries(schema.associations).map(async ([key, value]) => {
                const { id, type, name } = value;
                if (type === 'table') {
                    const result = await db.query(
                        `SELECT * FROM central.${name}`,
                    );
                    const values = result.rows.reduce((acc, row) => {
                        acc[row[id]] = row.name;
                        return acc;
                    }, {});
                    return { [key]: values };
                } else if (type === 'enum') {
                    const result = await db.query(
                        `SELECT enum_range(NULL::${name})`,
                    );
                    const values = result.rows[0].enum_range
                        .replace(/[{()}]/g, '')
                        .split(',')
                        .map((item) => item.replace(/"/g, ''));
                    return { [key]: values };
                }
            }),
        );
        const associations = promises.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {},
        );

        res.json({ ...schema, associations });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

export default { get };
