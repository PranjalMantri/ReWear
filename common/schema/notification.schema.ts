import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "points_awarded",
  "item_listed",
  "swap_proposed",
  "swap_accepted",
  "swap_rejected",
  "swap_cancelled",
  "swap_completed",
  "item_redeemed",
  "item_shipped",
  "item_received",
  "redemption_cancelled",
]);

export const notificationInputSchema = z.object({
  receiverId: z.string(),
  senderId: z.string().optional(),
  type: NotificationTypeEnum,
  resourceId: z.string().optional(),
  message: z.string(),
  isRead: z.boolean(),
});

export const notificationSchema = notificationInputSchema.extend({
  _id: z.string(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
});
