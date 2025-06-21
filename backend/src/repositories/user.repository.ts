import crypto from "crypto";
import prisma from "../prisma/client";
import { Prisma } from "@prisma/client";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (userData: Prisma.UserCreateInput) => {
  const passwordToken = crypto.randomBytes(32).toString("hex");
  const passwordTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      passwordToken,
      passwordTokenExpiresAt,
    },
  });

  return newUser;
};
