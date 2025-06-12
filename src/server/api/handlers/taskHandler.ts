import { taskService } from "@/server/services/taskService";

export const taskHandler = {
    getTasks: async ({ userId }: { userId: string }) => {
        return taskService.getTasks(userId);
    }
}