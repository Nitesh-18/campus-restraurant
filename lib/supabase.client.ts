// supabase.client.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const storageKey = "supabase-auth";

// Singleton Supabase client
let _supabase: SupabaseClient | null = null;

function getSupabaseClient() {
  if (!_supabase) {
    // console.log("[Supabase] Creating singleton client");
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { storageKey },
    });
  }
  return _supabase;
}

// ✅ Keep same naming to avoid refactor errors
export const supabase = getSupabaseClient();
export const createSupabaseClient = () => getSupabaseClient();
