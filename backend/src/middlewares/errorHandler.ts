import { NextFunction, Request, Response } from "express";
import ApiError from "../util/ApiError.ts";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  console.error("Unexpected error:", err);

  return res.status(500).json({
    success: false,
    message: `Internal Server Error: ${err.message}`,
  });
};

export default errorHandler;
