import { z } from "zod";
import mongoose, { Document, Schema } from "mongoose";
import {
  RedemptionInputSchema,
  RedemptionStatusEnum,
} from "../../../common/schema/redemption.schema.ts";

type RedemptionInput = z.infer<typeof RedemptionInputSchema>;

interface RedemptionDocument extends RedemptionInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const redemptionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    pointsUsed: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: RedemptionStatusEnum.options,
    },
    confirmedBySender: {
      type: Boolean,
      default: false,
    },
    confirmedByReceiver: {
      type: Boolean,
      default: false,
    },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Redemption = mongoose.model<RedemptionDocument>(
  "Redemption",
  redemptionSchema
);

export default Redemption;
