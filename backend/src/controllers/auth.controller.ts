import { Request, Response } from "express";
import logger from "../config/logger.config";
import { authenticateUser, generateAuthToken } from "../utils/helpers/auth.utils";
import { LoginInput } from "../types/auth.type";
import { serverConfig } from "../config";

export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  const user = await authenticateUser(req.body);

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
