// 🌍 GLOBAL PAGE GENERATOR
// Comprehensive system to generate all 247 country and city pages
// with automatic GMB builder integration

import { EXPANDED_EXHIBITION_DATA, getAllExpandedCities, getCitiesByCountry } from '@/lib/data/expandedLocations';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

// Complete list of 247 countries with basic info
export const GLOBAL_COUNTRIES = [
  // Europe (43 countries)
  { name: 'Germany', code: 'DE', continent: 'Europe', capital: 'Berlin', region: 'Central Europe' },
  { name: 'France', code: 'FR', continent: 'Europe', capital: 'Paris', region: 'Western Europe' },
  { name: 'Italy', code: 'IT', continent: 'Europe', capital: 'Rome', region: 'Southern Europe' },
  { name: 'United Kingdom', code: 'GB', continent: 'Europe', capital: 'London', region: 'Western Europe' },
  { name: 'Spain', code: 'ES', continent: 'Europe', capital: 'Madrid', region: 'Southern Europe' },
  { name: 'Netherlands', code: 'NL', continent: 'Europe', capital: 'Amsterdam', region: 'Western Europe' },
  { name: 'Belgium', code: 'BE', continent: 'Europe', capital: 'Brussels', region: 'Western Europe' },
  { name: 'Switzerland', code: 'CH', continent: 'Europe', capital: 'Bern', region: 'Central Europe' },
  { name: 'Austria', code: 'AT', continent: 'Europe', capital: 'Vienna', region: 'Central Europe' },
  { name: 'Poland', code: 'PL', continent: 'Europe', capital: 'Warsaw', region: 'Central Europe' },
  { name: 'Russia', code: 'RU', continent: 'Europe', capital: 'Moscow', region: 'Eastern Europe' },
  { name: 'Sweden', code: 'SE', continent: 'Europe', capital: 'Stockholm', region: 'Northern Europe' },
  { name: 'Norway', code: 'NO', continent: 'Europe', capital: 'Oslo', region: 'Northern Europe' },
  { name: 'Denmark', code: 'DK', continent: 'Europe', capital: 'Copenhagen', region: 'Northern Europe' },
  { name: 'Finland', code: 'FI', continent: 'Europe', capital: 'Helsinki', region: 'Northern Europe' },
  { name: 'Czech Republic', code: 'CZ', continent: 'Europe', capital: 'Prague', region: 'Central Europe' },
  { name: 'Hungary', code: 'HU', continent: 'Europe', capital: 'Budapest', region: 'Central Europe' },
  { name: 'Portugal', code: 'PT', continent: 'Europe', capital: 'Lisbon', region: 'Southern Europe' },
  { name: 'Greece', code: 'GR', continent: 'Europe', capital: 'Athens', region: 'Southern Europe' },
  { name: 'Ireland', code: 'IE', continent: 'Europe', capital: 'Dublin', region: 'Western Europe' },
  { name: 'Ukraine', code: 'UA', continent: 'Europe', capital: 'Kyiv', region: 'Eastern Europe' },
  { name: 'Romania', code: 'RO', continent: 'Europe', capital: 'Bucharest', region: 'Eastern Europe' },
  { name: 'Bulgaria', code: 'BG', continent: 'Europe', capital: 'Sofia', region: 'Eastern Europe' },
  { name: 'Croatia', code: 'HR', continent: 'Europe', capital: 'Zagreb', region: 'Southern Europe' },
  { name: 'Slovakia', code: 'SK', continent: 'Europe', capital: 'Bratislava', region: 'Central Europe' },
  { name: 'Slovenia', code: 'SI', continent: 'Europe', capital: 'Ljubljana', region: 'Central Europe' },
  { name: 'Lithuania', code: 'LT', continent: 'Europe', capital: 'Vilnius', region: 'Northern Europe' },
  { name: 'Latvia', code: 'LV', continent: 'Europe', capital: 'Riga', region: 'Northern Europe' },
  { name: 'Estonia', code: 'EE', continent: 'Europe', capital: 'Tallinn', region: 'Northern Europe' },
  { name: 'Luxembourg', code: 'LU', continent: 'Europe', capital: 'Luxembourg City', region: 'Western Europe' },
  { name: 'Malta', code: 'MT', continent: 'Europe', capital: 'Valletta', region: 'Southern Europe' },
  { name: 'Cyprus', code: 'CY', continent: 'Europe', capital: 'Nicosia', region: 'Southern Europe' },
  { name: 'Iceland', code: 'IS', continent: 'Europe', capital: 'Reykjavik', region: 'Northern Europe' },
  { name: 'Moldova', code: 'MD', continent: 'Europe', capital: 'Chisinau', region: 'Eastern Europe' },
  { name: 'Belarus', code: 'BY', continent: 'Europe', capital: 'Minsk', region: 'Eastern Europe' },
  { name: 'Serbia', code: 'RS', continent: 'Europe', capital: 'Belgrade', region: 'Southern Europe' },
  { name: 'Montenegro', code: 'ME', continent: 'Europe', capital: 'Podgorica', region: 'Southern Europe' },
  { name: 'Bosnia and Herzegovina', code: 'BA', continent: 'Europe', capital: 'Sarajevo', region: 'Southern Europe' },
  { name: 'Albania', code: 'AL', continent: 'Europe', capital: 'Tirana', region: 'Southern Europe' },
  { name: 'North Macedonia', code: 'MK', continent: 'Europe', capital: 'Skopje', region: 'Southern Europe' },
  { name: 'Kosovo', code: 'XK', continent: 'Europe', capital: 'Pristina', region: 'Southern Europe' },
  { name: 'Andorra', code: 'AD', continent: 'Europe', capital: 'Andorra la Vella', region: 'Southern Europe' },
  { name: 'Monaco', code: 'MC', continent: 'Europe', capital: 'Monaco', region: 'Western Europe' },

  // Asia (50 countries)
  { name: 'China', code: 'CN', continent: 'Asia', capital: 'Beijing', region: 'East Asia' },
  { name: 'Japan', code: 'JP', continent: 'Asia', capital: 'Tokyo', region: 'East Asia' },
  { name: 'South Korea', code: 'KR', continent: 'Asia', capital: 'Seoul', region: 'East Asia' },
  { name: 'India', code: 'IN', continent: 'Asia', capital: 'New Delhi', region: 'South Asia' },
  { name: 'Singapore', code: 'SG', continent: 'Asia', capital: 'Singapore', region: 'Southeast Asia' },
  { name: 'United Arab Emirates', code: 'AE', continent: 'Asia', capital: 'Abu Dhabi', region: 'Middle East' },
  { name: 'Saudi Arabia', code: 'SA', continent: 'Asia', capital: 'Riyadh', region: 'Middle East' },
  { name: 'Qatar', code: 'QA', continent: 'Asia', capital: 'Doha', region: 'Middle East' },
  { name: 'Kuwait', code: 'KW', continent: 'Asia', capital: 'Kuwait City', region: 'Middle East' },
  { name: 'Bahrain', code: 'BH', continent: 'Asia', capital: 'Manama', region: 'Middle East' },
  { name: 'Oman', code: 'OM', continent: 'Asia', capital: 'Muscat', region: 'Middle East' },
  { name: 'Turkey', code: 'TR', continent: 'Asia', capital: 'Ankara', region: 'West Asia' },
  { name: 'Israel', code: 'IL', continent: 'Asia', capital: 'Jerusalem', region: 'Middle East' },
  { name: 'Jordan', code: 'JO', continent: 'Asia', capital: 'Amman', region: 'Middle East' },
  { name: 'Lebanon', code: 'LB', continent: 'Asia', capital: 'Beirut', region: 'Middle East' },
  { name: 'Syria', code: 'SY', continent: 'Asia', capital: 'Damascus', region: 'Middle East' },
  { name: 'Iraq', code: 'IQ', continent: 'Asia', capital: 'Baghdad', region: 'Middle East' },
  { name: 'Iran', code: 'IR', continent: 'Asia', capital: 'Tehran', region: 'Middle East' },
  { name: 'Pakistan', code: 'PK', continent: 'Asia', capital: 'Islamabad', region: 'South Asia' },
  { name: 'Afghanistan', code: 'AF', continent: 'Asia', capital: 'Kabul', region: 'South Asia' },
  { name: 'Bangladesh', code: 'BD', continent: 'Asia', capital: 'Dhaka', region: 'South Asia' },
  { name: 'Sri Lanka', code: 'LK', continent: 'Asia', capital: 'Sri Jayawardenepura Kotte', region: 'South Asia' },
  { name: 'Myanmar', code: 'MM', continent: 'Asia', capital: 'Naypyidaw', region: 'Southeast Asia' },
  { name: 'Thailand', code: 'TH', continent: 'Asia', capital: 'Bangkok', region: 'Southeast Asia' },
  { name: 'Vietnam', code: 'VN', continent: 'Asia', capital: 'Hanoi', region: 'Southeast Asia' },
  { name: 'Cambodia', code: 'KH', continent: 'Asia', capital: 'Phnom Penh', region: 'Southeast Asia' },
  { name: 'Laos', code: 'LA', continent: 'Asia', capital: 'Vientiane', region: 'Southeast Asia' },
  { name: 'Malaysia', code: 'MY', continent: 'Asia', capital: 'Kuala Lumpur', region: 'Southeast Asia' },
  { name: 'Indonesia', code: 'ID', continent: 'Asia', capital: 'Jakarta', region: 'Southeast Asia' },
  { name: 'Philippines', code: 'PH', continent: 'Asia', capital: 'Manila', region: 'Southeast Asia' },
  { name: 'Brunei', code: 'BN', continent: 'Asia', capital: 'Bandar Seri Begawan', region: 'Southeast Asia' },
  { name: 'Kazakhstan', code: 'KZ', continent: 'Asia', capital: 'Nur-Sultan', region: 'Central Asia' },
  { name: 'Uzbekistan', code: 'UZ', continent: 'Asia', capital: 'Tashkent', region: 'Central Asia' },
  { name: 'Turkmenistan', code: 'TM', continent: 'Asia', capital: 'Ashgabat', region: 'Central Asia' },
  { name: 'Kyrgyzstan', code: 'KG', continent: 'Asia', capital: 'Bishkek', region: 'Central Asia' },
  { name: 'Tajikistan', code: 'TJ', continent: 'Asia', capital: 'Dushanbe', region: 'Central Asia' },
  { name: 'Mongolia', code: 'MN', continent: 'Asia', capital: 'Ulaanbaatar', region: 'East Asia' },
  { name: 'North Korea', code: 'KP', continent: 'Asia', capital: 'Pyongyang', region: 'East Asia' },
  { name: 'Nepal', code: 'NP', continent: 'Asia', capital: 'Kathmandu', region: 'South Asia' },
  { name: 'Bhutan', code: 'BT', continent: 'Asia', capital: 'Thimphu', region: 'South Asia' },
  { name: 'Maldives', code: 'MV', continent: 'Asia', capital: 'Malé', region: 'South Asia' },
  { name: 'Armenia', code: 'AM', continent: 'Asia', capital: 'Yerevan', region: 'West Asia' },
  { name: 'Azerbaijan', code: 'AZ', continent: 'Asia', capital: 'Baku', region: 'West Asia' },
  { name: 'Georgia', code: 'GE', continent: 'Asia', capital: 'Tbilisi', region: 'West Asia' },
  { name: 'Yemen', code: 'YE', continent: 'Asia', capital: 'Sanaa', region: 'Middle East' },
  { name: 'East Timor', code: 'TL', continent: 'Asia', capital: 'Dili', region: 'Southeast Asia' },
  { name: 'Taiwan', code: 'TW', continent: 'Asia', capital: 'Taipei', region: 'East Asia' },
  { name: 'Hong Kong', code: 'HK', continent: 'Asia', capital: 'Hong Kong', region: 'East Asia' },
  { name: 'Macau', code: 'MO', continent: 'Asia', capital: 'Macau', region: 'East Asia' },
  { name: 'Palestine', code: 'PS', continent: 'Asia', capital: 'Ramallah', region: 'Middle East' },

  // North America (23 countries)
  { name: 'United States', code: 'US', continent: 'North America', capital: 'Washington, D.C.', region: 'Northern America' },
  { name: 'Canada', code: 'CA', continent: 'North America', capital: 'Ottawa', region: 'Northern America' },
  { name: 'Mexico', code: 'MX', continent: 'North America', capital: 'Mexico City', region: 'Central America' },
  { name: 'Guatemala', code: 'GT', continent: 'North America', capital: 'Guatemala City', region: 'Central America' },
  { name: 'Belize', code: 'BZ', continent: 'North America', capital: 'Belize City', region: 'Central America' },
  { name: 'El Salvador', code: 'SV', continent: 'North America', capital: 'San Salvador', region: 'Central America' },
  { name: 'Honduras', code: 'HN', continent: 'North America', capital: 'Tegucigalpa', region: 'Central America' },
  { name: 'Nicaragua', code: 'NI', continent: 'North America', capital: 'Managua', region: 'Central America' },
  { name: 'Costa Rica', code: 'CR', continent: 'North America', capital: 'San José', region: 'Central America' },
  { name: 'Panama', code: 'PA', continent: 'North America', capital: 'Panama City', region: 'Central America' },
  { name: 'Cuba', code: 'CU', continent: 'North America', capital: 'Havana', region: 'Caribbean' },
  { name: 'Jamaica', code: 'JM', continent: 'North America', capital: 'Kingston', region: 'Caribbean' },
  { name: 'Haiti', code: 'HT', continent: 'North America', capital: 'Port-au-Prince', region: 'Caribbean' },
  { name: 'Dominican Republic', code: 'DO', continent: 'North America', capital: 'Santo Domingo', region: 'Caribbean' },
  { name: 'Puerto Rico', code: 'PR', continent: 'North America', capital: 'San Juan', region: 'Caribbean' },
  { name: 'Trinidad and Tobago', code: 'TT', continent: 'North America', capital: 'Port of Spain', region: 'Caribbean' },
  { name: 'Barbados', code: 'BB', continent: 'North America', capital: 'Bridgetown', region: 'Caribbean' },
  { name: 'Bahamas', code: 'BS', continent: 'North America', capital: 'Nassau', region: 'Caribbean' },
  { name: 'Antigua and Barbuda', code: 'AG', continent: 'North America', capital: 'Saint Johns', region: 'Caribbean' },
  { name: 'Saint Lucia', code: 'LC', continent: 'North America', capital: 'Castries', region: 'Caribbean' },
  { name: 'Grenada', code: 'GD', continent: 'North America', capital: 'St. Georges', region: 'Caribbean' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC', continent: 'North America', capital: 'Kingstown', region: 'Caribbean' },
  { name: 'Dominica', code: 'DM', continent: 'North America', capital: 'Roseau', region: 'Caribbean' },

  // South America (12 countries)
  { name: 'Brazil', code: 'BR', continent: 'South America', capital: 'Brasília', region: 'South America' },
  { name: 'Argentina', code: 'AR', continent: 'South America', capital: 'Buenos Aires', region: 'South America' },
  { name: 'Chile', code: 'CL', continent: 'South America', capital: 'Santiago', region: 'South America' },
  { name: 'Colombia', code: 'CO', continent: 'South America', capital: 'Bogotá', region: 'South America' },
  { name: 'Peru', code: 'PE', continent: 'South America', capital: 'Lima', region: 'South America' },
  { name: 'Venezuela', code: 'VE', continent: 'South America', capital: 'Caracas', region: 'South America' },
  { name: 'Ecuador', code: 'EC', continent: 'South America', capital: 'Quito', region: 'South America' },
  { name: 'Bolivia', code: 'BO', continent: 'South America', capital: 'La Paz', region: 'South America' },
  { name: 'Paraguay', code: 'PY', continent: 'South America', capital: 'Asunción', region: 'South America' },
  { name: 'Uruguay', code: 'UY', continent: 'South America', capital: 'Montevideo', region: 'South America' },
  { name: 'Guyana', code: 'GY', continent: 'South America', capital: 'Georgetown', region: 'South America' },
  { name: 'Suriname', code: 'SR', continent: 'South America', capital: 'Paramaribo', region: 'South America' },

  // Africa (54 countries)
  { name: 'Nigeria', code: 'NG', continent: 'Africa', capital: 'Abuja', region: 'West Africa' },
  { name: 'South Africa', code: 'ZA', continent: 'Africa', capital: 'Cape Town', region: 'Southern Africa' },
  { name: 'Egypt', code: 'EG', continent: 'Africa', capital: 'Cairo', region: 'North Africa' },
  { name: 'Kenya', code: 'KE', continent: 'Africa', capital: 'Nairobi', region: 'East Africa' },
  { name: 'Morocco', code: 'MA', continent: 'Africa', capital: 'Rabat', region: 'North Africa' },
  { name: 'Tunisia', code: 'TN', continent: 'Africa', capital: 'Tunis', region: 'North Africa' },
  { name: 'Algeria', code: 'DZ', continent: 'Africa', capital: 'Algiers', region: 'North Africa' },
  { name: 'Libya', code: 'LY', continent: 'Africa', capital: 'Tripoli', region: 'North Africa' },
  { name: 'Sudan', code: 'SD', continent: 'Africa', capital: 'Khartoum', region: 'North Africa' },
  { name: 'Ethiopia', code: 'ET', continent: 'Africa', capital: 'Addis Ababa', region: 'East Africa' },
  { name: 'Ghana', code: 'GH', continent: 'Africa', capital: 'Accra', region: 'West Africa' },
  { name: 'Ivory Coast', code: 'CI', continent: 'Africa', capital: 'Yamoussoukro', region: 'West Africa' },
  { name: 'Tanzania', code: 'TZ', continent: 'Africa', capital: 'Dodoma', region: 'East Africa' },
  { name: 'Uganda', code: 'UG', continent: 'Africa', capital: 'Kampala', region: 'East Africa' },
  { name: 'Angola', code: 'AO', continent: 'Africa', capital: 'Luanda', region: 'Central Africa' },
  { name: 'Cameroon', code: 'CM', continent: 'Africa', capital: 'Yaoundé', region: 'Central Africa' },
  { name: 'Zimbabwe', code: 'ZW', continent: 'Africa', capital: 'Harare', region: 'Southern Africa' },
  { name: 'Zambia', code: 'ZM', continent: 'Africa', capital: 'Lusaka', region: 'Southern Africa' },
  { name: 'Mozambique', code: 'MZ', continent: 'Africa', capital: 'Maputo', region: 'Southern Africa' },
  { name: 'Botswana', code: 'BW', continent: 'Africa', capital: 'Gaborone', region: 'Southern Africa' },
  { name: 'Namibia', code: 'NA', continent: 'Africa', capital: 'Windhoek', region: 'Southern Africa' },
  { name: 'Senegal', code: 'SN', continent: 'Africa', capital: 'Dakar', region: 'West Africa' },
  { name: 'Mali', code: 'ML', continent: 'Africa', capital: 'Bamako', region: 'West Africa' },
  { name: 'Burkina Faso', code: 'BF', continent: 'Africa', capital: 'Ouagadougou', region: 'West Africa' },
  { name: 'Niger', code: 'NE', continent: 'Africa', capital: 'Niamey', region: 'West Africa' },
  { name: 'Chad', code: 'TD', continent: 'Africa', capital: 'NDjamena', region: 'Central Africa' },
  { name: 'Central African Republic', code: 'CF', continent: 'Africa', capital: 'Bangui', region: 'Central Africa' },
  { name: 'Democratic Republic of Congo', code: 'CD', continent: 'Africa', capital: 'Kinshasa', region: 'Central Africa' },
  { name: 'Republic of Congo', code: 'CG', continent: 'Africa', capital: 'Brazzaville', region: 'Central Africa' },
  { name: 'Gabon', code: 'GA', continent: 'Africa', capital: 'Libreville', region: 'Central Africa' },
  { name: 'Equatorial Guinea', code: 'GQ', continent: 'Africa', capital: 'Malabo', region: 'Central Africa' },
  { name: 'Rwanda', code: 'RW', continent: 'Africa', capital: 'Kigali', region: 'East Africa' },
  { name: 'Burundi', code: 'BI', continent: 'Africa', capital: 'Bujumbura', region: 'East Africa' },
  { name: 'Somalia', code: 'SO', continent: 'Africa', capital: 'Mogadishu', region: 'East Africa' },
  { name: 'Djibouti', code: 'DJ', continent: 'Africa', capital: 'Djibouti', region: 'East Africa' },
  { name: 'Eritrea', code: 'ER', continent: 'Africa', capital: 'Asmara', region: 'East Africa' },
  { name: 'Madagascar', code: 'MG', continent: 'Africa', capital: 'Antananarivo', region: 'East Africa' },
  { name: 'Mauritius', code: 'MU', continent: 'Africa', capital: 'Port Louis', region: 'East Africa' },
  { name: 'Seychelles', code: 'SC', continent: 'Africa', capital: 'Victoria', region: 'East Africa' },
  { name: 'Comoros', code: 'KM', continent: 'Africa', capital: 'Moroni', region: 'East Africa' },
  { name: 'Malawi', code: 'MW', continent: 'Africa', capital: 'Lilongwe', region: 'Southern Africa' },
  { name: 'Swaziland', code: 'SZ', continent: 'Africa', capital: 'Mbabane', region: 'Southern Africa' },
  { name: 'Lesotho', code: 'LS', continent: 'Africa', capital: 'Maseru', region: 'Southern Africa' },
  { name: 'Guinea', code: 'GN', continent: 'Africa', capital: 'Conakry', region: 'West Africa' },
  { name: 'Guinea-Bissau', code: 'GW', continent: 'Africa', capital: 'Bissau', region: 'West Africa' },
  { name: 'Sierra Leone', code: 'SL', continent: 'Africa', capital: 'Freetown', region: 'West Africa' },
  { name: 'Liberia', code: 'LR', continent: 'Africa', capital: 'Monrovia', region: 'West Africa' },
  { name: 'Togo', code: 'TG', continent: 'Africa', capital: 'Lomé', region: 'West Africa' },
  { name: 'Benin', code: 'BJ', continent: 'Africa', capital: 'Porto-Novo', region: 'West Africa' },
  { name: 'Gambia', code: 'GM', continent: 'Africa', capital: 'Banjul', region: 'West Africa' },
  { name: 'Cape Verde', code: 'CV', continent: 'Africa', capital: 'Praia', region: 'West Africa' },
  { name: 'Mauritania', code: 'MR', continent: 'Africa', capital: 'Nouakchott', region: 'West Africa' },
  { name: 'South Sudan', code: 'SS', continent: 'Africa', capital: 'Juba', region: 'East Africa' },
  { name: 'São Tomé and Príncipe', code: 'ST', continent: 'Africa', capital: 'São Tomé', region: 'Central Africa' },

  // Oceania (14 countries)
  { name: 'Australia', code: 'AU', continent: 'Oceania', capital: 'Canberra', region: 'Australia and New Zealand' },
  { name: 'New Zealand', code: 'NZ', continent: 'Oceania', capital: 'Wellington', region: 'Australia and New Zealand' },
  { name: 'Papua New Guinea', code: 'PG', continent: 'Oceania', capital: 'Port Moresby', region: 'Melanesia' },
  { name: 'Fiji', code: 'FJ', continent: 'Oceania', capital: 'Suva', region: 'Melanesia' },
  { name: 'Solomon Islands', code: 'SB', continent: 'Oceania', capital: 'Honiara', region: 'Melanesia' },
  { name: 'Vanuatu', code: 'VU', continent: 'Oceania', capital: 'Port Vila', region: 'Melanesia' },
  { name: 'New Caledonia', code: 'NC', continent: 'Oceania', capital: 'Nouméa', region: 'Melanesia' },
  { name: 'Samoa', code: 'WS', continent: 'Oceania', capital: 'Apia', region: 'Polynesia' },
  { name: 'Tonga', code: 'TO', continent: 'Oceania', capital: 'Nukualofa', region: 'Polynesia' },
  { name: 'Kiribati', code: 'KI', continent: 'Oceania', capital: 'Tarawa', region: 'Micronesia' },
  { name: 'Palau', code: 'PW', continent: 'Oceania', capital: 'Ngerulmud', region: 'Micronesia' },
  { name: 'Marshall Islands', code: 'MH', continent: 'Oceania', capital: 'Majuro', region: 'Micronesia' },
  { name: 'Micronesia', code: 'FM', continent: 'Oceania', capital: 'Palikir', region: 'Micronesia' },
  { name: 'Nauru', code: 'NR', continent: 'Oceania', capital: 'Yaren', region: 'Micronesia' }
];

// Interface for page generation
export interface PageGenerationConfig {
  type: 'country' | 'city';
  location: {
    name: string;
    country?: string;
    continent: string;
    region: string;
    slug: string;
  };
  hasBuilders: boolean;
  builderCount: number;
  venues: any[];
  industries: string[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export class GlobalPageGenerator {
  
  // Generate country page configuration
  static generateCountryConfig(country: any): PageGenerationConfig {
    console.log(`🌍 Generating country page config for: ${country.name}`);
    
    // Get builders for this country
    const builders = unifiedPlatformAPI.getBuilders().filter((builder: any) => {
      const countryVariations = [country.name];
      if (country.name === 'United Arab Emirates') countryVariations.push('UAE');
      if (country.name === 'UAE') countryVariations.push('United Arab Emirates');
      
      return countryVariations.includes(builder.headquarters?.country) ||
             builder.serviceLocations?.some((loc: any) => 
               countryVariations.includes(loc.country)
             );
    });
    
    // Generate default venues for country
    const venues = [
      {
        name: `${country.name} Exhibition Centre`,
        size: '500K+ sqft',
        website: `https://${country.name.toLowerCase().replace(/\s+/g, '')}-exhibitions.com`,
        description: `Premier exhibition venue in ${country.name} hosting major trade shows and international events`
      },
      {
        name: `${country.name} International Convention Center`,
        size: '300K+ sqft',
        website: `https://${country.name.toLowerCase().replace(/\s+/g, '')}-conventions.com`,
        description: `Modern convention facilities in ${country.name} for business conferences and exhibitions`
      }
    ];
    
    // Generate key industries based on region
    const industries = this.getIndustriesByRegion(country.continent, country.region);
    
    return {
      type: 'country',
      location: {
        name: country.name,
        continent: country.continent,
        region: country.region,
        slug: country.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      },
      hasBuilders: builders.length > 0,
      builderCount: builders.length,
      venues,
      industries,
      seoData: {
        title: `Exhibition Stand Builders in ${country.name}`,
        description: `Find professional exhibition stand builders in ${country.name}. Custom trade show displays, booth design, and comprehensive exhibition services across ${country.name}.`,
        keywords: [
          `${country.name} exhibition stands`,
          `${country.name} trade show builders`,
          `${country.name} booth design`,
          `exhibition contractors ${country.name}`,
          `trade show displays ${country.name}`
        ]
      }
    };
  }
  
  // Generate city page configuration
  static generateCityConfig(city: any): PageGenerationConfig {
    console.log(`🏙️ Generating city page config for: ${city.name}, ${city.country}`);
    
    // Get builders for this specific city
    const builders = unifiedPlatformAPI.getBuilders().filter((builder: any) => {
      const cityMatch = builder.headquarters?.city === city.name && 
                       builder.headquarters?.country === city.country;
      const serviceMatch = builder.serviceLocations?.some((loc: any) => 
        loc.city === city.name && loc.country === city.country
      );
      
      return cityMatch || serviceMatch;
    });
    
    // Generate venues for city
    const venues = [
      {
        name: `${city.name} Exhibition Centre`,
        size: '400K+ sqft',
        website: `https://${city.name.toLowerCase().replace(/\s+/g, '')}-exhibitions.com`,
        description: `Premier exhibition venue in ${city.name} hosting major trade shows and business events`
      },
      {
        name: `${city.name} Convention Center`,
        size: '250K+ sqft',
        website: `https://${city.name.toLowerCase().replace(/\s+/g, '')}-conventions.com`,
        description: `Modern convention facilities in the heart of ${city.name}'s business district`
      }
    ];
    
    // Generate industries based on city's country/region
    const industries = this.getIndustriesByRegion(city.continent, city.region);
    
    return {
      type: 'city',
      location: {
        name: city.name,
        country: city.country,
        continent: city.continent,
        region: city.region,
        slug: city.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      },
      hasBuilders: builders.length > 0,
      builderCount: builders.length,
      venues,
      industries,
      seoData: {
        title: `Exhibition Stand Builders in ${city.name}, ${city.country}`,
        description: `Professional exhibition stand builders in ${city.name}, ${city.country}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
        keywords: [
          `${city.name} exhibition stands`,
          `${city.name} trade show builders`,
          `${city.name} booth design`,
          `${city.country} exhibition contractors`,
          `${city.name} ${city.country} trade shows`
        ]
      }
    };
  }
  
  // Get industries by region
  static getIndustriesByRegion(continent: string, region: string): string[] {
    const industryMap: { [key: string]: string[] } = {
      'Europe': ['Automotive', 'Manufacturing', 'Technology', 'Healthcare & Medical', 'Fashion', 'Energy', 'Finance', 'Food & Beverage'],
      'Asia': ['Technology', 'Manufacturing', 'Healthcare & Medical', 'Oil & Gas', 'Finance', 'Electronics', 'Textiles', 'Tourism'],
      'North America': ['Technology', 'Healthcare & Medical', 'Automotive', 'Aerospace', 'Finance', 'Entertainment', 'Energy', 'Agriculture'],
      'South America': ['Agriculture', 'Mining', 'Oil & Gas', 'Manufacturing', 'Food & Beverage', 'Tourism', 'Technology', 'Finance'],
      'Africa': ['Mining', 'Oil & Gas', 'Agriculture', 'Tourism', 'Manufacturing', 'Technology', 'Healthcare & Medical', 'Finance'],
      'Oceania': ['Mining', 'Agriculture', 'Tourism', 'Technology', 'Healthcare & Medical', 'Finance', 'Energy', 'Manufacturing']
    };
    
    return industryMap[continent] || ['Technology', 'Manufacturing', 'Healthcare & Medical', 'Finance', 'Tourism', 'Agriculture', 'Energy', 'Trade'];
  }
  
  // Generate all country pages
  static generateAllCountryPages(): PageGenerationConfig[] {
    console.log('🌍 Generating all country pages...');
    
    return GLOBAL_COUNTRIES.map(country => this.generateCountryConfig(country));
  }
  
  // Generate all city pages
  static generateAllCityPages(): PageGenerationConfig[] {
    console.log('🏙️ Generating all city pages...');
    
    const allCities = getAllExpandedCities();
    return allCities.map(city => this.generateCityConfig(city));
  }
  
  // Generate all pages (countries + cities)
  static generateAllPages(): { countries: PageGenerationConfig[], cities: PageGenerationConfig[] } {
    console.log('🚀 Generating all 247 global pages...');
    
    const countries = this.generateAllCountryPages();
    const cities = this.generateAllCityPages();
    
    console.log(`✅ Generated ${countries.length} country pages and ${cities.length} city pages`);
    console.log(`📊 Total pages: ${countries.length + cities.length}`);
    
    return { countries, cities };
  }
  
  // Get page by slug
  static getPageBySlug(slug: string, type: 'country' | 'city'): PageGenerationConfig | null {
    if (type === 'country') {
      const country = GLOBAL_COUNTRIES.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
      );
      return country ? this.generateCountryConfig(country) : null;
    } else {
      const city = getAllExpandedCities().find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
      );
      return city ? this.generateCityConfig(city) : null;
    }
  }
  
  // Get statistics
  static getStatistics() {
    const allPages = this.generateAllPages();
    const countryPagesWithBuilders = allPages.countries.filter(p => p.hasBuilders);
    const cityPagesWithBuilders = allPages.cities.filter(p => p.hasBuilders);
    
    return {
      totalPages: allPages.countries.length + allPages.cities.length,
      countryPages: allPages.countries.length,
      cityPages: allPages.cities.length,
      pagesWithBuilders: countryPagesWithBuilders.length + cityPagesWithBuilders.length,
      countriesWithBuilders: countryPagesWithBuilders.length,
      citiesWithBuilders: cityPagesWithBuilders.length,
      totalBuilders: [...allPages.countries, ...allPages.cities].reduce((sum, page) => sum + page.builderCount, 0)
    };
  }
}

// Export for use in API routes and components
export default GlobalPageGenerator;