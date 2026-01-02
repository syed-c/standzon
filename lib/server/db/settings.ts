import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getSiteSettings = cache(async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key');
  
  if (error) throw error;
  return data;
});

export const getSiteSetting = cache(async (key: string) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error) throw error;
  return data;
});

export async function setSiteSetting(key: string, value: any, description?: string, category?: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({
      key,
      value,
      description,
      category,
      last_modified: new Date().toISOString()
    }, { onConflict: 'key' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
