// Script to update locations based on requirements
const fs = require('fs');
const path = require('path');

// Paths to the location data files
const locationDataPath = path.resolve('lib/data/locationData.ts');
const comprehensiveLocationDataPath = path.resolve('lib/data/comprehensiveLocationData.ts');

// Read the files
let locationData = fs.readFileSync(locationDataPath, 'utf8');
let comprehensiveLocationData = fs.readFileSync(comprehensiveLocationDataPath, 'utf8');

// Cities to remove
const citiesToRemove = [
  // Qatar
  { country: 'Qatar', city: 'Al Rayyan' },
  // Kuwait
  { country: 'Kuwait', city: 'Hawalli' },
  // Bahrain
  { country: 'Bahrain', city: 'Manama' },
  { country: 'Bahrain', city: 'Muharraq' },
  // Iran
  { country: 'Iran', city: 'Isfahan' },
  { country: 'Iran', city: 'Mashhad' },
  { country: 'Iran', city: 'Qom' },
  { country: 'Iran', city: 'Shiraz' },
  { country: 'Iran', city: 'Tabriz' },
  // Iraq - all cities
  { country: 'Iraq', city: 'ALL' },
  // Japan
  { country: 'Japan', city: 'Nagoya' },
  // India
  { country: 'India', city: 'Chennai' },
  { country: 'India', city: 'Delhi' },
  { country: 'India', city: 'Pune' },
  // South Korea
  { country: 'South Korea', city: 'Busan' },
  // Indonesia - all except Bali and Jakarta
  { country: 'Indonesia', city: 'ALL_EXCEPT', except: ['Bali', 'Jakarta'] },
  // Philippines - all except Manila
  { country: 'Philippines', city: 'ALL_EXCEPT', except: ['Manila'] },
  // Vietnam - all cities
  { country: 'Vietnam', city: 'ALL' },
  // Belgium
  { country: 'Belgium', city: 'Antwerp' },
  { country: 'Belgium', city: 'Ghent' },
  // Austria
  { country: 'Austria', city: 'Innsbruck' },
  // Sweden - all cities
  { country: 'Sweden', city: 'ALL' },
  // Norway - all except Oslo
  { country: 'Norway', city: 'ALL_EXCEPT', except: ['Oslo'] },
  // Denmark - all except Copenhagen
  { country: 'Denmark', city: 'ALL_EXCEPT', except: ['Copenhagen'] },
  // Finland - all except Helsinki
  { country: 'Finland', city: 'ALL_EXCEPT', except: ['Helsinki'] },
  // Poland - all except Warsaw
  { country: 'Poland', city: 'ALL_EXCEPT', except: ['Warsaw'] }
];

// Cities to add
const citiesToAdd = [
  // Japan
  { country: 'Japan', city: 'Chiba', latitude: 35.6073, longitude: 140.1063, population: 979768 },
  // Belgium
  { country: 'Belgium', city: 'Kortrijk', latitude: 50.8281, longitude: 3.2648, population: 76265 },
  // Poland
  { country: 'Poland', city: 'Kielce', latitude: 50.8661, longitude: 20.6286, population: 195774 },
  { country: 'Poland', city: 'Poznan', latitude: 52.4064, longitude: 16.9252, population: 534813 },
  // Thailand
  { country: 'Thailand', city: 'Khon Kaen', latitude: 16.4322, longitude: 102.8236, population: 114459 },
  // France
  { country: 'France', city: 'Strasbourg', latitude: 48.5734, longitude: 7.7521, population: 277270 },
  // Netherlands
  { country: 'Netherlands', city: 'Maastricht', latitude: 50.8514, longitude: 5.6910, population: 122378 },
  { country: 'Netherlands', city: 'Rotterdam', latitude: 51.9244, longitude: 4.4777, population: 651446 },
  { country: 'Netherlands', city: 'Vijfhuizen', latitude: 52.3500, longitude: 4.6667, population: 5115 }
];

// Countries to create without cities section
const countriesToCreate = [
  { 
    countryName: 'Taiwan', 
    countryCode: 'TW', 
    countrySlug: 'taiwan',
    continent: 'Asia',
    currency: 'TWD',
    timezone: 'Asia/Taipei',
    language: 'Chinese',
    cities: []
  },
  { 
    countryName: 'Hong Kong', 
    countryCode: 'HK', 
    countrySlug: 'hong-kong',
    continent: 'Asia',
    currency: 'HKD',
    timezone: 'Asia/Hong_Kong',
    language: 'Chinese',
    cities: []
  },
  { 
    countryName: 'New Zealand', 
    countryCode: 'NZ', 
    countrySlug: 'new-zealand',
    continent: 'Oceania',
    currency: 'NZD',
    timezone: 'Pacific/Auckland',
    language: 'English',
    cities: []
  },
  { 
    countryName: 'Vietnam', 
    countryCode: 'VN', 
    countrySlug: 'vietnam',
    continent: 'Asia',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'Vietnamese',
    cities: []
  }
];

