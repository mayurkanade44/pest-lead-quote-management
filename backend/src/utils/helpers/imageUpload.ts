import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { serverConfig } from "../../config";
import logger from "../../config/logger.config";
import { BadRequestError, InternalServerError } from "../errors/app.error";
import fileUpload from "express-fileupload";

// Configure Cloudinary
cloudinary.config({
  cloud_name: serverConfig.CLOUDINARY_CLOUD_NAME,
  api_key: serverConfig.CLOUDINARY_API_KEY,
  api_secret: serverConfig.CLOUDINARY_API_SECRET,
});

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`profile-pics/${publicId}`);
    }
  } catch (error) {
    logger.error("Error deleting image:", error);
  }
};

export const processImage = async (file: fileUpload.UploadedFile) => {
  if (typeof file !== "object") {
    throw new BadRequestError("Only one image is allowed");
  }

  if (!file.tempFilePath) {
    throw new BadRequestError("No file provided");
  }

  if (!file.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image");
  }

  const fileSize: number = 5 * 1024 * 1024; // 5MB limit

  if (file.size > fileSize) {
    throw new BadRequestError(
      "File size is too large. Maximum size allowed is 5MB."
    );
  }
};

export const uploadImage = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      folder,
      quality: 80,
      resource_type: "image",
      public_id: `profile_${Date.now()}`,
    });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    logger.error("Cloud Upload", error);
    throw new InternalServerError("Failed to upload image");
  }
};
