import { clientService } from "@/server/services/client.service";
import { Database } from "@/types/supabase";

type NewClient = Database['public']['Tables']['clients']['Insert'];

export const clientHandler = {
  getClients: async () => {
    return clientService.getClients()
  },
  createClient: async (client: NewClient) => {
    return clientService.createClient(client)
  },
}