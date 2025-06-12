import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type Client = Database['public']['Tables']['clients']['Row'];
type NewClient = Database['public']['Tables']['clients']['Insert'];

export const clientService = {
  getClients: async (): Promise<{ data: Client[] | null; error: string | null; }> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },
  createClient: async (client: NewClient): Promise<{ data: Client | null; error: string | null; }> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('clients').insert(client).select().single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },
}