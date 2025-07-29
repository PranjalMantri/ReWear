import { Router } from "express";
import { proposeSwap } from "../controller/swap.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.get("/propose", proposeSwap);
export default router;
