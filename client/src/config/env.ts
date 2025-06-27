import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url("API_BASE_URL must be a valid URL"),
  VITE_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(import.meta.env);
} catch (error) {
  console.error("❌ Invalid environment variables:", error);
  throw new Error(
    "Invalid environment configuration. Please check your .env file."
  );
}

export { env };
