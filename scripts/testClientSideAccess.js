// Test client-side access to builders data
const { createClient } = require('@supabase/supabase-js');

// Simulate client-side environment (no service role key)
const supabaseUrl = 'https://elipizumpfnzmzifrcnl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaXBpenVtcGZuem16aWZyY25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTk0ODYsImV4cCI6MjA3MTg3NTQ4Nn0.ja14hIvo-7uLZQqCtnVsqaoHsE7h15aNCSCe5zQxZ38';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testClientAccess() {
  console.log('=== Testing Client-Side Access (Anon Key Only) ===\n');
  
  try {
    // Test builders table access
    console.log('1. Testing "builders" table access...');
    const { data: buildersData, error: buildersError } = await supabase
      .from('builders')
      .select('*')
      .limit(5);
    
    if (buildersError) {
      console.error('   Error:', buildersError.message);
    } else {
      console.log(`   Found ${buildersData.length} records in "builders" table`);
    }
    
    // Test builder_profiles table access
    console.log('2. Testing "builder_profiles" table access...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('builder_profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.error('   Error:', profilesError.message);
    } else {
      console.log(`   Found ${profilesData.length} records in "builder_profiles" table`);
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testClientAccess();