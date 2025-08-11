/**
 * Example usage of message conversion utilities
 * 
 * This file demonstrates how to use the DBMessage type and conversion utilities
 * in your Convex functions and API routes.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { UIMessage } from "ai";
import {
  DBMessage,
  dbMessageToUIMessage,
  uiMessageToDBMessage,
  dbMessagesToUIMessages,
  uiMessagesToDBMessages,
} from "./index";

// Example 1: Store a UIMessage in the database
export const storeMessage = mutation({
  args: {
    threadId: v.id("threads"),
    message: v.any(), // Accept UIMessage from client
  },
  handler: async (ctx, args) => {
    // Convert UIMessage to DBMessage for storage
    const dbMessage = uiMessageToDBMessage(args.message as UIMessage);
    
    // Store in database
    const messageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      ...dbMessage,
      createdAt: Date.now(),
    });
    
    return messageId;
  },
});

// Example 2: Retrieve messages and convert to UIMessage format
export const getThreadMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    // Get messages from database
    const dbMessages = await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("asc")
      .collect();
    
    // Convert to UIMessage format for the client
    const uiMessages = dbMessagesToUIMessages(dbMessages);
    
    return uiMessages;
  },
});

// Example 3: Validate and store messages with the DBMessage validator
export const storeValidatedMessage = mutation({
  args: {
    threadId: v.id("threads"),
    message: DBMessage, // Use the DBMessage validator directly
  },
  handler: async (ctx, args) => {
    // Message is already validated by Convex
    const messageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      ...args.message,
      createdAt: Date.now(),
    });
    
    return messageId;
  },
});

// Example 4: Update a message part (e.g., when streaming completes)
export const updateMessagePart = mutation({
  args: {
    messageId: v.id("messages"),
    partIndex: v.number(),
    updates: v.object({
      state: v.optional(v.union(v.literal("streaming"), v.literal("done"))),
      text: v.optional(v.string()),
      output: v.optional(v.any()),
      errorText: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    
    // Update the specific part
    const parts = [...message.parts];
    parts[args.partIndex] = {
      ...parts[args.partIndex],
      ...args.updates,
    };
    
    // Update the message
    await ctx.db.patch(args.messageId, { parts });
    
    return { success: true };
  },
});

// Example 5: Usage in an API route (Next.js app router)
/*
// In your app/api/chat/route.ts or similar

import { UIMessage } from "ai";
import { api } from "@/convex/_generated/api";
import { uiMessageToDBMessage } from "@/convex/lib/message-converters";

export async function POST(req: Request) {
  const { messages, threadId } = await req.json();
  
  // Convert UIMessages to DBMessages for storage
  const dbMessages = messages.map((msg: UIMessage) => uiMessageToDBMessage(msg));
  
  // Store in Convex
  for (const dbMessage of dbMessages) {
    await convex.mutation(api.messages.store, {
      threadId,
      message: dbMessage,
    });
  }
  
  // ... rest of your chat logic
}
*/

// Example 6: Handle different message part types
export const createAssistantMessage = mutation({
  args: {
    threadId: v.id("threads"),
    text: v.string(),
    reasoning: v.optional(v.string()),
    toolCalls: v.optional(v.array(v.object({
      toolName: v.string(),
      toolCallId: v.string(),
      input: v.any(),
    }))),
  },
  handler: async (ctx, args) => {
    // Build message parts
    const parts: any[] = [];
    
    // Add text part
    if (args.text) {
      parts.push({
        type: "text",
        text: args.text,
        state: "done",
      });
    }
    
    // Add reasoning part if present
    if (args.reasoning) {
      parts.push({
        type: "reasoning",
        text: args.reasoning,
        state: "done",
      });
    }
    
    // Add tool calls if present
    if (args.toolCalls) {
      for (const toolCall of args.toolCalls) {
        parts.push({
          type: `tool-${toolCall.toolName}`,
          toolCallId: toolCall.toolCallId,
          state: "input-available",
          input: toolCall.input,
        });
      }
    }
    
    // Create the DBMessage
    const dbMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      parts,
    };
    
    // Store in database
    const messageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      ...dbMessage,
      createdAt: Date.now(),
    });
    
    return messageId;
  },
});