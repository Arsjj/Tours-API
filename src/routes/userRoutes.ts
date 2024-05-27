import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/userController";
import { signIn, signUp } from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/sign-up", signUp)
userRouter.post("/sign-in", signIn)

userRouter.route("/").get(getUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;

