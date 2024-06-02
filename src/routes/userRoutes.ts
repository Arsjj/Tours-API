import express from "express";
import {
  createUser,
  deleteMe,
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateMe,
  updateUser,
} from "../controllers/userController";
import {
  forgotPassword,
  protect,
  resetPassword,
  restrictTo,
  signIn,
  signUp,
  updatePassword,
} from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/sign-in", signIn);
userRouter.post("/forgot-password", forgotPassword);
userRouter.patch("/reset-passwprd", resetPassword);

//protected routes
userRouter.use(protect);

userRouter.patch("/update-passwprd", updatePassword);
userRouter.get("/me", getMe, getUser);
userRouter.patch("/update-me", updateMe);
userRouter.patch("/delete-me", deleteMe);

//only for admins
userRouter.use(restrictTo("admin"));

userRouter.route("/").get(getUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
