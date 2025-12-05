const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateItalyCities() {
  console.log('🇮🇹 Updating cities for Italy...');

  try {
    // First, get Italy's country data
    const { data: italy, error: countryError } = await supabase
      .from('countries')
      .select('*')
      .eq('country_code', 'IT')
      .single();

    if (countryError || !italy) {
      console.error('❌ Error finding Italy:', countryError);
      return;
    }

    console.log('✅ Found Italy:', italy.country_name);

    // Cities to add
    const citiesToAdd = [
      {
        city_name: 'Rimini',
        city_slug: 'rimini',
        country_id: italy.id,
        country_name: italy.country_name,
        country_code: italy.country_code,
        state: 'Emilia-Romagna',
        timezone: 'Europe/Rome',
        latitude: 44.0678,
        longitude: 12.5695,
        population: 150000,
        active: true,
        builder_count: 0,
        exhibition_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        city_name: 'Florence',
        city_slug: 'florence',
        country_id: italy.id,
        country_name: italy.country_name,
        country_code: italy.country_code,
        state: 'Tuscany',
        timezone: 'Europe/Rome',
        latitude: 43.7696,
        longitude: 11.2558,
        population: 380000,
        active: true,
        builder_count: 0,
        exhibition_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        city_name: 'Canova',
        city_slug: 'canova',
        country_id: italy.id,
        country_name: italy.country_name,
        country_code: italy.country_code,
        state: 'Veneto',
        timezone: 'Europe/Rome',
        latitude: 45.4408,
        longitude: 12.3155,
        population: 12000,
        active: true,
        builder_count: 0,
        exhibition_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Add new cities
    console.log('➕ Adding new cities...');
    for (const city of citiesToAdd) {
      const { data, error } = await supabase
        .from('cities')
        .insert(city);

      if (error) {
        console.error(`❌ Error adding ${city.city_name}:`, error);
      } else {
        console.log(`✅ Added ${city.city_name}`);
      }
    }

    // Remove old cities
    const citiesToRemove = ['Venice', 'Naples'];
    console.log('➖ Removing old cities...');
    
    for (const cityName of citiesToRemove) {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('city_name', cityName)
        .eq('country_code', 'IT');

      if (error) {
        console.error(`❌ Error removing ${cityName}:`, error);
      } else {
        console.log(`✅ Removed ${cityName}`);
      }
    }

    console.log('🎉 Italy cities update completed!');

  } catch (error) {
    console.error('❌ Error updating Italy cities:', error);
  }
}

// Run the update
updateItalyCities();
