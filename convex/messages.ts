import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const listMessages = query({
  args: { 
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("asc")
      .collect();
  },
});

export const addMessage = mutation({
  args: {
    streamId: v.optional(v.string()),
    threadId: v.string(),
    clerkUserId: v.optional(v.string()),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    parts: v.array(v.any())
  },
  handler: async (ctx, args) => {
    if (args.role === "assistant") {
      const streamId = await ctx.runMutation(api.streaming.createStream, {
        threadId: args.threadId,
      });
      const messageId: Id<"messages"> = await ctx.db.insert("messages", {
        threadId: args.threadId,
        clerkUserId: args.clerkUserId,
        content: args.content,
        role: args.role,
        parts: args.parts,
        streamId: streamId,
        createdAt: Date.now(),
      });
      return messageId;
    }
    else {
      return await ctx.db.insert("messages", {
        threadId: args.threadId,
        clerkUserId: args.clerkUserId,
        content: args.content,
        role: args.role,
        parts: args.parts,
        createdAt: Date.now(),
      });
    }
  },
});
