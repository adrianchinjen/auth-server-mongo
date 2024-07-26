import express from 'express';
import { fetchUser, fetchUsers, signup, signin, grant_token } from '../controllers/auth';
import { refreshToken, verifyToken } from '../middlewares/tokenHandler';
import { deleteUser, updateUser } from '../controllers/users';

const router = express.Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/token', grant_token);

router.get('/users', verifyToken, refreshToken, fetchUsers);

router.get('/user/:userid', fetchUser);

router.put('/user/update/:userid', verifyToken, refreshToken, updateUser);

router.delete('/user/delete/:userid', verifyToken, refreshToken, deleteUser);

export default router;
