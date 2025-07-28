import ApiError from "../util/ApiError.ts";
import { asyncHandler } from "../util/asyncHandler.ts";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../util/jwt.ts";
import { UserPayload } from "../types/express/index.js";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as UserPayload | null;

    if (!decodedToken) {
      throw new ApiError(401, "Invalid or expired access token");
    }

    req.user = {
      _id: decodedToken.userId,
    };

    next();
  }
);
