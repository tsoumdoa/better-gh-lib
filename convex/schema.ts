import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	post: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		dateCreated: v.string(),
		dateUpdated: v.string(),
		bucketUrl: v.string(),
		clerkUserId: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
	})
		.index("by_clerkUserId", ["clerkUserId"])
		.index("by_user_dateUpdated", ["clerkUserId", "dateUpdated"])
		.index("by_user_dateCreated", ["clerkUserId", "dateCreated"])
		.index("by_user_name", ["clerkUserId", "name"]),

	shares: defineTable({
		postId: v.id("post"),
		shareToken: v.string(),
		expiryDate: v.string(),
		createdAt: v.string(),
		clerkUserId: v.string(),
	})
		.index("by_shareToken", ["shareToken"])
		.index("by_postId", ["postId"])
		.index("by_expiryDate", ["expiryDate"]),
});
