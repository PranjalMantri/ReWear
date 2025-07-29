import { Router } from "express";
import { createItem, getAllItems } from "../controller/item.controller.ts";
import { upload } from "../middlewares/multer.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.post("/", upload.array("images", 5), createItem);
router.get("/", getAllItems);

export default router;
