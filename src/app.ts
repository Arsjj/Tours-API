import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import AppError from "./utils/appError";
import { globalErrorHandler } from "./controllers/errorController";
import { protect } from "./controllers/authController";

const app = express();

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction): void => {
  next();
});


//ROUTES
app.use('/tours', protect, tourRouter)
app.use('/users', userRouter)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} route in this server`, 404));
})

app.use(globalErrorHandler)



export default app


