// COMPREHENSIVE GLOBAL EXHIBITION LOCATIONS DATABASE
// Complete coverage of all major exhibition markets worldwide
// Synchronized with countries.ts for consistent global coverage

export interface ExpandedCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  region: string;
  population: string;
  annualEvents: number;
  keyIndustries: string[];
  majorVenues?: string[];
  isCapital?: boolean;
  builderCount?: number;
  averageStandCost?: number;
}

export interface ExpandedCountry {
  id: string;
  name: string;
  countryCode: string;
  continent: string;
  region: string;
  capital: string;
  currency: string;
  majorCities: string[];
  totalVenues: number;
  annualEvents: number;
  keyIndustries: string[];
  exhibitionRanking: number;
  builderCount: number;
  marketSize: number;
}

// Import comprehensive data from countries.ts
import { allCountriesWithCities, globalExhibitionStats } from './countries';

// Generate comprehensive cities list from countries data
export const getAllExpandedCities = (): ExpandedCity[] => {
  const cities: ExpandedCity[] = [];
  
  allCountriesWithCities.forEach(country => {
    country.majorCities.forEach(city => {
      cities.push({
        id: `${city.slug}-${country.code.toLowerCase()}`,
        name: city.name,
        country: country.name,
        countryCode: country.code,
        continent: country.continent,
        region: getRegionFromContinent(country.continent, country.name),
        population: formatPopulation(city.population),
        annualEvents: city.upcomingShows,
        keyIndustries: getIndustriesForCity(city.name, country.name),
        majorVenues: city.majorVenues?.map(v => v.name) || [],
        isCapital: city.isCapital,
        builderCount: city.builderCount,
        averageStandCost: city.averageStandCost
      });
    });
  });

  // Add additional major cities not in the main countries data
  const additionalCities = getAdditionalMajorCities();
  cities.push(...additionalCities);

  return cities.sort((a, b) => a.name.localeCompare(b.name));
};

// Generate comprehensive countries list
export const getAllExpandedCountries = (): ExpandedCountry[] => {
  return allCountriesWithCities.map(country => ({
    id: `${country.code.toLowerCase()}-expanded`,
    name: country.name,
    countryCode: country.code,
    continent: country.continent,
    region: getRegionFromContinent(country.continent, country.name),
    capital: country.majorCities.find(city => city.isCapital)?.name || country.majorCities[0]?.name || 'Unknown',
    currency: country.currency,
    majorCities: country.majorCities.map(city => city.name),
    totalVenues: country.majorCities.reduce((sum, city) => sum + (city.majorVenues?.length || 0), 0),
    annualEvents: country.annualTradeShows,
    keyIndustries: getIndustriesForCountry(country.name),
    exhibitionRanking: getExhibitionRanking(country.exhibitionMarketSize),
    builderCount: country.builderCount,
    marketSize: country.exhibitionMarketSize
  })).sort((a, b) => b.marketSize - a.marketSize);
};

// Helper function to get region from continent and country
function getRegionFromContinent(continent: string, countryName: string): string {
  const regionMap: { [key: string]: { [key: string]: string } } = {
    'Europe': {
      'Germany': 'Central Europe',
      'France': 'Western Europe',
      'United Kingdom': 'Western Europe',
      'Italy': 'Southern Europe',
      'Spain': 'Southern Europe',
      'Netherlands': 'Western Europe',
      'Belgium': 'Western Europe',
      'Switzerland': 'Central Europe',
      'Austria': 'Central Europe',
      'Poland': 'Central Europe',
      'Russia': 'Eastern Europe',
      'Sweden': 'Northern Europe',
      'Norway': 'Northern Europe',
      'Denmark': 'Northern Europe',
      'Finland': 'Northern Europe'
    },
    'Asia': {
      'China': 'East Asia',
      'Japan': 'East Asia',
      'South Korea': 'East Asia',
      'India': 'South Asia',
      'Singapore': 'Southeast Asia',
      'Malaysia': 'Southeast Asia',
      'Thailand': 'Southeast Asia',
      'Indonesia': 'Southeast Asia',
      'Philippines': 'Southeast Asia',
      'Vietnam': 'Southeast Asia',
      'United Arab Emirates': 'Middle East',
      'Saudi Arabia': 'Middle East',
      'Qatar': 'Middle East',
      'Kuwait': 'Middle East',
      'Bahrain': 'Middle East',
      'Oman': 'Middle East',
      'Turkey': 'West Asia',
      'Israel': 'Middle East',
      'Jordan': 'Middle East',
      'Lebanon': 'Middle East'
    },
    'North America': {
      'United States': 'North America',
      'Canada': 'North America',
      'Mexico': 'North America'
    },
    'South America': {
      'Brazil': 'South America',
      'Argentina': 'South America',
      'Chile': 'South America',
      'Colombia': 'South America',
      'Peru': 'South America',
      'Venezuela': 'South America'
    },
    'Africa': {
      'South Africa': 'Southern Africa',
      'Egypt': 'North Africa',
      'Morocco': 'North Africa',
      'Nigeria': 'West Africa',
      'Kenya': 'East Africa',
      'Ghana': 'West Africa',
      'Tunisia': 'North Africa',
      'Algeria': 'North Africa'
    },
    'Oceania': {
      'Australia': 'Oceania',
      'New Zealand': 'Oceania',
      'Fiji': 'Oceania'
    }
  };

  return regionMap[continent]?.[countryName] || continent;
}

