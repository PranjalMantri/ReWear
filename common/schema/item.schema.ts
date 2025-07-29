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

export const itemInputSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: CategoryEnum,
  gender: GenderEnum.optional(),
  size: SizeEnum,
  condition: ConditionEnum,
  tags: z.array(z.string()).optional().default([]),
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(0, "Price must be zero or more")
      .refine((val) => !isNaN(val), "Price must be a number")
  ),
  listingType: ListingTypeEnum,
  status: ItemStatusEnum.default("active"),
  color: z.string().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
});

export const itemUpdateSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters"),
  size: SizeEnum,
  condition: ConditionEnum,
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(0, "Price must be zero or more")
      .refine((val) => !isNaN(val), "Price must be a number")
  ),
});
