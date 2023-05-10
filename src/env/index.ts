import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development"]).default("development"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().nonempty(),
  JWT_SECRET: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_S3_ACCESS_KEY_ID: z.string(),
  AWS_S3_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_REGION: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
