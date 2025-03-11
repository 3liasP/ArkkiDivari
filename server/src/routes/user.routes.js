import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.get('/me', userController.me);
router.put('/update', userController.update);
router.delete('/delete', userController.remove);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
