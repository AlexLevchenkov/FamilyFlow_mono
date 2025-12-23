import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3000),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  ACCESS_SECRET: z.string().min(128),
  REFRESH_SECRET: z.string().min(128),
  PREVIOUS_ACCESS_SECRET: z.string().min(128).optional(),
  PREVIOUS_REFRESH_SECRET: z.string().min(128).optional(),
  ACCESS_EXPIRES_IN: z.string().default("15"),
  REFRESH_EXPIRES_IN: z.string().default("30"),
  LAST_ROTATION: z.coerce.date().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export default parsed.data;