// Helper function to format population
function formatPopulation(population: number): string {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(0)}K`;
  }
  return population.toString();
}

// Helper function to get industries for a city
function getIndustriesForCity(cityName: string, countryName: string): string[] {
  const cityIndustries: { [key: string]: string[] } = {
    // Major global cities with specific industries
    'Dubai': ['Oil & Gas', 'Technology', 'Healthcare', 'Finance', 'Tourism', 'Aviation', 'Real Estate'],
    'Singapore': ['Finance', 'Technology', 'Shipping', 'Petrochemicals', 'Electronics'],
    'Hong Kong': ['Finance', 'Trade', 'Logistics', 'Technology', 'Tourism'],
    'London': ['Finance', 'Technology', 'Creative Industries', 'Healthcare', 'Education'],
    'New York': ['Finance', 'Technology', 'Fashion', 'Media', 'Real Estate'],
    'Tokyo': ['Technology', 'Finance', 'Automotive', 'Electronics', 'Robotics'],
    'Shanghai': ['Finance', 'Manufacturing', 'Technology', 'Shipping', 'Automotive'],
    'Frankfurt': ['Finance', 'Aviation', 'Trade', 'Automotive', 'Chemicals'],
    'Paris': ['Luxury Goods', 'Fashion', 'Technology', 'Aerospace', 'Tourism'],
    'Milan': ['Fashion', 'Design', 'Finance', 'Manufacturing', 'Automotive'],
    'Las Vegas': ['Technology', 'Entertainment', 'Gaming', 'Hospitality', 'Conventions'],
    'Chicago': ['Manufacturing', 'Finance', 'Technology', 'Transportation', 'Agriculture'],
    'Munich': ['Automotive', 'Technology', 'Aerospace', 'Finance', 'Beer & Food'],
    'Barcelona': ['Tourism', 'Technology', 'Design', 'Automotive', 'Pharmaceuticals'],
    'Amsterdam': ['Technology', 'Finance', 'Agriculture', 'Logistics', 'Energy'],
    'Sydney': ['Finance', 'Technology', 'Tourism', 'Mining', 'Education'],
    'Melbourne': ['Manufacturing', 'Arts', 'Technology', 'Education', 'Sports'],
    'Toronto': ['Finance', 'Technology', 'Healthcare', 'Media', 'Education'],
    'São Paulo': ['Manufacturing', 'Finance', 'Technology', 'Automotive', 'Aerospace'],
    'Mumbai': ['Finance', 'Entertainment', 'Textiles', 'Pharmaceuticals', 'Technology'],
    'Delhi': ['Government', 'Technology', 'Healthcare', 'Automotive', 'Textiles'],
    'Seoul': ['Technology', 'Automotive', 'Entertainment', 'Electronics', 'Shipbuilding'],
    'Bangkok': ['Tourism', 'Food & Beverage', 'Automotive', 'Electronics', 'Textiles']
  };

  // Return city-specific industries or default based on country
  if (cityIndustries[cityName]) {
    return cityIndustries[cityName];
  }

  // Default industries based on country
  return getIndustriesForCountry(countryName);
}

// Helper function to get industries for a country
function getIndustriesForCountry(countryName: string): string[] {
  const countryIndustries: { [key: string]: string[] } = {
    'United Arab Emirates': ['Oil & Gas', 'Technology', 'Healthcare', 'Finance', 'Tourism', 'Aviation'],
    'Germany': ['Automotive', 'Manufacturing', 'Technology', 'Healthcare', 'Green Energy', 'Engineering'],
    'United States': ['Technology', 'Healthcare', 'Finance', 'Aerospace', 'Entertainment', 'Energy'],
    'China': ['Manufacturing', 'Technology', 'Electronics', 'Automotive', 'Textiles', 'Chemicals'],
    'United Kingdom': ['Finance', 'Technology', 'Creative Industries', 'Healthcare', 'Education', 'Energy'],
    'France': ["Luxury Goods", 'Fashion', 'Technology', 'Aerospace', 'Tourism', 'Agriculture'],
    'Italy': ['Fashion', 'Design', 'Manufacturing', 'Tourism', 'Food & Beverage', 'Automotive'],
    'Spain': ['Tourism', 'Automotive', 'Renewable Energy', 'Agriculture', 'Textiles', 'Chemicals'],
    'Netherlands': ['Technology', 'Agriculture', 'Logistics', 'Energy', 'Chemicals', 'Finance'],
    'Singapore': ['Finance', 'Technology', 'Shipping', 'Petrochemicals', 'Electronics', 'Tourism'],
    'Japan': ['Technology', 'Automotive', 'Electronics', 'Robotics', 'Pharmaceuticals', 'Steel'],
    'Australia': ['Mining', 'Agriculture', 'Technology', 'Tourism', 'Education', 'Healthcare'],
    'Canada': ['Natural Resources', 'Technology', 'Healthcare', 'Aerospace', 'Agriculture', 'Energy'],
    'Brazil': ['Agriculture', 'Mining', 'Manufacturing', 'Oil & Gas', 'Technology', 'Aerospace'],
    'India': ['Technology', 'Pharmaceuticals', 'Textiles', 'Automotive', 'Chemicals', 'Agriculture'],
    'South Korea': ['Technology', 'Automotive', 'Shipbuilding', 'Electronics', 'Steel', 'Chemicals'],
    'Mexico': ['Automotive', 'Electronics', 'Aerospace', 'Agriculture', 'Tourism', 'Oil & Gas'],
    'South Africa': ['Mining', 'Agriculture', 'Manufacturing', 'Finance', 'Tourism', 'Technology']
  };

  return countryIndustries[countryName] || ['Manufacturing', 'Technology', 'Healthcare', 'Finance', 'Tourism'];
}

// Helper function to get exhibition ranking
function getExhibitionRanking(marketSize: number): number {
  if (marketSize >= 10000) return 1; // Top tier
  if (marketSize >= 5000) return 2;  // Major markets
  if (marketSize >= 2000) return 3;  // Significant markets
  if (marketSize >= 1000) return 4;  // Growing markets
  return 5; // Emerging markets
}

// Additional major cities not covered in main countries data
function getAdditionalMajorCities(): ExpandedCity[] {
  return [
    // Additional European cities
    // Austria cities removed as requested
    {
      id: 'zurich-ch',
      name: 'Zurich',
      country: 'Switzerland',
      countryCode: 'CH',
      continent: 'Europe',
      region: 'Central Europe',
      population: '1.4M',
      annualEvents: 180,
      keyIndustries: ['Finance', 'Technology', 'Pharmaceuticals'],
      builderCount: 55,
      averageStandCost: 580
    },
    {
      id: 'geneva-ch',
      name: 'Geneva',
      country: 'Switzerland',
      countryCode: 'CH',
      continent: 'Europe',
      region: 'Central Europe',
      population: '1.0M',
      annualEvents: 160,
      keyIndustries: ['International Organizations', 'Finance', 'Luxury Goods'],
      builderCount: 35,
      averageStandCost: 560
    },
    {
      id: 'brussels-be',
      name: 'Brussels',
      country: 'Belgium',
      countryCode: 'BE',
      continent: 'Europe',
      region: 'Western Europe',
      population: '1.2M',
      annualEvents: 220,
      keyIndustries: ['EU Government', 'International Organizations', 'Chemicals'],
      isCapital: true,
      builderCount: 42,
      averageStandCost: 450
    },
    // Sweden cities removed as requested
    {
      id: 'copenhagen-dk',
      name: 'Copenhagen',
      country: 'Denmark',
      countryCode: 'DK',
      continent: 'Europe',
      region: 'Northern Europe',
      population: '1.4M',
      annualEvents: 180,
      keyIndustries: ['Green Energy', 'Pharmaceuticals', 'Design'],
      isCapital: true,
      builderCount: 32,
      averageStandCost: 460
    },
    {
      id: 'oslo-no',
      name: 'Oslo',
      country: 'Norway',
      countryCode: 'NO',
      continent: 'Europe',
      region: 'Northern Europe',
      population: '1.0M',
      annualEvents: 140,
      keyIndustries: ['Oil & Gas', 'Maritime', 'Technology'],
      isCapital: true,
      builderCount: 28,
      averageStandCost: 520
    },
    {
      id: 'helsinki-fi',
      name: 'Helsinki',
      country: 'Finland',
      countryCode: 'FI',
      continent: 'Europe',
      region: 'Northern Europe',
      population: '1.3M',
      annualEvents: 120,
      keyIndustries: ['Technology', 'Gaming', 'Clean Technology'],
      isCapital: true,
      builderCount: 25,
      averageStandCost: 440
    },
    {
      id: 'budapest-hu',
      name: 'Budapest',
      country: 'Hungary',
      countryCode: 'HU',
      continent: 'Europe',
      region: 'Central Europe',
      population: '3.0M',
      annualEvents: 180,
      keyIndustries: ['Automotive', 'Technology', 'Tourism'],
      isCapital: true,
      builderCount: 38,
      averageStandCost: 280
    },

    // Additional Asian cities
    {
      id: 'hong-kong-hk',
      name: 'Hong Kong',
      country: 'Hong Kong',
      countryCode: 'HK',
      continent: 'Asia',
      region: 'East Asia',
      population: '7.5M',
      annualEvents: 380,
      keyIndustries: ['Finance', 'Trade', 'Logistics', 'Technology'],
      builderCount: 85,
      averageStandCost: 520
    },
    {
      id: 'taipei-tw',
      name: 'Taipei',
      country: 'Taiwan',
      countryCode: 'TW',
      continent: 'Asia',
      region: 'East Asia',
      population: '7.0M',
      annualEvents: 280,
      keyIndustries: ['Technology', 'Electronics', 'Manufacturing'],
      isCapital: true,
      builderCount: 65,
      averageStandCost: 380
    },
    {
      id: 'kuala-lumpur-my',
      name: 'Kuala Lumpur',
      country: 'Malaysia',
      countryCode: 'MY',
      continent: 'Asia',
      region: 'Southeast Asia',
      population: '8.4M',
      annualEvents: 220,
      keyIndustries: ['Technology', 'Palm Oil', 'Tourism'],
      isCapital: true,
      builderCount: 55,
      averageStandCost: 280
    },
    {
      id: 'jakarta-id',
      name: 'Jakarta',
      country: 'Indonesia',
      countryCode: 'ID',
      continent: 'Asia',
      region: 'Southeast Asia',
      population: '10.6M',
      annualEvents: 280,
      keyIndustries: ['Manufacturing', 'Mining', 'Agriculture'],
      isCapital: true,
      builderCount: 75,
      averageStandCost: 220
    },
    {
      id: 'bangkok-th',
      name: 'Bangkok',
      country: 'Thailand',
      countryCode: 'TH',
      continent: 'Asia',
      region: 'Southeast Asia',
      population: '10.5M',
      annualEvents: 380,
      keyIndustries: ['Tourism', 'Food & Beverage', 'Automotive'],
      isCapital: true,
      builderCount: 85,
      averageStandCost: 240
    },
    {
      id: 'manila-ph',
      name: 'Manila',
      country: 'Philippines',
      countryCode: 'PH',
      continent: 'Asia',
      region: 'Southeast Asia',
      population: '25.0M',
      annualEvents: 220,
      keyIndustries: ['Electronics', 'Tourism', 'Outsourcing'],
      isCapital: true,
      builderCount: 65,
      averageStandCost: 200
    },


    // Additional Middle East cities
    {
      id: 'tel-aviv-il',
      name: 'Tel Aviv',
      country: 'Israel',
      countryCode: 'IL',
      continent: 'Asia',
      region: 'Middle East',
      population: '4.3M',
      annualEvents: 180,
      keyIndustries: ['Technology', 'Defense', 'Diamonds'],
      builderCount: 45,
      averageStandCost: 420
    },
    {
      id: 'istanbul-tr',
      name: 'Istanbul',
      country: 'Turkey',
      countryCode: 'TR',
      continent: 'Asia',
      region: 'West Asia',
      population: '15.8M',
      annualEvents: 380,
      keyIndustries: ['Textiles', 'Tourism', 'Manufacturing'],
      builderCount: 95,
      averageStandCost: 280
    },


    // Additional African cities
    {
      id: 'cairo-eg',
      name: 'Cairo',
      country: 'Egypt',
      countryCode: 'EG',
      continent: 'Africa',
      region: 'North Africa',
      population: '21.3M',
      annualEvents: 280,
      keyIndustries: ['Tourism', 'Oil & Gas', 'Agriculture'],
      isCapital: true,
      builderCount: 65,
      averageStandCost: 180
    },
    {
      id: 'casablanca-ma',
      name: 'Casablanca',
      country: 'Morocco',
      countryCode: 'MA',
      continent: 'Africa',
      region: 'North Africa',
      population: '3.4M',
      annualEvents: 140,
      keyIndustries: ['Finance', 'Manufacturing', 'Agriculture'],
      builderCount: 35,
      averageStandCost: 160
    },
    {
      id: 'lagos-ng',
      name: 'Lagos',
      country: 'Nigeria',
      countryCode: 'NG',
      continent: 'Africa',
      region: 'West Africa',
      population: '15.4M',
      annualEvents: 180,
      keyIndustries: ['Oil & Gas', 'Technology', 'Entertainment'],
      builderCount: 45,
      averageStandCost: 140
    },
    {
      id: 'nairobi-ke',
      name: 'Nairobi',
      country: 'Kenya',
      countryCode: 'KE',
      continent: 'Africa',
      region: 'East Africa',
      population: '5.1M',
      annualEvents: 120,
      keyIndustries: ['Technology', 'Agriculture', 'Tourism'],
      isCapital: true,
      builderCount: 28,
      averageStandCost: 120
    }
  ];
}

// Function to get cities by continent
export const getCitiesByContinent = (continent: string): ExpandedCity[] => {
  return getAllExpandedCities().filter(city => city.continent === continent);
};

// Function to get cities by region
export const getCitiesByRegion = (region: string): ExpandedCity[] => {
  return getAllExpandedCities().filter(city => city.region === region);
};

// Function to get cities by country
export const getCitiesByCountry = (country: string): ExpandedCity[] => {
  return getAllExpandedCities().filter(city => city.country === country);
};

// Function to get countries by continent
export const getCountriesByContinent = (continent: string): ExpandedCountry[] => {
  return getAllExpandedCountries().filter(country => country.continent === continent);
};

// Total counts for dashboard display
export const EXPANDED_LOCATION_STATS = {
  totalCountries: getAllExpandedCountries().length,
  totalCities: getAllExpandedCities().length,
  totalEvents: getAllExpandedCities().reduce((sum, city) => sum + city.annualEvents, 0),
  totalBuilders: getAllExpandedCities().reduce((sum, city) => sum + (city.builderCount || 0), 0),
  totalMarketSize: globalExhibitionStats.totalMarketSize,
  coverageByContinent: {
    'Europe': getCitiesByContinent('Europe').length,
    'Asia': getCitiesByContinent('Asia').length,
    'North America': getCitiesByContinent('North America').length,
    'South America': getCitiesByContinent('South America').length,
    'Africa': getCitiesByContinent('Africa').length,
    'Oceania': getCitiesByContinent('Oceania').length
  }
};

// Export main data for use in admin dashboard
export const EXPANDED_EXHIBITION_DATA = {
  continents: ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'],
  countries: getAllExpandedCountries(),
  cities: getAllExpandedCities(),
  stats: EXPANDED_LOCATION_STATS
};

// Export organized by continent for easy access
export const ASIA_CITIES = getCitiesByContinent('Asia');
export const EUROPE_CITIES = getCitiesByContinent('Europe');
export const NORTH_AMERICA_CITIES = getCitiesByContinent('North America');
export const SOUTH_AMERICA_CITIES = getCitiesByContinent('South America');
export const AFRICA_CITIES = getCitiesByContinent('Africa');
export const OCEANIA_CITIES = getCitiesByContinent('Oceania');

export const ASIA_COUNTRIES = getCountriesByContinent('Asia');
export const EUROPE_COUNTRIES = getCountriesByContinent('Europe');
export const NORTH_AMERICA_COUNTRIES = getCountriesByContinent('North America');
export const SOUTH_AMERICA_COUNTRIES = getCountriesByContinent('South America');
export const AFRICA_COUNTRIES = getCountriesByContinent('Africa');
export const OCEANIA_COUNTRIES = getCountriesByContinent('Oceania');

console.log('🌍 COMPREHENSIVE GLOBAL LOCATIONS DATABASE LOADED');
console.log(`📊 Coverage: ${EXPANDED_LOCATION_STATS.totalCountries} countries, ${EXPANDED_LOCATION_STATS.totalCities} cities`);
console.log(`🏗️ ${EXPANDED_LOCATION_STATS.totalBuilders} builders, ${EXPANDED_LOCATION_STATS.totalEvents} annual events`);
console.log(`💰 $${EXPANDED_LOCATION_STATS.totalMarketSize}B global market covered`);
