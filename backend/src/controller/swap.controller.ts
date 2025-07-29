import { SwapInputSchema } from "../../../common/schema/swap.schema.ts";
import Swap from "../model/swaps.model.ts";
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

export { proposeSwap };
