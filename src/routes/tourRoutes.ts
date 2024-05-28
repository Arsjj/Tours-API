import express from "express";
import { aliasTopTours, createTour, deleteTour, getMonthlyPlan, getTour, getTours, getToursstats, updateTour } from "../controllers/tourController";
import { protect, restrictTo } from "../controllers/authController";


const tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(aliasTopTours, getTours)
tourRouter.route('/stats').get(getToursstats)
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan)

tourRouter.route("/").get(getTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(protect, restrictTo("admin", "lead-guid"), deleteTour);

export default tourRouter;