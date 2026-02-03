const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWerepairBuilder() {
  console.log('🔍 Checking werepair builder in database...');

  try {
    // Search for werepair builder
    const { data: builders, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .or('company_name.ilike.%werepair%,slug.ilike.%werepair%')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching builders:', error);
      return;
    }

    console.log(`\n📋 Found ${builders.length} builders matching 'werepair':`);
    builders.forEach(builder => {
      console.log(`  • ${builder.company_name} (${builder.slug})`);
      console.log(`    - Headquarters: ${builder.headquarters_city}, ${builder.headquarters_country}`);
      console.log(`    - Verified: ${builder.verified}`);
      console.log(`    - Email: ${builder.primary_email}`);
      console.log(`    - Created: ${builder.created_at}`);
      console.log('');
    });

    // Also check UAE builders specifically
    console.log('\n🇦🇪 Checking all UAE builders:');
    const { data: uaeBuilders, error: uaeError } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('headquarters_country', 'United Arab Emirates')
      .limit(10);

    if (uaeError) {
      console.error('❌ Error fetching UAE builders:', uaeError);
      return;
    }

    console.log(`\n📋 Found ${uaeBuilders.length} builders in UAE:`);
    uaeBuilders.forEach(builder => {
      console.log(`  • ${builder.company_name} (${builder.slug})`);
      console.log(`    - Verified: ${builder.verified}`);
      console.log(`    - City: ${builder.headquarters_city}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking werepair builder:', error);
  }
}

// Run the check
checkWerepairBuilder();
