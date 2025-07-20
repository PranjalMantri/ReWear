import { Router } from "express";
import { signup, signin, logout } from "../controller/user.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.use(verifyJWT);

router.get("/logout", logout);

export default router;
