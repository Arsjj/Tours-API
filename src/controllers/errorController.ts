import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

interface CustomError extends Error {
  name: string;
  code?: number;
  statusCode: number;
  status: string;
  message: string;
}

interface MongoError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  path?: string;
  value?: string;
  code?: number;
  errmsg?: string;
  errors?: { [key: string]: { message: string } };
  stack?: string;
}

const handleCastErrorDB = (err: MongoError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || "Unknown value";
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongoError) => {
  const errors = Object.values(err.errors ?? {}).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJwtError = () =>
  new AppError("Invalid token. Please login again!", 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);
  

const sendErrorDev = (err: MongoError, res: Response) => {
  res.status(err.statusCode as number).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: MongoError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode as number).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if(error.name === "JsonWebTokenError") error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
