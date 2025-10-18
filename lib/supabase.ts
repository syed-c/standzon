import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase/database';

// Server-side Supabase client using the service role for privileged writes from API routes
export function getServerSupabase() {
  const url = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) return null;
  return createClient<Database>(url, serviceKey, { auth: { persistSession: false } });
}

// Public client (optional), if ever needed on the client-side rendering
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !anonKey) return null;
  return createClient<Database>(url, anonKey);
}

// Export the new database service (server-side only)
export { db, DatabaseService } from './supabase/database';

// Export simple client-side functions
export * from './supabase/client';


