const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugBuilderFlow() {
  console.log('🔍 Debugging builder data flow...');

  try {
    // Test 1: Check raw Supabase data
    console.log('\n1️⃣ Raw Supabase data:');
    const { data: rawBuilders, error } = await supabase
      .from('builder_profiles')
      .select('*')
      .eq('headquarters_country', 'United Arab Emirates')
      .eq('verified', true);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`Found ${rawBuilders.length} builders:`);
    rawBuilders.forEach((builder, index) => {
      console.log(`  ${index + 1}. ${builder.company_name} (${builder.slug})`);
      console.log(`     - Verified: ${builder.verified}`);
      console.log(`     - Rating: ${builder.rating}`);
      console.log(`     - Projects: ${builder.projects_completed}`);
    });

    // Test 2: Transform data like in country page
    console.log('\n2️⃣ Transformed data (like country page):');
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

    console.log(`Transformed ${transformedBuilders.length} builders:`);
    transformedBuilders.forEach((builder, index) => {
      console.log(`  ${index + 1}. ${builder.companyName} (${builder.slug})`);
      console.log(`     - Headquarters: ${builder.headquarters.city}, ${builder.headquarters.country}`);
      console.log(`     - Verified: ${builder.verified}`);
      console.log(`     - Rating: ${builder.rating}`);
      console.log(`     - Projects: ${builder.projectsCompleted}`);
      console.log(`     - Has headquarters.city: ${!!builder.headquarters.city}`);
      console.log(`     - Has headquarters.country: ${!!builder.headquarters.country}`);
    });

    // Test 3: Check if data would pass BuilderCard validation
    console.log('\n3️⃣ BuilderCard validation:');
    transformedBuilders.forEach((builder, index) => {
      const hasRequiredFields = !!(
        builder.companyName &&
        builder.headquarters &&
        builder.headquarters.city &&
        builder.headquarters.country
      );
      console.log(`  Builder ${index + 1}: ${hasRequiredFields ? '✅ Valid' : '❌ Invalid'}`);
      if (!hasRequiredFields) {
        console.log(`     Missing: companyName=${!!builder.companyName}, headquarters=${!!builder.headquarters}, city=${!!builder.headquarters?.city}, country=${!!builder.headquarters?.country}`);
      }
    });

    console.log('\n🎉 Debug completed!');

  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
}

// Run the debug
debugBuilderFlow();
