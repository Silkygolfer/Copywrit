import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
    imageUrl: v.union(v.string(), v.null()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkUserId"]),
  
  // Clients table
  businesses: defineTable({
    clerkUserId: v.string(),
    businessName: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_name", ["clerkUserId", "businessName"]),
  
  // Chat threads table
  threads: defineTable({
    threadId: v.string(),
    clerkUserId: v.string(),
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_updated", ["updatedAt"])
    .index("by_thread_id", ["threadId"]),
  
  // Chat messages table
  messages: defineTable({
    threadId: v.string(),
    clerkUserId: v.optional(v.string()),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    parts: v.array(v.any()),
    streamId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_thread_and_created", ["threadId", "createdAt"]),


  
  // Waitlist table
  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),
})