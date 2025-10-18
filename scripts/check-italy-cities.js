const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkItalyCities() {
  console.log('🇮🇹 Checking current cities for Italy...');

  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('*')
      .eq('country_code', 'IT')
      .order('city_name');

    if (error) {
      console.error('❌ Error fetching cities:', error);
      return;
    }

    console.log(`\n📋 Current cities in Italy (${cities.length} total):`);
    cities.forEach(city => {
      console.log(`  • ${city.city_name} (${city.city_slug}) - ${city.state || 'No state'}`);
    });

  } catch (error) {
    console.error('❌ Error checking Italy cities:', error);
  }
}

// Run the check
checkItalyCities();
