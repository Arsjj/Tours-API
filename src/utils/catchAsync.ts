import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => any;

const catchAsync = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export { catchAsync };
