import db from '../db/database.js';

const create = async (req, res) => {
    const { copyids } = req.body;
    const { userid } = req.user;

    try {
        const orderid = await db
            .query('SELECT create_order($1, $2) AS orderid', [copyids, userid])
            .then((result) => result.rows[0].orderid);

        const { time, status, subtotal, shipping, total } = await db
            .query(
                'SELECT time, status, subtotal, shipping, total FROM central.Orders WHERE orderid = $1',
                [orderid],
            )
            .then((result) => result.rows[0]);

        const copies = await db
            .query('SELECT copyid FROM central.OrderItems WHERE orderid = $1', [
                orderid,
            ])
            .then((result) => result.rows.map((row) => row.copyid));

        res.send({
            message: 'Order created successfully',
            order: {
                orderid,
                userid,
                time,
                status,
                subtotal,
                shipping,
                total,
                copies,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error creating order', error });
    }
};

const cancel = async (req, res) => {
    const { orderid } = req.body;
    const { userid } = req.user;

    try {
        await db.query('SELECT cancel_order($1, $2)', [orderid, userid]);
        res.send({ message: 'Order canceled successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error canceling order', error });
    }
};

const complete = async (req, res) => {
    const { orderid } = req.body;
    const { userid } = req.user;

    try {
        await db.query('SELECT complete_order($1, $2)', [orderid, userid]);
        res.send({ message: 'Order completed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error completing order', error });
    }
};

const get = async (req, res) => {
    const { userid } = req.user;

    try {
        const orders = await db.query(
            'SELECT orderid, time, status, subtotal, shipping, total FROM central.Orders WHERE userid = $1',
            [userid],
        );
        res.send({ orders: orders.rows });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching orders', error });
    }
};

export default {
    create,
    cancel,
    complete,
    get,
};
