import Supermemory from "supermemory";
import { Tool } from "ai";
import { z } from "zod";

const supermemory = new Supermemory({
    apiKey: process.env.SUPERMEMORY_API_KEY,
})

export const searchSupermemoryTool: Tool = {
    description: "Search Supermemory for information",
    parameters: z.object({
        query: z.string().describe("The query to search for"),
        businessId: z.string().describe("The business ID to search in"),
    }),
    execute: async (args: { query: string, businessId: string }) => {
        console.log("Searching Supermemory for:", args.query)
        try {
            const results = await supermemory.search.execute({
                q: args.query,
                limit: 10,
                containerTags: [args.businessId],
            })
            
            return {
                content: results.results.map((result: { chunks: { content: string }[] }) => result.chunks.map((chunk) => chunk.content).join("\n")).join("\n"),
            }
        } catch (error) {
            console.error("Error searching Supermemory:", error)
            return {
                content: "Error searching Supermemory",
            }
        }
    }
}