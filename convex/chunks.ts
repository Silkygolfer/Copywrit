import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { StreamStatus } from './schema'

export const writeChunk = mutation({
    args: {
        streamId: v.id("streams"),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const { streamId, text } = args;
        const chunkId = await ctx.db.insert("chunks", {
            streamId,
            text,
        });
        return chunkId;
    }
})

export const listChunks = query({
    args: {
        streamId: v.id("streams"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("chunks").withIndex("by_stream", (q) => q.eq("streamId", args.streamId)).collect();
    }
})

export const getStreamText = query({
    args: {
        streamId: v.id("streams"),
    },
    handler: async (ctx, args) => {
        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }
        let text = "";
        if (stream.status !== "pending") {
            const chunks = await ctx.db
                .query("chunks")
                .withIndex("by_stream", (q) => q.eq("streamId", args.streamId))
                .collect();
            text = chunks.map((chunk) => chunk.text).join("");
        }
        return {
            text,
            status: stream.status as StreamStatus,
        };
    },
})