import { z } from "zod";

export const PointsTypeEnum = z.enum(["earned", "spent"]);

export const PointsReasonEnum = z.enum([
  "registration",
  "redemption",
  "swap",
  "listing",
]);
export type PointsReason = z.infer<typeof PointsReasonEnum>;

export const PointsReasonLabels: Record<PointsReason, string> = {
  registration: "Sign-up Bonus",
  redemption: "Item Redeemed",
  swap: "Swap Completed",
  listing: "Reward for listing your first item",
};

export const pointsInputSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  type: PointsTypeEnum,
  amount: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(0, "Amount must be 0 or more")
      .refine((val) => !isNaN(val), "Amount must be a number")
  ),
  meta: z.record(z.string(), PointsReasonEnum).optional(),
});
