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

reviewRouter.use(protect);

reviewRouter.route("/").get(getReviews).post(restrictTo("user"), createReview);

reviewRouter
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

export default reviewRouter;
