const { getCitiesByCountry } = require('../lib/data/globalExhibitionDatabase');

console.log('🔍 Testing global cities database...');

// Test fetching cities for a few countries
const testCountries = [
  { name: 'Germany', slug: 'germany' },
  { name: 'United States', slug: 'united-states' },
  { name: 'United Arab Emirates', slug: 'united-arab-emirates' }
];

for (const country of testCountries) {
  console.log(`\n📍 Testing ${country.name} (${country.slug})...`);
  
  const cities = getCitiesByCountry(country.slug);
  
  console.log(`✅ Found ${cities.length} cities for ${country.name}:`);
  cities.slice(0, 5).forEach(city => {
    console.log(`  - ${city.name} (${city.slug}) - ${city.builderCount || 0} builders`);
  });
  
  if (cities.length > 5) {
    console.log(`  ... and ${cities.length - 5} more`);
  }
}

console.log('\n✅ Test completed successfully!');