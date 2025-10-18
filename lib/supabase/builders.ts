import { supabase } from '@/lib/supabase/client';

export async function getAllBuilders() {
  const { data, error } = await supabase
    .from('builders')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getBuilderBySlug(slug: string) {
  const { data, error } = await supabase
    .from('builders')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getBuilderById(id: string) {
  const { data, error } = await supabase
    .from('builders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createBuilder(builderData: any) {
  const { data, error } = await supabase
    .from('builders')
    .insert([builderData])
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function updateBuilder(id: string, updates: any) {
  const { data, error } = await supabase
    .from('builders')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
}

export async function deleteBuilder(id: string) {
  const { error } = await supabase
    .from('builders')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}