export type SupabaseClientInfo = {
  url: string;
  anonKey: string;
};

export function getPublicSupabaseConfig(): SupabaseClientInfo {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  };
}
