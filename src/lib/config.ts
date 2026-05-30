// Central feature flags. The app runs in three independent states:
//  - hasSupabase: real per-user data from the database
//  - hasClerk:    real login / sign-up
// When a flag is false, that part gracefully falls back to demo behaviour.
//
// NOTE: server-only secrets (CLERK_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY) are
// only readable in server code. Client components must rely on the NEXT_PUBLIC_*
// flags below, which Next.js inlines at build time.

export const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side only: do we have what we need to read/write the database?
export const hasSupabaseServer =
  hasSupabase && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const DEMO_USER_ID = "demo-user";
