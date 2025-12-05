const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addWerepairBuilder() {
  console.log('➕ Adding werepair builder to Supabase...');

  try {
    // First, check if UAE exists in countries
    let uaeCountry = null;
    const { data: countries, error: countryError } = await supabase
      .from('countries')
      .select('*')
      .eq('country_code', 'AE')
      .single();

    if (countryError && countryError.code === 'PGRST116') {
      // UAE doesn't exist, create it
      console.log('🇦🇪 Creating UAE country...');
      const { data: newCountry, error: createError } = await supabase
        .from('countries')
        .insert({
          country_name: 'United Arab Emirates',
          country_code: 'AE',
          country_slug: 'united-arab-emirates',
          continent: 'Asia',
          currency: 'AED',
          timezone: 'Asia/Dubai',
          language: 'ar',
          active: true,
          builder_count: 0,
          exhibition_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating UAE country:', createError);
        return;
      }
      uaeCountry = newCountry;
      console.log('✅ Created UAE country');
    } else if (countries) {
      uaeCountry = countries;
      console.log('✅ Found existing UAE country');
    } else {
      console.error('❌ Error fetching UAE country:', countryError);
      return;
    }

    // Add werepair builder
    const builderData = {
      company_name: 'werepair',
      slug: 'werepair',
      primary_email: 'info@werepair.com',
      phone: '+971 50 123 4567',
      website: 'https://werepair.com',
      headquarters_city: 'Dubai',
      headquarters_country: 'United Arab Emirates',
      headquarters_country_code: 'AE',
      headquarters_address: 'Dubai, UAE',
      contact_person: 'John Smith',
      position: 'Manager',
      company_description: 'Professional exhibition stand builders in Dubai, UAE. We specialize in custom exhibition stands, trade show booths, and event displays.',
      team_size: 15,
      projects_completed: 2,
      rating: 4.7,
      review_count: 39,
      response_time: 'Within 24 hours',
      languages: ['English', 'Arabic'],
      verified: true,
      premium_member: false,
      claimed: true,
      claim_status: 'claimed',
      basic_stand_min: 5000,
      basic_stand_max: 15000,
      custom_stand_min: 15000,
      custom_stand_max: 50000,
      premium_stand_min: 50000,
      premium_stand_max: 100000,
      average_project: 25000,
      currency: 'AED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: builder, error: builderError } = await supabase
      .from('builder_profiles')
      .insert(builderData)
      .select()
      .single();

    if (builderError) {
      console.error('❌ Error adding werepair builder:', builderError);
      return;
    }

    console.log('✅ Successfully added werepair builder:', builder.company_name);
    console.log(`   - ID: ${builder.id}`);
    console.log(`   - Location: ${builder.headquarters_city}, ${builder.headquarters_country}`);
    console.log(`   - Verified: ${builder.verified}`);

    // Update UAE builder count
    const { error: updateError } = await supabase
      .from('countries')
      .update({ 
        builder_count: 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', uaeCountry.id);

    if (updateError) {
      console.error('❌ Error updating UAE builder count:', updateError);
    } else {
      console.log('✅ Updated UAE builder count');
    }

  } catch (error) {
    console.error('❌ Error adding werepair builder:', error);
  }
}

// Run the script
addWerepairBuilder();
