import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role for privileged writes from API routes
export function getServerSupabase() {
  const url = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
  
  console.log('🔍 Supabase config check:', { 
    urlPresent: !!url, 
    serviceKeyPresent: !!serviceKey,
    url: url ? 'present' : 'missing',
    serviceKey: serviceKey ? 'present' : 'missing'
  });
  
  if (!url || !serviceKey) {
    console.log('❌ Supabase server client not configured:', { url: !!url, serviceKey: !!serviceKey });
    return null;
  }
  console.log('✅ Supabase server client configured');
  
  try {
    const client = createClient(url, serviceKey, { 
      auth: { persistSession: false },
      db: { schema: 'public' }
    });
    return client;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    return null;
  }
}

// Public client (optional), if ever needed on the client-side rendering
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

// Export the new database service (server-side only)
export { db, DatabaseService } from './supabase/database';

// Export simple client-side functions
export * from './supabase/client';


