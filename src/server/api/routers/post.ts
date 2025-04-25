import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Posts, posts } from "@/server/db/schema";
import mockData from "../../../../public/card-mock-data.json";
import { ensureUniqueName } from "../utilities/ensureUniqueName";

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
    while (retry < maxRetry && redo.length > 0) {
      mockData.forEach(
        async (item: { Name: string; Description: string }, i: number) => {
          /* const res = */ await ctx.db
            .insert(posts)
            .values({
              name: uniqueName[i],
              description: item.Description,
            })
            .catch((err) => {
              if (
                err.message ===
                "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: posts.name"
              ) {
                console.log("not unique");
                redo.push({
                  name: uniqueName[i],
                  description: item.Description,
                });
              }
            });
        }
      );
      retry++;
    }
    return redo;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.posts.findMany({ limit: 10 });
    return posts;
  }),
});
