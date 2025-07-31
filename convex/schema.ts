import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const streamStatusValidator = v.union(
  v.literal("pending"),
  v.literal("streaming"),
  v.literal("done"),
  v.literal("error"),
  v.literal("timeout")
);

export const businessContextValidator = v.object({
  businessName: v.string(),
  businessAddressLine1: v.string(),
  businessAddressLine2: v.optional(v.string()),
  businessCity: v.string(),
  businessState: v.string(),
  businessZip: v.string(),
  businessCountry: v.string(),
  businessPhone: v.string(),
  businessEmail: v.string(),
})

export type StreamStatus = Infer<typeof streamStatusValidator>;
export type BusinessContext = Infer<typeof businessContextValidator>;

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
    businessContext: businessContextValidator,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_name", ["clerkUserId", "businessName"]),

  // Files table
  files: defineTable({
    key: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    uploadedAt: v.number(),
    businessId: v.id("businesses"),
    clerkUserId: v.string(),
    supermemoryId: v.string(),
  }).index("by_business", ["businessId"])
    .index("by_user", ["clerkUserId"]),

  // Chat threads table
  threads: defineTable({
    clerkUserId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    businessId: v.id("businesses"),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_updated", ["updatedAt"])
    .index("by_business", ["businessId"]),

  // Chat messages table
  messages: defineTable({
    messageId: v.string(),
    threadId: v.id('threads'),
    clerkUserId: v.optional(v.string()),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("data")
    ),
    parts: v.array(v.any()),
    createdAt: v.number(),
    streamId: v.id("streams"),
  })
    .index("by_thread", ["threadId"])
    .index("by_thread_and_created", ["threadId", "createdAt"]),

  // streams table
  streams: defineTable({
    status: streamStatusValidator,
    threadId: v.id("threads"),
  }).index("by_status", ["status"]),

  chunks: defineTable({
    streamId: v.id("streams"),
    text: v.string(),
  }).index("by_stream", ["streamId"]),

  // Waitlist table
  waitlist: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
