const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key available:', !!supabaseAnonKey);
console.log('Service Key available:', !!supabaseServiceKey);

if (!supabaseUrl) {
  console.error('Missing Supabase URL environment variable');
  process.exit(1);
}

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey || '');
const supabaseService = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function checkBuildersData() {
  console.log('=== Checking Builders Data ===\n');
  
  try {
    // Try with service role key first (bypasses RLS)
    if (supabaseService) {
      console.log('1. Checking with Service Role Key (bypasses RLS)...');
      
      // Check builders table
      console.log('   Checking "builders" table...');
      const { data: buildersData, error: buildersError } = await supabaseService
        .from('builders')
        .select('*')
        .limit(5);
      
      if (buildersError) {
        console.error('   Error fetching from builders table:', buildersError.message);
      } else {
        console.log(`   Found ${buildersData.length} records in "builders" table`);
        if (buildersData.length > 0) {
          console.log('   Sample record:', buildersData[0].company_name);
        }
      }
      
      // Check builder_profiles table
      console.log('   Checking "builder_profiles" table...');
      const { data: profilesData, error: profilesError } = await supabaseService
        .from('builder_profiles')
        .select('*')
        .limit(5);
      
      if (profilesError) {
        console.error('   Error fetching from builder_profiles table:', profilesError.message);
      } else {
        console.log(`   Found ${profilesData.length} records in "builder_profiles" table`);
        if (profilesData.length > 0) {
          console.log('   Sample record:', profilesData[0].company_name);
        }
      }
    } else {
      console.log('1. Service Role Key not available, skipping service role checks');
    }
    
    // Try with anon key (respects RLS)
    console.log('\n2. Checking with Anon Key (respects RLS)...');
    
    // Check builders table
    console.log('   Checking "builders" table...');
    const { data: anonBuildersData, error: anonBuildersError } = await supabaseAnon
      .from('builders')
      .select('*')
      .limit(5);
    
    if (anonBuildersError) {
      console.error('   Error fetching from builders table:', anonBuildersError.message);
    } else {
      console.log(`   Found ${anonBuildersData.length} records in "builders" table`);
      if (anonBuildersData.length > 0) {
        console.log('   Sample record:', anonBuildersData[0].company_name);
      }
    }
    
    // Check builder_profiles table
    console.log('   Checking "builder_profiles" table...');
    const { data: anonProfilesData, error: anonProfilesError } = await supabaseAnon
      .from('builder_profiles')
      .select('*')
      .limit(5);
    
    if (anonProfilesError) {
      console.error('   Error fetching from builder_profiles table:', anonProfilesError.message);
    } else {
      console.log(`   Found ${anonProfilesData.length} records in "builder_profiles" table`);
      if (anonProfilesData.length > 0) {
        console.log('   Sample record:', anonProfilesData[0].company_name);
      }
    }
    
    // Try to get count of all records
    console.log('\n3. Getting record counts...');
    
    if (supabaseService) {
      const { count: buildersCount, error: countBuildersError } = await supabaseService
        .from('builders')
        .select('*', { count: 'exact', head: true });
      
      if (!countBuildersError) {
        console.log(`   Total records in "builders" table: ${buildersCount}`);
      }
      
      const { count: profilesCount, error: countProfilesError } = await supabaseService
        .from('builder_profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!countProfilesError) {
        console.log(`   Total records in "builder_profiles" table: ${profilesCount}`);
      }
    }
    
    console.log('\n=== Check Complete ===');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

checkBuildersData();