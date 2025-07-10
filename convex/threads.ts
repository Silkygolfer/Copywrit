import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listThreads = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();
  },
});

export const createThread = mutation({
  args: {
    threadId: v.string(),
    title: v.optional(v.string()),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("threads", {
      threadId: args.threadId,
      clerkUserId: args.clerkUserId,
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getThread = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .first();
  },
});
