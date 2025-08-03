import { Router } from "express";
import {
  cancelRedemption,
  getAllRedemptions,
  getRedemptionById,
  markItemReceived,
  markItemShipped,
  redeemItem,
} from "../controller/redemption.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.post("/", redeemItem);
router.get("/", getAllRedemptions);
router.get("/:redemptionId", getRedemptionById);
router.get("/:redemptionId/mark-shipped", markItemShipped);
router.get("/:redemptionId/mark-received", markItemReceived);
router.get("/:redemptionId/cancel", cancelRedemption);

export default router;
