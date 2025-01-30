import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();
app.use(express.json());

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);

app.get("/", (req, res) => {
  // const error = createHttpError(404, "Not Found");
  // throw error;
  res.json({ message: "Hello World" });
});

app.use("/api/users", userRouter);

// Use the error handler correctly
app.use(globalErrorHandler);

export default app;
