import express from 'express';
import schemaController from '../controllers/schema.controller.js';

const router = express.Router();

router.get('/', schemaController.get);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
