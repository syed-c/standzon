require('dotenv/config');

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUAEBuildersFiltering() {
  console.log('🔍 Testing UAE builders filtering logic...\n');
  
  try {
    // Get all builders from the database
    console.log('1️⃣ Fetching all builders from database...');
    const { data: allBuilders, error: fetchError } = await supabase
      .from('builder_profiles')
      .select('*');
    
    if (fetchError) {
      console.log('❌ Error fetching builders:', fetchError.message);
      return;
    }
    
    console.log(`✅ Fetched ${allBuilders.length} total builders`);
    
    // Test the filtering logic for UAE
    console.log('\n2️⃣ Testing UAE filtering logic...');
    
    const countryName = "United Arab Emirates";
    const cityName = "Dubai";
    
    // Apply the same filtering logic as in the page components
    const normalizedCountryName = countryName.toLowerCase();
    const countryVariations = [normalizedCountryName];
    if (normalizedCountryName.includes("united arab emirates")) {
      countryVariations.push("uae");
    } else if (normalizedCountryName === "uae") {
      countryVariations.push("united arab emirates");
    }
    
    console.log('Country variations for filtering:', countryVariations);
    
    // Filter builders for this city and country
    const filteredBuilders = allBuilders.filter((builder) => {
      // Normalize strings for comparison
      const normalizeString = (str) => {
        if (!str) return '';
        return str.toString().toLowerCase().trim();
      };
      
      const normalizedCity = normalizeString(cityName);
      
      // Check headquarters (handle different field names)
      const headquartersCity = normalizeString(
        builder.headquarters_city || 
        builder.headquarters?.city || 
        ''
      );
      const headquartersCountry = normalizeString(
        builder.headquarters_country || 
        builder.headquarters?.country || 
        builder.headquartersCountry || 
        ''
      );
      
      const headquartersMatch = 
        (headquartersCity === normalizedCity || headquartersCity.includes(normalizedCity)) &&
        countryVariations.some(variation => 
          headquartersCountry === variation || headquartersCountry.includes(variation)
        );
      
      // Check service locations
      const serviceLocations = builder.service_locations || builder.serviceLocations || [];
      const serviceLocationMatch = serviceLocations.some((loc) => {
        const serviceCity = normalizeString(loc.city);
        const serviceCountry = normalizeString(loc.country);
        return (
          (serviceCity === normalizedCity || serviceCity.includes(normalizedCity)) &&
          countryVariations.some(variation => 
            serviceCountry === variation || serviceCountry.includes(variation)
          )
        );
      });
      
      // Log for debugging first few builders
      if (allBuilders.indexOf(builder) < 3) {
        console.log('🔍 Filtering builder:', {
          company: builder.company_name,
          headquartersCity,
          headquartersCountry,
          headquartersMatch,
          serviceLocationMatch,
          finalResult: headquartersMatch || serviceLocationMatch
        });
      }
      
      return headquartersMatch || serviceLocationMatch;
    });
    
    console.log(`\n📊 Filtered builders for ${cityName}, ${countryName}: ${filteredBuilders.length}`);
    
    if (filteredBuilders.length > 0) {
      console.log('\n📋 Filtered builders:');
      filteredBuilders.forEach((builder, index) => {
        console.log(`   ${index + 1}. ${builder.company_name}`);
        console.log(`      Headquarters: ${builder.headquarters_city}, ${builder.headquarters_country}`);
      });
    } else {
      console.log('\n⚠️ No builders found after filtering. This indicates the filtering logic may have issues.');
      
      // Let's check what the actual data looks like
      console.log('\n🔍 Detailed inspection of UAE builders:');
      const uaeBuilders = allBuilders.filter(builder => 
        builder.headquarters_country && 
        builder.headquarters_country.toLowerCase().includes('united arab emirates')
      );
      
      uaeBuilders.forEach((builder, index) => {
        console.log(`\n   Builder ${index + 1}: ${builder.company_name}`);
        console.log(`      Headquarters City: "${builder.headquarters_city}"`);
        console.log(`      Headquarters Country: "${builder.headquarters_country}"`);
        console.log(`      Normalized City: "${builder.headquarters_city?.toLowerCase().trim()}"`);
        console.log(`      Normalized Country: "${builder.headquarters_country?.toLowerCase().trim()}"`);
      });
    }
    
    console.log('\n🎉 Test complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testUAEBuildersFiltering();