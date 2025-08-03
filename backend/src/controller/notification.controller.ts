import Notification from "../model/notification.model.ts";
import User from "../model/user.model.ts";
import ApiError from "../util/ApiError.ts";
import ApiResponse from "../util/ApiResponse.ts";
import { asyncHandler } from "../util/asyncHandler.ts";
import { Request, Response } from "express";

const getAllNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const notifications = await Notification.find({ receiverId: userId });

    if (notifications.length === 0) {
      throw new ApiError(404, "User has no notifications");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Successfully fetched all user notifications",
          notifications
        )
      );
  }
);

const getUnreadNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const notifications = await Notification.find({
      receiverId: userId,
      isRead: false,
    });

    if (notifications.length === 0) {
      throw new ApiError(404, "User has no unread notifications");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Successfully fetched all user unread notifications",
          notifications
        )
      );
  }
);

const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { notificationIds } = req.body;

  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    throw new ApiError(400, "Notification IDs are required");
  }

  const updated = await Notification.updateMany(
    {
      receiverId: userId,
      _id: { $in: notificationIds },
    },
    {
      $set: { isRead: true },
    }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Marked ${updated.modifiedCount} notifications as read`,
        null
      )
    );
});

const markOneAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { notificationId } = req.params;

  const existingNotification = await Notification.findById(notificationId);
  if (!existingNotification) throw new ApiError(400, "No such notification");

  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      isRead: true,
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully marked notification as read",
        notification
      )
    );
});

const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { notificationId } = req.params;

  const existingNotification = await Notification.findById(notificationId);
  if (!existingNotification) throw new ApiError(400, "No such notification");

  await Notification.findByIdAndDelete(notificationId);

  res
    .status(200)
    .json(new ApiResponse(200, "Successfully deleted the notification", null));
});

export {
  getAllNotifications,
  getUnreadNotifications,
  markOneAsRead,
  deleteNotification,
  markAllRead,
};
