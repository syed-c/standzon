const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testCitiesFetch() {
  try {
    console.log('🔍 Testing Supabase database structure...');
    console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    
    // List all tables
    console.log('\n📋 Listing all tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError.message);
    } else {
      console.log('Available tables:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
    
    // Check cities table specifically
    console.log('\n🏙️ Checking cities table...');
    const { data: citiesSample, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .limit(5);
    
    if (citiesError) {
      console.error('❌ Error fetching cities sample:', citiesError.message);
    } else {
      console.log(`Found ${citiesSample.length} sample cities:`);
      citiesSample.forEach(city => {
        console.log(`  - ${city.city_name || city.name} (${city.city_slug || city.slug}) - Country: ${city.country_code || 'N/A'}`);
      });
    }
    
    // Check if there's any data in the cities table
    console.log('\n🔢 Counting total cities...');
    const { count, error: countError } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting cities:', countError.message);
    } else {
      console.log(`Total cities in database: ${count}`);
    }
    
    // Check countries table
    console.log('\n🌍 Checking countries table...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .limit(10);
    
    if (countriesError) {
      console.error('❌ Error fetching countries:', countriesError.message);
    } else {
      console.log(`Found ${countries.length} countries:`);
      countries.forEach(country => {
        console.log(`  - ${country.country_name || country.name} (${country.country_code || country.code})`);
      });
    }
    
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCitiesFetch();