import mongoose, { Document, mongo, Schema } from "mongoose";
import { z } from "zod";
import {
  pointsInputSchema,
  PointsReasonEnum,
  PointsTypeEnum,
} from "../../../common/schema/points.schema.ts";

type PointsInput = z.infer<typeof pointsInputSchema>;

interface PointsDocument extends PointsInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const pointsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: PointsTypeEnum.options,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    meta: { type: String, enum: PointsReasonEnum.options },
  },
  { timestamps: true }
);

const Points = mongoose.model<PointsDocument>("Points", pointsSchema);

export default Points;
