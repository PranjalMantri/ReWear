import mongoose, { Document, Schema } from "mongoose";
import {
  CategoryEnum,
  GenderEnum,
  SizeEnum,
  ConditionEnum,
  ListingTypeEnum,
  ItemStatusEnum,
  ItemInputSchema,
} from "../../../common/schema/item.schema.ts";
import { z } from "zod";

type ItemInput = z.infer<typeof ItemInputSchema>;

interface ItemDocument extends ItemInput, Document {
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
      unique: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
    },
    category: {
      type: String,
      enum: Object.values(CategoryEnum),
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
    },
    size: {
      type: String,
      enum: Object.values(SizeEnum),
      required: true,
    },
    condition: {
      type: String,
      enum: Object.values(ConditionEnum),
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
      enum: Object.values(ListingTypeEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ItemStatusEnum),
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
