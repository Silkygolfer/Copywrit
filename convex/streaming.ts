import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { PersistentTextStreaming, StreamIdValidator, StreamId } from "@convex-dev/persistent-text-streaming";
import { v } from "convex/values";

// Initialize the persistent text streaming component
export const streamingComponent = new PersistentTextStreaming(components.persistentTextStreaming);

export const getStreamBody = query({
    args: {
      streamId: StreamIdValidator,
    },
    handler: async (ctx, args) => {
      return await streamingComponent.getStreamBody(
        ctx,
        args.streamId as StreamId
      );
    },
  });

  export const createStream = mutation({
    args: {
      threadId: v.string(),
    },
    handler: async (ctx, args) => {
      return await streamingComponent.createStream(ctx);
    },
  });