import fs from "fs";
import { Tour } from "../../types";
import { NextFunction, Request, Response } from "express";

const tours: Array<Tour> = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) as any
);

const checkId = (
  req: Request,
  res: Response,
  next: NextFunction,
  val: string
) => {
  console.log(val);
  const tour = tours.find((el: Tour) => el?.id === Number(req.params.id));

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

const checkBody = (req: Request, res: Response, next: NextFunction) => {
  console.log(1);
  const data = req.body;
  if (!data.name || !data.price) {
    return res.status(404).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

const getTours = (req: Request, res: Response) => {
  console.log(req);
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req: Request, res: Response) => {
  const id = req.params.id;

  res.status(200).json({
    status: "success",
    data: {
      tour: id,
    },
  });
};

const createTour = (req: Request, res: Response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      console.log(error);
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );

  //    res.send("ok");
};

const deleteTour = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};

const updateTour = (req: Request, res: Response) => {
  res.status(500).json({
    statuse: "error",
    message: "This route isn't defined yet",
  });
};

export {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
};
