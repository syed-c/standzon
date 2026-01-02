import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const createServerClient = cache(() => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !serviceKey) {
    throw new Error('Supabase server client not configured. Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
    db: { schema: 'public' }
  });
});

// For cases where we want a client with the anon key but still on the server (e.g. following RLS)
export const createAnonServerClient = cache(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    throw new Error('Supabase anon server client not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false }
  });
});
