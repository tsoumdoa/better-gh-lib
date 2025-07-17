import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { SignJWT, importPKCS8 } from "jose";
import { Posts, posts } from "@/server/db/schema";
import { nanoid } from "nanoid";
import { addNanoId } from "./util/ensureUniqueName";
import { and, eq, sql } from "drizzle-orm";
import {
  GhCardSchema,
  ShareLinkUidSchema,
  SortOrderZenum,
  UserTag,
} from "@/types/types";
import { TRPCError } from "@trpc/server";
import { waitUntil } from "@vercel/functions";
import cleanUpBucket from "./util/run-bucket-cleanup";
import { generateSharableLinkUid } from "./util/generate-sharable-link-uid";
import { deleteUrl, orderBy, presignedUrl } from "./util/helper-functions";
import formatShareExpiryTime from "./util/format-expiry-time";
import { env } from "@/env";

export const postRouter = createTRPCRouter({
  add: publicProcedure
    .input(
      GhCardSchema.extend({
        nanoid: z.string(),
        tags: z.array(z.string()).max(20), //for now, hardcorded tags limit of 20
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      const checkAllEntries = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.clerkUserId, userId));
      if (checkAllEntries.length > 50) {
        throw new Error("CARD_LIMIT_50_HIT", {
          cause: new Error("MAC_CARD_LIMIT_HIT"),
        });
      }

      const currentDate = new Date();
      const stringDate = currentDate.toISOString();

      input.tags.sort((a, b) => a.localeCompare(b));

      try {
        await ctx.db.insert(posts).values({
          name: input.name,
          description: input.description,
          bucketUrl: input.nanoid,
          clerkUserId: userId,
          dateCreated: stringDate,
          dateUpdated: stringDate,
          tags: input.tags,
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
              dateCreated: stringDate,
              dateUpdated: stringDate,
              tags: input.tags,
            });
          }
        }
      }

      waitUntil(cleanUpBucket(ctx.r2Client, ctx.redis, ctx.db, userId));
      if (input.tags.length > 0) {
        //invalidate cacche
        waitUntil(ctx.redis.del(`userTagAndCount:${userId}`));
        waitUntil(ctx.redis.del(`userHasTags:${userId}`));
      }
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        prevName: z.string(),
        description: z.string().max(150),
        tags: z.array(z.string()).max(20).optional(), //for now, hardcorded tags limit of 20
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

      const currentDate = new Date();
      const stringDate = currentDate.toISOString();

      try {
        await ctx.db
          .update(posts)
          .set({
            name: data.name,
            description: data.description,
            dateUpdated: stringDate,
            tags: input.tags && input.tags,
          })
          .where(and(eq(posts.clerkUserId, userId), eq(posts.id, input.id)));
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("UNIQUE constraint failed")) {
            data.name = addNanoId(input.name);
            await ctx.db
              .update(posts)
              .set({
                name: data.name,
                description: data.description,
                dateUpdated: stringDate,
                tags: input.tags && input.tags,
              })
              .where(
                and(eq(posts.clerkUserId, userId), eq(posts.id, input.id))
              );
          }
          if (err.message === "AUTH_FAILED") {
            throw new Error("AUTH_FAILED", {
              cause: new Error("AUTH_FAILED"),
            });
          }
        }
      }
      if (Array.isArray(input.tags)) {
        waitUntil(ctx.redis.del(`userTagAndCount:${userId}`));
        waitUntil(ctx.redis.del(`userHasTags:${userId}`));
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

      //todo: good enough for now, but improve later...
      const existingEntry: {
        publicId: string;
        userId: string;
      } | null = await ctx.redis.get(`sharedLinkBucket:${input.bucketId}`);

      await ctx.redis.del(`sharedLink:${existingEntry?.publicId}`);
      await ctx.redis.del(`sharedLinkBucket:${input.bucketId}`);

      waitUntil(ctx.redis.del(`userTagAndCount:${userId}`));
      waitUntil(ctx.redis.del(`userHasTags:${userId}`));
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

  getAll: publicProcedure
    .input(z.object({ sortOrder: SortOrderZenum }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      const res = await ctx.db.query.posts.findMany({
        where: eq(posts.clerkUserId, userId),
        limit: 50,
        offset: 0,
        orderBy: orderBy(input.sortOrder),
      });
      return res as Posts[];
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

      const uploadDb = ctx.db
        .update(posts)
        .set({
          publicShareExpiryDate: sql`STRFTIME('%Y-%m-%d %H:%M:%S', CURRENT_TIMESTAMP, '+14 days')`,
          isPublicShared: true,
        })
        .where(
          and(
            eq(posts.clerkUserId, userId),
            eq(posts.bucketUrl, input.bucketId)
          )
        );

      const uploadRedis1 = ctx.redis.set(
        `sharedLinkBucket:${input.bucketId}`,
        {
          publicId: publicId,
          userId: userId,
        },
        {
          ex: 60 * 60 * 24 * 14, // 14 days
        }
      );

      const uplaod2 = await ctx.redis.set(
        `sharedLink:${publicId}`,
        {
          bucketId: input.bucketId,
          userId: userId,
        },
        {
          ex: 60 * 60 * 24 * 14, // 14 days
        }
      );
      const res = await Promise.allSettled([uploadDb, uploadRedis1, uplaod2]);

      let allSucceeded = true;
      const reasons: string[] = [];

      res.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(`Promise ${index + 1} succeeded:`, result.value);
        } else {
          allSucceeded = false;
          console.error(`Promise ${index + 1} failed:`, result.reason);
          reasons.push(result.reason);
        }
      });

      if (!allSucceeded) {
        throw new Error("Some operations failed.");
      }

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

      const delSharedLink = ctx.redis.del(
        `sharedLink:${existingEntry?.publicId}`
      );

      const delSharedLinkBucket = ctx.redis.del(
        `sharedLinkBucket:${input.bucketId}`
      );

      const updateDb = await ctx.db
        .update(posts)
        .set({
          isPublicShared: false,
          publicShareExpiryDate: null,
        })
        .where(
          and(
            eq(posts.clerkUserId, userId),
            eq(posts.bucketUrl, input.bucketId)
          )
        );

      const [delSharedLinkRes, delSharedLinkBucketRes, updateDbRes] =
        await Promise.allSettled([
          delSharedLink,
          delSharedLinkBucket,
          updateDb,
        ]);
      if (
        delSharedLinkRes.status === "rejected" ||
        delSharedLinkBucketRes.status === "rejected" ||
        updateDbRes.status === "rejected"
      ) {
        throw new Error("Failed to update db or redis");
      }
      return { success: true, error: "", res: updateDb };
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

      //get expiry time
      const expiryTime = await ctx.redis.ttl(`sharedLink:${input.publicId}`);
      if (expiryTime < 0) {
        return {
          presignedUrl: presignedRes.value.url,
          name: postDataRes.value[0].name,
          description: postDataRes.value[0].description,
          expirationHours: "unknown",
        };
      }

      const formattedExpiryTime = formatShareExpiryTime(expiryTime);

      return {
        presignedUrl: presignedRes.value.url,
        name: postDataRes.value[0].name,
        description: postDataRes.value[0].description,
        expirationHours: formattedExpiryTime,
      };
    }),

  getUserTags: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) {
      throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
    }

    const cachedUserTags: UserTag[] = await ctx.redis.smembers(
      `userTagAndCount:${userId}`
    );

    if (cachedUserTags.length > 0) {
      cachedUserTags.sort((a, b) => a.tag.localeCompare(b.tag));
      return cachedUserTags;
    }

    const userHasTags = await ctx.redis.get(`userHasTags:${userId}`);
    if (userHasTags) {
      return [];
    }

    const userTags = await ctx.db
      .select({
        tags: posts.tags,
      })
      .from(posts)
      .where(eq(posts.clerkUserId, userId))
      .limit(50); // hardcoded limit for now

    const tagCountsMap = new Map<string, number>();
    userTags.forEach((userTag) => {
      const tags = userTag.tags ?? [];
      tags.forEach((tag) => {
        tagCountsMap.set(tag, (tagCountsMap.get(tag) || 0) + 1);
      });
    });

    const userTagCounts: UserTag[] = Array.from(
      tagCountsMap,
      ([tag, count]) => ({
        tag,
        count,
      })
    );

    userTagCounts.sort((a, b) => a.tag.localeCompare(b.tag));
    //@ts-ignore
    waitUntil(ctx.redis.sadd(`userTagAndCount:${userId}`, ...userTagCounts));
    waitUntil(ctx.redis.set(`userHasTags:${userId}`, true));

    return userTagCounts;
  }),

  generateJwtToken: publicProcedure
    .input(z.object({ size: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.auth;
      if (!userId) {
        throw new Error("UNAUTHORIZED", { cause: new Error("UNAUTHORIZED") });
      }

      if (input.size > 1024 * 1024 * 1.5) {
        return { result: "error", error: "FILE_SIZE_TOO_BIG" };
      }

      const nanoId = nanoid();

      const payload = {
        role: "user",
        userId: userId,
        postId: nanoId,
        size: input.size,
      };
      const privateString = env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
      const privateKey = await importPKCS8(privateString, "RS256");

      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(env.JWT_ISSUER)
        .setAudience(env.JWT_AUDIENCE)
        .setExpirationTime("1 minutes")
        .sign(privateKey);

      // only for debug purpose...
      // const publicString = env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");
      // const publicKey = await importSPKI(publicString, "RS256");
      // const verified = await jwtVerify(jwt, publicKey, {
      //   issuer: env.JWT_ISSUER,
      //   audience: env.JWT_AUDIENCE,
      // });

      return { result: "ok", token: jwt, id: nanoId };
    }),
});
