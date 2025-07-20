import { Router } from "express";
import { signup } from "../controller/user.controller.ts";

const router = Router();

router.post("/signup", signup);

export default router;
