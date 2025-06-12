import { PublicUser, CreatedUser } from "@/types/User";
import { createClient } from "@/lib/supabase/server";

export const userService = {
  getUser: async (userId: string): Promise<{ data: PublicUser | null; error: string | null; }> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },
  createUser: async (user: CreatedUser): Promise<{ data: PublicUser | null; error: string | null; }> => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('users').insert(user).select().single();
    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },
}