import { Router } from "express";
import {
  cancelRedemption,
  getAllRedemptions,
  getRedemptionById,
  markItemReceived,
  markItemShipped,
  redeemItem,
  getItemRedemptionDetails,
} from "../controller/redemption.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.post("/:itemId", redeemItem);
router.get("/:itemId", getItemRedemptionDetails);
router.get("/", getAllRedemptions);
router.get("/:redemptionId", getRedemptionById);
router.put("/:redemptionId/mark-shipped", markItemShipped);
router.put("/:redemptionId/mark-received", markItemReceived);
router.put("/:redemptionId/cancel", cancelRedemption);

export default router;
