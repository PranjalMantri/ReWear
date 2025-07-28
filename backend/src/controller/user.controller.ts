import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../model/user.model.ts";

import ApiError from "../util/ApiError.ts";
import ApiResponse from "../util/ApiResponse.ts";
import { asyncHandler } from "../util/asyncHandler.ts";

import { createAccessToken, createRefreshToken } from "../util/jwt.ts";

import {
  signinSchema,
  signupSchema,
} from "../../../common/schema/user.schema.ts";
import { UserPayload } from "../types/express/index.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV == "production",
  sameSite: true,
};

const createTokens = async (payload: jwt.JwtPayload) => {
  try {
    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    user.refreshToken = refreshToken;

    user?.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while creating tokens: ${error}`
    );
  }
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

  const { accessToken, refreshToken } = await createTokens({
    userId: user._id,
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

  const { accessToken, refreshToken } = await createTokens({
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

const getCurrentUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    res
      .status(200)
      .json(new ApiResponse(200, "Fetched user details successfuly", user));
  }
);

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as UserPayload | null;

  if (!decodedToken) {
    throw new ApiError(401, "Token is invalid or expired");
  }

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new ApiError(401, "Refresh token is invalid");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is invalid or used");
  }

  const { accessToken, refreshToken } = await createTokens({
    userId: user._id,
  });

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "New tokens generated successfuly", refreshToken)
    );
});

const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Successfuly fetched user using userId", user));
});

const updateUserProfilePicture = asyncHandler(
  async (req: Request, res: Response) => {
    const profilePicture = req.file;

    if (!profilePicture) {
      throw new ApiError(
        500,
        "Something went wrong while uploading profile picure"
      );
    }

    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "Could not find user");
    }

    user.profilePicture = profilePicture.path;
    user.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, "User profile picture updated successfuly", user)
      );
  }
);

export {
  signup,
  signin,
  logout,
  getCurrentUserDetails,
  refreshAccessToken,
  getUserDetails,
  updateUserProfilePicture,
};
