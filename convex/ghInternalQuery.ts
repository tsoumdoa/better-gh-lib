import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { bucketUrl } from "../src/utils/utils";

export const getShareableLink = internalQuery({
	args: {
		shareToken: v.string(),
	},
	handler: async (ctx, args) => {
		const share = await ctx.db
			.query("shares")
			.withIndex("by_shareToken", (q) => q.eq("shareToken", args.shareToken))
			.first();
		if (!share) return null;
		if (new Date(share.expiryDate) <= new Date()) return null;
		const post = await ctx.db
			.query("post")
			.withIndex("by_id", (q) => q.eq("_id", share.postId))
			.first();

		if (!post) return null;

		return bucketUrl(share.clerkUserId, post.bucketUrl);
	},
});
