import { userService } from "@/server/services/user.service";
import { CreatedUser } from "@/types/User";

export const userHandler = {
  getUser: async (userId: string) => {
    return userService.getUser(userId)
  },
  createUser: async (user: CreatedUser) => {
    return userService.createUser(user)
  },
}