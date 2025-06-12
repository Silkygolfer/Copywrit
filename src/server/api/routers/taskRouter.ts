import { taskHandler } from "../handlers/taskHandler";

export const taskRouter = {
    getTasks: async ({ userId }: { userId: string }) => {
        return await taskHandler.getTasks({ userId });
    }
}