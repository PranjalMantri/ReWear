import { SwapInputSchema } from "../../../common/schema/swap.schema.ts";
import Item from "../model/item.model.ts";
import Notification from "../model/notification.model.ts";
import Points from "../model/points.model.ts";
import Swap from "../model/swaps.model.ts";
import User from "../model/user.model.ts";
import ApiError from "../util/ApiError.ts";
import ApiResponse from "../util/ApiResponse.ts";
import { asyncHandler } from "../util/asyncHandler.ts";
import { Request, Response } from "express";

const proposeSwap = asyncHandler(async (req: Request, res: Response) => {
  const proposerId = req.user?._id;

  const proposer = await User.findById(proposerId);
  if (!proposer) throw new ApiError(400, "User does not exist");

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

  const proposedItem = await Item.findById(validatedData.data.proposedItemId);

  if (!proposedItem) throw new ApiError(400, "Proposed item does not exist");

  if (validatedData.data.receiver === proposerId) {
    throw new ApiError(400, "Cannot swap items with yourself");
  }

  const swap = await Swap.create(validatedData.data);

  await Notification.create({
    receiverId: proposedItem.userId,
    type: "swap_proposed",
    message: `${proposer.fullname} proposed a swap for your item: - ${proposedItem.title}`,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Successfully proposed a swap", swap));
});

const getIncomingSwaps = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const incomingSwaps = await Swap.find({ receiver: userId })
    .populate("proposer", "name email")
    .populate("proposerItemId")
    .populate("receiverItemId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched all the incoming swaps for user",
        incomingSwaps
      )
    );
});

const getOutgoingSwaps = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const outgoingSwaps = await Swap.find({ proposer: userId })
    .populate("receiver", "name email")
    .populate("receiverItemId")
    .populate("proposerItemId");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched all the outgoing swaps for user",
        outgoingSwaps
      )
    );
});

const getAllSwaps = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

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
      new ApiResponse(200, "Successfully fetched all the swaps for user", swaps)
    );
});

const getSwapById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { swapId } = req.params;

  if (!swapId) {
    throw new ApiError(404, "Swap Id is required");
  }

  const swap = await Swap.findById({
    _id: swapId,
    $or: [{ proposer: userId }, { receiver: userId }],
  })
    .populate("proposer", "name email")
    .populate("receiver", "name email")
    .populate("proposerItemId")
    .populate("receiverItemId");

  if (!swap) throw new ApiError(404, "Swap not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully fetched all the requested swap", swap)
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

  const swap = await Swap.findById(swapId).populate("itemId");
  if (!swap) throw new ApiError(404, "Swap not found");

  const proposer = await User.findById(swap.proposer);
  if (!proposer)
    throw new ApiError(400, "User that proposed the swap does not exist");

  if (swap.receiver.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to accept this swap");
  }

  if (swap.status !== "pending") {
    throw new ApiError(400, `This swap is already ${swap.status}`);
  }

  swap.status = "accepted";
  await swap.save();

  await Item.findByIdAndUpdate(
    {
      _id: swap.proposedItemId,
    },
    {
      status: "inactive",
    }
  );

  await Item.findByIdAndUpdate(
    {
      _id: swap.receiveItemId,
    },
    {
      status: "inactive",
    }
  );

  // the user that accepted the swap calls this endpoit,
  // we send notification to the user who actually proposed the swap

  await Notification.create({
    receiverId: proposer._id,
    type: "swap_accepted",
    message: `${user.fullname} accepted your swap proposal for item: - ${
      (swap.proposedItemId as any).title
    }`,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, "Successfully accepted the swap proposal", swap)
    );
});

const rejectSwap = asyncHandler(async (req: Request, res: Response) => {
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
  if (!swap) throw new ApiError(404, "Swap not found");

  const proposer = await User.findById(swap.proposer);
  if (!proposer)
    throw new ApiError(400, "User that proposed the swap does not exist");

  if (swap.receiver.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to reject this swap");
  }

  if (swap.status !== "pending") {
    throw new ApiError(400, `This swap is already ${swap.status}`);
  }

  swap.status = "rejected";
  await swap.save();

  await Notification.create({
    receiverId: proposer._id,
    type: "swap_rejected",
    message: `${user.fullname} rejected your swap proposal for item: - ${
      (swap.proposedItemId as any).title
    }`,
  });

  await Item.findByIdAndUpdate(
    {
      _id: swap.proposedItemId,
    },
    {
      status: "active",
    }
  );

  await Item.findByIdAndUpdate(
    {
      _id: swap.receiveItemId,
    },
    {
      status: "active",
    }
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, "Successfully rejected the swap proposal", swap)
    );
});

