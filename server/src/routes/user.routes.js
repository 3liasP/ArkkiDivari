import express from 'express';
import userController from '../controllers/user.controller.js';
import cookieParser from 'cookie-parser';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
// router.post('/logout', userController.logout);
// router.put('/update', authMiddleware, userController.update);

// to be added later?
// router.delete('/delete', authMiddleware, userController.remove);

router.use(cookieParser());

router.use((req, res) => {
    res.status(405).send({ message: 'Method not allowed' });
})

export default router;