import React, { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import {
  CategoryEnum,
  SizeEnum,
  ConditionEnum,
  GenderEnum,
  ListingTypeEnum,
  itemInputSchema,
} from "../../../common/schema/item.schema";
import Input from "../components/UI/Input";
import useItemStore from "../store/item.store";

type FormSchemaType = z.infer<typeof itemInputSchema>;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-sm font-medium text-red-500 mt-1">{message}</p>;
};

const ListItemPage = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const navigate = useNavigate();

  const { createItem, isLoading, error } = useItemStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemInputSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      category: undefined,
      gender: undefined,
      size: undefined,
      condition: undefined,
      listingType: undefined,
      price: 0,
      images: [],
    },
  });

  const [tagInput, setTagInput] = useState("");
  const watchedTags = watch("tags");

  useEffect(() => {
    setTagInput(watchedTags?.join(", ") || "");
  }, [watchedTags]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setTagInput(inputValue);
    setValue(
      "tags",
      inputValue.split(",").map((tag: string) => tag.trim())
    );
  };

  const watchedListingType = watch("listingType");
  const isSellListing = watchedListingType === "redeem";
  const watchedImages = watch("images");

  const format = (str: string) => {
    const title = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return title.replaceAll("_", " ");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const currentFiles = watchedImages || [];
    const totalFiles = currentFiles.length + files.length;
    if (totalFiles > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    const newFiles = [...currentFiles, ...files];
    const updatedFiles = newFiles.map((file) =>
      typeof file === "string" ? file : file
    );
    setValue("images", updatedFiles, { shouldValidate: true });

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedFiles = (watchedImages || []).filter(
      (_, i) => i !== indexToRemove
    );
    setValue("images", updatedFiles, { shouldValidate: true });

    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("tags", data.tags.join(", "));
    formData.append("category", data.category);

    formData.append("size", data.size);
    formData.append("condition", data.condition);
    formData.append("listingType", data.listingType);

    if (data.gender) {
      formData.append("gender", data.gender);
    }

    if (data.listingType === "redeem" && data.price !== undefined) {
      formData.append("price", String(data.price));
    }

    const imagesToUpload = data.images.filter((img) => typeof img !== "string");
    imagesToUpload.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await createItem(formData);
      navigate("/");
    } catch (err) {
      console.error("Failed to list item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 text-slate-800 font-sans px-4 sm:px-6 lg:px-8">
      <main className="flex justify-center py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-4xl space-y-8 bg-white/80 p-8 rounded-2xl"
        >
          <h1 className="text-2xl font-bold mb-4">List an Item</h1>
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <FieldError message={errors.images?.message as string} />
          </div>
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 rounded-lg border border-dashed border-slate-300">
              {imagePreviews.map((src, index) => (
                <div key={src} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="rounded-lg object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Title"
                  placeholder="e.g. Summer dress"
                  inputClassName="p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  labelClassName="block text-sm font-medium text-slate-700"
                />
              )}
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe your item"
              rows={4}
              className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <FieldError message={errors.description?.message} />
          </div>
          <div>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Tags"
                  placeholder="e.g. summer, dress, floral (comma-separated)"
                  inputClassName="p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  labelClassName="block text-sm font-medium text-slate-700"
                  value={tagInput}
                  onChange={handleTagsChange}
                />
              )}
            />
            <FieldError message={errors.tags?.message} />
          </div>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                {...register("category")}
                className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Category</option>
                {CategoryEnum.options.map((o) => (
                  <option key={o} value={o}>
                    {format(o)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.category?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              <select
                {...register("gender")}
                className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Gender</option>
                {GenderEnum.options.map((o) => (
                  <option key={o} value={o}>
                    {format(o)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.gender?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Size
              </label>
              <select
                {...register("size")}
                className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Size</option>
                {SizeEnum.options.map((o) => (
                  <option key={o} value={o}>
                    {format(o)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.size?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Condition
              </label>
              <select
                {...register("condition")}
                className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Condition</option>
                {ConditionEnum.options.map((o) => (
                  <option key={o} value={o}>
                    {format(o)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.condition?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Listing Type
              </label>
              <select
                {...register("listingType")}
                className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select Listing Type</option>
                {ListingTypeEnum.options.map((o) => (
                  <option key={o} value={o}>
                    {format(o)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.listingType?.message} />
            </div>
            <div>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Price (only for Selling)"
                    type="number"
                    placeholder="0"
                    {...({ disabled: !isSellListing } as any)}
                    inputClassName={clsx(
                      "p-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500",
                      !isSellListing && "bg-slate-100 cursor-not-allowed"
                    )}
                    labelClassName="block text-sm font-medium text-slate-700"
                  />
                )}
              />
              <FieldError message={errors.price?.message} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition duration-300 disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Listing..." : "List Item"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ListItemPage;
