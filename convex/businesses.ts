import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBusiness = query({
    args: {
        businessId: v.id("businesses"),
    },
    handler: async (ctx, args) => {
        // Note: This query is called from server-side contexts, so we skip auth check
        // The businessId is validated by the calling context
        
        const business = await ctx.db
            .query("businesses")
            .withIndex("by_id", (q) => q.eq("_id", args.businessId))
            .first();
        return business;
    },
});

export const getBusinessByClerkUserId = query({
    args: {
        clerkUserId: v.string(),
    },
    handler: async (ctx, args) => {
        // Note: This query is called from server-side, so we skip auth check
        // The clerkUserId is validated on the server side before calling this query
        
        const businesses = await ctx.db
            .query("businesses")
            .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
            .collect();

        return businesses;
    },
});