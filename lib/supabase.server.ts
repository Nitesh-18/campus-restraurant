// supabase.server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server component helper
export const createSupabaseServerClient = () => {
  return createServerComponentClient({ cookies });
};

// Admin client with service role key (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// No changes needed, just ensure this file is only imported server-side.
