"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const authController_1 = require("../controllers/authController");
const reviewRouter = express_1.default.Router({
    mergeParams: true,
});
reviewRouter
    .route("/")
    .get(reviewController_1.getReviews)
    .post(authController_1.protect, (0, authController_1.restrictTo)("user", "admin"), reviewController_1.createReview);
reviewRouter
    .route("/:id")
    .get(reviewController_1.getReview)
    .patch(authController_1.protect, (0, authController_1.restrictTo)("user", "admin"), reviewController_1.updateReview)
    .delete(authController_1.protect, (0, authController_1.restrictTo)("user", "admin"), reviewController_1.deleteReview);
exports.default = reviewRouter;
//# sourceMappingURL=reviewRoutes.js.map