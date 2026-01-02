import { createServerClient } from '../supabase';
import { cache } from 'react';

export const getBuilders = cache(async () => {
  const supabase = createServerClient();
  
  // Try 'builder_profiles' table first
  const { data: data1, error: error1 } = await supabase
    .from('builder_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!error1 && data1 && data1.length > 0) {
    return data1;
  }
  
  // Fallback to 'builders' table
  const { data: data2, error: error2 } = await supabase
    .from('builders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!error2 && data2) {
    return data2;
  }
  
  return [];
});

export const getBuilderBySlug = cache(async (slug: string) => {
  const supabase = createServerClient();
  
  const { data: data1, error: error1 } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!error1 && data1) {
    return data1;
  }
  
  const { data: data2, error: error2 } = await supabase
    .from('builders')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!error2 && data2) {
    return data2;
  }
  
  return null;
});

export async function createBuilder(builder: any) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('builder_profiles')
    .insert(builder)
    .select()
    .single();
  
  if (error) {
    // try fallback
    const { data: data2, error: error2 } = await supabase
      .from('builders')
      .insert(builder)
      .select()
      .single();
    if (error2) throw error;
    return data2;
  }
  
  return data;
}

export async function updateBuilder(id: string, updates: any) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('builder_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    const { data: data2, error: error2 } = await supabase
      .from('builders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error2) throw error;
    return data2;
  }
  
  return data;
}

export async function deleteBuilder(id: string) {
  const supabase = createServerClient();
  
  const { error: error1 } = await supabase
    .from('builder_profiles')
    .delete()
    .eq('id', id);
  
  if (error1) {
    const { error: error2 } = await supabase
      .from('builders')
      .delete()
      .eq('id', id);
    if (error2) throw error1;
  }
  
  return true;
}
