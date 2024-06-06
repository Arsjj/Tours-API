"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReview = exports.getReviews = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const handlerFactory_1 = require("./handlerFactory");
const createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.tour)
        req.body.tour = req.params.tourId;
    if (!req.body.user)
        req.body.user = req.params.userId;
    const newReview = yield reviewModel_1.default.create(req.body);
    res.status(200).json({
        status: "success",
        data: {
            review: newReview,
            de: 1,
        },
    });
}));
exports.createReview = createReview;
const getReviews = (0, handlerFactory_1.getAll)(reviewModel_1.default);
exports.getReviews = getReviews;
const getReview = (0, handlerFactory_1.getOne)(reviewModel_1.default);
exports.getReview = getReview;
const updateReview = (0, handlerFactory_1.updateOne)(reviewModel_1.default);
exports.updateReview = updateReview;
const deleteReview = (0, handlerFactory_1.deleteOne)(reviewModel_1.default);
exports.deleteReview = deleteReview;
//# sourceMappingURL=reviewController.js.map