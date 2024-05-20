import express from 'express';
import { fetchUser, fetchUsers, grantToken, signup } from '../../controllers/v2/auth';
import { refreshToken, verifyToken } from '../../middlewares/tokenHandler';
import { deleteUser, updateUser } from '../../controllers/users';

const router = express.Router();

router.post('/signup', signup);

router.post('/grant_access_token', grantToken);

router.get('/users', verifyToken, refreshToken, fetchUsers);

router.get('/user/:userid', fetchUser);

router.put('/user/update/:userid', verifyToken, refreshToken, updateUser);

router.delete('/user/delete/:userid', verifyToken, refreshToken, deleteUser);

export default router;
