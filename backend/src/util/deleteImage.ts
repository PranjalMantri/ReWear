import { v2 as cloudinary } from "cloudinary";

function extractPublicIdFromUrl(url: string): string {
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split(".")[0];

  return `item-images/${publicId}`;
}

export const deleteImage = async (imageUrl: string) => {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);

    const response = await cloudinary.uploader.destroy(publicId);

    if (response.result == "ok" || response.result == "not found") {
      return true;
    }

    return false;
  } catch (error) {
    console.log("Error deleting image: ", error);
    return false;
  }
};
