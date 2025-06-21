import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string({ message: "Password is required" })
    .min(5, { message: "Password must be at least 5 characters long" }),
});
