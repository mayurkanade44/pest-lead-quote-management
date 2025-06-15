import { z } from "zod";

export const pingSchema = z.object({
  message: z
    .string({message:"message is requried"})
    .min(1, "Message should be at least 1 character long"),
});
