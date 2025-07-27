import { Router } from "express";
import {
  signup,
  signin,
  logout,
  getCurrentUserDetails,
  refreshAccessToken,
  getUserDetails,
} from "../controller/user.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/refresh", refreshAccessToken);

router.use(verifyJWT);

router.get("/logout", logout);
router.get("/me", getCurrentUserDetails);
router.get("/:id", getUserDetails);

export default router;
