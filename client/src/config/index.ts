import { env } from "./env";

export const config = {
  API_BASE_URL: env.VITE_API_BASE_URL,
  APP_ENV: env.VITE_APP_ENV,
  IS_DEV: env.VITE_APP_ENV === "development",
  IS_STAGING: env.VITE_APP_ENV === "staging",
  IS_PROD: env.VITE_APP_ENV === "production",
  ENABLE_DEVTOOLS: env.VITE_ENABLE_DEVTOOLS,
} as const;
