import mongoose, { Date, Document, Schema } from "mongoose";
import {
  SwapInputSchema,
  SwapStatusEnum,
} from "../../../common/schema/swap.schema.ts";
import { z } from "zod";

type SwapInput = z.infer<typeof SwapInputSchema>;

interface SwapDocument extends SwapInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const swapSchema = new Schema(
  {
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiveItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    status: {
      type: String,
      enum: SwapStatusEnum.options,
      default: "pending",
    },
    message: {
      type: String,
    },
    proposerCompleted: {
      type: Boolean,
      default: false,
    },
    receiverCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Swap = mongoose.model<SwapDocument>("Swap", swapSchema);

export default Swap;
