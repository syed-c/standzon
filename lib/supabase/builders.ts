import { supabase } from '@/lib/supabase/client';

export async function getAllBuilders() {
  console.log('Fetching all builders from Supabase...');
  
  // Try 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await supabase
    .from('builders')
    .select('*');
  
  if (!error1 && data1) {
    console.log('Found builders in builders table:', data1.length);
    return data1;
  }
  
  console.log('No data in builders table, trying builder_profiles table...');
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await supabase
    .from('builder_profiles')
    .select('*');
  
  if (!error2 && data2) {
    console.log('Found builders in builder_profiles:', data2.length);
    return data2;
  }
  
  console.log('No builders found in either table');
  if (error1) console.error('Error from builders:', error1.message);
  if (error2) console.error('Error from builder_profiles:', error2.message);
  
  return [];
}

export async function getBuilderBySlug(slug: string) {
  console.log('Fetching builder by slug:', slug);
  
  // Try 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await supabase
    .from('builders')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!error1 && data1) {
    console.log('Found builder in builders by slug');
    return data1;
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!error2 && data2) {
    console.log('Found builder in builder_profiles by slug');
    return data2;
  }
  
  if (error1) console.error('Error from builders:', error1.message);
  if (error2) console.error('Error from builder_profiles:', error2.message);
  
  return null;
}

export async function getBuilderById(id: string) {
  console.log('Fetching builder by ID:', id);
  
  // Try 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await supabase
    .from('builders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!error1 && data1) {
    console.log('Found builder in builders by ID');
    return data1;
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!error2 && data2) {
    console.log('Found builder in builder_profiles by ID');
    return data2;
  }
  
  if (error1) console.error('Error from builders:', error1.message);
  if (error2) console.error('Error from builder_profiles:', error2.message);
  
  return null;
}

export async function createBuilder(builderData: any) {
  console.log('Creating builder:', builderData);
  
  // Try to insert into 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await supabase
    .from('builders')
    .insert([builderData])
    .select();
  
  if (!error1 && data1) {
    console.log('Created builder in builders');
    return data1[0];
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await supabase
    .from('builder_profiles')
    .insert([builderData])
    .select();
  
  if (!error2 && data2) {
    console.log('Created builder in builder_profiles');
    return data2[0];
  }
  
  if (error1) throw error1;
  if (error2) throw error2;
  
  throw new Error('Failed to create builder in either table');
}

export async function updateBuilder(id: string, updates: any) {
  console.log('Updating builder:', id, updates);
  
  // Try to update in 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await supabase
    .from('builders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (!error1 && data1) {
    console.log('Updated builder in builders');
    return data1;
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await supabase
    .from('builder_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (!error2 && data2) {
    console.log('Updated builder in builder_profiles');
    return data2;
  }
  
  if (error1) throw error1;
  if (error2) throw error2;
  
  throw new Error('Failed to update builder in either table');
}

export async function deleteBuilder(id: string) {
  console.log('Deleting builder:', id);
  
  // Try to delete from 'builders' table first (it has more data according to our test)
  const { error: error1 } = await supabase
    .from('builders')
    .delete()
    .eq('id', id);
  
  if (!error1) {
    console.log('Deleted builder from builders');
    return true;
  }
  
  // Fallback to 'builder_profiles' table
  const { error: error2 } = await supabase
    .from('builder_profiles')
    .delete()
    .eq('id', id);
  
  if (!error2) {
    console.log('Deleted builder from builder_profiles');
    return true;
  }
  
  if (error1) throw error1;
  if (error2) throw error2;
  
  throw new Error('Failed to delete builder from either table');
}