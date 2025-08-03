import { Request, Response } from "express";
import { asyncHandler } from "../util/asyncHandler.ts";
import ApiError from "../util/ApiError.ts";
import Redemption from "../model/redemption.model.ts";
import ApiResponse from "../util/ApiResponse.ts";
import Item from "../model/item.model.ts";
import Points from "../model/points.model.ts";
import Notification from "../model/notification.model.ts";
import User from "../model/user.model.ts";

const redeemItem = asyncHandler(async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  if (!userId || !itemId) {
    throw new ApiError(400, "User ID and Item ID are required");
  }

  const item = await Item.findById(itemId).populate("userId", "name");
  if (!item) throw new ApiError(404, "Item not found");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Invalid user");

  if (item.userId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot redeem your own item");
  }

  const itemRedemption = await Redemption.find({
    itemId,
    status: { $ne: "cancelled" },
  });

  if (itemRedemption) throw new ApiError(400, "Item has been already redeemed");

  // check balance
  if (user.points < item.price) {
    throw new ApiError(
      400,
      "User does not have sufficient points to redeem the item"
    );
  }

  const redemption = await Redemption.create({
    userId,
    itemId,
    pointsUsed: item.price,
  });

  const pointsDeducted = await Points.create({
    userId,
    type: "spent",
    amount: item.price,
  });

  if (!redemption || !pointsDeducted) {
    throw new ApiError(500, "Failed to redeem item");
  }

  await Notification.create({
    receiverId: (item.userId as any).name,
    type: "item_redeemed",
    message: `${user.fullname} has redeemed your item: - ${item.title}`,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Succesfuly redeemed the item", redemption));
});

const getAllRedemptions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

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
  const { redemptionId } = req.params;

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

const markItemShipped = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { redemptionId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Invalid user id");

  const redemption = await Redemption.findById(redemptionId).populate("itemId");
  if (!redemption) throw new ApiError(404, "Redemption Id is required");

  const receiver = await User.findById((redemption.itemId as any).userId);
  if (!receiver) throw new ApiError(404, "User does not exist");

  redemption.confirmedBySender = true;
  await redemption.save();

  await Notification.create({
    receiverId: receiver._id,
    type: "item_shipped",
    message: `${user.fullname} has shipped your item`,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Sender marked the item as shipped", redemption)
    );
});

const markItemReceived = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { redemptionId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Invalid user id");

  const redemption = await Redemption.findById(redemptionId).populate("itemId");
  if (!redemption) throw new ApiError(404, "Redemption Id is required");

  if (!redemption.confirmedBySender) {
    throw new ApiError(
      401,
      "Sender has not shipped the item so receiver cannot receive it"
    );
  }

  if (redemption.confirmedByReceiver) {
    throw new ApiError(400, "Already marked as received");
  }

  const sender = await User.findById((redemption.itemId as any).userId);

  if (!sender) {
    throw new ApiError(500, "Could not determine sender of the item");
  }

  const updatedRedemption = await Redemption.findByIdAndUpdate(
    redemptionId,
    {
      confirmedByReceiver: true,
      status: "completed",
    },
    { new: true }
  );

  const pointsEarned = await Points.create({
    userId: sender._id,
    type: "earned",
    amount: redemption.pointsUsed,
    meta: {
      reason: "redemption",
    },
  });

  await Notification.create({
    receiverId: sender._id,
    type: "item_received",
    message: `${user.fullname} confirmed they received the item you shipped`,
  });

  res.status(200).json(
    new ApiResponse(200, "Item marked as received. Sender rewarded 🎉", {
      redemption: updatedRedemption,
      reward: pointsEarned,
    })
  );
});

const cancelRedemption = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { redemptionId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Invalid user id");

  const redemption = await Redemption.findById(redemptionId);
  if (!redemption) throw new ApiError(404, "Redemption Id is required");

  const sender = await User.findById((redemption.itemId as any).userId);
  if (!sender) {
    throw new ApiError(500, "Could not determine sender of the item");
  }

  if (redemption.userId.toString() !== userId?.toString()) {
    throw new ApiError(401, "User is not authorized to cancel this redemption");
  }

  if (redemption.status == "completed") {
    throw new ApiError(400, "Cannot cancel a completed redemption");
  }

  if (redemption.confirmedBySender) {
    throw new ApiError(400, "Cannot cancel a shipped redemption");
  }

  redemption.status = "cancelled";
  await redemption.save();

  await Notification.create({
    receiverId: sender._id,
    type: "redemption_cancelled",
    message: `${user.fullname} cancelled their redemption order`,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Redeemption was cancelled", redemption));
});

export {
  getAllRedemptions,
  getRedemptionById,
  markItemReceived,
  markItemShipped,
  cancelRedemption,
  redeemItem,
};
