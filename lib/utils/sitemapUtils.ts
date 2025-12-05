import fs from "fs";
import path from "path";

/**
 * Utility functions for sitemap generation and validation
 */

/**
 * Check if a page file exists in the app directory
 * @param pathname The URL pathname to check (e.g., /exhibition-stands/germany)
 * @returns boolean indicating if the page exists
 */
export function checkPageExists(pathname: string): boolean {
  try {
    // Base path for the app directory
    const basePath = path.join(process.cwd(), "app");
    
    // Handle special cases for dynamic routes
    if (pathname.includes("[country]") || pathname.includes("[city]")) {
      return true; // Assume dynamic routes exist
    }
    
    // Handle exhibition-stands directory structure
    if (pathname.startsWith("/exhibition-stands/")) {
      const parts = pathname.split("/").filter(Boolean);
      
      if (parts.length === 2) {
        // Country page: /exhibition-stands/country-slug
        const countrySlug = parts[1];
        
        // Check for static country directory
        const staticCountryPath = path.join(basePath, "exhibition-stands", countrySlug);
        if (fs.existsSync(staticCountryPath)) {
          return true;
        }
        
        // Check for dynamic country route
        const dynamicCountryPath = path.join(basePath, "exhibition-stands", "[country]");
        return fs.existsSync(dynamicCountryPath);
      } else if (parts.length === 3) {
        // City page: /exhibition-stands/country-slug/city-slug
        const countrySlug = parts[1];
        const citySlug = parts[2];
        
        // Check for static city directory
        const staticCityPath = path.join(basePath, "exhibition-stands", countrySlug, citySlug);
        if (fs.existsSync(staticCityPath)) {
          return true;
        }
        
        // Check for dynamic city route
        const dynamicCityPath = path.join(basePath, "exhibition-stands", "[country]", "[city]");
        return fs.existsSync(dynamicCityPath);
      }
    }
    
    // For other pages, check if the file exists
    const fullPath = path.join(basePath, pathname.replace(/^\//, ""));
    if (fs.existsSync(fullPath)) {
      return true;
    }
    
    // Check for .tsx or .jsx extensions
    if (fs.existsSync(fullPath + ".tsx") || fs.existsSync(fullPath + ".jsx")) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking page existence for ${pathname}:`, error);
    return false;
  }
}

/**
 * Filter out countries that don't have existing pages
 * @param countries Array of country objects
 * @returns Array of countries with existing pages
 */
export function filterValidCountries(countries: any[]) {
  return countries.filter(country => {
    const countryPath = `/exhibition-stands/${country.slug}`;
    return checkPageExists(countryPath);
  });
}

/**
 * Filter out cities that don't have existing pages
 * @param cities Array of city objects
 * @param countrySlug The country slug for these cities
 * @returns Array of cities with existing pages
 */
export function filterValidCities(cities: any[], countrySlug: string) {
  return cities.filter(city => {
    const cityPath = `/exhibition-stands/${countrySlug}/${city.slug}`;
    return checkPageExists(cityPath);
  });
}

/**
 * Get all countries and cities that actually have pages
 * @param allCountries Array of all countries from GLOBAL_EXHIBITION_DATA
 * @param allCities Array of all cities from GLOBAL_EXHIBITION_DATA
 * @returns Object containing valid countries and cities grouped by country
 */
export function getValidLocations(allCountries: any[], allCities: any[]) {
  // Group cities by country name
  const citiesByCountry: Record<string, any[]> = {};
  allCities.forEach((city) => {
    const countryName = city.country;
    if (!citiesByCountry[countryName]) {
      citiesByCountry[countryName] = [];
    }
    citiesByCountry[countryName].push(city);
  });

  // Filter countries that have existing pages
  const validCountries = filterValidCountries(allCountries);
  
  // Create result object with valid countries and their cities
  const validLocations: Record<string, { country: any; cities: any[] }> = {};
  
  validCountries.forEach(country => {
    // Get all cities for this country
    const countryCities = citiesByCountry[country.name] || [];
    
    // Filter cities that have existing pages
    const validCities = filterValidCities(countryCities, country.slug);
    
    // Only include country if it has at least one valid city or if country page exists
    if (validCities.length > 0 || checkPageExists(`/exhibition-stands/${country.slug}`)) {
      validLocations[country.slug] = {
        country,
        cities: validCities
      };
    }
  });
  
  return validLocations;
}