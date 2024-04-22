import { ErrorResponse } from '../utils/ErrorResponse';
import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CustomErrorHandler = (error: CustomError, _req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  if (error instanceof ErrorResponse) {
    statusCode = error.statusCode;
    message = error.message;
  }

  return res.status(statusCode).json({
    error: message
  });
};
