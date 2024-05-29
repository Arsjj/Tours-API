import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

const reviewRouter = express.Router({
  mergeParams: true,
});

reviewRouter
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), createReview);

reviewRouter.delete("/:id", deleteReview);

export default reviewRouter;
