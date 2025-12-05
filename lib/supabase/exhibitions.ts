import { supabase } from '@/lib/supabase/client';

export async function getAllExhibitions() {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getExhibitionBySlug(slug: string) {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getExhibitionById(id: string) {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getExhibitionsByCountry(country: string) {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('country', country);
  
  if (error) throw error;
  return data;
}

export async function getUpcomingExhibitions(limit: number = 10) {
  const today = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .gt('startDate', today)
    .order('startDate', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function getFeaturedExhibitions(limit: number = 6) {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .eq('featured', true)
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function createExhibition(exhibitionData: any) {
  const { data, error } = await supabase
    .from('exhibitions')
    .insert([exhibitionData])
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function updateExhibition(id: string, updates: any) {
  const { data, error } = await supabase
    .from('exhibitions')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function deleteExhibition(id: string) {
  const { error } = await supabase
    .from('exhibitions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}