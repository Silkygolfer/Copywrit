import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTasks = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    return tasks;
  },
}); 