/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { Review } from "../models/reviewModel";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory";

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

const getReviews = getAll(Review)
const getReview = getOne(Review)
const updateReview = updateOne(Review);
const deleteReview = deleteOne(Review);

export { getReviews, getReview, createReview, updateReview, deleteReview };
