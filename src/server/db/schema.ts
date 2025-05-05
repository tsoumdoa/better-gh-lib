import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: integer().primaryKey().unique(),
    name: text(),
    description: text(),
    dateCreated: text("date_created")
      .notNull()
      .default(sql`(current_timestamp)`),
    dateUpdated: text("date_updated")
      .notNull()
      .default(sql`(current_timestamp)`),
    bucketUrl: text().notNull(),
    clerkUserId: text(),
  },
  (table) => [
    index("user_idx").on(table.clerkUserId),
    index("post_idx").on(table.id),
  ]
);

export type Posts = typeof posts.$inferInsert;
