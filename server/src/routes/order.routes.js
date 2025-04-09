import express from 'express';
import orderController from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create', orderController.create);
router.post('/cancel', orderController.cancel);
router.post('/complete', orderController.complete);
router.get('/', orderController.get);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
