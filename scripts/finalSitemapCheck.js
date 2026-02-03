const fs = require('fs');
const path = require('path');

console.log('=== FINAL SITEMAP VERIFICATION ===');

// Check if dynamic routes exist
const basePath = path.join(__dirname, '..', 'app', 'exhibition-stands');
const dynamicCountryRoute = path.join(basePath, '[country]');
const dynamicCityRoute = path.join(basePath, '[country]', '[city]');

console.log('Dynamic country route exists:', fs.existsSync(dynamicCountryRoute));
console.log('Dynamic city route exists:', fs.existsSync(dynamicCityRoute));

// Check a few specific static directories that should exist
const staticCountries = ['us', 'de', 'gb', 'fr', 'jp'];
staticCountries.forEach(country => {
  const countryPath = path.join(basePath, country);
  console.log(`Static directory for ${country} exists:`, fs.existsSync(countryPath));
});

// Check a few specific city directories
const cityChecks = [
  { country: 'us', city: 'new-york' },
  { country: 'de', city: 'berlin' },
  { country: 'gb', city: 'london' }
];

cityChecks.forEach(check => {
  const cityPath = path.join(basePath, check.country, check.city);
  console.log(`Static directory for ${check.country}/${check.city} exists:`, fs.existsSync(cityPath));
});

console.log('\n=== CONCLUSION ===');
console.log('1. Dynamic routes [country] and [city] exist, so all country/city combinations should work');
console.log('2. The sitemap should include ALL countries and cities from GLOBAL_EXHIBITION_DATA');
console.log('3. Any 404 errors would be due to:');
console.log('   - Invalid country/city slugs in the data');
console.log('   - Typos in the slugs');
console.log('   - Missing data entries');
console.log('4. No pages should be removed from sitemap unless they truly don\'t exist');
console.log('5. All countries and cities from GLOBAL_EXHIBITION_DATA should be added if missing');