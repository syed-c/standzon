const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAllBuilders() {
  console.log('🔍 Checking all builders in database...');

  try {
    const { data: builders, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .limit(10);

    if (error) {
      console.error('❌ Error fetching builders:', error);
      return;
    }

    console.log(`\n📋 Found ${builders.length} builders total:`);
    builders.forEach(builder => {
      console.log(`  • ${builder.company_name} (${builder.slug})`);
      console.log(`    - Headquarters: ${builder.headquarters_city}, ${builder.headquarters_country}`);
      console.log(`    - Verified: ${builder.verified}`);
      console.log(`    - Created: ${builder.created_at}`);
      console.log('');
    });

    // Check countries
    console.log('\n🌍 Checking countries:');
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('*')
      .limit(5);

    if (countryError) {
      console.error('❌ Error fetching countries:', countryError);
      return;
    }

    console.log(`\n📋 Found ${countries.length} countries:`);
    countries.forEach(country => {
      console.log(`  • ${country.country_name} (${country.country_code})`);
    });

  } catch (error) {
    console.error('❌ Error checking builders:', error);
  }
}

// Run the check
checkAllBuilders();
