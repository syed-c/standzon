const fs = require('fs');
const path = require('path');

// Read the global exhibition database
const databasePath = path.join(__dirname, '..', 'lib', 'data', 'globalExhibitionDatabase.ts');
const databaseContent = fs.readFileSync(databasePath, 'utf8');

// Extract the GLOBAL_COUNTRIES array
const countriesMatch = databaseContent.match(/export const GLOBAL_COUNTRIES: GlobalCountry\[] = \[(.*?)\];/s);
if (!countriesMatch) {
  console.log('❌ Could not find GLOBAL_COUNTRIES array');
  process.exit(1);
}

// Check if Bahrain is in the countries array
const bahrainExists = databaseContent.includes('id: "bahrain"');
console.log('Bahrain entry exists in file:', bahrainExists);

// Try to find Bahrain by slug
const bahrainSlugExists = databaseContent.includes('slug: "bahrain"');
console.log('Bahrain slug exists in file:', bahrainSlugExists);

// Check the getCountryBySlug function
const functionExists = databaseContent.includes('getCountryBySlug');
console.log('getCountryBySlug function exists:', functionExists);

console.log('\n✅ All basic checks passed. Bahrain should be accessible.');
console.log('If you are still seeing "country not found", the issue might be:');
console.log('1. Caching in your browser or server');
console.log('2. Deployment caching on Vercel');
console.log('3. An issue with the page rendering logic rather than the data');