import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { threadMutation } from "./custom_functions/custom_thread_mutation";

export const listThreads = query({
  args: {
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    // If no businessId provided, return empty array
    if (!args.businessId) {
      return [];
    }
    
    return await ctx.db
      .query("threads")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId!))
      .collect();
  },
});

export const createThread = mutation({
  args: {
    title: v.string(),
    businessId: v.id("businesses"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("threads", {
      businessId: args.businessId,
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      clerkUserId: args.clerkUserId,
    });
  },
});

export const updateThreadTitle = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const thread = await ctx.db.get(args.threadId);
      if (!thread) {
        return { success: false };
      }
      await ctx.db.patch(args.threadId, {
        title: args.title,
      });
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },
  returns: { success: v.boolean() }
});

export const deleteThread = threadMutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    try {
      const thread = await ctx.db.get(args.threadId);
      if (!thread) {
        return { success: false };
      }
      
      // Delete the thread - this will trigger the cleanup of related data
      await ctx.db.delete(args.threadId);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },
  returns: { success: v.boolean() }
});

export const createThreadAction = action({
  args: {
    title: v.string(),
    businessId: v.id("businesses"),
    clerkUserId: v.string(),
    initialMessage: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"threads">> => {
    const threadId = await ctx.runMutation(api.threads.createThread, {
      businessId: args.businessId,
      title: args.title,
      clerkUserId: args.clerkUserId,
    });

    // Autocomplete Title Update
    try {
      const { text: title } = await generateText({
        model: google("gemini-2.0-flash"),
        system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 30 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons`,
      prompt: args.initialMessage,
      })

      await ctx.runMutation(api.threads.updateThreadTitle, {
        threadId: threadId as Id<"threads">,
        title: title,
      })
    } catch (error) {
      console.error("Error generating title:", error)
    }

    return threadId;
  },
})

export const getThread = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .first();
  },
});


