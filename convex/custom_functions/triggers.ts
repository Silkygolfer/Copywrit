import { Triggers } from "convex-helpers/server/triggers";
import { DataModel } from "../_generated/dataModel";
import { mutation as rawMutation } from "../_generated/server";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";

const triggers = new Triggers<DataModel>();

triggers.register("threads", async (ctx, change) => {
  
  // Only trigger on delete operations
  if (change.operation !== "delete") {
    return;
  }

  const threadId = change.oldDoc._id;

  // Delete all messages for this thread
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .collect();

  for (const message of messages) {
    await ctx.db.delete(message._id);
  }

  // Delete all streams for this thread
  const streams = await ctx.db
    .query("streams")
    .filter((q) => q.eq(q.field("threadId"), threadId))
    .collect();

  for (const stream of streams) {
    // Delete all chunks for this stream
    const chunks = await ctx.db
      .query("chunks")
      .withIndex("by_stream", (q) => q.eq("streamId", stream._id))
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }

    // Delete the stream
    await ctx.db.delete(stream._id);
  }
});

export default triggers;