import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getExhibitions = cache(async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('active', true)
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const getExhibitionBySlug = cache(async (slug: string) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
});
