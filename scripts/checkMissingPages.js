const fs = require('fs');
const path = require('path');

// Simple approach: manually check what we know exists
const existingCountryDirs = [
  'at', 'au', 'be', 'ca', 'ch', 'de', 'dk', 'es', 'fi', 'fr', 'gb', 'hk', 
  'hong-kong', 'india', 'israel', 'jordan', 'jp', 'lebanon', 'new-zealand', 
  'nl', 'no', 'nz', 'pl', 'se', 'taiwan', 'th', 'tw', 'us', 'vn'
];

// Countries that should exist based on GLOBAL_EXHIBITION_DATA
const allCountries = [
  // Europe
  { name: 'United Kingdom', slug: 'united-kingdom' },
  { name: 'France', slug: 'france' },
  { name: 'Germany', slug: 'germany' },
  { name: 'Italy', slug: 'italy' },
  { name: 'Spain', slug: 'spain' },
  { name: 'Belgium', slug: 'belgium' },
  { name: 'Netherlands', slug: 'netherlands' },
  { name: 'Greece', slug: 'greece' },
  { name: 'Hungary', slug: 'hungary' },
  { name: 'Poland', slug: 'poland' },
  { name: 'Romania', slug: 'romania' },
  { name: 'Austria', slug: 'austria' },
  { name: 'Denmark', slug: 'denmark' },
  { name: 'Norway', slug: 'norway' },
  { name: 'Sweden', slug: 'sweden' },
  { name: 'Finland', slug: 'finland' },
  { name: 'Switzerland', slug: 'switzerland' },
  { name: 'Portugal', slug: 'portugal' },
  { name: 'Czech Republic', slug: 'czech-republic' },
  
  // North America
  { name: 'United States', slug: 'united-states' },
  { name: 'Canada', slug: 'canada' },
  { name: 'Mexico', slug: 'mexico' },
  
  // South America
  { name: 'Brazil', slug: 'brazil' },
  { name: 'Argentina', slug: 'argentina' },
  { name: 'Colombia', slug: 'colombia' },
  { name: 'Chile', slug: 'chile' },
  { name: 'Peru', slug: 'peru' },
  
  // Asia & Middle East
  { name: 'United Arab Emirates', slug: 'united-arab-emirates' },
  { name: 'Saudi Arabia', slug: 'saudi-arabia' },
  { name: 'Oman', slug: 'oman' },
  { name: 'Egypt', slug: 'egypt' },
  { name: 'Japan', slug: 'japan' },
  { name: 'South Korea', slug: 'south-korea' },
  { name: 'Turkey', slug: 'turkey' },
  { name: 'Singapore', slug: 'singapore' },
  { name: 'China', slug: 'china' },
  { name: 'Pakistan', slug: 'pakistan' },
  { name: 'Bangladesh', slug: 'bangladesh' },
  { name: 'Indonesia', slug: 'indonesia' },
  { name: 'Malaysia', slug: 'malaysia' },
  { name: 'Thailand', slug: 'thailand' },
  { name: 'Philippines', slug: 'philippines' },
  { name: 'Vietnam', slug: 'vietnam' },
  { name: 'Taiwan', slug: 'taiwan' },
  { name: 'Hong Kong', slug: 'hong-kong' },
  { name: 'Iran', slug: 'iran' },
  { name: 'Iraq', slug: 'iraq' },
  { name: 'Jordan', slug: 'jordan' },
  { name: 'Lebanon', slug: 'lebanon' },
  { name: 'Qatar', slug: 'qatar' },
  { name: 'Bahrain', slug: 'bahrain' },
  { name: 'Kuwait', slug: 'kuwait' },
  { name: 'Israel', slug: 'israel' },
  
  // Africa
  { name: 'South Africa', slug: 'south-africa' },
  { name: 'Kenya', slug: 'kenya' },
  { name: 'Nigeria', slug: 'nigeria' },
  { name: 'Morocco', slug: 'morocco' },
  
  // Oceania
  { name: 'Australia', slug: 'australia' },
  { name: 'New Zealand', slug: 'new-zealand' }
];

console.log('Total countries in GLOBAL_EXHIBITION_DATA:', allCountries.length);
console.log('Existing country directories:', existingCountryDirs.length);

// Find countries that don't have directories (missing from sitemap)
const missingCountries = allCountries.filter(country => {
  return !existingCountryDirs.includes(country.slug);
});

console.log('\n=== MISSING COUNTRIES (in data but no directory) ===');
missingCountries.forEach(country => {
  console.log(`${country.name} (${country.slug})`);
});

// Find countries that have directories but might be missing from data
const extraCountries = existingCountryDirs.filter(slug => {
  return !allCountries.some(country => country.slug === slug);
});

console.log('\n=== EXTRA COUNTRIES (have directory but not in data) ===');
extraCountries.forEach(slug => {
  console.log(slug);
});

// Countries that exist in both data and directories (these should be in sitemap)
const validCountries = allCountries.filter(country => {
  return existingCountryDirs.includes(country.slug);
});

console.log('\n=== VALID COUNTRIES (in both data and directories) ===');
validCountries.forEach(country => {
  console.log(`${country.name} (${country.slug})`);
});

// Now check cities for some key countries
console.log('\n=== CITY DIRECTORY CHECK ===');

const keyCountries = [
  { slug: 'de', name: 'Germany' },
  { slug: 'us', name: 'United States' },
  { slug: 'gb', name: 'United Kingdom' },
  { slug: 'fr', name: 'France' },
  { slug: 'cn', name: 'China' }
];

keyCountries.forEach(country => {
  const countryDirPath = path.join(__dirname, '..', 'app', 'exhibition-stands', country.slug);
  if (fs.existsSync(countryDirPath)) {
    const cityDirs = fs.readdirSync(countryDirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== '[city]')
      .map(dirent => dirent.name);
    
    console.log(`${country.name}: ${cityDirs.length} city directories`);
    if (cityDirs.length > 0) {
      console.log(`  Cities: ${cityDirs.join(', ')}`);
    }
  } else {
    console.log(`${country.name}: No country directory found`);
  }
});