import { RequestHandler } from 'express';
import { VerifyErrors } from 'jsonwebtoken';
import { ErrorResponse } from '../utils/ErrorResponse';
import jwt from 'jsonwebtoken';
require('dotenv').config();

interface TokenData {
  id: string;
  username?: string;
  email: string;
  roles: string[];
}

export const verifyToken: RequestHandler = (req, res, next) => {
  const cookies = req.headers.cookie;
  const secretKey = process.env.TOKEN_SECRET;

  if (!cookies) {
    return res.status(400).json({
      status: 400,
      message: 'Unauthorized access1'
    });
  }

  const token = cookies.split('=')[1];

  jwt.verify(token, secretKey, (err: VerifyErrors, user: TokenData) => {
    if (err) {
      return next(new ErrorResponse(498, 'Invalid token.'));
    }

    req.body.id = user.id;
    req.body.email = user.email;
    req.body.username = user.username;
    req.body.roles = user.roles;

    next();
  });
};

export const refreshToken: RequestHandler = (req, res, next) => {
  const cookies = req.headers.cookie;
  const secretKey = process.env.TOKEN_SECRET;

  if (!cookies) {
    return res.status(400).json({
      status: 400,
      message: 'Unauthorized access2'
    });
  }

  const prevToken = cookies.split('=')[1];

  jwt.verify(prevToken, secretKey, (err: VerifyErrors, user: TokenData) => {
    if (err) {
      return next(new ErrorResponse(498, 'Invalid token.'));
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles
      },
      secretKey,
      { expiresIn: '30s' }
    );

    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = '';

    res.cookie(user.id, token, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 30),
      httpOnly: true,
      sameSite: 'lax'
    });

    req.body.id = user.id;
    req.body.email = user.email;
    req.body.username = user.username;
    req.body.roles = user.roles;

    next();
  });
};
