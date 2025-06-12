import { initTRPC } from '@trpc/server';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * This is where you create the context for each request
*/
export const createTRPCContext = async (opts: { headers: Headers }) => {
    // For now, just return a simple context
    // Later you'll add Supabase, user, etc. here
    return {
      headers: opts.headers,
    };
  };

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;