const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

async function testUaeBuilders() {
  console.log('🧪 Testing UAE builders fetch...\n');
  
  try {
    // Test 1: Fetch all builders
    console.log('1️⃣ Fetching all builders...');
    const { data: allBuilders, error: allError } = await supabase
      .from('builder_profiles')
      .select('*')
      .limit(5);
    
    if (allError) {
      console.log('❌ All builders fetch error:', allError.message);
    } else {
      console.log('✅ All builders fetch successful');
      console.log('   Total builders:', allBuilders.length);
      console.log('   Sample builders:');
      allBuilders.forEach((builder, index) => {
        console.log(`     ${index + 1}. ${builder.company_name} - ${builder.headquarters_country}, ${builder.headquarters_city}`);
      });
    }
    console.log('');
    
    // Test 2: Fetch UAE builders specifically
    console.log('2️⃣ Fetching UAE builders...');
    const { data: uaeBuilders, error: uaeError } = await supabase
      .from('builder_profiles')
      .select('*')
      .ilike('headquarters_country', '%united arab emirates%');
    
    if (uaeError) {
      console.log('❌ UAE builders fetch error:', uaeError.message);
    } else {
      console.log('✅ UAE builders fetch successful');
      console.log('   UAE builders count:', uaeBuilders.length);
      if (uaeBuilders.length > 0) {
        console.log('   UAE builders:');
        uaeBuilders.forEach((builder, index) => {
          console.log(`     ${index + 1}. ${builder.company_name} - ${builder.headquarters_city}`);
        });
      }
    }
    console.log('');
    
    // Test 3: Fetch Dubai builders specifically
    console.log('3️⃣ Fetching Dubai builders...');
    const { data: dubaiBuilders, error: dubaiError } = await supabase
      .from('builder_profiles')
      .select('*')
      .ilike('headquarters_city', '%dubai%');
    
    if (dubaiError) {
      console.log('❌ Dubai builders fetch error:', dubaiError.message);
    } else {
      console.log('✅ Dubai builders fetch successful');
      console.log('   Dubai builders count:', dubaiBuilders.length);
      if (dubaiBuilders.length > 0) {
        console.log('   Dubai builders:');
        dubaiBuilders.forEach((builder, index) => {
          console.log(`     ${index + 1}. ${builder.company_name} - ${builder.headquarters_country}`);
        });
      }
    }
    console.log('');
    
    // Test 4: Check builders table as well
    console.log('4️⃣ Checking builders table...');
    const { data: buildersTable, error: buildersError } = await supabase
      .from('builders')
      .select('*')
      .limit(5);
    
    if (buildersError) {
      console.log('❌ Builders table fetch error:', buildersError.message);
    } else {
      console.log('✅ Builders table fetch successful');
      console.log('   Builders table count:', buildersTable.length);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  console.log('\n🏁 Test completed');
}

testUaeBuilders();