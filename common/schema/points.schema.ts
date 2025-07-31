import { z } from "zod";

export const PointsTypeEnum = z.enum(["earned", "spent"]);

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
  meta: z.record(z.string(), z.any()).optional(),
});
