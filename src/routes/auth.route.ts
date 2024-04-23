import express from 'express';
import { fetchUser, fetchUsers, signup, token } from '../controllers/auth';
import { refreshToken, verifyToken } from '../middlewares/tokenHandler';

const router = express.Router();

router.post('/signup', signup);

router.post('/token', token);

router.get('/users', verifyToken, refreshToken, fetchUsers);

router.get('/user/:userid', fetchUser);

export default router;
