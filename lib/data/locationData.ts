// Comprehensive location data structure for countries and cities
// This data will be used to populate the database and generate dynamic pages

export interface CountryData {
  countryName: string;
  countryCode: string;
  countrySlug: string;
  continent: string;
  currency: string;
  timezone: string;
  language: string;
  cities: CityData[];
}

export interface CityData {
  cityName: string;
  citySlug: string;
  state?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
}

// Comprehensive location data based on the provided list
export const locationData: CountryData[] = [
  {
    countryName: "Vietnam",
    countryCode: "VN",
    countrySlug: "vietnam",
    continent: "Asia",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    language: "Vietnamese",
    cities: []
  },
  {
    countryName: "New Zealand",
    countryCode: "NZ",
    countrySlug: "new-zealand",
    continent: "Oceania",
    currency: "NZD",
    timezone: "Pacific/Auckland",
    language: "English",
    cities: []
  },
  {
    countryName: "Hong Kong",
    countryCode: "HK",
    countrySlug: "hong-kong",
    continent: "Asia",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    language: "Chinese",
    cities: []
  },
  {
    countryName: "Taiwan",
    countryCode: "TW",
    countrySlug: "taiwan",
    continent: "Asia",
    currency: "TWD",
    timezone: "Asia/Taipei",
    language: "Chinese",
    cities: []
  },
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
      {
        cityName: "San Francisco",
        citySlug: "san-francisco",
        state: "California",
      },
      { cityName: "Miami", citySlug: "miami", state: "Florida" },
      { cityName: "Las Vegas", citySlug: "las-vegas", state: "Nevada" },
      { cityName: "Austin", citySlug: "austin", state: "Texas" },
      { cityName: "Dallas", citySlug: "dallas", state: "Texas" },
      { cityName: "Denver", citySlug: "denver", state: "Colorado" },
      { cityName: "Detroit", citySlug: "detroit", state: "Michigan" },

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
      { cityName: "New Orleans", citySlug: "new-orleans", state: "Louisiana" },
      { cityName: "Utah", citySlug: "utah", state: "Utah" },
      { cityName: "Michigan", citySlug: "michigan", state: "Michigan" },
      { cityName: "Alaska", citySlug: "alaska", state: "Alaska" },
      { cityName: "Georgia", citySlug: "georgia", state: "Georgia" }
    ],
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

      { cityName: "Hyderabad", citySlug: "hyderabad", state: "Telangana" },
      { cityName: "Kolkata", citySlug: "kolkata", state: "West Bengal" }
    ],
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
      { cityName: "Manchester", citySlug: "manchester" },

    ],
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
    ],
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
    ],
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
    ],
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
    ],
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
    ],
  },
  {
    countryName: "Egypt",
    countryCode: "EG",
    countrySlug: "egypt",
    continent: "Africa",
    currency: "EGP",
    timezone: "Africa/Cairo",
    language: "Arabic",
    cities: [{ cityName: "Cairo", citySlug: "cairo" }],
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
    ],
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
    ],
  },
  {
    countryName: "Jordan",
    countryCode: "JO",
    countrySlug: "jordan",
    continent: "Asia",
    currency: "JOD",
    timezone: "Asia/Amman",
    language: "Arabic",
    cities: [
      { cityName: "Amman", citySlug: "amman" },
      { cityName: "Aqaba", citySlug: "aqaba" },
      { cityName: "Irbid", citySlug: "irbid" },
      { cityName: "Zarqa", citySlug: "zarqa" },
      { cityName: "Madaba", citySlug: "madaba" }
    ],
  },
  {
    countryName: "Lebanon",
    countryCode: "LB",
    countrySlug: "lebanon",
    continent: "Asia",
    currency: "LBP",
    timezone: "Asia/Beirut",
    language: "Arabic",
    cities: [
      { cityName: "Beirut", citySlug: "beirut" },
      { cityName: "Tripoli", citySlug: "tripoli" },
      { cityName: "Sidon", citySlug: "sidon" },
      { cityName: "Tyre", citySlug: "tyre" },
      { cityName: "Byblos", citySlug: "byblos" }
    ],
  },
  {
    countryName: "Israel",
    countryCode: "IL",
    countrySlug: "israel",
    continent: "Asia",
    currency: "ILS",
    timezone: "Asia/Jerusalem",
    language: "Hebrew",
    cities: [
      { cityName: "Jerusalem", citySlug: "jerusalem" },
      { cityName: "Tel Aviv", citySlug: "tel-aviv" },
      { cityName: "Haifa", citySlug: "haifa" },
      { cityName: "Eilat", citySlug: "eilat" },
      { cityName: "Nazareth", citySlug: "nazareth" }
    ],
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
    ],
  },
  {
    countryName: "Malaysia",
    countryCode: "MY",
    countrySlug: "malaysia",
    continent: "Asia",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    language: "Malay",
    cities: [{ cityName: "Kuala Lumpur", citySlug: "kuala-lumpur" }],
  },
  {
    countryName: "Turkey",
    countryCode: "TR",
    countrySlug: "turkey",
    continent: "Asia",
    currency: "TRY",
    timezone: "Europe/Istanbul",
    language: "Turkish",
    cities: [{ cityName: "Istanbul", citySlug: "istanbul" }],
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
    ],
  },
  {
    countryName: "Singapore",
    countryCode: "SG",
    countrySlug: "singapore",
    continent: "Asia",
    currency: "SGD",
    timezone: "Asia/Singapore",
    language: "English",
    cities: [{ cityName: "Singapore", citySlug: "singapore" }],
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
    ],
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
    ],
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
    ],
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
    ],
  },
  {
    countryName: "Netherlands",
    countryCode: "NL",
    countrySlug: "netherlands",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Amsterdam",
    language: "Dutch",
    cities: [
      { cityName: "Amsterdam", citySlug: "amsterdam" },
      { cityName: "Rotterdam", citySlug: "rotterdam" },
      { cityName: "Maastricht", citySlug: "maastricht" },
      { cityName: "Vijfhuizen", citySlug: "vijfhuizen" }
    ],
  },
  {
    countryName: "Thailand",
    countryCode: "TH",
    countrySlug: "thailand",
    continent: "Asia",
    currency: "THB",
    timezone: "Asia/Bangkok",
    language: "Thai",
    cities: [
      { cityName: "Bangkok", citySlug: "bangkok" },
      { cityName: "Khon Kaen", citySlug: "khon-kaen" }
    ],
  },
  {
    countryName: "Philippines",
    countryCode: "PH",
    countrySlug: "philippines",
    continent: "Asia",
    currency: "PHP",
    timezone: "Asia/Manila",
    language: "Filipino",
    cities: [

    ],
  },
  {
    countryName: "Japan",
    countryCode: "JP",
    countrySlug: "japan",
    continent: "Asia",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    language: "Japanese",
    cities: [
      { cityName: "Tokyo", citySlug: "tokyo" },
      { cityName: "Osaka", citySlug: "osaka" },
      { cityName: "Chiba", citySlug: "chiba" }
    ],
  },
  {
    countryName: "Sweden",
    countryCode: "SE",
    countrySlug: "sweden",
    continent: "Europe",
    currency: "SEK",
    timezone: "Europe/Stockholm",
    language: "Swedish",
    cities: [],
  },
  {
    countryName: "Norway",
    countryCode: "NO",
    countrySlug: "norway",
    continent: "Europe",
    currency: "NOK",
    timezone: "Europe/Oslo",
    language: "Norwegian",
    cities: [
      { cityName: "Oslo", citySlug: "oslo" }
    ],
  },
  {
    countryName: "Denmark",
    countryCode: "DK",
    countrySlug: "denmark",
    continent: "Europe",
    currency: "DKK",
    timezone: "Europe/Copenhagen",
    language: "Danish",
    cities: [
      { cityName: "Copenhagen", citySlug: "copenhagen" }
    ],
  },
  {
    countryName: "Finland",
    countryCode: "FI",
    countrySlug: "finland",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Helsinki",
    language: "Finnish",
    cities: [
      { cityName: "Helsinki", citySlug: "helsinki" }
    ],
  },
  {
    countryName: "Poland",
    countryCode: "PL",
    countrySlug: "poland",
    continent: "Europe",
    currency: "PLN",
    timezone: "Europe/Warsaw",
    language: "Polish",
    cities: [

    ],
  },
  {
    countryName: "Austria",
    countryCode: "AT",
    countrySlug: "austria",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Vienna",
    language: "German",
    cities: [
      { cityName: "Vienna", citySlug: "vienna" }
    ],
  },
  {
    countryName: "Czech Republic",
    countryCode: "CZ",
    countrySlug: "czech-republic",
    continent: "Europe",
    currency: "CZK",
    timezone: "Europe/Prague",
    language: "Czech",
    cities: [
      { cityName: "Prague", citySlug: "prague" }
    ]
  },
  {
    countryName: "Hungary",
    countryCode: "HU",
    countrySlug: "hungary",
    continent: "Europe",
    currency: "HUF",
    timezone: "Europe/Budapest",
    language: "Hungarian",
    cities: [
      { cityName: "Budapest", citySlug: "budapest" }
    ],
  },
  {
    countryName: "Nigeria",
    countryCode: "NG",
    countrySlug: "nigeria",
    continent: "Africa",
    currency: "NGN",
    timezone: "Africa/Lagos",
    language: "English",
    cities: [
      { cityName: "Lagos", citySlug: "lagos" }
    ],
  },
  {
    countryName: "Kenya",
    countryCode: "KE",
    countrySlug: "kenya",
    continent: "Africa",
    currency: "KES",
    timezone: "Africa/Nairobi",
    language: "English",
    cities: [
      { cityName: "Nairobi", citySlug: "nairobi" }
    ],
  },
  {
    countryName: "Brazil",
    countryCode: "BR",
    countrySlug: "brazil",
    continent: "South America",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    language: "Portuguese",
    cities: [

    ],
  },
  {
    countryName: "Mexico",
    countryCode: "MX",
    countrySlug: "mexico",
    continent: "North America",
    currency: "MXN",
    timezone: "America/Mexico_City",
    language: "Spanish",
    cities: [

    ],
  }
    ];

