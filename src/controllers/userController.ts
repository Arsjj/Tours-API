/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import User from "../models/userModel";

const filterObj = (obj: Record<string, any> , ...allowedFields: Array<string>) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getUsers = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};

const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};
const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};
const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};
const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};

const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email");

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export { getUsers, getUser, createUser, updateUser, deleteUser, updateMe };
