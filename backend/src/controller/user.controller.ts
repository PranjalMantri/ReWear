import { Request, Response } from "express";

import User from "../model/user.model.ts";

import ApiError from "../util/ApiError.ts";
import ApiResponse from "../util/ApiResponse.ts";
import { asyncHandler } from "../util/asyncHandler.ts";

import { createTokens } from "../util/jwt.ts";

import {
  signinSchema,
  signupSchema,
} from "../../../common/schema/user.schema.ts";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV == "production",
  sameSite: true,
};

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

const signin = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signinSchema.safeParse(req.body);

  if (!validatedData.success) {
    throw new ApiError(
      400,
      "Invalid input",
      validatedData.error.flatten().fieldErrors
    );
  }

  const { email, password } = validatedData.data!;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await existingUser.isPasswordValid(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = createTokens({
    userId: existingUser._id,
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = {
    id: existingUser._id,
    fullname: existingUser.fullname,
    email: existingUser.email,
  };

  res
    .status(200)
    .json(new ApiResponse(200, "User signup succcessfull", userResponse));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Logged out user successfuly", {}));
});

export { signup, signin, logout };
