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
    tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  },
  (t) => [
    index("user_idx").on(t.clerkUserId),
    index("post_idx").on(t.id),
    index("post_name_idx").on(t.name),
    index("date_updated_idx").on(t.dateUpdated),
    index("date_created_idx").on(t.dateCreated),
    unique("unique_name").on(t.name, t.clerkUserId),
  ]
);

export type Posts = typeof posts.$inferInsert;
