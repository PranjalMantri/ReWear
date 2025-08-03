import { Router } from "express";
import {
  deleteNotification,
  getAllNotifications,
  getUnreadNotifications,
  markAllRead,
  markOneAsRead,
} from "../controller/notification.controller.ts";

const router = Router();

router.get("/", getAllNotifications);
router.get("/unread", getUnreadNotifications);
router.patch("/read", markAllRead);
router.get("/:notificationId", deleteNotification);
router.get("/:notificationId/read", markOneAsRead);

export default Router;
