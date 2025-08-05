import { ToolSet } from "ai";
// import { getBusinessTool } from "./internal-tools";
import { searchSupermemoryTool } from "./supermemory-tool";



// Bulk export all tools as a ToolSet
export const copywritToolSet: ToolSet = {
    // getBusiness: getBusinessTool,
    searchSupermemory: searchSupermemoryTool,
    // Add more tools here as they're created:
    // searchMemory: searchMemoryTool,
    // analyzeBrand: analyzeBrandTool,
    // etc.
}; 