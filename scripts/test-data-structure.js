const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBuilderDataStructure() {
  console.log('🧪 Testing builder data structure transformation...');

  try {
    // Get UAE builders
    const { data: rawBuilders, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('headquarters_country', 'United Arab Emirates')
      .eq('verified', true)
      .limit(2);

    if (error) {
      console.error('❌ Error fetching builders:', error);
      return;
    }

    console.log('\n📋 Raw Supabase data:');
    rawBuilders.forEach((builder, index) => {
      console.log(`\nBuilder ${index + 1}:`);
      console.log(`  - company_name: ${builder.company_name}`);
      console.log(`  - headquarters_city: ${builder.headquarters_city}`);
      console.log(`  - headquarters_country: ${builder.headquarters_country}`);
      console.log(`  - verified: ${builder.verified}`);
    });

    // Transform data like in the country page
    const transformedBuilders = rawBuilders.map((builder) => ({
      id: builder.id,
      companyName: builder.company_name,
      slug: builder.slug,
      logo: builder.logo || "/images/builders/default-logo.png",
      establishedYear: builder.established_year || 2020,
      headquarters: {
        city: builder.headquarters_city || "Unknown",
        country: builder.headquarters_country || "Unknown",
        countryCode: builder.headquarters_country_code || "XX",
        address: builder.headquarters_address || "",
        latitude: builder.headquarters_latitude || 0,
        longitude: builder.headquarters_longitude || 0,
        isHeadquarters: true,
      },
      serviceLocations: [
        {
          city: builder.headquarters_city || "Unknown",
          country: builder.headquarters_country || "Unknown",
          countryCode: builder.headquarters_country_code || "XX",
          address: builder.headquarters_address || "",
          latitude: builder.headquarters_latitude || 0,
          longitude: builder.headquarters_longitude || 0,
          isHeadquarters: false,
        },
      ],
      contactInfo: {
        primaryEmail: builder.primary_email || "",
        phone: builder.phone || "",
        website: builder.website || "",
        contactPerson: builder.contact_person || "Contact Person",
        position: builder.position || "Manager",
      },
      services: [],
      specializations: [
        { id: 'general', name: 'Exhibition Builder', icon: '🏗️', color: '#3B82F6' }
      ],
      companyDescription: builder.company_description || 'Professional exhibition services provider',
      keyStrengths: ["Professional Service", "Quality Work", "Local Expertise"],
      projectsCompleted: builder.projects_completed || 25,
      rating: builder.rating || 4.0,
      reviewCount: builder.review_count || 0,
      responseTime: builder.response_time || 'Within 24 hours',
      languages: builder.languages || ['English'],
      verified: builder.verified || false,
      premiumMember: builder.premium_member || false,
      claimed: builder.claimed || false,
      claimStatus: builder.claim_status || 'unclaimed',
      teamSize: builder.team_size || 10,
      averageProjectValue: builder.average_project || 15000,
      currency: builder.currency || 'USD',
      basicStandMin: builder.basic_stand_min || 5000,
      basicStandMax: builder.basic_stand_max || 15000,
      customStandMin: builder.custom_stand_min || 15000,
      customStandMax: builder.custom_stand_max || 50000,
      premiumStandMin: builder.premium_stand_min || 50000,
      premiumStandMax: builder.premium_stand_max || 100000,
      gmbImported: builder.gmb_imported || false,
      importedFromGmb: builder.imported_from_gmb || false,
      source: builder.source || 'manual',
      createdAt: builder.created_at,
      updatedAt: builder.updated_at,
    }));

    console.log('\n✅ Transformed data structure:');
    transformedBuilders.forEach((builder, index) => {
      console.log(`\nBuilder ${index + 1}:`);
      console.log(`  - companyName: ${builder.companyName}`);
      console.log(`  - headquarters.city: ${builder.headquarters.city}`);
      console.log(`  - headquarters.country: ${builder.headquarters.country}`);
      console.log(`  - verified: ${builder.verified}`);
      console.log(`  - projectsCompleted: ${builder.projectsCompleted}`);
      console.log(`  - rating: ${builder.rating}`);
    });

    console.log('\n🎉 Data structure transformation test completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test
testBuilderDataStructure();
