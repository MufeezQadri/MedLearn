import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().default("development-access-secret"),
  JWT_REFRESH_SECRET: z.string().default("development-refresh-secret"),
  POSTGRES_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/medlearn"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  OPENAI_API_KEY: z.string().optional(), // kept for backward compat
  GEMINI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
