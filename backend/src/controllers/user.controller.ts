import { Request, Response } from "express";
import logger from "../config/logger.config";
import * as userRepository from "../repositories/user.repository";
import { CreateUserInput } from "../types/user.type";
import { uploadImageToCloudinary } from "../utils/helpers/imageUpload";
import { BadRequestError } from "../utils/errors/app.error";
import { Prisma } from "@prisma/client";

export const addUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  const existingUser = await userRepository.findUserByEmail(req.body.email);
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  let profilePictureUrl: string | undefined;

  if (req.file) {
    logger.info("Profile picture found, uploading to Cloudinary");
    profilePictureUrl = await uploadImageToCloudinary(req.file);
    logger.info(`Profile picture uploaded successfully: ${profilePictureUrl}`);
  }

  const userData: Prisma.UserCreateInput & { profilePictureUrl?: string } = {
    ...req.body,
    ...(profilePictureUrl && { profilePictureUrl }),
  };

  await userRepository.createUser(userData);

  res.status(201).json({
    message: "User created successfully",
  });
};
