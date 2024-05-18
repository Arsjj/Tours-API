import { Request, Response } from "express";

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

export {getUsers, getUser, createUser, updateUser, deleteUser}
