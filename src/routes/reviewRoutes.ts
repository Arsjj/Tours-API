import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

const reviewRouter = express.Router({
  mergeParams: true,
});

reviewRouter
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user", "admin"), createReview);

reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(protect, restrictTo("user", "admin"), updateReview)
  .delete(protect, restrictTo("user", "admin"), deleteReview);

export default reviewRouter;
