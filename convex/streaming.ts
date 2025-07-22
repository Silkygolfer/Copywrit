import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const createStream = internalMutation({
    args: {
        threadId: v.id('threads'),
    },
    handler: async (ctx, args) => {
        const streamId = await ctx.db.insert("streams", {
            threadId: args.threadId,
            status: "pending",
        });
        return streamId;
    }
})

export const updateStatus = mutation({
    args: {
        streamId: v.id('streams'),
        status: v.union(v.literal('pending'), v.literal('streaming'), v.literal('done'), v.literal('error'), v.literal('timeout')),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.streamId, { status: args.status });
    }
})

export const getStreamStatus = query({
    args: {
        streamId: v.id('streams'),
    },
    handler: async (ctx, args) => {
        const stream = await ctx.db.get(args.streamId);
        return stream?.status || null;
    }
})