/**
 * Script to verify and fix location data issues
 * This script checks that all required countries and cities are properly defined
 */

const fs = require('fs');
const path = require('path');

// Function to check if a country exists in the database
function checkCountryExists(countrySlug) {
  const databasePath = path.join(__dirname, '..', 'lib', 'data', 'globalExhibitionDatabase.ts');
  const databaseContent = fs.readFileSync(databasePath, 'utf8');
  
  // Look for the country definition
  const countryPattern = new RegExp(`id:\\s*["']${countrySlug}["']`, 'g');
  return databaseContent.match(countryPattern);
}

// Function to check if a city exists in the database
function checkCityExists(citySlug, countrySlug) {
  const databasePath = path.join(__dirname, '..', 'lib', 'data', 'globalExhibitionDatabase.ts');
  const databaseContent = fs.readFileSync(databasePath, 'utf8');
  
  // Look for the city definition
  const cityPattern = new RegExp(`slug:\\s*["']${citySlug}["'][^}]*countrySlug:\\s*["']${countrySlug}["']`, 'g');
  return databaseContent.match(cityPattern);
}

// Countries that should exist
const requiredCountries = [
  'bahrain', 'qatar', 'kuwait', 'oman', 'austria', 'czech-republic'
];

// Cities that should exist
const requiredCities = [
  { city: 'vienna', country: 'austria' },
  { city: 'prague', country: 'czech-republic' },
  { city: 'tallahassee', country: 'united-states' }
];

console.log('🔍 Checking location data integrity...\n');

// Check countries
console.log('🌍 Checking countries:');
requiredCountries.forEach(country => {
  const exists = checkCountryExists(country);
  if (exists) {
    console.log(`✅ ${country} - Found (${exists.length} entries)`);
  } else {
    console.log(`❌ ${country} - Not found`);
  }
});

console.log('\n🏙️ Checking cities:');
requiredCities.forEach(({ city, country }) => {
  const exists = checkCityExists(city, country);
  if (exists) {
    console.log(`✅ ${city}, ${country} - Found`);
  } else {
    console.log(`❌ ${city}, ${country} - Not found`);
  }
});

console.log('\n✨ Verification complete!');
console.log('\n💡 If all items show as found but still appear as "not found" in the application:');
console.log('   1. Clear your browser cache');
console.log('   2. Restart the development server');
console.log('   3. Check if there are any deployment caching issues');
console.log('   4. Verify that the environment variables are correctly set');

// List of items that should NOT be treated as countries (these are cities)
console.log('\n⚠️  The following items from your list are cities, not countries:');
const nonCountries = [
  'Al Khor', 'Al Rayyan', 'Al Wakrah', 'Dawhah', 'Doha', 'Messaieed',
  'Ahmadi', 'Al Farwaniyah', 'Hawalli', 'Jubail', 'Kuwait City', 'Sabah Al Salem',
  'Al Khawd', 'Al Masqat', 'Al Sib', 'Mussaqah',
  'Alexandria', 'Luxor', 'Sharm El Sheikh',
  'Isfahan', 'Mashhad', 'Tehran',
  'Baghdad', 'Basra', 'Erbil', 'Karbala',
  'Chengdu', 'Shenzhen', 'Xiamen',
  'Fukuoka', 'Kyoto',
  'singapore city',
  'Chennai', 'Delhi',
  'Daegu', 'Gwangju', 'Incheon',
  'Adelaide',
  'Makassar',
  'Cebu', 'Davao', 'Manila',
  'Da Nang', 'Hanoi', 'Ho Chi Minh City',
  'Edinburgh', 'Glasgow',
  'Marseille', 'Nice', 'Toulouse',
  'Naples', 'Turin',
  'Kielce', 'Poznan', 'Warsaw',
  'Adana', 'Ankara', 'Bursa',
  'Hollywood', 'Tallahassee',
  'Edmonton',
  'Cancún', 'Mexico City', 'Monterrey', 'Tijuana',
  'Brasília', 'Fortaleza', 'Rio de Janeiro', 'Salvador', 'São Paulo',
  'Concepción', 'Valparaiso',
  'Barranquilla', 'Bogotá', 'Medellín',
  'Alajuela', 'San José',
  'Colón', 'Panama City'
];

nonCountries.forEach(city => {
  console.log(`   • ${city}`);
});