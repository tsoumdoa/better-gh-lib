import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer().primaryKey().unique(),
  name: text(),
  description: text(),
});

export type Posts = typeof posts.$inferInsert;
