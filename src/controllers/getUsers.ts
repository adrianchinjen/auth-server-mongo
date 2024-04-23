import UserModel from '../models/User';
import { ErrorResponse } from '../utils/ErrorResponse';

export const getUserByEmail = async (email: string) => {
  try {
    const response = await UserModel.findOne({ email });
    return response;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by email.');
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const response = await UserModel.findOne({ username });
    return response;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by username.');
  }
};

export const getUserById = async (id: string) => {
  try {
    const data = await UserModel.findById({ id });
    return data;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by id.');
  }
};

export const getUsers = async () => {
  try {
    const response = await UserModel.find();
    return response;
  } catch (error) {
    throw new ErrorResponse(401, 'Something went wrong getting user by id.');
  }
};
