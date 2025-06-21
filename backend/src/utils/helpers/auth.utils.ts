import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serverConfig } from "../../config";
import prisma from "../../prisma/client";
import { JwtPayload, LoginInput } from "../../types/auth.type";
import { UnauthorizedError } from "../errors/app.error";

export const authenticateUser = async (loginData: LoginInput) => {
  const { email, password } = loginData;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.password || !user.isActive) {
    throw new UnauthorizedError("Invalid credentials or inactive account");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

const timeStringToSeconds = (timeStr: string): number => {
  const num = parseInt(timeStr.slice(0, -1), 10);
  const unit = timeStr.slice(-1);
  if (isNaN(num)) return 604800; // Default to 7 days in seconds
  switch (unit) {
    case "d":
      return num * 24 * 60 * 60;
    case "h":
      return num * 60 * 60;
    case "m":
      return num * 60;
    default:
      return num;
  }
};

export const generateAuthToken = (payload: JwtPayload): string => {
  const secret = serverConfig.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  const expiresInSeconds = timeStringToSeconds(serverConfig.JWT_EXPIRES_IN);
  return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
};
