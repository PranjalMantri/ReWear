import { z } from "zod";

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
  confirmedByReceiever: z.boolean().optional().default(false),
});
