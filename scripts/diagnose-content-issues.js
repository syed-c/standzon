const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function diagnoseContentIssues() {
  console.log('🧪 Diagnosing content issues...\n');
  
  try {
    // 1. Check if we can connect to Supabase
    console.log('1️⃣ Testing Supabase connection...');
    const { data: testConnection, error: connectionError } = await supabase
      .from('page_contents')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Connection successful\n');
    
    // 2. Check page_contents table
    console.log('2️⃣ Checking page_contents table...');
    const { data: pageContents, error: pageContentsError } = await supabase
      .from('page_contents')
      .select('*')
      .limit(10);
    
    if (pageContentsError) {
      console.error('❌ Error fetching page_contents:', pageContentsError.message);
    } else {
      console.log(`✅ Found ${pageContents.length} records in page_contents`);
      pageContents.forEach((page, index) => {
        console.log(`   ${index + 1}. ID: ${page.id}`);
        console.log(`      Content type: ${typeof page.content}`);
        if (page.content && typeof page.content === 'object') {
          console.log(`      Content keys: ${Object.keys(page.content).join(', ')}`);
        }
      });
    }
    console.log('');
    
    // 3. Check specific city page (Dubai)
    console.log('3️⃣ Checking Dubai city page...');
    const { data: dubaiPage, error: dubaiError } = await supabase
      .from('page_contents')
      .select('*')
      .eq('id', 'united-arab-emirates-dubai')
      .single();
    
    if (dubaiError) {
      console.log('⚠️  Dubai page not found or error:', dubaiError.message);
    } else if (dubaiPage) {
      console.log('✅ Dubai page found:');
      console.log('   ID:', dubaiPage.id);
      console.log('   Content type:', typeof dubaiPage.content);
      if (dubaiPage.content) {
        console.log('   Content structure:');
        console.log(JSON.stringify(dubaiPage.content, null, 2));
      }
    }
    console.log('');
    
    // 4. Check builders table
    console.log('4️⃣ Checking builders data...');
    const { data: builders, error: buildersError } = await supabase
      .from('builders')
      .select('*')
      .limit(5);
    
    if (buildersError) {
      console.log('⚠️  Error checking builders table:', buildersError.message);
      
      // Try builder_profiles table
      console.log('   Trying builder_profiles table...');
      const { data: profiles, error: profilesError } = await supabase
        .from('builder_profiles')
        .select('*')
        .limit(5);
      
      if (profilesError) {
        console.log('❌ Error checking builder_profiles table:', profilesError.message);
      } else {
        console.log(`✅ Found ${profiles.length} records in builder_profiles`);
        profiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.company_name || profile.companyName || 'Unknown'} (${profile.id})`);
          console.log(`      Headquarters: ${profile.headquarters_city || profile.headquarters?.city}, ${profile.headquarters_country || profile.headquarters?.country}`);
        });
      }
    } else {
      console.log(`✅ Found ${builders.length} records in builders table`);
      builders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name || builder.companyName || 'Unknown'} (${builder.id})`);
        console.log(`      Headquarters: ${builder.headquarters_city || builder.headquarters?.city}, ${builder.headquarters_country || builder.headquarters?.country}`);
      });
    }
    console.log('');
    
    // 5. Check UAE builders specifically
    console.log('5️⃣ Checking UAE builders...');
    const { data: uaeBuilders, error: uaeError } = await supabase
      .from('builder_profiles')
      .select('*')
      .ilike('headquarters_country', '%united arab emirates%')
      .limit(5);
    
    if (uaeError) {
      console.log('❌ Error checking UAE builders:', uaeError.message);
    } else {
      console.log(`✅ Found ${uaeBuilders.length} UAE builders`);
      uaeBuilders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name} in ${builder.headquarters_city}`);
      });
    }
    
    console.log('\n🎉 Diagnosis complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

diagnoseContentIssues();