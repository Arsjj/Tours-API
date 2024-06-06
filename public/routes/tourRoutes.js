"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController_1 = require("../controllers/tourController");
const authController_1 = require("../controllers/authController");
const reviewRoutes_1 = __importDefault(require("./reviewRoutes"));
const tourRouter = express_1.default.Router();
tourRouter.route("/top-5-cheap").get(tourController_1.aliasTopTours, tourController_1.getTours);
tourRouter.route("/stats").get(tourController_1.getToursstats);
tourRouter
    .route("/monthly-plan/:year")
    .get(authController_1.protect, (0, authController_1.restrictTo)("admin", "lead-guide"), tourController_1.getMonthlyPlan);
tourRouter.use("/:tourId/reviews", reviewRoutes_1.default);
tourRouter.route("/tours-within/:distance/center/:lng/:lat/unit/:unit").get(tourController_1.getToursWithin);
tourRouter
    .route("/")
    .get(tourController_1.getTours)
    .post(authController_1.protect, (0, authController_1.restrictTo)("admin", "lead-guide", "guide"), tourController_1.createTour);
tourRouter
    .route("/:id")
    .get(tourController_1.getTour)
    .patch(authController_1.protect, (0, authController_1.restrictTo)("admin", "lead-guide"), tourController_1.updateTour)
    .delete(authController_1.protect, (0, authController_1.restrictTo)("admin", "lead-guide"), tourController_1.deleteTour);
exports.default = tourRouter;
//# sourceMappingURL=tourRoutes.js.map