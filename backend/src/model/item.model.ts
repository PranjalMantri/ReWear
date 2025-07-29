import mongoose, { Document, Schema } from "mongoose";
import {
  CategoryEnum,
  GenderEnum,
  SizeEnum,
  ConditionEnum,
  ListingTypeEnum,
  ItemStatusEnum,
  itemInputSchema,
} from "../../../common/schema/item.schema.ts";
import { z } from "zod";

type ItemInput = z.infer<typeof itemInputSchema>;

interface ItemInputI extends ItemInput {
  userId: mongoose.Types.ObjectId;
}

interface ItemDocument extends ItemInputI, Document {
  _id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
    },
    category: {
      type: String,
      enum: CategoryEnum.options,
      required: true,
    },
    gender: {
      type: String,
      enum: GenderEnum.options,
    },
    size: {
      type: String,
      enum: SizeEnum.options,
      required: true,
    },
    condition: {
      type: String,
      enum: ConditionEnum.options,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    listingType: {
      type: String,
      enum: ListingTypeEnum.options,
      required: true,
    },
    status: {
      type: String,
      enum: ItemStatusEnum.options,
      default: "active",
    },
    color: {
      type: String,
    },
    brand: {
      type: String,
    },
  },
  { timestamps: true }
);

itemSchema.pre("save", function (next) {
  if (
    this.listingType === ListingTypeEnum.def.entries.swap ||
    this.listingType === ListingTypeEnum.def.entries.giveaway
  ) {
    this.price = 0;
  }
  next();
});

const Item = mongoose.model<ItemDocument>("Item", itemSchema);

export default Item;
