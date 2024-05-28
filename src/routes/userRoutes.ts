import express from "express";
import { createUser, deleteMe, deleteUser, getUser, getUsers, updateMe, updateUser } from "../controllers/userController";
import { forgotPassword, protect, resetPassword, signIn, signUp, updatePassword } from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp)
userRouter.post("/sign-in", signIn)
userRouter.post("/forgot-password", forgotPassword)
userRouter.patch("/reset-passwprd", resetPassword)
userRouter.patch("/update-passwprd", protect, updatePassword)
userRouter.patch("/update-me", protect, updateMe)
userRouter.patch("/delete-me", protect, deleteMe)

userRouter.route("/").get(getUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;

