import { Prisma, UserRole } from "@prisma/client";
import { Request, Response } from "express";
import * as userRepository from "../repositories/user.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors/app.error";
import { processImage, uploadImage } from "../utils/helpers/imageUpload.utils";
import fileUpload from "express-fileupload";
import { GetAllUsersQuery } from "../types/user.type";

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

export const updateUserProfileHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id; // Get user ID from authenticated user
  const role = req.user!.role;

  if (role !== UserRole.ADMIN && userId !== req.params.id) {
    throw new ForbiddenError("You are not authorized to update this user.");
  }

  const updatedUser = await userRepository.updateUserProfile(userId, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: updatedUser,
  });
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userRepository.getUserById(id);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  res.status(200).json({
    success: true,
    message: "User retrieved successfully.",
    data: user,
  });
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const query = req.query as GetAllUsersQuery;
  const result = await userRepository.getAllUsers(query);
  res.status(200).json({
    success: true,
    message: "Users retrieved successfully.",
    data: result,
  });
};

export const deactivateUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userRepository.deactivateUser(id);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  res.status(200).json({
    success: true,
    message: "User deactivated successfully.",
    data: user,
  });
};
