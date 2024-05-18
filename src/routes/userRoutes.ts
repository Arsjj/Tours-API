import express, { Request, Response } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/").get(getUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
