"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const appError_1 = __importDefault(require("./utils/appError"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const errorController_1 = require("./controllers/errorController");
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const app = (0, express_1.default)();
//Set security HTTP headers
app.use((0, helmet_1.default)());
// Development logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
//Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour",
});
app.use("/", limiter);
//Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: "10kb" }));
//Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
//Data sanitization against XSS
// app.use()
//Prevent parameter polution
app.use((0, hpp_1.default)({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAvrage",
        "maxGroupSize",
        "difficulty",
        "price",
    ],
}));
//ROUTES
app.use("/tours", tourRoutes_1.default);
app.use("/reviews", reviewRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} route in this server`, 404));
});
app.use(errorController_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map