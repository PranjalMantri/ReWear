import { z } from "zod";

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
  receiveItemId: z.string().trim().min(1, "receiver item id is required"),
  status: SwapStatusEnum.default("pending"),
  message: z.string().optional(),
  proposerCompleted: z.boolean().optional().default(false),
  receiverCompleted: z.boolean().optional().default(false),
});
