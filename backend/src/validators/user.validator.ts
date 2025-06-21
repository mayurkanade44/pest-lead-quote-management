import { z } from "zod";
import { UserRole } from "@prisma/client";

export const createUserSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  address: z.string().min(1, { message: "Address is required" }),
  role: z.nativeEnum(UserRole, {
    message: "Role is required",
  }),
});
