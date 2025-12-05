/**
 * Supabase Client - Simple client-side access
 * 
 * This provides a simple way to access Supabase from client-side components
 * Uses singleton pattern to prevent multiple GoTrueClient instances
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton instances
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

// Regular client for frontend operations (respects RLS)
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
}

// Admin client for backend/admin operations (bypasses RLS)
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseAdminInstance && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdminInstance = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseAdminInstance || null;
}

// Export the singleton instances
export const supabase = getSupabaseClient();
export const supabaseAdmin = getSupabaseAdminClient();

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(supabaseUrl && supabaseAnonKey);
}

// Simple data access functions
export async function getCountries() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('countries')
    .select('*')
    .eq('active', true)
    .order('country_name');
  
  if (error) throw error;
  return data;
}

export async function getCitiesByCountry(countryCode: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('cities')
    .select('*')
    .eq('country_code', countryCode)
    .eq('active', true)
    .order('city_name');
  
  if (error) throw error;
  return data;
}

export async function getBuilders() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty builders array');
    return [];
  }
  
  try {
    console.log('Fetching builders from Supabase...');
    
    // Use admin client if available (bypasses RLS)
    const client = getSupabaseAdminClient() || getSupabaseClient();
    
    // Try 'builder_profiles' table first
    const { data: data1, error: error1 } = await client
      .from('builder_profiles')
      .select('*')
      .order('company_name');
    
    if (!error1 && data1 && data1.length > 0) {
      console.log('Builders fetched successfully from builder_profiles:', data1.length, 'builders found');
      return data1;
    }
    
    console.log('No data in builder_profiles table or error occurred, trying builders table...');
    if (error1) console.log('builder_profiles error:', error1.message);
    
    // Fallback to 'builders' table
    const { data: data2, error: error2 } = await client
      .from('builders')
      .select('*')
      .order('company_name');
    
    if (!error2 && data2) {
      console.log('Builders fetched successfully from builders:', data2.length, 'builders found');
      return data2;
    }
    
    console.log('No builders found in either table');
    if (error1) console.error('Error from builder_profiles:', error1.message);
    if (error2) console.error('Error from builders:', error2.message);
    
    return [];
  } catch (err) {
    console.error('Exception fetching builders:', err);
    return [];
  }
}

export async function getBuilderBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('builder_profiles')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getExhibitions() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('exhibitions')
    .select('*')
    .eq('active', true)
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getExhibitionBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('exhibitions')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .order('key');
  
  if (error) throw error;
  return data;
}

export async function getSiteSetting(key: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error) throw error;
  return data;
}