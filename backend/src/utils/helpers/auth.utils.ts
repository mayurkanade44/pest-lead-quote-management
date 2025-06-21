import jwt from "jsonwebtoken";
import { serverConfig } from "../../config";
import { JwtPayload } from "../../types/auth.type";
import { BadRequestError } from "../errors/app.error";



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
  if (!secret) throw new BadRequestError("JWT_SECRET is not set");

  const expiresInSeconds = timeStringToSeconds(serverConfig.JWT_EXPIRES_IN);
  return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
};
