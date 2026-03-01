import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export type SupabaseClientInfo = {
  url: string;
  anonKey: string;
};

export function getPublicSupabaseConfig(): SupabaseClientInfo {
  return {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey()
  };
}
