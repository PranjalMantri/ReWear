import { Request, Response } from "express";
import { asyncHandler } from "../util/asyncHandler.ts";
import User from "../model/user.model.ts";
import ApiError from "../util/ApiError.ts";
import Redemption from "../model/redemption.model.ts";
import ApiResponse from "../util/ApiResponse.ts";

const getAllRedemptions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User does not exist");

  const redemptions = await Redemption.find({ userId })
    .populate("userId", "name email")
    .populate("itemId");

  if (redemptions.length === 0) {
    throw new ApiError(404, "User has no redemptions");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully fetched user redemptions", redemptions)
    );
});

const getRedemptionById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { redemptionId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Invalid user id");
  }

  if (!redemptionId) {
    throw new ApiError(404, "Redemption Id is required");
  }

  const redemption = await Redemption.findById(redemptionId)
    .populate("userId", "name email")
    .populate("itemId");

  if (!redemption) throw new ApiError(404, "Redemption not found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched all the requested redemption",
        redemption
      )
    );
});

export { getAllRedemptions, getRedemptionById };
