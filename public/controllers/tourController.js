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
exports.getToursWithin = exports.getMonthlyPlan = exports.getToursstats = exports.aliasTopTours = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getTours = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
const handlerFactory_1 = require("./handlerFactory");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../utils/appError"));
const aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingAverage,price";
    req.query.fields = "name,price,ratingAverage,summary,difficulty";
    next();
};
exports.aliasTopTours = aliasTopTours;
const getTours = (0, handlerFactory_1.getAll)(tourModel_1.default);
exports.getTours = getTours;
const getTour = (0, handlerFactory_1.getOne)(tourModel_1.default);
exports.getTour = getTour;
const createTour = (0, handlerFactory_1.createOne)(tourModel_1.default);
exports.createTour = createTour;
const deleteTour = (0, handlerFactory_1.deleteOne)(tourModel_1.default);
exports.deleteTour = deleteTour;
const updateTour = (0, handlerFactory_1.updateOne)(tourModel_1.default);
exports.updateTour = updateTour;
const getToursstats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield tourModel_1.default.aggregate([
            {
                $match: {
                    ratingsAverage: { $gte: 4.5 },
                },
            },
            {
                $group: {
                    _id: "$difficulty",
                    numTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ]);
        res.status(200).json({
            status: "success",
            data: stats,
        });
    }
    catch (err) {
        res.status(404).json({
            status: "failed",
            message: err,
        });
    }
});
exports.getToursstats = getToursstats;
const getMonthlyPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = Number(req.params.year); // 2021
        const plan = yield tourModel_1.default.aggregate([
            {
                $unwind: "$startDates",
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { numTourStarts: -1 },
            },
            {
                $limit: 12,
            },
        ]);
        res.status(200).json({
            status: "success",
            data: {
                plan,
            },
        });
    }
    catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
});
exports.getMonthlyPlan = getMonthlyPlan;
const getToursWithin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { distance, lat, lng, unit } = req.params;
    const radius = unit === "mi" ? Number(distance) / 3963.2 : Number(distance) / 6378.1;
    if (!lat || !lng) {
        next(new appError_1.default("Please provide latitutr and longitude in the format lat,lng.", 400));
    }
    const tours = yield tourModel_1.default.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lat, lng], radius],
            },
        },
    });
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: tours,
    });
}));
exports.getToursWithin = getToursWithin;
//# sourceMappingURL=tourController.js.map