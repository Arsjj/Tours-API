/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import User from "../models/userModel";
import multer from "multer";

import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory";

// const filterObj = (
//   obj: Record<string, any>,
//   ...allowedFields: Array<string>
// ) => {
//   const newObj: any = {};
//   Object.keys(obj).forEach((el) => {
//     if (!allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user=${req.user?.id}.${ext}`);
  },
});

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadPhoto = upload.single("photo");

const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};

const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user?.id;
  next();
};

const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }
    if (req.body.email) {
      return next(new AppError("You can't change your email", 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    // const filteredBody = filterObj(req.body, "email");

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user?.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

const deleteMe = catchAsync(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.user?.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getUser = getOne(User);
const getUsers = getAll(User);
const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  uploadPhoto,
};
 