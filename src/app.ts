import express, { NextFunction, Request, Response } from "express";
import hpp from "hpp";
import helmet from "helmet";
import morgan from "morgan";
import AppError from "./utils/appError";
import rateLimit from "express-rate-limit";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { globalErrorHandler } from "./controllers/errorController";
import reviewRouter from "./routes/reviewRoutes";

const app = express();

//Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

//Data sanitization against XSS
// app.use()

//Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAvrage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//ROUTES
app.use("/", (req, res) => {
  res.send("You are welcome");
});
app.use("/tours", tourRouter);
app.use("/reviews", reviewRouter);
app.use("/users", userRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} route in this server`, 404));
});

app.use(globalErrorHandler);

export default app;
