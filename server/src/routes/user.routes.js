import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../auth/auth.middleware.js';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
// This is to be added later
// router.put('/update', authMiddleware, userController.update);

router.delete('/delete', authMiddleware, userController.remove);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
});

export default router;
