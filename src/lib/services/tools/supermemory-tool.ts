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
    }),
    execute: async (args: { query: string }) => {
        console.log("Searching Supermemory for:", args.query)
        const results = await supermemory.search.execute({
            q: args.query,
            containerTags: ["businessId"],
        })
        console.log("Supermemory results:", results)
        return {
            content: results.results.map((result) => result.chunks.map((chunk) => chunk.content).join("\n")).join("\n"),
        }
    }
}