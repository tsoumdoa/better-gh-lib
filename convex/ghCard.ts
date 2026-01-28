import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addPost = mutation({
	args: {
		name: v.string(),
		description: v.string(),
		tags: v.array(v.string()),
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
			bucketUrl: "",
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
	args: {},
	handler: async (ctx, _) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Not authenticated");
		}
		const post = await ctx.db
			.query("post")
			.withIndex("by_clerkUserId", (q) =>
				q.eq("clerkUserId", identity.id as string)
			)
			.take(10);
		return post;
	},
});
