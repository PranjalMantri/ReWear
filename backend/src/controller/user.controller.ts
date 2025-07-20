import { Request, Response } from "express";

import User from "../model/user.model.ts";

import ApiError from "../util/ApiError.ts";
import ApiResponse from "../util/ApiResponse.ts";
import { asyncHandler } from "../util/asyncHandler.ts";

import { createTokens } from "../util/jwt.ts";

import { signupSchema } from "../../../common/schema/user.schema.ts";

const signup = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signupSchema.safeParse(req.body);

  if (!validatedData.success) {
    throw new ApiError(
      400,
      "Invalid input",
      validatedData.error.flatten().fieldErrors
    );
  }

  const { fullname, email, password } = validatedData.data!;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({ fullname, email, password });

  if (!user) {
    throw new ApiError(500, "Something went wrong while creating a user");
  }

  const { accessToken, refreshToken } = createTokens({ userId: user._id });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: true,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
  };

  res
    .status(201)
    .json(new ApiResponse(201, "User registered succcessfuly", userResponse));
});

export { signup };
