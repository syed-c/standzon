const fs = require('fs');

// Comprehensive location data
const comprehensiveLocationData = [
  {
    countryName: "United States",
    countryCode: "US",
    countrySlug: "united-states",
    continent: "North America",
    currency: "USD",
    timezone: "America/New_York",
    language: "English",
    cities: [
      { cityName: "Florida", citySlug: "florida", state: "Florida" },
      { cityName: "Los Angeles", citySlug: "los-angeles", state: "California" },
      { cityName: "Anaheim", citySlug: "anaheim", state: "California" },
      { cityName: "Atlanta", citySlug: "atlanta", state: "Georgia" },
      { cityName: "Boston", citySlug: "boston", state: "Massachusetts" },
      { cityName: "Chicago", citySlug: "chicago", state: "Illinois" },
      { cityName: "Houston", citySlug: "houston", state: "Texas" },
      { cityName: "Washington", citySlug: "washington", state: "Washington" },
      { cityName: "San Francisco", citySlug: "san-francisco", state: "California" },
      { cityName: "Miami", citySlug: "miami", state: "Florida" },
      { cityName: "Las Vegas", citySlug: "las-vegas", state: "Nevada" },
      { cityName: "Austin", citySlug: "austin", state: "Texas" },
      { cityName: "Dallas", citySlug: "dallas", state: "Texas" },
      { cityName: "Denver", citySlug: "denver", state: "Colorado" },
      { cityName: "Detroit", citySlug: "detroit", state: "Michigan" },
      { cityName: "Hollywood", citySlug: "hollywood", state: "California" },
      { cityName: "Long Beach", citySlug: "long-beach", state: "California" },
      { cityName: "Louisville", citySlug: "louisville", state: "Kentucky" },
      { cityName: "New York", citySlug: "new-york", state: "New York" },
      { cityName: "Orlando", citySlug: "orlando", state: "Florida" },
      { cityName: "Palm Beach", citySlug: "palm-beach", state: "Florida" },
      { cityName: "Pittsburgh", citySlug: "pittsburgh", state: "Pennsylvania" },
      { cityName: "San Antonio", citySlug: "san-antonio", state: "Texas" },
      { cityName: "San Diego", citySlug: "san-diego", state: "California" },
      { cityName: "San Jose", citySlug: "san-jose", state: "California" },
      { cityName: "Texas", citySlug: "texas", state: "Texas" },
      { cityName: "Washington DC", citySlug: "washington-dc", state: "District of Columbia" },
      { cityName: "New Orleans", citySlug: "new-orleans", state: "Louisiana" },
      { cityName: "Utah", citySlug: "utah", state: "Utah" },
      { cityName: "Michigan", citySlug: "michigan", state: "Michigan" },
      { cityName: "Alaska", citySlug: "alaska", state: "Alaska" },
      { cityName: "Georgia", citySlug: "georgia", state: "Georgia" }
    ]
  },
  {
    countryName: "India",
    countryCode: "IN",
    countrySlug: "india",
    continent: "Asia",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "Hindi",
    cities: [
      { cityName: "Bangalore", citySlug: "bangalore", state: "Karnataka" },
      { cityName: "Mumbai", citySlug: "mumbai", state: "Maharashtra" },
      { cityName: "New Delhi", citySlug: "new-delhi", state: "Delhi" }
    ]
  },
  {
    countryName: "United Kingdom",
    countryCode: "GB",
    countrySlug: "united-kingdom",
    continent: "Europe",
    currency: "GBP",
    timezone: "Europe/London",
    language: "English",
    cities: [
      { cityName: "London", citySlug: "london" },
      { cityName: "Birmingham", citySlug: "birmingham" },
      { cityName: "Manchester", citySlug: "manchester" }
    ]
  },
  {
    countryName: "Australia",
    countryCode: "AU",
    countrySlug: "australia",
    continent: "Oceania",
    currency: "AUD",
    timezone: "Australia/Sydney",
    language: "English",
    cities: [
      { cityName: "Brisbane", citySlug: "brisbane", state: "Queensland" },
      { cityName: "Melbourne", citySlug: "melbourne", state: "Victoria" },
      { cityName: "Sydney", citySlug: "sydney", state: "New South Wales" }
    ]
  },
  {
    countryName: "France",
    countryCode: "FR",
    countrySlug: "france",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Paris",
    language: "French",
    cities: [
      { cityName: "Cannes", citySlug: "cannes" },
      { cityName: "Lyon", citySlug: "lyon" },
      { cityName: "Paris", citySlug: "paris" },
      { cityName: "Strasbourg", citySlug: "strasbourg" }
    ]
  },
  {
    countryName: "Saudi Arabia",
    countryCode: "SA",
    countrySlug: "saudi-arabia",
    continent: "Asia",
    currency: "SAR",
    timezone: "Asia/Riyadh",
    language: "Arabic",
    cities: [
      { cityName: "Riyadh", citySlug: "riyadh" },
      { cityName: "Jeddah", citySlug: "jeddah" }
    ]
  },
  {
    countryName: "Germany",
    countryCode: "DE",
    countrySlug: "germany",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Berlin",
    language: "German",
    cities: [
      { cityName: "Frankfurt", citySlug: "frankfurt" },
      { cityName: "Stuttgart", citySlug: "stuttgart" },
      { cityName: "Berlin", citySlug: "berlin" },
      { cityName: "Cologne", citySlug: "cologne" },
      { cityName: "Dortmund", citySlug: "dortmund" },
      { cityName: "Nuremberg", citySlug: "nuremberg" },
      { cityName: "Hannover", citySlug: "hannover" },
      { cityName: "Hamburg", citySlug: "hamburg" },
      { cityName: "Essen", citySlug: "essen" },
      { cityName: "Dusseldorf", citySlug: "dusseldorf" },
      { cityName: "Munich", citySlug: "munich" },
      { cityName: "Leipzig", citySlug: "leipzig" }
    ]
  },
  {
    countryName: "Italy",
    countryCode: "IT",
    countrySlug: "italy",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Rome",
    language: "Italian",
    cities: [
      { cityName: "Bologna", citySlug: "bologna" },
      { cityName: "Florence", citySlug: "florence" },
      { cityName: "Milan", citySlug: "milan" },
      { cityName: "Rimini", citySlug: "rimini" },
      { cityName: "Rome", citySlug: "rome" },
      { cityName: "Verona", citySlug: "verona" },
      { cityName: "Genoa", citySlug: "genoa" }
    ]
  },
  {
    countryName: "Egypt",
    countryCode: "EG",
    countrySlug: "egypt",
    continent: "Africa",
    currency: "EGP",
    timezone: "Africa/Cairo",
    language: "Arabic",
    cities: [
      { cityName: "Cairo", citySlug: "cairo" }
    ]
  },
  {
    countryName: "Spain",
    countryCode: "ES",
    countrySlug: "spain",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Madrid",
    language: "Spanish",
    cities: [
      { cityName: "Alicante", citySlug: "alicante" },
      { cityName: "Barcelona", citySlug: "barcelona" },
      { cityName: "Bilbao", citySlug: "bilbao" },
      { cityName: "Coruna", citySlug: "coruna" },
      { cityName: "Jaen", citySlug: "jaen" },
      { cityName: "Madrid", citySlug: "madrid" },
      { cityName: "Malaga", citySlug: "malaga" },
      { cityName: "Zaragoza", citySlug: "zaragoza" },
      { cityName: "Vigo", citySlug: "vigo" },
      { cityName: "Valladolid", citySlug: "valladolid" },
      { cityName: "Valencia", citySlug: "valencia" },
      { cityName: "Seville", citySlug: "seville" },
      { cityName: "Palma de Mallorca", citySlug: "palma-de-mallorca" }
    ]
  },
  {
    countryName: "United Arab Emirates",
    countryCode: "AE",
    countrySlug: "united-arab-emirates",
    continent: "Asia",
    currency: "AED",
    timezone: "Asia/Dubai",
    language: "Arabic",
    cities: [
      { cityName: "Dubai", citySlug: "dubai" },
      { cityName: "Abu Dhabi", citySlug: "abu-dhabi" },
      { cityName: "Sharjah", citySlug: "sharjah" }
    ]
  },
  {
    countryName: "Iran",
    countryCode: "IR",
    countrySlug: "iran",
    continent: "Asia",
    currency: "IRR",
    timezone: "Asia/Tehran",
    language: "Persian",
    cities: [
      { cityName: "Tehran", citySlug: "tehran" }
    ]
  },
  {
    countryName: "Indonesia",
    countryCode: "ID",
    countrySlug: "indonesia",
    continent: "Asia",
    currency: "IDR",
    timezone: "Asia/Jakarta",
    language: "Indonesian",
    cities: [
      { cityName: "Bali", citySlug: "bali" },
      { cityName: "Jakarta", citySlug: "jakarta" }
    ]
  },
  {
    countryName: "Malaysia",
    countryCode: "MY",
    countrySlug: "malaysia",
    continent: "Asia",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    language: "Malay",
    cities: [
      { cityName: "Kuala Lumpur", citySlug: "kuala-lumpur" }
    ]
  },
  {
    countryName: "Turkey",
    countryCode: "TR",
    countrySlug: "turkey",
    continent: "Asia",
    currency: "TRY",
    timezone: "Europe/Istanbul",
    language: "Turkish",
    cities: [
      { cityName: "Istanbul", citySlug: "istanbul" }
    ]
  },
  {
    countryName: "Russia",
    countryCode: "RU",
    countrySlug: "russia",
    continent: "Europe",
    currency: "RUB",
    timezone: "Europe/Moscow",
    language: "Russian",
    cities: [
      { cityName: "Moscow", citySlug: "moscow" },
      { cityName: "St. Petersburg", citySlug: "st-petersburg" }
    ]
  },
  {
    countryName: "Singapore",
    countryCode: "SG",
    countrySlug: "singapore",
    continent: "Asia",
    currency: "SGD",
    timezone: "Asia/Singapore",
    language: "English",
    cities: [
      { cityName: "Singapore", citySlug: "singapore" }
    ]
  },
  {
    countryName: "China",
    countryCode: "CN",
    countrySlug: "china",
    continent: "Asia",
    currency: "CNY",
    timezone: "Asia/Shanghai",
    language: "Chinese",
    cities: [
      { cityName: "Beijing", citySlug: "beijing" },
      { cityName: "Guangzhou", citySlug: "guangzhou" }
    ]
  },
  {
    countryName: "Canada",
    countryCode: "CA",
    countrySlug: "canada",
    continent: "North America",
    currency: "CAD",
    timezone: "America/Toronto",
    language: "English",
    cities: [
      { cityName: "Montreal", citySlug: "montreal" },
      { cityName: "Toronto", citySlug: "toronto" },
      { cityName: "Vancouver", citySlug: "vancouver" }
    ]
  },
  {
    countryName: "Switzerland",
    countryCode: "CH",
    countrySlug: "switzerland",
    continent: "Europe",
    currency: "CHF",
    timezone: "Europe/Zurich",
    language: "German",
    cities: [
      { cityName: "Geneva", citySlug: "geneva" },
      { cityName: "Zurich", citySlug: "zurich" },
      { cityName: "Basel", citySlug: "basel" },
      { cityName: "Sirnach", citySlug: "sirnach" },
      { cityName: "Bern", citySlug: "bern" },
      { cityName: "Lugano", citySlug: "lugano" }
    ]
  },
  {
    countryName: "Belgium",
    countryCode: "BE",
    countrySlug: "belgium",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Brussels",
    language: "Dutch",
    cities: [
      { cityName: "Brussels", citySlug: "brussels" },
      { cityName: "Kortrijk", citySlug: "kortrijk" }
    ]
  }
];

