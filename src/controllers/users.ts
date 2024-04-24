import { RequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import AuthModel from '../models/Auth';
import UserModel from '../models/People';

export const getUserByEmail = async (email: string) => {
  try {
    const response = await AuthModel.findOne({ email });
    return response;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by email.');
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const response = await AuthModel.findOne({ username });
    return response;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by username.');
  }
};

export const getUserById = async (id: string) => {
  try {
    const data = await AuthModel.findById({ _id: id });
    return data;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by id.');
  }
};

export const getUsers = async () => {
  try {
    const response = await AuthModel.find();
    return response;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by id.');
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userid;
  const userIdInfo = req.body.user.id;

  if (userIdInfo !== userId) {
    return next(new ErrorResponse(401, 'Unauthorized action. Information update blocked.'));
  }
  // $push: { roles: rolesBody }
  try {
    const requestBody = {
      username: req.body.username,
      email: req.body.email
    };

    if (req.body.roles) {
      const updateAuth = await AuthModel.findByIdAndUpdate(
        userIdInfo,
        { $set: requestBody, $push: { roles: req.body.roles } },
        { new: true }
      );
      if (updateAuth) {
        const updateUser = await UserModel.findOneAndUpdate(
          { auth_id: userIdInfo },
          { $set: requestBody, $push: { roles: req.body.roles } },
          { new: true }
        );
        return res.status(201).json({
          auth: updateAuth,
          user: updateUser
        });
      }
    } else {
      const updateAuth = await AuthModel.findByIdAndUpdate(userIdInfo, { $set: requestBody }, { new: true });
      if (updateAuth) {
        const updateUser = await UserModel.findOneAndUpdate(
          { auth_id: userIdInfo },
          { $set: requestBody },
          { new: true }
        );
        return res.status(201).json({
          auth: updateAuth,
          user: updateUser
        });
      }
    }
  } catch (error) {
    return next(new ErrorResponse(401, error));
  }

  return res.status(200).json({ userId });
};

// export const deleteUser: RequestHandler = async (req, res, next) => {};
