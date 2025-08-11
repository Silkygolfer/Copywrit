import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { DBMessage } from "./lib/types";

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
    // DBMessage fields
    ...DBMessage.fields,
    // Database-specific fields
    threadId: v.id('threads'),
    clerkUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const streamId = await ctx.db.insert("streams", {
      threadId: args.threadId,
      status: "pending",
    }) as Id<"streams">;

      await ctx.db.insert("messages", {
        id: args.id,
        role: args.role,
        metadata: args.metadata,
        parts: args.parts,
        threadId: args.threadId,
        clerkUserId: args.clerkUserId,
        streamId: streamId,
        createdAt: Date.now(),
      });
      return args.id;
  },
});

export const addMessage = mutation({
  args: {
    // DBMessage fields
    ...DBMessage.fields,
    // Database-specific fields
    threadId: v.id('threads'),
    clerkUserId: v.optional(v.string()),
    streamId: v.id('streams'),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      id: args.id,
      role: args.role,
      metadata: args.metadata,
      parts: args.parts,
      threadId: args.threadId,
      clerkUserId: args.clerkUserId,
      streamId: args.streamId,
      createdAt: args.createdAt,
    });
  },
});
