import { Request, Response } from "express";
import { asyncHandler } from "../util/asyncHandler.ts";
import { ItemInputSchema } from "../../../common/schema/item.schema.ts";
import ApiError from "../util/ApiError.ts";
import Item from "../model/item.model.ts";
import ApiResponse from "../util/ApiResponse.ts";

const createItem = asyncHandler(async (req: Request, res: Response) => {
  const images = req.files as Express.Multer.File[] | undefined;
  const data = {
    ...req.body,
    tags: req.body.tags
      ? req.body.tags.split(",").map((tag: string) => tag.trim())
      : [],
  };

  if (!Array.isArray(images)) {
    throw new ApiError(400, "Invalid image upload");
  }

  if (images.length === 0) {
    throw new ApiError(400, "At least one image is required to create an item");
  }

  if (images.length > 5) {
    throw new ApiError(400, "You can upload a maximum of 5 images");
  }

  const validatedData = ItemInputSchema.safeParse(data);

  if (!validatedData.success) {
    throw new ApiError(
      401,
      "Invalid input",
      validatedData.error.flatten().fieldErrors
    );
  }

  const imageUrls = images.map((image) => image.path);

  const dbdata = {
    userId: req?.user?._id,
    ...validatedData.data,
    images: imageUrls,
  };

  const item = await Item.create(dbdata);

  if (!item) {
    throw new ApiError(500, "Something went wrong while listing an item");
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Successfuly uploaded an item", item));
});

export { createItem };
