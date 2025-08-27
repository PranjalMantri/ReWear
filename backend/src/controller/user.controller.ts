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
import Item from "../model/item.model.ts";
import Points from "../model/points.model.ts";
import Notification from "../model/notification.model.ts";

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

  const points = await Points.create({
    userId: user._id,
    type: "earned",
    amount: 20,
    meta: {
      reason: "registration",
    },
  });

  if (!points) {
    throw new ApiError(500, "Failed to assign signup points");
  }

  const { accessToken, refreshToken } = await createTokens({
    userId: user._id,
  });

  user.refreshToken = refreshToken;
  user.points += points.amount;
  await user.save({ validateBeforeSave: true });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userResponse = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  await Notification.create({
    receiverId: user._id,
    type: "points_awarded",
    message:
      "Welcome aboard! You've received a 20 point signup bonus to kickstart your journey.",
  });

  res.status(201).json(
    new ApiResponse(201, "User registered succcessfuly", {
      user: userResponse,
      reward: points,
    })
  );
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

  existingUser.refreshToken = refreshToken;
  existingUser.save();

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const user = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  res.status(200).json(new ApiResponse(200, "User signup succcessful", user));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (user) {
    user.refreshToken = null;
    user.save({ validateBeforeSave: true });
  }

  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Logged out user Successfully", null));
});

const getCurrentUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    res
      .status(200)
      .json(new ApiResponse(200, "Fetched user details Successfully", user));
  }
);

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

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

  user.refreshToken = refreshToken;
  user.save();

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, "New tokens generated Successfully", null));
});

const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetched user using userId", user));
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
        new ApiResponse(201, "User profile picture updated Successfully", user)
      );
  }
);

const getUserItems = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized request");

  const userItems = await Item.find({ userId });

  res
    .status(200)
    .json(new ApiResponse(200, "Succesfuly fetched all user items", userItems));
});

const getUserPoints = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized request");

  const user = await User.findById(userId, "points");

  if (!user) throw new ApiError(404, "Invalid user");

  res.status(200).json(
    new ApiResponse(200, "Succesfuly fetched user points", {
      points: user.points,
    })
  );
});

const getUserPointsHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) throw new ApiError(401, "Unauthorized request");

    const pointsHistory = await Points.find({ userId });

    res.status(200).json(
      new ApiResponse(200, "Succesfuly fetched user points historys", {
        pointsHistory,
      })
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
  getUserItems,
  getUserPoints,
  getUserPointsHistory,
};
