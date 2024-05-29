/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Review } from "../models/reviewModel";

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: (reviews as unknown as any[]).length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req: Request, res: Response) => {
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      review: newReview,
      de: 1
    },
  });
});

export { getReviews, createReview };
