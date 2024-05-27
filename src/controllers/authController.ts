/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

const signToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const signUp = catchAsync(async (req: Request, res: Response) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id as string);

  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});

const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const correct = await user.correctPassword(password, user?.password);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (
      !user ||
      !(await (user as any).correctPassword(password, user?.password))
    ) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id as string);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export { signUp, signIn };
