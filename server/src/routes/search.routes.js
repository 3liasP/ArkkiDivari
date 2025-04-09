import express from 'express';
import searchController from '../controllers/search.controller.js';

const router = express.Router();

router.post('/', searchController.search);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
