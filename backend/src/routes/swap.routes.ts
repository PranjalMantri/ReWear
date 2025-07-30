import { Router } from "express";
import {
  getIncomingSwaps,
  getOutgoingSwaps,
  proposeSwap,
} from "../controller/swap.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.get("/propose", proposeSwap);
router.get("/incoming", getIncomingSwaps);
router.get("/outgoing", getOutgoingSwaps);

export default router;
