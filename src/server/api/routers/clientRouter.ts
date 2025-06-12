import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { clientHandler } from "../handlers/clientHandler";
import { Database } from "@/types/supabase";



export const clientRouter = router({
  getClients: publicProcedure.query(() => {
    return clientHandler.getClients()
  }),
  createClient: publicProcedure.input(z.object({
    client_name: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    logo: z.string().optional(),
    brand_guidelines: z.string().optional(),
    user_id: z.string(),
  })).mutation(({ input }) => {
    return clientHandler.createClient({ ...input })
  }),
})