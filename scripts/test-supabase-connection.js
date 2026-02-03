// Script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');

console.log('=== Testing Supabase Connection ===');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment variables check:');
console.log('- Supabase URL:', supabaseUrl ? '✓ Present' : '✗ Missing');
console.log('- Anon Key:', supabaseAnonKey ? '✓ Present' : '✗ Missing');
console.log('- Service Key:', supabaseServiceKey ? '✓ Present' : '✗ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required Supabase environment variables');
  process.exit(1);
}

// Test with anon key (client-side)
console.log('\n1. Testing with Anon Key (Client-side access)...');
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonAccess() {
  try {
    // Test connection by fetching a small amount of data
    console.log('   Testing connection to builder_profiles table...');
    const { data, error } = await supabaseAnon
      .from('builder_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('   ❌ Error:', error.message);
      return false;
    } else {
      console.log('   ✅ Connection successful');
      console.log('   Found records:', data.length);
      return true;
    }
  } catch (err) {
    console.error('   ❌ Exception:', err.message);
    return false;
  }
}

// Test with service key (admin access) if available
if (supabaseServiceKey) {
  console.log('\n2. Testing with Service Key (Admin access)...');
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  async function testAdminAccess() {
    try {
      // Test connection by fetching a small amount of data
      console.log('   Testing connection to builder_profiles table...');
      const { data, error } = await supabaseAdmin
        .from('builder_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('   ❌ Error:', error.message);
        return false;
      } else {
        console.log('   ✅ Connection successful');
        console.log('   Found records:', data.length);
        return true;
      }
    } catch (err) {
      console.error('   ❌ Exception:', err.message);
      return false;
    }
  }
  
  // Run tests
  Promise.all([
    testAnonAccess(),
    testAdminAccess()
  ]).then(([anonResult, adminResult]) => {
    console.log('\n=== Test Results ===');
    console.log('Anon Access:', anonResult ? '✅ Pass' : '❌ Fail');
    console.log('Admin Access:', adminResult ? '✅ Pass' : '❌ Fail');
    
    if (anonResult || adminResult) {
      console.log('✅ At least one connection method works');
      process.exit(0);
    } else {
      console.log('❌ Both connection methods failed');
      process.exit(1);
    }
  });
} else {
  // Only test anon access
  testAnonAccess().then(result => {
    console.log('\n=== Test Results ===');
    console.log('Anon Access:', result ? '✅ Pass' : '❌ Fail');
    
    if (result) {
      console.log('✅ Connection successful');
      process.exit(0);
    } else {
      console.log('❌ Connection failed');
      process.exit(1);
    }
  });
}