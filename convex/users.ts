import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get current authenticated user using Clerk
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    // Find the user profile by Clerk subject ID
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();
      
    return userProfile;
  },
});

// Create or update user profile after authentication
export const createOrUpdateProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();
      
    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        firstName: typeof identity.firstName === 'string' ? identity.firstName : existingProfile.firstName,
        lastName: typeof identity.lastName === 'string' ? identity.lastName : existingProfile.lastName,
        email: identity.email || existingProfile.email,
        updatedAt: Date.now(),
      });
      return existingProfile._id;
    }
    
    // Create new profile
    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      email: identity.email || "",
      firstName: typeof identity.firstName === 'string' ? identity.firstName : null,
      lastName: typeof identity.lastName === 'string' ? identity.lastName : null,
      imageUrl: typeof identity.pictureUrl === 'string' ? identity.pictureUrl : null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get all users (for admin purposes)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Create a user manually (for admin purposes)
export const create = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    firstName: v.union(v.string(), v.null()),
    lastName: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      ...args,
      imageUrl: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
}); 