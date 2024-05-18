import express from "express";
import { checkBody, checkId, createTour, deleteTour, getTour, getTours, updateTour } from "../controllers/tourController";


const tourRouter = express.Router();
tourRouter.param('id', checkId)

tourRouter.route("/").get(getTours).post(checkBody, createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default tourRouter;