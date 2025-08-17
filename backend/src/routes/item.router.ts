import { Router } from "express";
import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
  getUserItems,
} from "../controller/item.controller.ts";
import { upload } from "../middlewares/multer.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(verifyJWT);

router.post("/", upload.array("images", 5), createItem);
router.get("/", getAllItems);
router.get("/me", getUserItems);
router.get("/:itemId", getItemById);
router.put("/:itemId", upload.array("images", 5), updateItem);
router.delete("/:itemId", deleteItem);

export default router;
