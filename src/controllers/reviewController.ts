/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Review } from "../models/reviewModel";
import { deleteOne, updateOne } from "./handlerFactory";

const getReviews = catchAsync(async (req: Request, res: Response) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }
  const reviews = await Review.find(filter as any);

  res.status(200).json({
    status: "success",
    results: (reviews as unknown as any[]).length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.params.userId;
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      review: newReview,
      de: 1,
    },
  });
});

const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

export { getReviews, createReview, updateReview, deleteReview };