// Function to remove cities
function removeCities(data) {
  for (const cityToRemove of citiesToRemove) {
    const { country, city, except } = cityToRemove;
    
    // Create regex patterns for different cases
    const countryPattern = new RegExp(`countryName: "${country}"[\\s\\S]*?cities: \\[([\\s\\S]*?)\\]`, 'g');
    
    // Handle different removal strategies
    if (city === 'ALL') {
      // Remove all cities for a country
      data = data.replace(countryPattern, (match, citiesContent) => {
        return match.replace(citiesContent, '\n      ');
      });
    } else if (city === 'ALL_EXCEPT') {
      // Remove all cities except those in the except array
      data = data.replace(countryPattern, (match, citiesContent) => {
        const cityLines = citiesContent.split('\n');
        const filteredCityLines = cityLines.filter(line => {
          for (const exceptCity of except) {
            if (line.includes(`cityName: "${exceptCity}"`)) {
              return true;
            }
          }
          return !line.trim(); // Keep empty lines
        });
        return match.replace(citiesContent, filteredCityLines.join('\n'));
      });
    } else {
      // Remove specific city
      const cityPattern = new RegExp(`\\{\\s*cityName: "${city}"[^}]*\\},?`, 'g');
      data = data.replace(cityPattern, '');
    }
  }
  
  // Clean up any empty cities arrays or double commas
  data = data.replace(/cities: \[\s*\]/g, 'cities: []');
  data = data.replace(/,\s*,/g, ',');
  data = data.replace(/,\s*\]/g, '\n    ]');
  
  return data;
}

// Function to add cities
function addCities(data) {
  for (const cityToAdd of citiesToAdd) {
    const { country, city, latitude, longitude, population } = cityToAdd;
    const citySlug = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Create the city entry
    const cityEntry = `      { cityName: "${city}", citySlug: "${citySlug}", latitude: ${latitude}, longitude: ${longitude}, population: ${population} }`;
    
    // Find the country and add the city
    const countryPattern = new RegExp(`countryName: "${country}"[\\s\\S]*?cities: \\[([\\s\\S]*?)\\]`, 'g');
    
    data = data.replace(countryPattern, (match, citiesContent) => {
      // Check if the city already exists
      if (citiesContent.includes(`cityName: "${city}"`)) {
        return match; // City already exists, don't add it
      }
      
      // Add the city to the cities array
      if (citiesContent.trim()) {
        // There are existing cities, add a comma and the new city
        return match.replace(/\]/, `,\n${cityEntry}\n    ]`);
      } else {
        // No existing cities, just add the new city
        return match.replace(/\[\s*\]/, `[\n${cityEntry}\n    ]`);
      }
    });
  }
  
  return data;
}

// Function to add new countries
function addCountries(data) {
  for (const country of countriesToCreate) {
    const { countryName, countryCode, countrySlug, continent, currency, timezone, language } = country;
    
    // Check if the country already exists
    const countryPattern = new RegExp(`countryName: "${countryName}"`, 'g');
    if (data.match(countryPattern)) {
      console.log(`Country ${countryName} already exists, skipping...`);
      continue;
    }
    
    // Create the country entry
    const countryEntry = `  {
    countryName: "${countryName}",
    countryCode: "${countryCode}",
    countrySlug: "${countrySlug}",
    continent: "${continent}",
    currency: "${currency}",
    timezone: "${timezone}",
    language: "${language}",
    cities: []
  },`;
    
    // Add the country to the data
    data = data.replace(/export const (locationData|comprehensiveLocationData): CountryData\[\] = \[/, `export const $1: CountryData[] = [\n${countryEntry}`);
  }
  
  return data;
}

// Apply the changes
locationData = removeCities(locationData);
locationData = addCities(locationData);
locationData = addCountries(locationData);

comprehensiveLocationData = removeCities(comprehensiveLocationData);
comprehensiveLocationData = addCities(comprehensiveLocationData);
comprehensiveLocationData = addCountries(comprehensiveLocationData);

// Write the updated files
fs.writeFileSync(locationDataPath, locationData);
fs.writeFileSync(comprehensiveLocationDataPath, comprehensiveLocationData);

console.log('Location data updated successfully!');