import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Posts, posts } from "@/server/db/schema";
import mockData from "../../../../public/card-mock-data.json";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  seed: publicProcedure.mutation(async ({ ctx }) => {
    // const uniqueMockData = ensureUniqueName(mockData);
    const maxRetry = 3;
    let redo: Posts[] = [];
    let retry = 0;
    while (retry < maxRetry && redo.length > 0) {
      mockData.forEach(
        async (item: { Name: string; Description: string }, i: number) => {
          const res = await ctx.db
            .insert(posts)
            .values({
              name: item.Name.replaceAll(" ", ""),
              description: item.Description,
            })
            .catch((err) => {
              if (
                err.message ===
                "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: posts.name"
              ) {
                console.log("not unique");
                // const newName = getUniqueName(item.Name);
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

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  // 	const post = await ctx.db.query.posts.findFirst({
  // 		orderBy: (posts, { desc }) => [desc(posts.id)],
  // 	});
  // 	return post ?? null;
  // }),
});
