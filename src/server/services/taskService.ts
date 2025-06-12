import convex from "@/lib/convex/client";
import { api } from "../../../convex/_generated/api";

export const taskService = {
    getTasks: async (userId: string) => {
        return await convex.query(api.tasks.getTasks, { userId });
    }
}