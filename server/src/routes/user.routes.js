import express from 'express';
import userController from '../controllers/user.controller.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.use(cookieParser());

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
// This is to be added later
// router.put('/update', authMiddleware, userController.update);

router.delete('/delete', userController.authMiddleware, userController.remove);

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
})

export default router;