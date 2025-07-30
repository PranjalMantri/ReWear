import {
  SwapInputSchema,
  SwapStatusEnum,
} from "../../../common/schema/swap.schema.ts";
import Swap from "../model/swaps.model.ts";
import User from "../model/user.model.ts";
import ApiError from "../util/ApiError.ts";
import ApiResponse from "../util/ApiResponse.ts";
import { asyncHandler } from "../util/asyncHandler.ts";
import { Request, Response } from "express";

const proposeSwap = asyncHandler(async (req: Request, res: Response) => {
  const proposerId = req.user?._id;
  const validatedData = SwapInputSchema.safeParse({
    ...req.body,
    proposer: proposerId,
  });

  if (!validatedData.success) {
    throw new ApiError(
      400,
      "Invalid data",
      validatedData.error.flatten().fieldErrors
    );
  }

  if (validatedData.data.receiver === proposerId) {
    throw new ApiError(400, "Cannot swap items with yourself");
  }

  const swap = await Swap.create(validatedData.data);

  res
    .status(201)
    .json(new ApiResponse(201, "Successfuly proposed a swap", swap));
});

const getIncomingSwaps = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Invalid user id");
  }

  const incomingSwaps = await Swap.find({ receiver: userId })
    .populate("proposer", "name email")
    .populate("proposerItemId")
    .populate("receiverItemId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfuly fetched all the incoming swaps for user",
        incomingSwaps
      )
    );
});

const getOutgoingSwaps = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Invalid user id");
  }

  const outgoingSwaps = await Swap.find({ proposer: userId })
    .populate("receiver", "name email")
    .populate("receiverItemId")
    .populate("proposerItemId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfuly fetched all the outgoing swaps for user",
        outgoingSwaps
      )
    );
});

const getAllSwaps = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Invalid user id");
  }

  const swaps = await Swap.find({
    $or: [{ proposer: userId }, { receiver: userId }],
  })
    .populate("receiver", "name email")
    .populate("proposer", "name email")
    .populate("receiverItemId")
    .populate("proposerItemId");

  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfuly fetched all the swaps for user", swaps)
    );
});

const getSwapById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { swapId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "Invalid user id");
  }

  if (!swapId) {
    throw new ApiError(404, "Swap Id is required");
  }

  const swap = await Swap.findById(swapId)
    .populate("proposer", "name email")
    .populate("receiver", "name email")
    .populate("proposerItemId")
    .populate("receiverItemId");

  if (!swap) throw new ApiError(404, "Swap not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfuly fetched all the requested swap", swap)
    );
});

const acceptSwap = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { swapId } = req.params;

  if (!userId) {
    throw new ApiError(404, "Invalid user id");
  }

  if (!swapId) {
    throw new ApiError(404, "Swap Id is required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "Invalid user");

  const swap = await Swap.findById(swapId);

  if (!swap) {
    throw new ApiError(404, "Could not find a swap with given id");
  }

  if (!swap) throw new ApiError(404, "Swap not found");

  if (swap.receiver.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to accept this swap");
  }

  if (swap.status !== "pending") {
    throw new ApiError(400, `This swap is already ${swap.status}`);
  }

  swap.status = "accepted";
  await swap.save();

  res
    .status(201)
    .json(new ApiResponse(201, "Successfuly accepted the swap proposal", swap));
});

export {
  proposeSwap,
  getIncomingSwaps,
  getOutgoingSwaps,
  getAllSwaps,
  getSwapById,
  acceptSwap,
};
