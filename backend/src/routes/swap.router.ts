import { Router } from "express";
import {
  acceptSwap,
  getAllSwaps,
  getIncomingSwaps,
  getOutgoingSwaps,
  getSwapById,
  proposeSwap,
  rejectSwap,
  cancelSwap,
  completeSwap,
  getItemSwapDetails,
} from "../controller/swap.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllSwaps);
router.post("/propose", proposeSwap);
router.get("/incoming", getIncomingSwaps);
router.get("/outgoing", getOutgoingSwaps);
router.get("/:itemId", getItemSwapDetails);
router.get("/:swapId", getSwapById);
router.put("/:swapId/accept", acceptSwap);
router.put("/:swapId/reject", rejectSwap);
router.put("/:swapId/cancel", cancelSwap);
router.put("/:swapId/complete", completeSwap);

export default router;
