import { RequestHandler } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import AuthModel from '../models/Auth';
import UserModel from '../models/People';
import { Role } from '../utils/enum/role.enum';

export interface TokenDetails {
  user_id: string;
  auth_id: string;
  username: string;
  email: string;
  roles: string[];
}

export const getUserByEmail = async (email: string) => {
  try {
    const response = await AuthModel.findOne({ email });

    if (!response) {
      return null;
    }
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
          status: 201,
          message: 'User has been successfully updated',
          payload: updateUser
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
          status: 201,
          message: 'User has been successfully updated',
          payload: updateUser
        });
      }
    }
  } catch (error) {
    return next(new ErrorResponse(401, error));
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userid;
  // const userIdInfo = req.body.user.id;
  const userRoles = req.body.user.roles;
  // eslint-disable-next-line prefer-const
  let superRole = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSuperAdmin = superRole.push(userRoles.indexOf(Role.SUPERADMIN));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isAdmin = superRole.push(userRoles.indexOf(Role.ADMIN));
  const roleIndex = superRole.findIndex((item) => item > 0);

  if (roleIndex >= 0) {
    try {
      const deleteAuth = await AuthModel.findByIdAndDelete(userId);

      if (deleteAuth) {
        const deleteUser = await UserModel.findOneAndDelete({ auth_id: userId });

        if (deleteUser) {
          return res.status(204).json({
            message: 'A user has been deleted successfully'
          });
        }
      }
    } catch (error) {
      return next(new ErrorResponse(401, error));
    }
  }

  return next(new ErrorResponse(401, 'Unauthorized deletion'));
};

export const getIds = async (email: string) => {
  try {
    const authDetails = await AuthModel.findOne({ email });

    if (!authDetails) {
      return null;
    }

    const userDetails = await UserModel.findOne({ auth_id: authDetails._id });

    return {
      auth_id: userDetails.auth_id,
      user_id: userDetails._id,
      username: userDetails.username,
      email: userDetails.email,
      roles: userDetails.roles,
      password: authDetails.password
    };
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by ids.');
  }
};
