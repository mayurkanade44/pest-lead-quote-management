import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../prisma/client";
import {
  BadRequestError,
  UnauthorizedError
} from "../utils/errors/app.error";
import { loginSchema, setupPasswordSchema } from "../validators/auth.validator";

export const authenticateUser = async (
  loginData: z.infer<typeof loginSchema>
) => {
  const { email, password } = loginData;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password || !user.isActive) {
    throw new UnauthorizedError("Invalid credentials");
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

export const setupPassword = async (
  input: z.infer<typeof setupPasswordSchema>
) => {
  const { passwordToken, password } = input;

  const user = await prisma.user.findFirst({
    where: { passwordToken },
  });

  if (!user) {
    throw new BadRequestError("Invalid password reset token.");
  }

  if (
    !user.passwordTokenExpiresAt ||
    user.passwordTokenExpiresAt < new Date()
  ) {
    throw new BadRequestError("Password reset token has expired.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordToken: null,
      passwordTokenExpiresAt: null,
      isActive: true,
    },
  });
};
