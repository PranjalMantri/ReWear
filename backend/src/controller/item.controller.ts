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

const getAllItems = asyncHandler(async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1;
  const limit = Number.parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;

  const { category, condition, size, gender, search, tags } = req.query;

  const filters: any = {
    status: "active",
  };

  if (category) filters.category = category;
  if (category) filters.condition = condition;
  if (category) filters.size = size;
  if (category) filters.gender = gender;

  if (tags) {
    const tagsArray = Array.isArray(tags)
      ? tags
      : tags
          .toString()
          .split(",")
          .map((tag: string) => tag.trim());

    filters.tags = { $in: tagsArray };
  }

  if (search) {
    const orConditions: any = [{ name: { $regex: search, $options: "i" } }];

    if (!tags) {
      orConditions.push({ tags: { $in: [search.toString()] } });
    }

    filters.$or = orConditions;
  }

  const items = await Item.find().skip(skip).limit(limit);

  const totalItems = await Item.countDocuments(filters);
  const totalPages = Math.ceil(totalItems / limit);

  const itemResponse = {
    items,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };

  res
    .status(200)
    .json(new ApiResponse(200, "Successfuly fetched items", itemResponse));
});

export { createItem, getAllItems };
