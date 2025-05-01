import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import mockData from "../../../../public/card-mock-data.json";
import { ensureUniqueName, addNanoId } from "./util/ensureUniqueName";
import { and, eq, desc, sql } from "drizzle-orm";
import { GhCardSchema } from "@/types";

const ghCardKey = (userId: string, name: string) => `ghcard_${userId}_${name}`;

export const postRouter = createTRPCRouter({
  seed: publicProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
    }

    const mockName = mockData.map((item) => item.Name);
    const uniqueName = ensureUniqueName(mockName);

    const dataToInsert = mockData.map((item, index) => ({
      name: uniqueName[index].replaceAll(" ", ""),
      description: item.Description,
    }));

    for (const item of dataToInsert) {
      const key = ghCardKey(userId, item.name);
      const hasKey = await ctx.radis.exists(key);
      if (hasKey === 0) {
        await ctx.db.insert(posts).values({
          name: item.name,
          description: item.description,
          bucketUrl: "todo",
          clerkUserId: userId,
        });
        ctx.radis.set(key, "");
      } else if (hasKey === 1) {
        const newName = addNanoId(item.name);
        ctx.radis.set(ghCardKey(userId, newName), newName);
        await ctx.db.insert(posts).values({
          name: newName,
          description: item.description,
          bucketUrl: "todo",
          clerkUserId: userId,
        });
      }
    }
  }),

  add: publicProcedure.input(GhCardSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
    }

    const key = ghCardKey(userId, input.name);
    const hasKey = await ctx.radis.exists(key);
    try {
      if (hasKey === 0) {
        //todo change it to transaction and throw error if there is duplicated name...
        await ctx.db.insert(posts).values({
          name: input.name,
          description: input.description,
          bucketUrl: "todo",
          clerkUserId: userId,
        });
        ctx.radis.set(key, "");
      } else if (hasKey === 1) {
        const newName = addNanoId(input.name);
        ctx.radis.set(ghCardKey(userId, newName), "");
        await ctx.db.insert(posts).values({
          name: newName,
          description: input.description,
          bucketUrl: "todo",
          clerkUserId: userId,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("UNIQUE constraint failed")) {
          const newName = addNanoId(input.name);
          ctx.radis.set(ghCardKey(userId, newName), "");
          await ctx.db.insert(posts).values({
            name: newName,
            description: input.description,
            bucketUrl: "todo",
            clerkUserId: userId,
          });
        }
      }
    }
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
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }
      const data = {
        name: input.name,
        description: input.description,
      };
      try {
        const res = await ctx.db
          .update(posts)
          .set({
            name: data.name,
            description: data.description,
            dateUpdated: sql`CURRENT_TIMESTAMP`,
          })
          .where(and(eq(posts.clerkUserId, userId), eq(posts.id, input.id)));
        if (res.rowsAffected === 0) {
          throw new Error("AUTH_FAILED", {
            cause: new Error("AUTH_FAILED"),
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "AUTH_FAILED") {
            throw new Error("AUTH_FAILED", {
              cause: new Error("AUTH_FAILED"),
            });
          }
        }
        throw new Error("FAILED_TO_UPDATE", {
          cause: new Error("FAILED_TO_UPDATE"),
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      ctx.radis.del(ghCardKey(userId, input.name));
      const res = await ctx.db
        .delete(posts)
        .where(and(eq(posts.clerkUserId, userId), eq(posts.id, input.id)));
      if (res.rowsAffected === 0) {
        throw new Error("FAILED_TO_DELETE", {
          cause: new Error("FAILED_TO_DELETE"),
        });
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
    }

    const res = await ctx.db.query.posts.findMany({
      where: eq(posts.clerkUserId, userId),
      limit: 100,
      offset: 0,
      orderBy: [desc(posts.dateUpdated)],
    });
    return res;
  }),
});
