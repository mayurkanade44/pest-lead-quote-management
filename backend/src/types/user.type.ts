import { z } from "zod";
import { createUserSchema } from "../validators/user.validator";

export type CreateUserInput = z.infer<typeof createUserSchema>;
