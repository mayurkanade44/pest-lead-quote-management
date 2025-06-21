import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import multer from "multer";
import { Readable } from "stream";
import { BadRequestError, InternalServerError } from "../errors/app.error";
import { serverConfig } from "../../config";
import logger from "../../config/logger.config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: serverConfig.CLOUDINARY_CLOUD_NAME,
  api_key: serverConfig.CLOUDINARY_API_KEY,
  api_secret: serverConfig.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (
  buffer: Buffer,
  options: any = {}
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "pest-leadquotation/profile-pics",
        quality: 50,
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// Function to process multipart data and extract both file and body fields
export const processMultipartData = (req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
    upload.single("profilePicture")(req, {} as any, (error: any) => {
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          reject(
            new BadRequestError("File too large. Maximum size allowed is 5MB.")
          );
        } else if (error.message === "Only image files are allowed") {
          reject(
            new BadRequestError(
              "Only image files are allowed (jpg, jpeg, png, gif, webp)."
            )
          );
        } else {
          reject(new BadRequestError(`File upload error: ${error.message}`));
        }
      } else {
        // req.body and req.file are now populated by multer
        resolve();
      }
    });
  });
};

// Function to process file upload from request
// export const processFileUpload = (
//   req: Request,
//   fileName: string
// ): Promise<Express.Multer.File | null> => {
//   return new Promise((resolve, reject) => {
//     upload.single(fileName)(req, {} as any, (error: any) => {
//       if (error) {
//         if (error.code === "LIMIT_FILE_SIZE") {
//           reject(
//             new BadRequestError("File too large. Maximum size allowed is 5MB.")
//           );
//         } else if (error.message === "Only image files are allowed") {
//           reject(
//             new BadRequestError(
//               "Only image files are allowed (jpg, jpeg, png, gif, webp)."
//             )
//           );
//         } else {
//           reject(new BadRequestError(`File upload error: ${error.message}`));
//         }
//       } else {
//         resolve(req.file || null);
//       }
//     });
//   });
// };

// Main upload function
export const uploadImageToCloudinary = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!file) {
    throw new BadRequestError("No file provided");
  }

  try {
    const result = await uploadToCloudinary(file.buffer, {
      public_id: `profile_${Date.now()}`,
    });

    return result.secure_url;
  } catch (error) {
    throw new InternalServerError(`Image upload failed: ${error}`);
  }
};

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
