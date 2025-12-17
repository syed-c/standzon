require('dotenv/config');

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseUAEData() {
  console.log('🔍 Diagnosing UAE builder data...\n');
  
  // Check if we have the required credentials
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials');
    console.log('SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'SET' : 'MISSING');
    return;
  }
  
  try {
    // 1. Check builder_profiles table for UAE builders
    console.log('1️⃣ Checking builder_profiles table for UAE builders...');
    const { data: profiles, error: profilesError } = await supabase
      .from('builder_profiles')
      .select('*')
      .ilike('headquarters_country', '%united arab emirates%')
      .limit(5);
    
    if (profilesError) {
      console.log('❌ Error fetching builder profiles:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles.length} UAE builder profiles`);
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.company_name}`);
        console.log(`      Headquarters: ${profile.headquarters_city}, ${profile.headquarters_country}`);
        console.log(`      Status: ${profile.status || 'active'}`);
        console.log('');
      });
    }
    
    // 2. Check builders table for UAE builders
    console.log('2️⃣ Checking builders table for UAE builders...');
    const { data: builders, error: buildersError } = await supabase
      .from('builders')
      .select('*')
      .ilike('headquarters_country', '%united arab emirates%')
      .limit(5);
    
    if (buildersError) {
      console.log('❌ Error fetching builders:', buildersError.message);
    } else {
      console.log(`✅ Found ${builders.length} UAE builders`);
      builders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name}`);
        console.log(`      Headquarters: ${builder.headquarters_city}, ${builder.headquarters_country}`);
        console.log(`      Status: ${builder.status || 'active'}`);
        console.log('');
      });
    }
    
    // 3. Check for UAE builders with service locations
    console.log('3️⃣ Checking for UAE builders with service locations...');
    const { data: serviceBuilders, error: serviceError } = await supabase
      .from('builder_profiles')
      .select('*, service_locations(*)')
      .ilike('service_locations.country', '%united arab emirates%')
      .limit(3);
    
    if (serviceError) {
      console.log('❌ Error fetching service location builders:', serviceError.message);
    } else {
      console.log(`✅ Found ${serviceBuilders.length} builders with UAE service locations`);
      serviceBuilders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name}`);
        if (builder.service_locations && builder.service_locations.length > 0) {
          builder.service_locations.forEach(loc => {
            if (loc.country && loc.country.toLowerCase().includes('united arab emirates')) {
              console.log(`      Service Location: ${loc.city}, ${loc.country}`);
            }
          });
        }
        console.log('');
      });
    }
    
    // 4. Check for UAE builders with lowercase variations
    console.log('4️⃣ Checking for UAE builders with different casing...');
    const { data: lowerCaseBuilders, error: lowerCaseError } = await supabase
      .from('builder_profiles')
      .select('*')
      .or('headquarters_country.ilike.%UAE%,headquarters_country.ilike.%uae%')
      .limit(5);
    
    if (lowerCaseError) {
      console.log('❌ Error fetching lowercase UAE builders:', lowerCaseError.message);
    } else {
      console.log(`✅ Found ${lowerCaseBuilders.length} builders with lowercase UAE`);
      lowerCaseBuilders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name}`);
        console.log(`      Headquarters: ${builder.headquarters_city}, ${builder.headquarters_country}`);
        console.log('');
      });
    }
    
    console.log('🎉 Diagnosis complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

diagnoseUAEData();