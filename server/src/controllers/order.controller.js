import db from '../db/database.js';

const getOrderDetails = async (orderid) => {
    const order = await db
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

    return { ...order, copies, orderid };
};

const create = async (req, res) => {
    const { copyids } = req.body;
    const { userid } = req.user;

    try {
        const orderid = await db
            .query('SELECT create_order($1, $2) AS orderid', [copyids, userid])
            .then((result) => result.rows[0].orderid);

        const details = await getOrderDetails(orderid);

        res.send({
            message: 'Order created successfully',
            details,
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

        const details = await getOrderDetails(orderid);

        res.send({
            message: 'Order canceled successfully',
            details,
        });
    } catch (error) {
        res.status(500).send({ message: 'Error canceling order', error });
    }
};

const complete = async (req, res) => {
    const { orderid } = req.body;
    const { userid } = req.user;

    try {
        await db.query('SELECT complete_order($1, $2)', [orderid, userid]);

        const details = await getOrderDetails(orderid);

        res.send({
            message: 'Order completed successfully',
            details,
        });
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

const getAllWithCopies = async (req, res) => {
    const { userid } = req.user;

    try {
        const orders = await db.query(
            'SELECT orderid, time, status, subtotal, shipping, total FROM central.Orders WHERE userid = $1',
            [userid],
        );
        if (orders.rowCount === 0) {
            return res.status(200).send({ message: 'No orders found' });
        }

        const ordersWithCopies = await Promise.all(
            orders.rows.map(async (order) => {
                const copies = await db.query(
                    'SELECT Copies.copyid, Copies.sellerid, Copies.price, Books.title, Books.author, Books.year ' +
                        'FROM central.OrderItems JOIN central.Copies ON OrderItems.copyid = Copies.copyid ' +
                        'JOIN central.Books ON Copies.bookid = Books.bookid ' +
                        'WHERE OrderItems.orderid = $1',
                    [order.orderid],
                );
                return { ...order, copies: copies.rows };
            }),
        );

        res.send({ orders: ordersWithCopies });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching orders', error });
    }
};

export default {
    create,
    cancel,
    complete,
    get,
    getAllWithCopies,
};
