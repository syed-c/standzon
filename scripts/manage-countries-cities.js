const fs = require('fs');
const path = require('path');

// Configuration for all country and city changes
const config = {
  // Cities to remove
  citiesToRemove: [
    'exhibition-stands/qa/al-rayyan',
    'exhibition-stands/kw/hawalli',
    'exhibition-stands/bh/manama',
    'exhibition-stands/bh/muharraq',
    'exhibition-stands/ir/isfahan',
    'exhibition-stands/ir/mashhad',
    'exhibition-stands/ir/qom',
    'exhibition-stands/ir/shiraz',
    'exhibition-stands/ir/tabriz',
    'exhibition-stands/iq', // Complete cities section on Iraq
    'exhibition-stands/jp/nagoya',
    'exhibition-stands/in/chennai',
    'exhibition-stands/in/delhi',
    'exhibition-stands/in/pune',
    'exhibition-stands/kr/busan',
    'exhibition-stands/be/antwerp',
    'exhibition-stands/be/ghent',
    'exhibition-stands/at/innsbruck'
  ],
  
  // Countries with specific city retention
  countrySpecificChanges: [
    { 
      country: 'id', // Indonesia
      keepOnly: ['bali', 'jakarta'],
      removeOthers: true
    },
    { 
      country: 'ph', // Philippines
      keepOnly: ['manila'],
      removeOthers: true
    },
    { 
      country: 'vn', // Vietnam
      keepOnly: [],
      removeOthers: true
    },
    { 
      country: 'se', // Sweden
      keepOnly: [],
      removeOthers: true
    },
    { 
      country: 'no', // Norway
      keepOnly: ['oslo'],
      removeOthers: true
    },
    { 
      country: 'dk', // Denmark
      keepOnly: ['copenhagen'],
      removeOthers: true
    },
    { 
      country: 'fi', // Finland
      keepOnly: ['helsinki'],
      removeOthers: true
    },
    { 
      country: 'pl', // Poland
      keepOnly: ['warsaw', 'kielce', 'poznan'],
      removeOthers: true
    }
  ],
  
  // Cities to add
  citiesToAdd: [
    { country: 'jp', city: 'chiba' },
    { country: 'be', city: 'kortrijk' },
    { country: 'th', city: 'khon-kaen' },
    { country: 'fr', city: 'strasbourg' },
    { country: 'nl', city: 'maastricht' },
    { country: 'nl', city: 'rotterdam' },
    { country: 'nl', city: 'vijfhuizen' }
  ],
  
  // Countries without city sections (to be updated in the main country page component)
  countriesWithoutCities: [
    'tw', // Taiwan
    'hk', // Hong Kong
    'nz', // New Zealand
    'vn', // Vietnam
    'se', // Sweden
    'no', // Norway
    'dk', // Denmark
    'fi'  // Finland
  ],
  
  // Special countries (to be updated in the main country page component)
  specialCountries: [
    'jordan',
    'lebanon',
    'israel',
    'de', // Germany
    'gb'  // United Kingdom
  ]
};

// Base directory for exhibition stands
const baseDir = path.resolve('app/exhibition-stands');

