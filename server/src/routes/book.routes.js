import express from 'express';
import bookController from '../controllers/book.controller.js';

const router = express.Router();

router.post('/', bookController.create);
router.get('/:id', bookController.findOne);
// router.put('/:id', bookController.update);
// router.delete('/:id', bookController.delete);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
