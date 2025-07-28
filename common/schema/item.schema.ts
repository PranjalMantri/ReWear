import { z } from "zod";

export const CategoryEnum = z.enum([
  "shirt",
  "tshirt",
  "pant",
  "jacket",
  "dress",
  "accessories",
  "footwear",
]);

export const GenderEnum = z.enum(["male", "female", "unisex"]);

export const SizeEnum = z.enum(["small", "medium", "large", "xlarge"]);

export const ConditionEnum = z.enum([
  "new_with_tags",
  "new_without_tags",
  "like_new",
  "used",
  "gently_used",
  "good",
  "fair",
  "poor",
]);

export const ListingTypeEnum = z.enum(["swap", "redeem", "giveaway"]);

export const ItemStatusEnum = z.enum(["active", "inactive", "sold"]);

export const ItemInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: CategoryEnum,
  gender: GenderEnum.optional(),
  size: SizeEnum,
  condition: ConditionEnum,
  tags: z.array(z.string()).optional().default([]),
  price: z
    .number()
    .min(0, "Price must be zero or more")
    .refine((val) => !isNaN(val), "Price must be a number"),
  images: z.array(z.string()).optional().default([]),
  listingType: ListingTypeEnum,
  status: ItemStatusEnum.default("active"),
  color: z.string().optional(),
  brand: z.string().optional(),
});
