import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  post: defineTable({
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    dateCreated: v.string(),
    dateUpdated: v.string(),
    bucketUrl: v.string(),
    clerkUserId: v.optional(v.string()),
    isPublicShared: v.boolean(),
    publicShareExpiryDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_dateUpdated", ["dateUpdated"])
    .index("by_dateCreated", ["dateCreated"])
    .index("by_name", ["name"]),
});
