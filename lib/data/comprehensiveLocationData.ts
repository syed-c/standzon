
// Comprehensive location data structure for all countries and cities
// This data includes all the locations provided by the user

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

// Complete location data with all countries and cities
export const comprehensiveLocationData: CountryData[] = [
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
    countryName: "United States",
    countryCode: "US",
    countrySlug: "united-states",
    continent: "North America",
    currency: "USD",
    timezone: "America/New_York",
    language: "English",
    cities: [
      { cityName: "Florida", citySlug: "florida", state: "Florida" },
      { cityName: "Los Angeles", citySlug: "los-angeles", state: "California", latitude: 34.0522, longitude: -118.2437, population: 3971883 },
      { cityName: "Anaheim", citySlug: "anaheim", state: "California", latitude: 33.8366, longitude: -117.9143, population: 352497 },
      { cityName: "Atlanta", citySlug: "atlanta", state: "Georgia", latitude: 33.7490, longitude: -84.3880, population: 498715 },
      { cityName: "Boston", citySlug: "boston", state: "Massachusetts", latitude: 42.3601, longitude: -71.0589, population: 685094 },
      { cityName: "Chicago", citySlug: "chicago", state: "Illinois", latitude: 41.8781, longitude: -87.6298, population: 2693976 },
      { cityName: "Houston", citySlug: "houston", state: "Texas", latitude: 29.7604, longitude: -95.3698, population: 2320268 },
      { cityName: "Washington", citySlug: "washington", state: "Washington", latitude: 47.0379, longitude: -122.9015, population: 753675 },
      { cityName: "San Francisco", citySlug: "san-francisco", state: "California", latitude: 37.7749, longitude: -122.4194, population: 873965 },
      { cityName: "Miami", citySlug: "miami", state: "Florida", latitude: 25.7617, longitude: -80.1918, population: 467963 },
      { cityName: "Las Vegas", citySlug: "las-vegas", state: "Nevada", latitude: 36.1699, longitude: -115.1398, population: 651319 },
      { cityName: "Austin", citySlug: "austin", state: "Texas", latitude: 30.2672, longitude: -97.7431, population: 978908 },
      { cityName: "Dallas", citySlug: "dallas", state: "Texas", latitude: 32.7767, longitude: -96.7970, population: 1343573 },
      { cityName: "Denver", citySlug: "denver", state: "Colorado", latitude: 39.7392, longitude: -104.9903, population: 715522 },
      { cityName: "Detroit", citySlug: "detroit", state: "Michigan", latitude: 42.3314, longitude: -83.0458, population: 670031 },
      { cityName: "Hollywood", citySlug: "hollywood", state: "California", latitude: 34.0928, longitude: -118.3287, population: 114947 },
      { cityName: "Long Beach", citySlug: "long-beach", state: "California", latitude: 33.7701, longitude: -118.1937, population: 466742 },
      { cityName: "Louisville", citySlug: "louisville", state: "Kentucky", latitude: 38.2527, longitude: -85.7585, population: 617638 },
      { cityName: "New York", citySlug: "new-york", state: "New York", latitude: 40.7128, longitude: -74.0060, population: 8336817 },
      { cityName: "Orlando", citySlug: "orlando", state: "Florida", latitude: 28.5383, longitude: -81.3792, population: 307573 },
      { cityName: "Palm Beach", citySlug: "palm-beach", state: "Florida", latitude: 26.7056, longitude: -80.0364, population: 8348 },
      { cityName: "Pittsburgh", citySlug: "pittsburgh", state: "Pennsylvania", latitude: 40.4406, longitude: -79.9959, population: 302971 },
      { cityName: "San Antonio", citySlug: "san-antonio", state: "Texas", latitude: 29.4241, longitude: -98.4936, population: 1547253 },
      { cityName: "San Diego", citySlug: "san-diego", state: "California", latitude: 32.7157, longitude: -117.1611, population: 1423851 },
      { cityName: "San Jose", citySlug: "san-jose", state: "California", latitude: 37.3382, longitude: -121.8863, population: 1021795 },
      { cityName: "Texas", citySlug: "texas", state: "Texas" },
      { cityName: "Washington DC", citySlug: "washington-dc", state: "District of Columbia", latitude: 38.9072, longitude: -77.0369, population: 705749 },
      { cityName: "New Orleans", citySlug: "new-orleans", state: "Louisiana", latitude: 29.9511, longitude: -90.0715, population: 383997 },
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
      { cityName: "Bangalore", citySlug: "bangalore", state: "Karnataka", latitude: 12.9716, longitude: 77.5946, population: 8443675 },
      { cityName: "Mumbai", citySlug: "mumbai", state: "Maharashtra", latitude: 19.0760, longitude: 72.8777, population: 12442373 },
      { cityName: "New Delhi", citySlug: "new-delhi", state: "Delhi", latitude: 28.6139, longitude: 77.2090, population: 32971776 },
      { cityName: "Hyderabad", citySlug: "hyderabad", state: "Telangana", latitude: 17.3850, longitude: 78.4867, population: 6809970 },
      { cityName: "Kolkata", citySlug: "kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639, population: 14974073 }
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
      { cityName: "London", citySlug: "london", latitude: 51.5074, longitude: -0.1278, population: 8982000 },
      { cityName: "Birmingham", citySlug: "birmingham", latitude: 52.4862, longitude: -1.8904, population: 1141816 },
      { cityName: "Manchester", citySlug: "manchester", latitude: 53.4808, longitude: -2.2426, population: 547899 },
      { cityName: "Glasgow", citySlug: "glasgow", latitude: 55.8642, longitude: -4.2518, population: 635640 }
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
      { cityName: "Brisbane", citySlug: "brisbane", state: "Queensland", latitude: -27.4698, longitude: 153.0251, population: 2560720 },
      { cityName: "Melbourne", citySlug: "melbourne", state: "Victoria", latitude: -37.8136, longitude: 144.9631, population: 5078193 },
      { cityName: "Sydney", citySlug: "sydney", state: "New South Wales", latitude: -33.8688, longitude: 151.2093, population: 5312163 }
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
      { cityName: "Cannes", citySlug: "cannes", latitude: 43.5528, longitude: 7.0174, population: 74152 },
      { cityName: "Lyon", citySlug: "lyon", latitude: 45.7640, longitude: 4.8357, population: 518635 },
      { cityName: "Paris", citySlug: "paris", latitude: 48.8566, longitude: 2.3522, population: 2161000 },
      { cityName: "Strasbourg", citySlug: "strasbourg", latitude: 48.5734, longitude: 7.7521, population: 280966 }
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
      { cityName: "Riyadh", citySlug: "riyadh", latitude: 24.7136, longitude: 46.6753, population: 7676654 },
      { cityName: "Jeddah", citySlug: "jeddah", latitude: 21.4858, longitude: 39.1925, population: 4697000 }
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
      { cityName: "Frankfurt", citySlug: "frankfurt", latitude: 50.1109, longitude: 8.6821, population: 753056 },
      { cityName: "Stuttgart", citySlug: "stuttgart", latitude: 48.7758, longitude: 9.1829, population: 626275 },
      { cityName: "Berlin", citySlug: "berlin", latitude: 52.5200, longitude: 13.4050, population: 3669491 },
      { cityName: "Cologne", citySlug: "cologne", latitude: 50.9375, longitude: 6.9603, population: 1073096 },
      { cityName: "Dortmund", citySlug: "dortmund", latitude: 51.5136, longitude: 7.4653, population: 588250 },
      { cityName: "Nuremberg", citySlug: "nuremberg", latitude: 49.4521, longitude: 11.0767, population: 518365 },
      { cityName: "Hannover", citySlug: "hannover", latitude: 52.3759, longitude: 9.7320, population: 535061 },
      { cityName: "Hamburg", citySlug: "hamburg", latitude: 53.5511, longitude: 9.9937, population: 1945532 },
      { cityName: "Essen", citySlug: "essen", latitude: 51.4556, longitude: 7.0116, population: 579432 },
      { cityName: "Dusseldorf", citySlug: "dusseldorf", latitude: 51.2277, longitude: 6.7735, population: 619294 },
      { cityName: "Munich", citySlug: "munich", latitude: 48.1351, longitude: 11.5820, population: 1488202 },
      { cityName: "Leipzig", citySlug: "leipzig", latitude: 51.3397, longitude: 12.3731, population: 597493 }
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
      { cityName: "Bologna", citySlug: "bologna", latitude: 44.4949, longitude: 11.3426, population: 394463 },
      { cityName: "Florence", citySlug: "florence", latitude: 43.7696, longitude: 11.2558, population: 382258 },
      { cityName: "Milan", citySlug: "milan", latitude: 45.4642, longitude: 9.1900, population: 1396059 },
      { cityName: "Rimini", citySlug: "rimini", latitude: 44.0678, longitude: 12.5695, population: 150951 },
      { cityName: "Rome", citySlug: "rome", latitude: 41.9028, longitude: 12.4964, population: 2873494 },
      { cityName: "Verona", citySlug: "verona", latitude: 45.4384, longitude: 10.9916, population: 259608 },
      { cityName: "Genoa", citySlug: "genoa", latitude: 44.4056, longitude: 8.9463, population: 583601 }
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
      { cityName: "Cairo", citySlug: "cairo", latitude: 30.0444, longitude: 31.2357, population: 20484965 }
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
      { cityName: "Alicante", citySlug: "alicante", latitude: 38.3452, longitude: -0.4810, population: 337482 },
      { cityName: "Barcelona", citySlug: "barcelona", latitude: 41.3851, longitude: 2.1734, population: 1620343 },
      { cityName: "Bilbao", citySlug: "bilbao", latitude: 43.2627, longitude: -2.9253, population: 346843 },
      { cityName: "Coruna", citySlug: "coruna", latitude: 43.3623, longitude: -8.4115, population: 245711 },
      { cityName: "Jaen", citySlug: "jaen", latitude: 37.7796, longitude: -3.7849, population: 112757 },
      { cityName: "Madrid", citySlug: "madrid", latitude: 40.4168, longitude: -3.7038, population: 3223334 },
      { cityName: "Malaga", citySlug: "malaga", latitude: 36.7213, longitude: -4.4214, population: 578460 },
      { cityName: "Zaragoza", citySlug: "zaragoza", latitude: 41.6488, longitude: -0.8891, population: 675301 },
      { cityName: "Vigo", citySlug: "vigo", latitude: 42.2406, longitude: -8.7207, population: 295364 },
      { cityName: "Valladolid", citySlug: "valladolid", latitude: 41.6523, longitude: -4.7245, population: 298866 },
      { cityName: "Valencia", citySlug: "valencia", latitude: 39.4699, longitude: -0.3763, population: 794288 },
      { cityName: "Seville", citySlug: "seville", latitude: 37.3891, longitude: -5.9845, population: 688711 },
      { cityName: "Palma de Mallorca", citySlug: "palma-de-mallorca", latitude: 39.5696, longitude: 2.6502, population: 416065 }
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
      { cityName: "Dubai", citySlug: "dubai", latitude: 25.2048, longitude: 55.2708, population: 3331420 },
      { cityName: "Abu Dhabi", citySlug: "abu-dhabi", latitude: 24.4539, longitude: 54.3773, population: 1482816 },
      { cityName: "Sharjah", citySlug: "sharjah", latitude: 25.3463, longitude: 55.4209, population: 1684649 }
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
      { cityName: "Bali", citySlug: "bali", latitude: -8.4095, longitude: 115.1889, population: 4317404 },
      { cityName: "Jakarta", citySlug: "jakarta", latitude: -6.2088, longitude: 106.8456, population: 10770487 }
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
      { cityName: "Kuala Lumpur", citySlug: "kuala-lumpur", latitude: 3.1390, longitude: 101.6869, population: 1768000 }
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
      { cityName: "Istanbul", citySlug: "istanbul", latitude: 41.0082, longitude: 28.9784, population: 15519267 },
      { cityName: "Ankara", citySlug: "ankara", latitude: 39.9334, longitude: 32.8597, population: 5663322 }
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
      { cityName: "Moscow", citySlug: "moscow", latitude: 55.7558, longitude: 37.6176, population: 12506468 },
      { cityName: "St. Petersburg", citySlug: "st-petersburg", latitude: 59.9311, longitude: 30.3609, population: 5383890 }
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
      { cityName: "Singapore", citySlug: "singapore", latitude: 1.3521, longitude: 103.8198, population: 5685807 }
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
      { cityName: "Beijing", citySlug: "beijing", latitude: 39.9042, longitude: 116.4074, population: 21542000 },
      { cityName: "Guangzhou", citySlug: "guangzhou", latitude: 23.1291, longitude: 113.2644, population: 18676605 },
      { cityName: "Shanghai", citySlug: "shanghai", latitude: 31.2304, longitude: 121.4737, population: 24870895 },
      { cityName: "Shenzhen", citySlug: "shenzhen", latitude: 22.5431, longitude: 114.0579, population: 12356820 }
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
      { cityName: "Montreal", citySlug: "montreal", latitude: 45.5017, longitude: -73.5673, population: 1780000 },
      { cityName: "Toronto", citySlug: "toronto", latitude: 43.6532, longitude: -79.3832, population: 2930000 },
      { cityName: "Vancouver", citySlug: "vancouver", latitude: 49.2827, longitude: -123.1207, population: 675218 }
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
      { cityName: "Geneva", citySlug: "geneva", latitude: 46.2044, longitude: 6.1432, population: 201818 },
      { cityName: "Zurich", citySlug: "zurich", latitude: 47.3769, longitude: 8.5417, population: 415367 },
      { cityName: "Basel", citySlug: "basel", latitude: 47.5596, longitude: 7.5886, population: 175131 },
      { cityName: "Sirnach", citySlug: "sirnach", latitude: 47.4597, longitude: 9.0564, population: 7851 },
      { cityName: "Bern", citySlug: "bern", latitude: 46.9481, longitude: 7.4474, population: 133883 },
      { cityName: "Lugano", citySlug: "lugano", latitude: 46.0037, longitude: 8.9511, population: 62315 }
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
      { cityName: "Brussels", citySlug: "brussels", latitude: 50.8503, longitude: 4.3517, population: 1208542 },
      { cityName: "Kortrijk", citySlug: "kortrijk", latitude: 50.8281, longitude: 3.2648, population: 76265 }
    ]
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
      { cityName: "Bangkok", citySlug: "bangkok", latitude: 13.7563, longitude: 100.5018, population: 10539415 }
    ,
      { cityName: "Khon Kaen", citySlug: "khon-kaen", latitude: 16.4322, longitude: 102.8236, population: 114459 }
    ]
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
      { cityName: "Amsterdam", citySlug: "amsterdam", latitude: 52.3676, longitude: 4.9041, population: 872680 },
      { cityName: "Rotterdam", citySlug: "rotterdam", latitude: 51.9244, longitude: 4.4777, population: 651446 },
      { cityName: "Utrecht", citySlug: "utrecht", latitude: 52.0907, longitude: 5.1214, population: 357179 }
    ,
      { cityName: "Maastricht", citySlug: "maastricht", latitude: 50.8514, longitude: 5.691, population: 122378 }
    ,
      { cityName: "Vijfhuizen", citySlug: "vijfhuizen", latitude: 52.35, longitude: 4.6667, population: 5115 }
    ]
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
      { cityName: "Copenhagen", citySlug: "copenhagen", latitude: 55.6761, longitude: 12.5683, population: 660193 }
    ]
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
      { cityName: "Oslo", citySlug: "oslo", latitude: 59.9139, longitude: 10.7522, population: 697549 }
    ]
  },
  {
    countryName: "Sweden",
    countryCode: "SE",
    countrySlug: "sweden",
    continent: "Europe",
    currency: "SEK",
    timezone: "Europe/Stockholm",
    language: "Swedish",
    cities: []
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
      { cityName: "Helsinki", citySlug: "helsinki", latitude: 60.1699, longitude: 24.9384, population: 658864 }
    ]
  },
  {
    countryName: "Austria",
    countryCode: "AT",
    countrySlug: "austria",
    continent: "Europe",
    currency: "EUR",
    timezone: "Europe/Vienna",
    language: "German",
    cities: []
  },
  {
    countryName: "Czech Republic",
    countryCode: "CZ",
    countrySlug: "czech-republic",
    continent: "Europe",
    currency: "CZK",
    timezone: "Europe/Prague",
    language: "Czech",
    cities: []
  },
  {
    countryName: "Poland",
    countryCode: "PL",
    countrySlug: "poland",
    continent: "Europe",
    currency: "PLN",
    timezone: "Europe/Warsaw",
    language: "Polish",
    cities: []
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
      { cityName: "Budapest", citySlug: "budapest", latitude: 47.4979, longitude: 19.0402, population: 1752286 }
    ]
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
      { cityName: "Tokyo", citySlug: "tokyo", latitude: 35.6762, longitude: 139.6503, population: 37435191 },
      { cityName: "Osaka", citySlug: "osaka", latitude: 34.6937, longitude: 135.5023, population: 2691185 },
      { cityName: "Chiba", citySlug: "chiba", latitude: 35.6073, longitude: 140.1063, population: 979768 }
    ]
  },
  {
    countryName: "Taiwan",
    countryCode: "TW",
    countrySlug: "taiwan",
    continent: "Asia",
    currency: "TWD",
    timezone: "Asia/Taipei",
    language: "Chinese",
    cities: [
      { cityName: "Taipei", citySlug: "taipei", latitude: 25.0330, longitude: 121.5654, population: 2646204 }
    ]
  },
  {
    countryName: "Hong Kong",
    countryCode: "HK",
    countrySlug: "hong-kong",
    continent: "Asia",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    language: "Chinese",
    cities: [
      { cityName: "Hong Kong", citySlug: "hong-kong", latitude: 22.3193, longitude: 114.1694, population: 7496981 }
    ]
  },
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
    countryName: "Philippines",
    countryCode: "PH",
    countrySlug: "philippines",
    continent: "Asia",
    currency: "PHP",
    timezone: "Asia/Manila",
    language: "Filipino",
    cities: [
      { cityName: "Manila", citySlug: "manila", latitude: 14.5995, longitude: 120.9842, population: 1780148 }
    ]
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
      { cityName: "Lagos", citySlug: "lagos", latitude: 6.5244, longitude: 3.3792, population: 14862111 }
    ]
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
      { cityName: "Nairobi", citySlug: "nairobi", latitude: -1.2921, longitude: 36.8219, population: 4397073 }
    ]
  },
  {
    countryName: "South Africa",
    countryCode: "ZA",
    countrySlug: "south-africa",
    continent: "Africa",
    currency: "ZAR",
    timezone: "Africa/Johannesburg",
    language: "English",
    cities: [
      { cityName: "Cape Town", citySlug: "cape-town", latitude: -33.9249, longitude: 18.4241, population: 4618263 },
      { cityName: "Johannesburg", citySlug: "johannesburg", latitude: -26.2041, longitude: 28.0473, population: 5635127 }
    ]
  },
  {
    countryName: "Morocco",
    countryCode: "MA",
    countrySlug: "morocco",
    continent: "Africa",
    currency: "MAD",
    timezone: "Africa/Casablanca",
    language: "Arabic",
    cities: [
      { cityName: "Casablanca", citySlug: "casablanca", latitude: 33.5731, longitude: -7.5898, population: 3359818 }
    ]
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
      { cityName: "São Paulo", citySlug: "sao-paulo", latitude: -23.5558, longitude: -46.6396, population: 12325232 },
      { cityName: "Rio de Janeiro", citySlug: "rio-de-janeiro", latitude: -22.9068, longitude: -43.1729, population: 6747815 },
      { cityName: "Curitiba", citySlug: "curitiba", latitude: -25.4284, longitude: -49.2733, population: 1948579 },
      { cityName: "Brasília", citySlug: "brasilia", latitude: -15.7801, longitude: -47.9292, population: 3055548 }
    ]
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
      { cityName: "Mexico City", citySlug: "mexico-city", latitude: 19.4326, longitude: -99.1332, population: 21804515 }
    ]
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
      { cityName: "Tel Aviv", citySlug: "tel-aviv", latitude: 32.0853, longitude: 34.7818, population: 460613 }
    ]
  },
  {
    countryName: "Colombia",
    countryCode: "CO",
    countrySlug: "colombia",
    continent: "South America",
    currency: "COP",
    timezone: "America/Bogota",
    language: "Spanish",
    cities: [
      { cityName: "Bogotá", citySlug: "bogota", latitude: 4.6097, longitude: -74.0818, population: 7412566 },
      { cityName: "Medellín", citySlug: "medellin", latitude: 6.2442, longitude: -75.5812, population: 2509788 },
      { cityName: "Cali", citySlug: "cali", latitude: 3.4372, longitude: -76.5225, population: 2227627 }
    ]
  }
];

// Helper functions for location data
export const getCountryBySlug = (slug: string): CountryData | undefined => {
  return comprehensiveLocationData.find(country => country.countrySlug === slug);
};

export const getCityBySlug = (countrySlug: string, citySlug: string): CityData | undefined => {
  const country = getCountryBySlug(countrySlug);
  return country?.cities.find(city => city.citySlug === citySlug);
};

export const getAllCountries = (): CountryData[] => {
  return comprehensiveLocationData;
};

export const getAllCitiesForCountry = (countrySlug: string): CityData[] => {
  const country = getCountryBySlug(countrySlug);
  return country?.cities || [];
};

// Statistics for the platform
export const globalExhibitionStats = {
  totalCountries: comprehensiveLocationData.length,
  totalCities: comprehensiveLocationData.reduce((sum, country) => sum + country.cities.length, 0),
  totalBuilders: 0, // Will be updated from database
  totalExhibitions: 0, // Will be updated from database
  tier1Countries: ['United States', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain'],
  tier1Stats: {
    countries: 6,
    cities: comprehensiveLocationData
      .filter(country => ['United States', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain'].includes(country.countryName))
      .reduce((sum, country) => sum + country.cities.length, 0)
  }
};
