import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { Redis } from "@upstash/redis";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
  upstashRedis: Redis | undefined;
};

const client =
  globalForDb.client ??
  createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

export const radis =
  globalForDb.upstashRedis ??
  new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.client = client;
  globalForDb.upstashRedis = radis;
}

export const db = drizzle(client, { schema });
