import { supabase, supabaseAdmin } from '@/lib/supabase/client';

// Use admin client if available (bypasses RLS), otherwise use regular client
const client = supabaseAdmin || supabase;

export async function getAllBuilders() {
  console.log('🔍 Fetching all builders from Supabase...');
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    console.warn('⚠️ Supabase not configured. Returning empty builders array.');
    console.log('Environment variables check:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Present' : '✗ Missing');
    console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Present' : '✗ Missing');
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing');
    return [];
  }
  
  try {
    console.log('🔍 Using client type:', supabaseAdmin ? 'Admin (bypasses RLS)' : 'Regular (respects RLS)');
    
    // Try 'builders' table first (it has more data according to our test)
    console.log('🔍 Querying builders table...');
    const { data: data1, error: error1 } = await client
      .from('builders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error1 && data1 && data1.length > 0) {
      console.log('✅ Found builders in builders table:', data1.length);
      return data1;
    }
    
    console.log('⚠️ No data in builders table or error occurred, trying builder_profiles table...');
    if (error1) console.log('Builders table error (if any):', error1.message);
    
    // Fallback to 'builder_profiles' table
    console.log('🔍 Querying builder_profiles table...');
    const { data: data2, error: error2 } = await client
      .from('builder_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error2 && data2) {
      console.log('✅ Found builders in builder_profiles:', data2.length);
      return data2;
    }
    
    console.log('⚠️ No builders found in either table');
    if (error1) console.error('❌ Error from builders table:', error1.message);
    if (error2) console.error('❌ Error from builder_profiles table:', error2.message);
    
    // Try a simple count query to check if tables exist and are accessible
    console.log('🔍 Running diagnostic queries...');
    try {
      const { count: count1, error: countError1 } = await client
        .from('builders')
        .select('*', { count: 'exact', head: true });
      
      if (countError1) {
        console.error('❌ builders table access error:', countError1.message);
      } else {
        console.log('✅ builders table accessible, record count:', count1);
      }
      
      const { count: count2, error: countError2 } = await client
        .from('builder_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (countError2) {
        console.error('❌ builder_profiles table access error:', countError2.message);
      } else {
        console.log('✅ builder_profiles table accessible, record count:', count2);
      }
    } catch (diagError) {
      console.error('❌ Diagnostic query error:', diagError);
    }
    
    // Return empty array if no data found in either table
    return [];
  } catch (error) {
    console.error('❌ Unexpected error in getAllBuilders:', error);
    if (error instanceof Error) {
      console.error('❌ Error stack:', error.stack);
    }
    return [];
  }
}

export async function getBuilderBySlug(slug: string) {
  console.log('🔍 Fetching builder by slug:', slug);
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn('⚠️ Supabase not configured. Returning null.');
    return null;
  }
  
  // Try 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await client
    .from('builders')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!error1 && data1) {
    console.log('✅ Found builder in builders by slug');
    return data1;
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await client
    .from('builder_profiles')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!error2 && data2) {
    console.log('✅ Found builder in builder_profiles by slug');
    return data2;
  }
  
  if (error1) console.error('❌ Error from builders:', error1.message);
  if (error2) console.error('❌ Error from builder_profiles:', error2.message);
  
  return null;
}

export async function getBuilderById(id: string) {
  console.log('🔍 Fetching builder by ID:', id);
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn('⚠️ Supabase not configured. Returning null.');
    return null;
  }
  
  // Try 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await client
    .from('builders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!error1 && data1) {
    console.log('✅ Found builder in builders by ID');
    return data1;
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await client
    .from('builder_profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!error2 && data2) {
    console.log('✅ Found builder in builder_profiles by ID');
    return data2;
  }
  
  if (error1) console.error('❌ Error from builders:', error1.message);
  if (error2) console.error('❌ Error from builder_profiles:', error2.message);
  
  return null;
}

export async function createBuilder(builderData: any) {
  console.log('➕ Creating builder:', builderData);
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase not configured');
  }
  
  // Try to insert into 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await client
    .from('builders')
    .insert([builderData])
    .select();
  
  if (!error1 && data1) {
    console.log('✅ Created builder in builders');
    return data1[0];
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await client
    .from('builder_profiles')
    .insert([builderData])
    .select();
  
  if (!error2 && data2) {
    console.log('✅ Created builder in builder_profiles');
    return data2[0];
  }
  
  if (error1) throw error1;
  if (error2) throw error2;
  
  throw new Error('Failed to create builder in either table');
}

export async function updateBuilder(id: string, updates: any) {
  console.log('🔄 Updating builder:', id, updates);
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase not configured');
  }
  
  // Try to update in 'builders' table first (it has more data according to our test)
  const { data: data1, error: error1 } = await client
    .from('builders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (!error1 && data1) {
    console.log('✅ Updated builder in builders');
    return data1;
  }
  
  // Fallback to 'builder_profiles' table
  const { data: data2, error: error2 } = await client
    .from('builder_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (!error2 && data2) {
    console.log('✅ Updated builder in builder_profiles');
    return data2;
  }
  
  if (error1) throw error1;
  if (error2) throw error2;
  
  throw new Error('Failed to update builder in either table');
}

export async function deleteBuilder(id: string) {
  console.log('🗑️ Deleting builder:', id);
  
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase not configured');
  }
  
  // Try to delete from 'builders' table first (it has more data according to our test)
  const { error: error1 } = await client
    .from('builders')
    .delete()
    .eq('id', id);
  
  if (!error1) {
    console.log('✅ Deleted builder from builders');
    return true;
  }
  
  // Fallback to 'builder_profiles' table
  const { error: error2 } = await client
    .from('builder_profiles')
    .delete()
    .eq('id', id);
  
  if (!error2) {
    console.log('✅ Deleted builder from builder_profiles');
    return true;
  }
  
  if (error1) throw error1;
  if (error2) throw error2;
  
  throw new Error('Failed to delete builder from either table');
}