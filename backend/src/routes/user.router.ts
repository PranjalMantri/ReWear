import { Router } from "express";
import { signup, signin } from "../controller/user.controller.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
