import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";
import {
  notificationInputSchema,
  NotificationTypeEnum,
} from "../../../common/schema/notification.schema.ts";

type NotificationInput = z.infer<typeof notificationInputSchema>;

interface NotificationDocument extends NotificationInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updateAt: Date;
}

const notificationSchema = new Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: NotificationTypeEnum.options,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema
);

export default Notification;
