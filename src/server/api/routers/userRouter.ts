import { publicProcedure, router } from '../trpc';
import { userHandler } from '../handlers/userHandler';
import { z } from 'zod';




const userRouter = router({
  getUser: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      return userHandler.getUser(input.userId)
    }),
  createUser: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      return userHandler.createUser(input)
    }),
});

export { userRouter };