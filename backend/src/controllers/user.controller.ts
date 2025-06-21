import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import * as userRepository from "../repositories/user.repository";
import { BadRequestError } from "../utils/errors/app.error";
import { processImage, uploadImage } from "../utils/helpers/imageUpload.utils";
import fileUpload from "express-fileupload";

export const addUserHandler = async (
  req: Request<{}, {}, Prisma.UserCreateInput>,
  res: Response
) => {
  const existingUser = await userRepository.findUserByEmail(req.body.email);
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  if (!req.body.profilePictureUrl || req.body.profilePictureUrl.length <= 10) {
    req.body.profilePictureUrl =
      "https://res.cloudinary.com/dv3uzwxy6/image/upload/v1750505737/pest-leadquotation/profile-pics/profile_1750505735431.png";
  }

  await userRepository.createUser(req.body);

  res.status(201).json({
    message: "User created successfully",
  });
};

export const uploadProfilePictureHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.files || !req.files.profilePicture) {
    throw new BadRequestError("No file provided");
  }

  const file = req.files.profilePicture as fileUpload.UploadedFile;
  await processImage(file);
  const profilePictureUrl = await uploadImage(
    file.tempFilePath,
    "pest-leadquotation/profile-pics"
  );
  res.status(200).json({
    message: "Profile picture uploaded successfully",
    profilePictureUrl,
  });
};
