import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: integer().primaryKey().unique(),
    name: text(),
    description: text(),
    dateCreated: text("date_created").notNull(),
    dateUpdated: text("date_updated").notNull(),
    bucketUrl: text().notNull(),
    clerkUserId: text(),
    isPublicShared: integer({ mode: "boolean" }).default(false),
    publicShareExpiryDate: text(),
  },
  (t) => [
    index("user_idx").on(t.clerkUserId),
    index("post_idx").on(t.id),
    unique("unique_name").on(t.name, t.clerkUserId),
  ]
);

export type Posts = typeof posts.$inferInsert;
