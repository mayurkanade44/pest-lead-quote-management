import { Prisma } from "@prisma/client";
import crypto from "crypto";
import prisma from "../prisma/client";
import { BadRequestError } from "../utils/errors/app.error";
import { GetAllUsersQuery } from "../types/user.type";

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

export const updateUserProfile = async (
  userId: string,
  data: Prisma.UserCreateInput
) => {
  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: userId },
      },
    });

    if (existingUser) {
      throw new BadRequestError("This email address is already in use.");
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      role: true,
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      profilePictureUrl: true,
      isActive: true,
    },
  });
};

export const getAllUsers = async (query: GetAllUsersQuery) => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (query.search) {
    where.fullName = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  if (query.role) {
    where.role = query.role;
  }

  if (query.isActive) {
    where.isActive = query.isActive === "true";
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const deactivateUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
    select: { id: true, isActive: true },
  });
};
