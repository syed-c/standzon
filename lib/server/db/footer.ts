import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getFooterData = cache(async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'footer')
    .single();
  
  if (error) {
    console.warn('No footer settings found in site_settings');
    return null;
  }
  return data.value;
});
