import convex from "@/lib/convex/client";
import { z } from "zod";
import { Tool } from "ai";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const getBusinessTool: Tool = {
    description: "Get information about the business",
    parameters: z.object({
        businessId: z.string().describe("The id of the business"),
    }),
    execute: async (args: { businessId: string }) => {
        const businessId = args.businessId as Id<"businesses">;
        const business = await convex.query(api.businesses.getBusiness, { businessId });
        return {
            content: business?.businessName,
        }
    }
}