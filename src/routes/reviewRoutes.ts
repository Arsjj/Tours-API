import express from "express";
import { createReview, getReviews } from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), createReview);

export default reviewRouter;
