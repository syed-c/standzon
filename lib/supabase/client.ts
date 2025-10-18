/**
 * Supabase Client - Simple client-side access
 * 
 * This provides a simple way to access Supabase from client-side components
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create the client
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Simple data access functions
export async function getCountries() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const { data, error } = await supabase
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
  
  const { data, error } = await supabase
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
    throw new Error('Supabase not configured');
  }
  
  const { data, error } = await supabase
    .from('builder_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getBuilderBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  
  const { data, error } = await supabase
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
  
  const { data, error } = await supabase
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
  
  const { data, error } = await supabase
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
  
  const { data, error } = await supabase
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
  
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error) throw error;
  return data;
}
