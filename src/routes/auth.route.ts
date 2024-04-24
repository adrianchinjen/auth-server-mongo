import express from 'express';
import { fetchUser, fetchUsers, signup, token } from '../controllers/auth';
import { refreshToken, verifyToken } from '../middlewares/tokenHandler';
import { updateUser } from '../controllers/users';

const router = express.Router();

router.post('/signup', signup);

router.post('/token', token);

router.get('/users', verifyToken, refreshToken, fetchUsers);

router.get('/user/:userid', fetchUser);

router.put('/user/update/:userid', verifyToken, updateUser);

export default router;
