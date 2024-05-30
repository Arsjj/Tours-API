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
  .post(protect, restrictTo("user"), createReview);

reviewRouter.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

export default reviewRouter;
