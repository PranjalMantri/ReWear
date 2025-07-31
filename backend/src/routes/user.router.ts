import { Router } from "express";
import {
  signup,
  signin,
  logout,
  getCurrentUserDetails,
  refreshAccessToken,
  getUserDetails,
  updateUserProfilePicture,
  getUserItems,
  getUserPoints,
} from "../controller/user.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { upload } from "../middlewares/multer.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/refresh", refreshAccessToken);

router.use(verifyJWT);

router.get("/logout", logout);
router.get("/me", getCurrentUserDetails);
router.get("/me/items", getUserItems);
router.get("/me/points", getUserPoints);
router.put(
  "/profile-picture",
  upload.single("profile-picture"),
  updateUserProfilePicture
);
router.get("/:id", getUserDetails);

export default router;
