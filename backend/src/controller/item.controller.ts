import { Request, Response } from "express";
import { asyncHandler } from "../util/asyncHandler.ts";
import {
  itemInputSchema,
  itemUpdateSchema,
} from "../../../common/schema/item.schema.ts";
import ApiError from "../util/ApiError.ts";
import Item from "../model/item.model.ts";
import ApiResponse from "../util/ApiResponse.ts";
import mongoose from "mongoose";
import { deleteImage } from "../util/deleteImage.ts";
import User from "../model/user.model.ts";

type UploadedCloudinaryFile = {
  path: string;
  filename: string;
  [key: string]: any;
};

const createItem = asyncHandler(async (req: Request, res: Response) => {
  const images = req.files as UploadedCloudinaryFile[] | undefined;
  console.log(images);
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

  const validatedData = itemInputSchema.safeParse(data);

  if (!validatedData.success) {
    throw new ApiError(
      401,
      "Invalid input",
      validatedData.error.flatten().fieldErrors
    );
  }

  const imageUrls = images.map((image: UploadedCloudinaryFile) => image.path);

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

  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Invalid page or limit");
  }

  const skip = (page - 1) * limit;

  const { category, condition, size, gender, search, tags } = req.query;

  const filters: any = {
    status: "active",
  };

  if (category) filters.category = category;
  if (condition) filters.condition = condition;
  if (size) filters.size = size;
  if (gender) filters.gender = gender;

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

    // Only include search-based tag matching if tags weren't already filtered
    if (!tags) {
      orConditions.push({ tags: { $in: [search.toString()] } });
    }

    filters.$or = orConditions;
  }

  const items = await Item.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalItems = await Item.countDocuments(filters);
  const totalPages = Math.ceil(totalItems / limit);

  if (totalItems === 0) {
    return res.status(200).json(
      new ApiResponse(200, "No items found", {
        items: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          limit,
        },
      })
    );
  }

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

const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId;

  if (!itemId) {
    throw new ApiError(404, "Invalid item id");
  }

  const item = await Item.findById(itemId);

  if (!item) {
    throw new ApiError(500, "Something went wrong while fetching the item");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Successfuly fetched item using ID", item));
});

const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId;
  const validatedData = itemUpdateSchema.safeParse(req.body);

  if (!req?.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!itemId) {
    throw new ApiError(404, "Invalid item id");
  }

  const existingItem = await Item.findById(itemId);

  if (!existingItem) {
    throw new ApiError(500, "Something went wrong while fetching the item");
  }

  if (!existingItem.userId.equals(userId)) {
    throw new ApiError(
      404,
      "User does not have the permission to update the item"
    );
  }

  if (!validatedData.success) {
    throw new ApiError(
      400,
      "Invalid data",
      validatedData.error.flatten().fieldErrors
    );
  }

  // get the old images that user wants to keep from frontend
  // get the new images that user uploaded
  // get their urls and create a combined array of old and new images
  // store this in the db
  // get the deleted images url and actually delete them from cloudinary

  const keepImages: string[] = req.body.keepImages
    ? Array.isArray(req.body.keepImages)
      ? req.body.keepImages
      : [req.body.keepImages]
    : [];

  const newImages = (req.files as UploadedCloudinaryFile[] | undefined) || [];
  const uploadedImages = newImages.map(
    (image: UploadedCloudinaryFile) => image.path
  );

  const finalImageList = [...keepImages, ...uploadedImages];

  if (finalImageList.length > 5) {
    throw new ApiError(400, "Max 5 images are allowed per item");
  }

  const removedImages = existingItem.images.filter(
    (img: string) => !keepImages.includes(img)
  );

  for (const url of removedImages) {
    await deleteImage(url);
  }

  const item = await Item.findByIdAndUpdate(
    itemId,
    {
      description: validatedData.data.description || existingItem.description,
      condition: validatedData.data.condition || existingItem.condition,
      size: validatedData.data.size || existingItem.size,
      price: validatedData.data.price || existingItem.price,
      images: [...finalImageList],
    },
    {
      new: true,
    }
  );

  res.status(201).json(new ApiResponse(201, "Updated item successfuly", item));
});

const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId;

  if (!req?.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (!itemId) {
    throw new ApiError(404, "Invalid item id");
  }

  const existingItem = await Item.findOne({
    _id: itemId,
    status: "active",
  });

  if (!existingItem) {
    throw new ApiError(500, "Could not find an item");
  }

  if (!existingItem.userId.equals(userId)) {
    throw new ApiError(404, "User is not permitted to delete the item");
  }

  const deletedItem = await Item.findByIdAndDelete(existingItem._id);

  if (!deletedItem) {
    throw new ApiError(500, "Something went wrong while deleting an item");
  }

  for (const url of existingItem.images) {
    await deleteImage(url);
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Deleted item successfuly", deletedItem));
});

export { createItem, getAllItems, getItemById, updateItem, deleteItem };
