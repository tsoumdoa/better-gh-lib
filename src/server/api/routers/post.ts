import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { nanoid } from "nanoid";
import { addNanoId } from "./util/ensureUniqueName";
import { and, eq, desc, sql } from "drizzle-orm";
import { GhCardSchema, ShareLinkUidSchema } from "@/types/types";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { waitUntil } from "@vercel/functions";
import cleanUpBucket from "./util/run-bucket-cleanup";
import { generateSharableLinkUid } from "./util/generate-sharable-link-uid";
import { Duration } from "effect";

const presignedUrl = (userId: string, nanoid: string, sec: number) =>
  `${env.R2_URL}/${userId}/${nanoid}?X-Amz-Expires=${sec}`;

const deleteUrl = (userId: string, bucketKey: string) =>
  `${env.R2_URL}/${userId}/${bucketKey}`;

export const postRouter = createTRPCRouter({
  add: publicProcedure
    .input(GhCardSchema.extend({ nanoid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      const checkNAllEntries = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.clerkUserId, userId));
      if (checkNAllEntries.length > 50) {
        throw new Error("CARD_LIMIT_50_HIT", {
          cause: new Error("MAC_CARD_LIMIT_HIT"),
        });
      }
      try {
        await ctx.db.insert(posts).values({
          name: input.name,
          description: input.description,
          bucketUrl: input.nanoid,
          clerkUserId: userId,
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("UNIQUE constraint failed")) {
            const newName = addNanoId(input.name);
            await ctx.db.insert(posts).values({
              name: newName,
              description: input.description,
              bucketUrl: input.nanoid,
              clerkUserId: userId,
            });
          }
        }
      }

      waitUntil(cleanUpBucket(ctx.r2Client, ctx.redis, ctx.db, userId));
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
      return data;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), bucketId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      const res = await ctx.db
        .delete(posts)
        .where(and(eq(posts.clerkUserId, userId), eq(posts.id, input.id)));
      if (res.rowsAffected === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete media from DB",
        });
      }

      const r2Res = await ctx.r2Client.fetch(
        new Request(deleteUrl(ctx.auth.userId, input.bucketId), {
          method: "DELETE",
        })
      );
      if (!r2Res.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete media from R2",
        });
      }
    }),

  getPutPresignedUrl: publicProcedure
    .input(z.object({ size: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // this is where the size limit logic is
      if (input.size > 1024 * 1024 * 1.5) {
        return { ok: false, error: "FILE_SIZE_TOO_BIG" };
      }

      const { userId } = ctx.auth;
      const size = input.size;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }
      const nanoId = nanoid();
      const presigned = await ctx.r2Client.sign(
        new Request(presignedUrl(userId, nanoId, 30), {
          method: "PUT",
        }),
        {
          aws: { signQuery: true },
          headers: {
            "Content-Encoding": "gzip",
            "Content-Length": size.toString(),
            "Content-Type": "application/gzip",
          },
        }
      );
      return { ok: true, data: { presignedUrl: presigned.url, id: nanoId } };
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
          headers: {
            "Content-Encoding": "gzip",
            "Content-Type": "application/gzip",
          },
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
      limit: 50,
      offset: 0,
      orderBy: [desc(posts.dateUpdated)],
    });
    return res;
  }),

  generateSharablePublicLink: publicProcedure
    .input(z.object({ bucketId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      const existingEntry: {
        publicId: string;
        userId: string;
      } | null = await ctx.redis.get(`sharedLinkBucket:${input.bucketId}`);
      if (existingEntry && existingEntry.userId === userId) {
        return existingEntry.publicId;
      }

      const item = await ctx.db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.bucketUrl, input.bucketId),
            eq(posts.clerkUserId, userId)
          )
        );
      if (item.length === 0 || item[0].clerkUserId !== userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      console.log("valid! uplading to redis");

      const publicId = generateSharableLinkUid();

      await ctx.redis.set(
        `sharedLinkBucket:${input.bucketId}`,
        {
          publicId: publicId,
          userId: userId,
        },
        {
          ex: 60 * 60 * 24 * 14, // 14 days
        }
      );

      await ctx.redis.set(
        `sharedLink:${publicId}`,
        {
          bucketId: input.bucketId,
          userId: userId,
        },
        {
          ex: 60 * 60 * 24 * 14, // 14 days
        }
      );

      return publicId;
    }),

  revokeSharablePublicLink: publicProcedure
    .input(z.object({ bucketId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        return { success: false, error: "UNAUTHORIZED" };
      }

      const existingEntry: {
        publicId: string;
        userId: string;
      } | null = await ctx.redis.get(`sharedLinkBucket:${input.bucketId}`);

      if (!existingEntry || existingEntry.userId !== userId) {
        return { success: false, error: "UNAUTHORIZED" };
      }

      await ctx.redis.del(`sharedLink:${existingEntry.publicId}`);
      return { success: true, error: "" };
    }),

  getSharedPresignedUrlPublic: publicProcedure
    .input(z.object({ publicId: ShareLinkUidSchema }))
    .query(async ({ input, ctx }) => {
      const bucketId: {
        bucketId: string;
        userId: string;
      } | null = await ctx.redis.get(`sharedLink:${input.publicId}`);
      if (!bucketId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      //get expiry time
      const expiryTime = await ctx.redis.ttl(`sharedLink:${input.publicId}`);

      const postData = ctx.db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.bucketUrl, bucketId.bucketId),
            eq(posts.clerkUserId, bucketId.userId)
          )
        );

      const presigned = ctx.r2Client.sign(
        new Request(presignedUrl(bucketId.userId, bucketId.bucketId, 60 * 3), {
          method: "GET",
        }),
        {
          aws: { signQuery: true },
          headers: {
            "Content-Encoding": "gzip",
            "Content-Type": "application/gzip",
          },
        }
      );
      const [presignedRes, postDataRes] = await Promise.allSettled([
        presigned,
        postData,
      ]);
      if (
        postDataRes.status === "rejected" ||
        presignedRes.status === "rejected"
      ) {
        throw new Error("Failed to get post data");
      }

      if (postDataRes.value.length === 0) {
        throw new Error("No post data");
      }
      if (postDataRes.value.length > 1) {
        throw new Error("Post should be unique but found multiple");
      }
      const duration = Duration.seconds(expiryTime);
      const expirationHours = Duration.toHours(duration);

      return {
        presignedUrl: presignedRes.value.url,
        name: postDataRes.value[0].name,
        description: postDataRes.value[0].description,
        expirationHours: expirationHours,
      };
    }),
});
