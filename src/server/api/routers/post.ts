import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import mockData from "../../../../public/card-mock-data.json";
import { ensureUniqueName, addNanoId } from "./util/ensureUniqueName";
import { and, eq, desc, sql } from "drizzle-orm";
import { GhCardSchema } from "@/types";
import { env } from "@/env";

const ghCardKey = (userId: string, name: string) => `ghcard_${userId}_${name}`;
const presignedUrl = (userId: string, nanoid: string, sec: number) =>
  `${env.R2_URL}/${userId}/${nanoid}?X-Amz-Expires=${sec}`;

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
          bucketUrl: item.name,
          clerkUserId: userId,
        });
        ctx.radis.set(key, "");
      } else if (hasKey === 1) {
        const newName = addNanoId(item.name);
        ctx.radis.set(ghCardKey(userId, newName), newName);
        await ctx.db.insert(posts).values({
          name: newName,
          description: item.description,
          bucketUrl: item.name,
          clerkUserId: userId,
        });
      }
    }
  }),

  add: publicProcedure
    .input(GhCardSchema.extend({ nanoid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      const key = ghCardKey(userId, input.name);
      const hasKey = await ctx.radis.exists(key);
      try {
        if (hasKey === 0) {
          await ctx.db.insert(posts).values({
            name: input.name,
            description: input.description,
            bucketUrl: input.nanoid,
            clerkUserId: userId,
          });
          ctx.radis.set(key, "");
        } else if (hasKey === 1) {
          const newName = addNanoId(input.name);
          ctx.radis.set(ghCardKey(userId, newName), "");
          await ctx.db.insert(posts).values({
            name: newName,
            description: input.description,
            bucketUrl: input.nanoid,
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
              bucketUrl: input.nanoid,
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
        prevName: z.string(),
        description: z.string().max(150),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      if (input.prevName !== input.name) {
        ctx.radis.del(ghCardKey(userId, input.prevName));
      }

      const data = {
        name: input.name,
        description: input.description,
      };
      const hasKey = await ctx.radis.exists(ghCardKey(userId, input.name));
      if (hasKey > 0 && input.prevName !== input.name) {
        const newName = addNanoId(input.name);
        data.name = newName;
      }
      ctx.radis.set(ghCardKey(userId, data.name), "");

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
      return data;
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

  getPutPresignedUrl: publicProcedure
    .input(z.object({ nanoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }
      const presigned = await ctx.r2Client.sign(
        new Request(presignedUrl(userId, input.nanoId, 30), {
          method: "PUT",
        }),
        {
          aws: { signQuery: true },
        }
      );
      return presigned.url;
    }),

  getPresignedUrl: publicProcedure
    .input(z.object({ bucketId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }
      const presigned = await ctx.r2Client.sign(
        new Request(presignedUrl(userId, input.bucketId, 60 * 3), {
          method: "GET",
        }),
        {
          aws: { signQuery: true },
        }
      );
      return presigned.url;
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
