import express from 'express';
import copyController from '../controllers/copy.controller.js';

const router = express.Router();

router.post('/', copyController.create);
router.get('/:id', copyController.findOne);
router.put('/:id', copyController.update);
router.delete('/:id', copyController.remove);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
