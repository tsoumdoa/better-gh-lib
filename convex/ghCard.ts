import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { UserTag, SortOrder } from "../src/types/types";

export const addPost = mutation({
	args: {
		name: v.string(),
		description: v.string(),
		tags: v.array(v.string()),
		uid: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		await ctx.db.insert("post", {
			name: args.name,
			description: args.description,
			tags: args.tags,
			clerkUserId: identity.id as string,
			publicShareExpiryDate: undefined,
			bucketUrl: args.uid,
			isPublicShared: false,
			dateCreated: new Date().toISOString(),
			dateUpdated: new Date().toISOString(),
		});
	},
});

export const deletePost = mutation({
	args: {
		id: v.id("post"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		await ctx.db.delete("post", args.id);
	},
});

export const updatePost = mutation({
	args: {
		id: v.id("post"),
		name: v.optional(v.string()),
		description: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		await ctx.db.patch("post", args.id, {
			name: args.name,
			description: args.description,
			tags: args.tags,
			dateUpdated: new Date().toISOString(),
		});
	},
});

export const getAll = query({
	args: {
		tags: v.optional(v.array(v.string())),
		sortOrder: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}

		const tags = args.tags ?? [];
		const sortOrder = args.sortOrder || "ascLastEdited";

		if (tags.length === 0 && sortOrder === "ascLastEdited") {
			return await ctx.db
				.query("post")
				.withIndex("by_clerkUserId", (q) =>
					q.eq("clerkUserId", identity.id as string)
				)
				.collect();
		}

		let posts;
		switch (sortOrder as SortOrder) {
			case "ascAZ":
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_name", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("asc")
					.collect();
				break;

			case "descZA":
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_name", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("desc")
					.collect();
				break;

			case "ascLastEdited":
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_dateUpdated", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("asc")
					.collect();
				break;

			case "descLastEdited":
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_dateUpdated", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("desc")
					.collect();
				break;

			case "ascCreated":
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_dateCreated", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("asc")
					.collect();
				break;

			case "descCreated":
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_dateCreated", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("desc")
					.collect();
				break;

			default:
				posts = await ctx.db
					.query("post")
					.withIndex("by_user_name", (q) =>
						q.eq("clerkUserId", identity.id as string)
					)
					.order("asc")
					.collect();
				break;
		}

		if (tags.length === 0) return posts;

		return posts.filter((post) => {
			for (const tag of tags) {
				if (post.tags?.includes(tag)) {
					return true;
				}
			}
		});
	},
});

export const getUserTags = query({
	args: {},
	handler: async (ctx, _) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		const posts = await ctx.db
			.query("post")
			.withIndex("by_clerkUserId", (q) =>
				q.eq("clerkUserId", identity.id as string)
			)
			.collect();

		const counts = posts
			.flatMap((p) => p.tags ?? [])
			.reduce<Record<string, number>>((acc, tag) => {
				acc[tag] = (acc[tag] ?? 0) + 1;
				return acc;
			}, {});

		const userTags: UserTag[] = Object.entries(counts).map(([tag, count]) => ({
			tag,
			count,
		}));
		userTags.sort((a, b) => {
			if (a.tag < b.tag) return -1;
			if (a.tag > b.tag) return 1;
			return 0;
		});
		return userTags;
	},
});