// Helper functions for location data
export const getCountryBySlug = (slug: string): CountryData | undefined => {
  return locationData.find((country) => country.countrySlug === slug);
};

export const getCityBySlug = (
  countrySlug: string,
  citySlug: string
): CityData | undefined => {
  const country = getCountryBySlug(countrySlug);
  return country?.cities.find((city) => city.citySlug === citySlug);
};

export const getAllCountries = (): CountryData[] => {
  return locationData;
};

export const getAllCitiesForCountry = (countrySlug: string): CityData[] => {
  const country = getCountryBySlug(countrySlug);
  return country?.cities || [];
};

// Statistics for the platform
export const globalExhibitionStats = {
  totalCountries: locationData.length,
  totalCities: locationData.reduce(
    (sum, country) => sum + country.cities.length,
    0
  ),
  totalBuilders: 0, // Will be updated from database
  totalExhibitions: 0, // Will be updated from database
  tier1Countries: [
    "United States",
    "Germany",
    "United Kingdom",
    "France",
    "Italy",
    "Spain"
    ],
  tier1Stats: {
    countries: 6,
    cities: locationData
      .filter((country) =>
        [
          "United States",
          "Germany",
          "United Kingdom",
          "France",
          "Italy",
          "Spain"
    ].includes(country.countryName)
      )
      .reduce((sum, country) => sum + country.cities.length, 0),
  },
};
