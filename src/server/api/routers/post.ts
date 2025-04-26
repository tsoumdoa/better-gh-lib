import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Posts, posts } from "@/server/db/schema";
import mockData from "../../../../public/card-mock-data.json";
import { ensureUniqueName, addNanoId } from "./util/ensureUniqueName";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  seed: publicProcedure.mutation(async ({ ctx }) => {
    const mockName = mockData.map((item) => item.Name);
    const uniqueName = ensureUniqueName(mockName);

    const maxRetry = 3;
    const redo: Posts[] = [];
    let retry = 0;

    let dataToInsert = mockData.map((item, index) => ({
      name: uniqueName[index].replaceAll(" ", ""),
      description: item.Description,
    }));

    while (retry < maxRetry && dataToInsert.length >= 0) {
      for (const item of dataToInsert) {
        await ctx.db
          .insert(posts)
          .values({
            name: item.name,
            description: item.description,
          })
          .catch((err) => {
            if (
              err.message ===
              "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: posts.name"
            ) {
              redo.push({
                name: addNanoId(item.name),
                description: item.description,
              });
            }
          });
      }
      dataToInsert = redo.map((item) => ({
        name: item.name!,
        description: item.description!,
      }));
      retry++;
    }
    redo.length = 0;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        description: z.string().max(150),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(posts)
          .set({ name: input.name, description: input.description })
          .where(eq(posts.id, input.id));
      } catch {
        //todo add posthug...
        throw new Error("failed to update DB");
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.posts.findMany({ limit: 100 });
    return posts;
  }),
});
