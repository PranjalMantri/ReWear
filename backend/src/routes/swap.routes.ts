import { Router } from "express";
import {
  getAllSwaps,
  getIncomingSwaps,
  getOutgoingSwaps,
  getSwapById,
  proposeSwap,
} from "../controller/swap.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllSwaps);
router.get("/propose", proposeSwap);
router.get("/incoming", getIncomingSwaps);
router.get("/outgoing", getOutgoingSwaps);
router.get("/:swapId", getSwapById);

export default router;
