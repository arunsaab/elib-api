import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { config } from "../config/config";
import { HttpError } from "http-errors"; // Ensure proper import

const globalErrorHandler: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === "development" ? err.stack : ""
  });
};

export default globalErrorHandler;
