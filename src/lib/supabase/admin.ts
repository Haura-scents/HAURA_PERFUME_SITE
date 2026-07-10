import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Privileged Supabase client — bypasses RLS. Server-side only; the
 *  `server-only` import makes any client-bundle inclusion a build error.
 *  Use for: order creation, stock updates, webhooks, guest carts, admin CRUD. */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  );
}
