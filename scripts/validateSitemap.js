const fs = require('fs');
const path = require('path');

// Function to check if a page file exists
function checkPageExists(pathname) {
  try {
    // Base path for the app directory
    const basePath = path.join(__dirname, '..', 'app');
    
    // Handle special cases for dynamic routes
    if (pathname.includes('[country]') || pathname.includes('[city]')) {
      return true; // Assume dynamic routes exist
    }
    
    // Handle exhibition-stands directory structure
    if (pathname.startsWith('/exhibition-stands/')) {
      const parts = pathname.split('/').filter(Boolean);
      
      if (parts.length === 2) {
        // Country page: /exhibition-stands/country-slug
        const countrySlug = parts[1];
        
        // Check for static country directory
        const staticCountryPath = path.join(basePath, 'exhibition-stands', countrySlug);
        if (fs.existsSync(staticCountryPath)) {
          return true;
        }
        
        // Check for dynamic country route
        const dynamicCountryPath = path.join(basePath, 'exhibition-stands', '[country]');
        return fs.existsSync(dynamicCountryPath);
      } else if (parts.length === 3) {
        // City page: /exhibition-stands/country-slug/city-slug
        const countrySlug = parts[1];
        const citySlug = parts[2];
        
        // Check for static city directory
        const staticCityPath = path.join(basePath, 'exhibition-stands', countrySlug, citySlug);
        if (fs.existsSync(staticCityPath)) {
          return true;
        }
        
        // Check for dynamic city route
        const dynamicCityPath = path.join(basePath, 'exhibition-stands', '[country]', '[city]');
        return fs.existsSync(dynamicCityPath);
      }
    }
    
    // For other pages, check if the file exists
    const fullPath = path.join(basePath, pathname.replace(/^\//, ''));
    if (fs.existsSync(fullPath)) {
      return true;
    }
    
    // Check for .tsx or .jsx extensions
    if (fs.existsSync(fullPath + '.tsx') || fs.existsSync(fullPath + '.jsx')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking page existence for ${pathname}:`, error);
    return false;
  }
}

// Read the globalCities file and extract the data
const globalCitiesPath = path.join(__dirname, '..', 'lib', 'data', 'globalCities.ts');
const globalCitiesContent = fs.readFileSync(globalCitiesPath, 'utf8');

// Extract countries and cities from the file
const countries = [];
const cities = [];

// Extract countries
const countryRegex = /{\s*id:\s*'([^']+)'.*?name:\s*'([^']+)'.*?slug:\s*'([^']+)'.*?majorCities:\s*\[([^\]]*)\]/gs;
let countryMatch;
while ((countryMatch = countryRegex.exec(globalCitiesContent)) !== null) {
  const id = countryMatch[1];
  const name = countryMatch[2];
  const slug = countryMatch[3];
  const majorCitiesRaw = countryMatch[4];
  
  // Parse major cities
  const majorCities = majorCitiesRaw
    .split(',')
    .map(city => city.trim().replace(/['"]/g, ''))
    .filter(city => city.length > 0);
  
  countries.push({
    id,
    name,
    slug,
    majorCities
  });
}

console.log(`Found ${countries.length} countries in globalCities.ts`);

// Extract cities (this is more complex, so we'll just use the major cities from countries for now)
countries.forEach(country => {
  country.majorCities.forEach(cityName => {
    // Convert city name to slug
    const citySlug = cityName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    
    cities.push({
      name: cityName,
      slug: citySlug,
      country: country.name,
      countrySlug: country.slug
    });
  });
});

console.log(`Found ${cities.length} cities from major cities list`);

// Validate countries
console.log('\n=== VALIDATING COUNTRIES ===');
const invalidCountries = [];
const validCountries = [];

countries.forEach(country => {
  const pagePath = `/exhibition-stands/${country.slug}`;
  const exists = checkPageExists(pagePath);
  
  if (exists) {
    validCountries.push(country);
    console.log(`✓ ${country.name} (${country.slug})`);
  } else {
    invalidCountries.push(country);
    console.log(`✗ ${country.name} (${country.slug}) - Page not found`);
  }
});

// Validate cities
console.log('\n=== VALIDATING CITIES (sample) ===');
const invalidCities = [];
const validCities = [];
let cityCount = 0;

cities.forEach(city => {
  // Limit output for readability
  if (cityCount < 20) {
    const pagePath = `/exhibition-stands/${city.countrySlug}/${city.slug}`;
    const exists = checkPageExists(pagePath);
    
    if (exists) {
      validCities.push(city);
      console.log(`✓ ${city.name}, ${city.country} (${city.slug})`);
    } else {
      invalidCities.push(city);
      console.log(`✗ ${city.name}, ${city.country} (${city.slug}) - Page not found`);
    }
    cityCount++;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Valid countries: ${validCountries.length}/${countries.length}`);
console.log(`Invalid countries: ${invalidCountries.length}`);
console.log(`Valid cities (sample): ${validCities.length}/${Math.min(cityCount, cities.length)}`);
console.log(`Invalid cities (sample): ${invalidCities.length}`);

// Show all invalid countries
if (invalidCountries.length > 0) {
  console.log('\n=== COUNTRIES TO REMOVE FROM SITEMAP ===');
  invalidCountries.forEach(country => {
    console.log(`${country.name} (${country.slug})`);
  });
}

// Create a report of what should be in the sitemap
console.log('\n=== SITEMAP RECOMMENDATIONS ===');
console.log('All countries and cities from GLOBAL_EXHIBITION_DATA should be in the sitemap');
console.log('since the dynamic routes [country] and [city] handle all pages.');
console.log('The sitemap should include ALL countries and cities from the data, not just those with static directories.');