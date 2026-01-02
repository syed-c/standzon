import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getCountries = cache(async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('active', true)
    .order('country_name');
  
  if (error) throw error;
  return data;
});

export const getCountryByCode = cache(async (code: string) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('country_code', code)
    .single();
  
  if (error) throw error;
  return data;
});

export const getCitiesByCountry = cache(async (countryCode: string) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('country_code', countryCode)
    .eq('active', true)
    .order('city_name');
  
  if (error) throw error;
  return data;
});
