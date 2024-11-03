import { NextFunction, Request, Response } from 'express';
import CustomError from '../classes';


const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log(err);
    return res.status(err.statusCode).json({
      status: false,
      statusCode: err.statusCode || 500,
      message: err.message || "Something went wrong",
    });
  }

export default errorHandler;


