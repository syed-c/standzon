// Test UAE page rendering logic
async function testUAEPageRendering() {
  console.log('🔍 Testing UAE page rendering logic...\n');
  
  try {
    // Simulate the country and city names as they would appear in the URL
    const countrySlug = 'united-arab-emirates';
    const citySlug = 'dubai';
    
    console.log('Testing with:');
    console.log('- Country slug:', countrySlug);
    console.log('- City slug:', citySlug);
    
    // Simulate the normalization logic used in the page component
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
    
    const countryName = toTitle(countrySlug);
    const cityName = toTitle(citySlug);
    
    console.log('\nNormalized names:');
    console.log('- Country name:', countryName);
    console.log('- City name:', cityName);
    
    // Test the country variations logic
    const normalizedCountryName = countryName.toLowerCase();
    const countryVariations = [normalizedCountryName];
    if (normalizedCountryName.includes("united arab emirates")) {
      countryVariations.push("uae");
    } else if (normalizedCountryName === "uae") {
      countryVariations.push("united arab emirates");
    }
    
    console.log('\nCountry variations:', countryVariations);
    
    // Check if the variations are correct
    const hasUAE = countryVariations.includes("uae");
    const hasUnitedArabEmirates = countryVariations.includes("united arab emirates");
    
    console.log('\nValidation:');
    console.log('- Has "uae":', hasUAE);
    console.log('- Has "united arab emirates":', hasUnitedArabEmirates);
    
    if (hasUAE && hasUnitedArabEmirates) {
      console.log('✅ Country variations logic is correct');
    } else {
      console.log('❌ Country variations logic has issues');
    }
    
    console.log('\n🎉 Page rendering test complete!');
    
  } catch (error) {
    console.error('❌ Error testing page rendering:', error);
  }
}

testUAEPageRendering();