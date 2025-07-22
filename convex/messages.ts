import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const listMessages = query({
  args: { 
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("asc")
      .collect();
  },
});

export const getMessageByStreamId = query({
  args: { 
    streamId: v.id('streams'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("streamId"), args.streamId))
      .first();
  },
});

export const sendMessage = mutation({
  args: {
    messageId: v.string(),
    threadId: v.id('threads'),
    clerkUserId: v.optional(v.string()),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system"), v.literal("data")),
    parts: v.array(v.any())
  },
  handler: async (ctx, args) => {
    const streamId = await ctx.db.insert("streams", {
      threadId: args.threadId,
      status: "pending",
    }) as Id<"streams">;

      await ctx.db.insert("messages", {
        messageId: args.messageId,
        threadId: args.threadId,
        clerkUserId: args.clerkUserId,
        content: args.content,
        role: args.role,
        parts: args.parts,
        streamId: streamId,
        createdAt: Date.now(),
      });
      return args.messageId;
  },
});

export const addMessage = mutation({
  args: {
    messageId: v.string(),
    clerkUserId: v.optional(v.string()),
    threadId: v.id('threads'),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system"), v.literal("data")),
    parts: v.array(v.any()),
    streamId: v.id('streams'),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      messageId: args.messageId,
      threadId: args.threadId,
      content: args.content,
      role: args.role,
      parts: args.parts,
      streamId: args.streamId,
      createdAt: args.createdAt,
    });
  },
});
