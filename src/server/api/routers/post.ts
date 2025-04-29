import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { Posts, posts } from "@/server/db/schema";
import mockData from "../../../../public/card-mock-data.json";
import { ensureUniqueName, addNanoId } from "./util/ensureUniqueName";
import { and, eq, desc, sql } from "drizzle-orm";
import { GhCardSchema } from "@/types";

export const postRouter = createTRPCRouter({
  seed: publicProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
    }

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
            bucketUrl: "todo",
            clerkUserId: userId,
          })
          .catch((err) => {
            if (
              err.message ===
              "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: posts.name"
            ) {
              redo.push({
                name: addNanoId(item.name),
                description: item.description,
                bucketUrl: "todo",
                clerkUserId: userId,
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

  add: publicProcedure.input(GhCardSchema).mutation(async ({ ctx, input }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
    }
    const toInsert = {
      name: input.name,
      description: input.description,
    };
    const maxRetry = 3;
    let retry = 0;
    let success = false;
    while (retry < maxRetry && !success) {
      await ctx.db
        .insert(posts)
        .values({
          name: toInsert.name,
          description: toInsert.description,
          bucketUrl: "todo",
          clerkUserId: userId,
        })
        .then(() => {
          success = true;
        })
        .catch((err) => {
          if (
            err.message ===
            "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: posts.name"
          ) {
            const newName = addNanoId(toInsert.name);
            toInsert.name = newName;
          }
        });
      retry++;
    }
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }
      await ctx.db.insert(posts).values({
        name: input.name,
        bucketUrl: "todo",
        clerkUserId: userId,
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
          console.log("no aff");
          throw new Error("AUTH_FAILED", {
            cause: new Error("AUTH_FAILED"),
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("UNIQUE constraint failed")) {
            throw new Error("DUPLICATED_NAME", {
              cause: new Error("DUPLICATED_NAME"),
            });
          }

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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }
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
