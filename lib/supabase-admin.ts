import { createClient } from "@supabase/supabase-js";

// Vercel uses SUPABASE_SERVICE_ROLE_KEY; GH Actions uses SUPABASE_SERVICE_KEY.
// Both hold the same value — try both names so the code works in either env.
export function createAdminClient() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
