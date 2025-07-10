import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Join the waitlist
export const join = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      return { success: false, error: "Email already registered in waitlist" };
    } else {
      // Add to waitlist
    await ctx.db.insert("waitlist", {
      email: args.email,
      createdAt: Date.now(),
    });
    return { success: true, error: null };
    }
  },
});

// Get the number of waitlist entries
export const count = query({
  args: {},
  handler: async (ctx) => {
    const waitlistEntries = await ctx.db.query("waitlist").collect();
    return waitlistEntries.length;
  },
});

// Get all waitlist entries (admin only - you might want to add auth check)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("waitlist")
      .order("desc")
      .collect();
  },
}); 