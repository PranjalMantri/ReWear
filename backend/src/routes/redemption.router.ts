import { Router } from "express";
import { getAllRedemptions } from "../controller/redemption.controller.ts";

const router = Router();

router.get("/outgoing", getAllRedemptions);

export default router;