// 1. Remove specific city pages
console.log('🗑️ Removing specific city pages...');
config.citiesToRemove.forEach(cityPath => {
  const fullPath = path.join(baseDir, '..', cityPath);
  if (fs.existsSync(fullPath)) {
    try {
      // If it's a directory, remove recursively
      if (fs.lstatSync(fullPath).isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(fullPath);
      }
      console.log(`✅ Removed: ${cityPath}`);
    } catch (error) {
      console.error(`❌ Error removing ${cityPath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️ Path does not exist: ${cityPath}`);
  }
});

// 2. Handle country-specific city changes
console.log('\n🌍 Processing country-specific city changes...');
config.countrySpecificChanges.forEach(countryConfig => {
  const countryDir = path.join(baseDir, countryConfig.country);
  
  if (fs.existsSync(countryDir)) {
    try {
      const entries = fs.readdirSync(countryDir, { withFileTypes: true });
      
      entries.forEach(entry => {
        // Only process directories (city folders)
        if (entry.isDirectory()) {
          const cityName = entry.name;
          const cityPath = path.join(countryDir, cityName);
          
          // Check if this city should be kept
          const shouldKeep = countryConfig.keepOnly.includes(cityName);
          
          if (!shouldKeep && countryConfig.removeOthers) {
            fs.rmSync(cityPath, { recursive: true, force: true });
            console.log(`✅ Removed city: ${countryConfig.country}/${cityName}`);
          }
        }
      });
    } catch (error) {
      console.error(`❌ Error processing country ${countryConfig.country}: ${error.message}`);
    }
  } else {
    console.log(`⚠️ Country directory does not exist: ${countryConfig.country}`);
  }
});

// 3. Generate template for new city pages
console.log('\n🏙️ Adding new city pages...');
const cityTemplate = `import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';

export const metadata: Metadata = {
  title: 'Exhibition Stand Builders in CITY_NAME, COUNTRY_NAME',
  description: 'Find the best exhibition stand builders in CITY_NAME, COUNTRY_NAME. Get quotes from trusted stand contractors for your next trade show or exhibition.',
};

export default function CITYNAMEPage() {
  return (
    <CityPage
      country="COUNTRY_SLUG"
      city="CITY_SLUG"
      cityName="CITY_NAME"
      countryName="COUNTRY_NAME"
    />
  );
}`;

// Country name mapping for template generation
const countryNames = {
  'jp': 'Japan',
  'be': 'Belgium',
  'th': 'Thailand',
  'fr': 'France',
  'nl': 'Netherlands',
  'pl': 'Poland'
};

// Add new city pages
config.citiesToAdd.forEach(cityConfig => {
  const countryDir = path.join(baseDir, cityConfig.country);
  const cityDir = path.join(countryDir, cityConfig.city);
  const cityPagePath = path.join(cityDir, 'page.tsx');
  
  // Create country directory if it doesn't exist
  if (!fs.existsSync(countryDir)) {
    fs.mkdirSync(countryDir, { recursive: true });
    console.log(`✅ Created country directory: ${cityConfig.country}`);
  }
  
  // Create city directory if it doesn't exist
  if (!fs.existsSync(cityDir)) {
    fs.mkdirSync(cityDir, { recursive: true });
    console.log(`✅ Created city directory: ${cityConfig.country}/${cityConfig.city}`);
  }
  
  // Create city page if it doesn't exist
  if (!fs.existsSync(cityPagePath)) {
    // Format city name for display (capitalize words, replace hyphens with spaces)
    const formattedCityName = cityConfig.city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Get country name
    const countryName = countryNames[cityConfig.country] || cityConfig.country.toUpperCase();
    
    // Replace placeholders in template
    let cityContent = cityTemplate
      .replace(/CITY_NAME/g, formattedCityName)
      .replace(/COUNTRY_NAME/g, countryName)
      .replace(/COUNTRY_SLUG/g, cityConfig.country)
      .replace(/CITY_SLUG/g, cityConfig.city)
      .replace(/CITYNAME/g, formattedCityName.replace(/\s+/g, ''));
    
    fs.writeFileSync(cityPagePath, cityContent);
    console.log(`✅ Created city page: ${cityConfig.country}/${cityConfig.city}`);
  } else {
    console.log(`⚠️ City page already exists: ${cityConfig.country}/${cityConfig.city}`);
  }
});

// 4. Update the main country page component to handle countries without city sections
const countryPagePath = path.resolve('app/exhibition-stands/[country]/page.tsx');
if (fs.existsSync(countryPagePath)) {
  let countryPageContent = fs.readFileSync(countryPagePath, 'utf8');
  
  // Update countries without city sections
  const countriesWithoutCitiesRegex = /const\s+countriesWithoutCities\s*=\s*\[\s*(['"][^'"]*['"]\s*(?:,\s*['"][^'"]*['"]\s*)*)?\]/;
  const countriesWithoutCitiesMatch = countryPageContent.match(countriesWithoutCitiesRegex);
  
  if (countriesWithoutCitiesMatch) {
    const countriesWithoutCitiesStr = `const countriesWithoutCities = ['${config.countriesWithoutCities.join("', '")}']`;
    countryPageContent = countryPageContent.replace(countriesWithoutCitiesRegex, countriesWithoutCitiesStr);
    console.log('✅ Updated countries without city sections in country page component');
  } else {
    console.log('⚠️ Could not find countriesWithoutCities array in country page component');
  }
  
  // Update special countries
  const specialCountriesRegex = /const\s+isSpecialCountry\s*=\s*\[\s*(['"][^'"]*['"]\s*(?:,\s*['"][^'"]*['"]\s*)*)?\]/;
  const specialCountriesMatch = countryPageContent.match(specialCountriesRegex);
  
  if (specialCountriesMatch) {
    const specialCountriesStr = `const isSpecialCountry = ['${config.specialCountries.join("', '")}']`;
    countryPageContent = countryPageContent.replace(specialCountriesRegex, specialCountriesStr);
    console.log('✅ Updated special countries in country page component');
  } else {
    console.log('⚠️ Could not find isSpecialCountry array in country page component');
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(countryPagePath, countryPageContent);
}

console.log('\n✅ Country and city management completed successfully!');
console.log('✅ All changes have been made directly to the codebase.');