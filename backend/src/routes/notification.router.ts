import { Router } from "express";
import {
  deleteNotification,
  getAllNotifications,
  getUnreadNotifications,
  markAllRead,
  markOneAsRead,
} from "../controller/notification.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllNotifications);
router.get("/unread", getUnreadNotifications);
router.patch("/read", markAllRead);
router.delete("/:notificationId", deleteNotification);
router.patch("/:notificationId/read", markOneAsRead);

export default router;
