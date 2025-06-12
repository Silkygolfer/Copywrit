import { router } from './trpc';
import { userRouter } from './routers/userRouter';
import { clientRouter } from './routers/clientRouter';
import { chatRouter } from './routers/chatRouter';

export const appRouter = router({
  user: userRouter,
  client: clientRouter,
  chat: chatRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;