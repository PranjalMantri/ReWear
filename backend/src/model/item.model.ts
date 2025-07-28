import mongoose, { Schema } from "mongoose";

enum Category {
  shirt = "shirt",
  tshirt = "tshirt",
  pant = "pant",
  jacket = "jacket",
  dress = "dress",
  accessories = "accessories",
  footwear = "footwear",
}

enum Gender {
  male = "male",
  female = "female",
  unisex = "unisex",
}

enum Size {
  small = "small",
  medium = "medium",
  large = "large",
  xlarge = "xlarge",
}

enum Condition {
  newWithTags = "new_with_tags",
  newWithoutTags = "new_without_tags",
  likeNew = "like_new",
  used = "used",
  gentlyUsed = "gently_used",
  good = "good",
  fair = "fair",
  poor = "poor",
}

enum ListingType {
  swap = "swap",
  redeem = "redeem",
  giveAway = "give_away",
}

enum ItemStatus {
  active = "active",
  inactive = "inactive",
  sold = "sold",
}

interface ItemInput {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  category: Category;
}

interface ItemDocument extends ItemInput, Document {}

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
      enum: Object.values(Category),
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    size: {
      type: String,
      enum: Object.values(Size),
      required: true,
    },
    condition: {
      type: String,
      enum: Object.values(Condition),
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
      enum: Object.values(ListingType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ItemStatus),
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
    this.listingType === ListingType.swap ||
    this.listingType === ListingType.giveAway
  ) {
    this.price = 0;
  }
  next();
});

const Item = mongoose.model<ItemDocument>("Item", itemSchema);

export default Item;
