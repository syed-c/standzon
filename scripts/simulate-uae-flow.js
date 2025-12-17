require('dotenv/config');

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateFullUAEFlow() {
  console.log('🔍 Simulating full UAE page flow...\n');
  
  try {
    // Simulate URL parameters
    const urlParams = {
      country: 'united-arab-emirates',
      city: 'dubai'
    };
    
    console.log('1️⃣ URL Parameters:');
    console.log('   Country:', urlParams.country);
    console.log('   City:', urlParams.city);
    
    // Simulate page component normalization
    console.log('\n2️⃣ Normalization:');
    const normalize = (s) => {
      return s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    };
    
    const toTitle = (s) => {
      return s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };
    
    const countrySlug = normalize(urlParams.country);
    const citySlug = normalize(urlParams.city);
    const countryName = toTitle(countrySlug);
    const cityName = toTitle(citySlug);
    
    console.log('   Country slug:', countrySlug);
    console.log('   City slug:', citySlug);
    console.log('   Country name:', countryName);
    console.log('   City name:', cityName);
    
    // Simulate fetching builders from API
    console.log('\n3️⃣ Fetching builders from API...');
    const { data: buildersData, error: apiError } = await supabase
      .from('builder_profiles')
      .select('*');
    
    if (apiError) {
      console.log('❌ API Error:', apiError.message);
      return;
    }
    
    console.log(`   Fetched ${buildersData.builders?.length || buildersData.length} builders`);
    
    // Simulate the exact filtering logic from the page component
    console.log('\n4️⃣ Applying filtering logic...');
    
    // Handle country name variations (UAE vs United Arab Emirates)
    const normalizedCountryName = countryName.toLowerCase();
    const countryVariations = [normalizedCountryName];
    if (normalizedCountryName.includes("united arab emirates")) {
      countryVariations.push("uae");
    } else if (normalizedCountryName === "uae") {
      countryVariations.push("united arab emirates");
    }
    
    console.log('   Country variations:', countryVariations);
    
    // Filter builders for this city and country
    const filteredBuilders = buildersData.filter((builder) => {
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
      
      return headquartersMatch || serviceLocationMatch;
    });
    
    console.log(`\n5️⃣ Results:`);
    console.log(`   Filtered builders: ${filteredBuilders.length}`);
    
    if (filteredBuilders.length > 0) {
      console.log('   Builders found:');
      filteredBuilders.forEach((builder, index) => {
        console.log(`     ${index + 1}. ${builder.company_name}`);
        console.log(`        Headquarters: ${builder.headquarters_city}, ${builder.headquarters_country}`);
      });
    } else {
      console.log('   ❌ No builders found - this indicates a problem!');
      
      // Debug information
      console.log('\n   🔍 Debug information:');
      console.log('   Looking for:');
      console.log('   - City:', cityName.toLowerCase());
      console.log('   - Country variations:', countryVariations);
      
      // Show first few builders and their data
      console.log('\n   First 3 builders in database:');
      buildersData.slice(0, 3).forEach((builder, index) => {
        console.log(`     ${index + 1}. ${builder.company_name}`);
        console.log(`        Headquarters City: "${builder.headquarters_city}"`);
        console.log(`        Headquarters Country: "${builder.headquarters_country}"`);
        console.log(`        Normalized City: "${builder.headquarters_city?.toLowerCase().trim()}"`);
        console.log(`        Normalized Country: "${builder.headquarters_country?.toLowerCase().trim()}"`);
      });
    }
    
    console.log('\n🎉 Full flow simulation complete!');
    
  } catch (error) {
    console.error('❌ Error in simulation:', error);
  }
}

simulateFullUAEFlow();