import { type Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
