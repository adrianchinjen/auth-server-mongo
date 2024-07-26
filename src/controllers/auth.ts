import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import { getIds, getUserByEmail, getUserById, getUserByUsername, getUsers } from './users';
import AuthModel from '../models/Auth';
import { ErrorResponse } from '../utils/ErrorResponse';
import UserModel from '../models/People';
import { isValidPassword } from '../utils/passwordChecker';
require('dotenv').config();

export const signup: RequestHandler = async (req, res, next) => {
  const { username, email, password } = req.body;

  const isPasswordValid = isValidPassword(password);

  if (!isPasswordValid) {
    return res.status(400).json({
      statusCode: 400,
      message:
        'Password should contain atleast one capital letter, one small letter, one special character, one number and atleast 12 characters long.'
    });
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await bcrypt.hashSync(password, salt);

  const checkByEmail = await getUserByEmail(email);
  const checkByUsername = await getUserByUsername(username);

  if (!checkByEmail && !checkByUsername) {
    const authCredentials = { email, username, password: hashedPassword };
    const newAuth = new AuthModel(authCredentials);

    try {
      const newAuthResponse = await newAuth.save();
      if (newAuthResponse) {
        const userCredentials = {
          auth_id: newAuthResponse._id.valueOf(),
          username: newAuthResponse.username,
          email: newAuthResponse.email,
          roles: newAuthResponse.roles
        };
        const newUser = new UserModel(userCredentials);
        try {
          const newUserResponse = await newUser.save();

          if (newUserResponse) {
            return res.status(201).json({
              status: 201,
              message: 'User has been created',
              payload: { username, email }
            });
          }
        } catch (error) {
          return next(new ErrorResponse(403, error));
        }
      }
    } catch (error) {
      return next(new ErrorResponse(403, error));
    }
  }

  return res.status(409).json({
    message: 'User already exist'
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signin: RequestHandler = async (req, res, next) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;
  const secretKey = process.env.TOKEN_SECRET;

  const user = await getUserByEmail(reqEmail);

  if (!user) {
    return res.status(409).json({
      message: 'User not found'
    });
  }

  const { username, id, email, roles } = user;
  const userHashedPassword = user.password;
  const isPasswordCorrect = await bcrypt.compareSync(reqPassword, userHashedPassword);

  if (!isPasswordCorrect) {
    return res.status(409).json({
      message: 'Incorrect email or password'
    });
  }

  const token = jwt.sign({ id, email, username, roles }, secretKey, { expiresIn: '3m' });

  if (req.cookies[`${id}`]) {
    req.cookies[`${id}`] = '';
  }

  res.cookie(id, token, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 180),
    httpOnly: true,
    sameSite: 'lax'
  });

  return res.status(200).json({
    message: 'Token has been granted successfully',
    payload: token
  });
};

export const fetchUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await getUsers();

    return res.status(200).json({
      payload: users
    });
  } catch (error) {
    return next(new ErrorResponse(404, error));
  }
};

export const fetchUser: RequestHandler = async (req, res, next) => {
  try {
    const users = await getUserById(req.params.userid);
    return res.status(200).json({
      payload: users
    });
  } catch (error) {
    return next(new ErrorResponse(404, error));
  }
};

export const grant_token: RequestHandler = async (req, res) => {
  const userDetails = await getIds(req.body.email);
  const user_input_password = req.body.password;
  const secretKey = process.env.TOKEN_SECRET;

  if (!userDetails) {
    return res.status(404).json({
      message: 'Incorrect email or password'
    });
  }

  const { auth_id, user_id, username, email, roles, password } = userDetails;

  const isPasswordCorrect = await bcrypt.compareSync(user_input_password, password);

  if (!isPasswordCorrect) {
    return res.status(409).json({
      message: 'Incorrect email or password'
    });
  }

  const token = jwt.sign({ auth_id, user_id, username, email, roles }, secretKey, { expiresIn: '3m' });

  return res.status(200).json({
    message: 'Token has granted successfully',
    token
  });
};
