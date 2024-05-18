import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";

const app = express();

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log("middleware");
  next();
});



//ROUTES
app.use('/tours', tourRouter)
app.use('/users', userRouter)

export default app


