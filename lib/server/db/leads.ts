import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getLeads = cache(async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
});

export async function createLead(lead: any) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createQuoteRequest(quoteRequest: any) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('quote_requests')
    .insert(quoteRequest)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateQuoteRequest(id: string, updates: any) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('quote_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