const cancelSwap = asyncHandler(async (req: Request, res: Response) => {
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
  if (!swap) throw new ApiError(404, "Swap not found");

  const receiver = await User.findById(swap.receiver);
  if (!receiver)
    throw new ApiError(400, "User that proposed the swap does not exist");

  if (swap.proposer.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to reject this swap");
  }

  if (swap.status !== "pending") {
    throw new ApiError(400, `This swap is already ${swap.status}`);
  }

  swap.status = "cancelled";
  await swap.save();

  await Notification.create({
    receiverId: user._id,
    type: "swap_cancelled",
    message: `${receiver.fullname} rejected your swap proposal for item: - ${
      (swap.proposedItemId as any).title
    }`,
  });

  await Item.findByIdAndUpdate(
    {
      _id: swap.proposedItemId,
    },
    {
      status: "inactive",
    }
  );

  await Item.findByIdAndUpdate(
    {
      _id: swap.receiveItemId,
    },
    {
      status: "inactive",
    }
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, "Successfully cancelled the swap proposal", swap)
    );
});

const completeSwap = asyncHandler(async (req: Request, res: Response) => {
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
  if (!swap) throw new ApiError(404, "Swap not found");

  const proposer = await User.findById(swap.proposer);
  if (!proposer)
    throw new ApiError(400, "User that proposed the swap does not exist");

  const isProposer = swap.proposer.toString() === userId.toString();
  const isReceiver = swap.receiver.toString() === userId.toString();

  if (!isProposer && !isReceiver) {
    throw new ApiError(403, "You are not authorized to complete this swap");
  }

  if (isProposer) {
    if (swap.proposerCompleted) {
      throw new ApiError(400, "You have already marked this as completed");
    }
    swap.proposerCompleted = true;
  }

  if (isReceiver) {
    if (swap.receiverCompleted) {
      throw new ApiError(400, "You have already marked this as completed");
    }
    swap.receiverCompleted = true;
  }

  const rewards: any[] = [];

  if (swap.proposerCompleted && swap.receiverCompleted) {
    swap.status = "completed";

    const proposerReward = await Points.create({
      userId: swap.proposer,
      type: "earned",
      amount: 15,
      meta: { reason: "swap" },
    });

    const receiverReward = await Points.create({
      userId: swap.receiver,
      type: "earned",
      amount: 15,
      meta: { reason: "swap" },
    });

    if (!proposerReward || !receiverReward) {
      throw new ApiError(500, "Failed to assign swap rewards");
    }

    rewards.push(
      {
        userId: swap.proposer,
        amount: proposerReward.amount,
        reason: proposerReward.meta?.reason,
        message: "Proposer earned 15 points for completing the swap",
      },
      {
        userId: swap.receiver,
        amount: receiverReward.amount,
        reason: receiverReward.meta?.reason,
        message: "Receiver earned 15 points for completing the swap",
      }
    );
  }

  await swap.save();

  await Notification.create({
    receiverId: user._id,
    type: "swap_completed",
    message: `Your swap with ${proposer.fullname} is successfully complete. You have also been awarded some points.`,
  });

  await Notification.create({
    receiverId: proposer._id,
    type: "swap_completed",
    message: `Your swap with ${user.fullname} is successfuly complete. You have also been awarded some points`,
  });

  await Item.findByIdAndUpdate(
    {
      _id: swap.proposedItemId,
    },
    {
      status: "sold",
    }
  );

  await Item.findByIdAndUpdate(
    {
      _id: swap.receiveItemId,
    },
    {
      status: "sold",
    }
  );

  res.status(200).json(
    new ApiResponse(200, "Swap updated successfully", {
      swap,
      rewards,
    })
  );
});

export {
  proposeSwap,
  getIncomingSwaps,
  getOutgoingSwaps,
  getAllSwaps,
  getSwapById,
  acceptSwap,
  rejectSwap,
  cancelSwap,
  completeSwap,
};
