import { Request } from "express";
import multer from "multer";
import storage from "./cloudinary.ts";

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only .png, .jpeg and .webp file formats are allowed") as any,
        false
      );
    }
  },
});
