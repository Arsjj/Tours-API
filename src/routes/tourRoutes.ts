import express from "express";
import {
  aliasTopTours,
  createTour,
  deleteTour,
  getMonthlyPlan,
  getTour,
  getTours,
  getToursWithin,
  getToursstats,
  updateTour,
} from "../controllers/tourController";
import { protect, restrictTo } from "../controllers/authController";
import reviewRouter from "./reviewRoutes";

const tourRouter = express.Router();

tourRouter.route("/top-5-cheap").get(aliasTopTours, getTours);
tourRouter.route("/stats").get(getToursstats);
tourRouter
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide"), getMonthlyPlan);
tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter.route("/tours-within/:distance/center/:lng/:lat/unit/:unit").get(getToursWithin)

tourRouter
  .route("/")
  .get(getTours)
  .post(protect, restrictTo("admin", "lead-guide", "guide"), createTour);
tourRouter
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default tourRouter;
