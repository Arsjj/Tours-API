import Tour from "../models/tourModel";
import { NextFunction, Request, Response } from "express";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";

const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";
  next();
};

const getTours = getAll(Tour);
const getTour = getOne(Tour);
const createTour = createOne(Tour);
const deleteTour = deleteOne(Tour);
const updateTour = updateOne(Tour);

const getToursstats = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

const getMonthlyPlan = async (req: Request, res: Response) => {
  try {
    const year = Number(req.params.year); // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getToursWithin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { distance, lat, lng, unit } = req.params;

    const radius =
      unit === "mi" ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

    if (!lat || !lng) {
      next(
        new AppError(
          "Please provide latitutr and longitude in the format lat,lng.",
          400
        )
      );
    }

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lat, lng], radius],
        },
      },
    });
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  }
);

export {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursstats,
  getMonthlyPlan,
  getToursWithin,
};
