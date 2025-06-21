import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
});

export const setupPasswordSchema = z.object({
  passwordToken: z.string().min(1, { message: "Password token is required" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
});
