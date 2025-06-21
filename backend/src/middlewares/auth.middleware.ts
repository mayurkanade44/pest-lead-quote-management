import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { serverConfig } from "../config";
import { UnauthorizedError, ForbiddenError } from "../utils/errors/app.error";
import { JwtPayload } from "../types/auth.type";
import logger from "../config/logger.config";
import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    throw new UnauthorizedError("Invalid authentication.");
  }

  try {
    const decoded = jwt.verify(
      authToken,
      serverConfig.JWT_SECRET
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      logger.error("User not found or account inactive.");
      throw new UnauthorizedError("Invalid authentication.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid authentication.");
    }
    next(error);
  }
};

export const isAuthorized = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      throw new ForbiddenError("Access denied. User role not found.");
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      throw new ForbiddenError(
        "You do not have permission to perform this action."
      );
    }

    next();
  };
};