// Read existing metadata
const existingMetadata = JSON.parse(fs.readFileSync('./app/metadata.json', 'utf8'));

// Generate new location metadata
const newMetadata = { ...existingMetadata };

// Update main exhibition stands page
newMetadata['/exhibition-stands'] = {
  title: 'Exhibition Stands Worldwide | 21+ Countries & 104+ Cities | Global Directory',
  description: 'Comprehensive global directory of exhibition stand builders covering 21+ countries and 104+ major cities. Professional trade show services across Europe, Asia, Americas, Africa, and Oceania. Custom stands, modular systems, and full-service solutions.',
  keywords: 'exhibition stands worldwide, global trade show services, international exhibition builders, custom stands, exhibition stands by country, trade show contractors worldwide',
  ogImage: '/og-image-locations.png'
};

// Generate country and city metadata
comprehensiveLocationData.forEach(country => {
  const countryPath = `/exhibition-stands/${country.countrySlug}`;
  const cityCount = country.cities.length;
  
  // Country metadata
  newMetadata[countryPath] = {
    title: `Exhibition Stand Builders ${country.countryName} | Trade Show Contractors`,
    description: `Leading exhibition stand builders in ${country.countryName}. Professional contractors serving ${cityCount} major cities including ${country.cities.slice(0, 3).map(c => c.cityName).join(', ')}${cityCount > 3 ? ' and more' : ''}. Custom stands, modular systems, and full-service exhibition solutions.`,
    keywords: `exhibition stands ${country.countryName}, ${country.countryName.toLowerCase()} trade show builders, ${country.countryName.toLowerCase()} exhibition contractors, trade show services ${country.countryName}`,
    ogImage: `/og-image-${country.countrySlug}.png`
  };

  // City metadata
  country.cities.forEach(city => {
    const cityPath = `/exhibition-stands/${country.countrySlug}/${city.citySlug}`;
    
    newMetadata[cityPath] = {
      title: `${city.cityName} Exhibition Stand Builders | Trade Show Contractors`,
      description: `Expert exhibition stand builders in ${city.cityName}, ${country.countryName}. Professional contractors for all major ${city.cityName} trade shows, exhibitions, and conventions. Custom booth design, construction, and installation services.`,
      keywords: `${city.cityName} exhibition stands, ${city.cityName} trade show builders, ${city.cityName} contractors, ${city.cityName} exhibition services, ${country.countryName} trade shows`,
      ogImage: `/og-image-${city.citySlug}.png`
    };
  });
});

// Write updated metadata
fs.writeFileSync('./app/metadata.json', JSON.stringify(newMetadata, null, 2));
console.log('Metadata updated successfully!');
console.log(`Total pages: ${Object.keys(newMetadata).length}`);

// Calculate statistics
const totalCountries = comprehensiveLocationData.length;
const totalCities = comprehensiveLocationData.reduce((sum, country) => sum + country.cities.length, 0);
console.log(`Generated metadata for ${totalCountries} countries and ${totalCities} cities`);