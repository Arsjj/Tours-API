/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import { NextFunction, Request, RequestHandler, Response } from "express";
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
    // role: req.body.role
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

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in get access", 401)
      );
    }

    // 2) Verification token
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as JwtPayload;

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // 4) Check if user changed password after the token was issued
    if ((currentUser as any).changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "The user recently changed password! Please login again.",
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as any).user = currentUser;
    next();
  }
);

const restrictTo = (...roles: Array<string>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
export { signUp, signIn, protect, restrictTo };
