import { z } from "zod";
import { itemSchema } from "./item.schema.ts";

export const SwapStatusEnum = z.enum([
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "completed",
]);

export const SwapInputSchema = z.object({
  proposer: z.string().trim().min(1, "Swap proposer Id is required"),
  proposedItemId: z.string().trim().min(1, "Proposed item id is required"),
  receiver: z.string().min(1, "Swap receiver Id is required"),
  receivedItemId: z.string().trim().min(1, "receiver item id is required"),
  status: SwapStatusEnum.default("pending"),
  message: z.string().optional(),
  proposerCompleted: z.boolean().optional().default(false),
  receiverCompleted: z.boolean().optional().default(false),
});

export const swapSchema = SwapInputSchema.extend({
  _id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  proposer: z
    .object({
      _id: z.string(),
      fullname: z.string(),
      email: z.string().email(),
    })
    .optional(),
  receiver: z
    .object({
      _id: z.string(),
      fullname: z.string(),
      email: z.string().email(),
    })
    .optional(),
  proposedItemId: z.union([z.string(), itemSchema]),
  receivedItemId: z.union([z.string(), itemSchema]),
}).loose();
