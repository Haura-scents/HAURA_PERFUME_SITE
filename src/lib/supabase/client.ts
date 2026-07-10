import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for Client Components (browser). Uses the publishable key
 *  and is therefore constrained by Row Level Security. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
