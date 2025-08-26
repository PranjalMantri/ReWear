import { z } from "zod";
import { itemSchema } from "./item.schema.ts";

export const RedemptionStatusEnum = z.enum([
  "pending",
  "completed",
  "cancelled",
]);

export const RedemptionInputSchema = z.object({
  userId: z.string(),
  itemId: z.string(),
  pointsUsed: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().min(0, "Points used must be at least 0 or more")
  ),
  status: RedemptionStatusEnum,
  confirmedBySender: z.boolean().optional().default(false),
  confirmedByReceiver: z.boolean().optional().default(false),
});

export const redemptionSchema = RedemptionInputSchema.extend({
  _id: z.string(),
  userId: z
    .object({
      _id: z.string(),
      fullname: z.string(),
      email: z.string().email(),
    })
    .optional(),
  itemId: itemSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).loose();
