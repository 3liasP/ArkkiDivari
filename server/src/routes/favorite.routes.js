import express from 'express';
import favoriteController from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/', favoriteController.add);
router.get('/', favoriteController.get);
router.delete('/', favoriteController.remove);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
