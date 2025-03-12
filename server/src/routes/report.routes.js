import express from 'express';
import reportController from '../controllers/report.controller.js';

const router = express.Router();

router.get('/:id', reportController.get);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
