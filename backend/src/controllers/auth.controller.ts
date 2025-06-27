import { Request, Response } from "express";
import { z } from "zod";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import * as authRepository from "../repositories/auth.repository";
import { getUserById } from "../repositories/user.repository";
import { NotFoundError } from "../utils/errors/app.error";
import { generateAuthToken } from "../utils/helpers/auth.utils";
import { loginSchema, setupPasswordSchema } from "../validators/auth.validator";

export const loginHandler = async (
  req: Request<{}, {}, z.infer<typeof loginSchema>>,
  res: Response
) => {
  const user = await authRepository.authenticateUser(req.body);

  const token = generateAuthToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const cookieMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: serverConfig.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: cookieMaxAge,
  });

  logger.info(`User ${user.email} logged in successfully`);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user },
  });
};

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie("authToken");
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const setupPasswordHandler = async (
  req: Request<{}, {}, z.infer<typeof setupPasswordSchema>>,
  res: Response
) => {
  await authRepository.setupPassword(req.body);

  res.status(200).json({
    success: true,
    message: "Password has been set up successfully.",
  });
};

export const getMeHandler = async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const userDetails = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };

  res.status(200).json({
    success: true,
    message: "User details retrieved successfully",
    data: { user: userDetails },
  });
};
