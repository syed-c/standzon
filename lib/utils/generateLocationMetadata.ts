// Generate comprehensive metadata for all location pages
import { comprehensiveLocationData } from '../data/comprehensiveLocationData';

export interface LocationMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

// Generate metadata for all countries and cities
export function generateAllLocationMetadata(): Record<string, LocationMetadata> {
  const metadata: Record<string, LocationMetadata> = {};

  // Add main exhibition stands page
  metadata['/exhibition-stands'] = {
    title: 'Exhibition Stands Worldwide | 21+ Countries & 104+ Cities | Global Directory',
    description: 'Comprehensive global directory of exhibition stand builders covering 21+ countries and 104+ major cities. Professional trade show services across Europe, Asia, Americas, Africa, and Oceania. Custom stands, modular systems, and full-service solutions.',
    keywords: 'exhibition stands worldwide, global trade show services, international exhibition builders, custom stands, exhibition stands by country, trade show contractors worldwide',
    ogImage: '/og-image-locations.png'
  };

  // Generate country pages metadata
  comprehensiveLocationData.forEach(country => {
    const countryPath = `/exhibition-stands/${country.countrySlug}`;
    const cityCount = country.cities.length;
    
    metadata[countryPath] = {
      title: `Exhibition Stand Builders ${country.countryName} | Trade Show Contractors`,
      description: `Leading exhibition stand builders in ${country.countryName}. Professional contractors serving ${cityCount} major cities including ${country.cities.slice(0, 3).map(c => c.cityName).join(', ')}${cityCount > 3 ? ' and more' : ''}. Custom stands, modular systems, and full-service exhibition solutions.`,
      keywords: `exhibition stands ${country.countryName}, ${country.countryName.toLowerCase()} trade show builders, ${country.countryName.toLowerCase()} exhibition contractors, trade show services ${country.countryName}`,
      ogImage: `/og-image-${country.countrySlug}.png`
    };

    // Generate city pages metadata
    country.cities.forEach(city => {
      const cityPath = `/exhibition-stands/${country.countrySlug}/${city.citySlug}`;
      
      metadata[cityPath] = {
        title: `${city.cityName} Exhibition Stand Builders | Trade Show Contractors`,
        description: `Expert exhibition stand builders in ${city.cityName}, ${country.countryName}. Professional contractors for all major ${city.cityName} trade shows, exhibitions, and conventions. Custom booth design, construction, and installation services.`,
        keywords: `${city.cityName} exhibition stands, ${city.cityName} trade show builders, ${city.cityName} contractors, ${city.cityName} exhibition services, ${country.countryName} trade shows`,
        ogImage: `/og-image-${city.citySlug}.png`
      };
    });
  });

  return metadata;
}

// Get specific location metadata
export function getLocationMetadata(countrySlug?: string, citySlug?: string): LocationMetadata | null {
  const allMetadata = generateAllLocationMetadata();
  
  if (citySlug && countrySlug) {
    return allMetadata[`/exhibition-stands/${countrySlug}/${citySlug}`] || null;
  } else if (countrySlug) {
    return allMetadata[`/exhibition-stands/${countrySlug}`] || null;
  } else {
    return allMetadata['/exhibition-stands'] || null;
  }
}

// Generate location-specific keywords
export function generateLocationKeywords(countryName: string, cityName?: string): string[] {
  const baseKeywords = [
    'exhibition stands',
    'trade show builders',
    'exhibition contractors',
    'booth builders',
    'custom stands',
    'modular displays',
    'trade show services',
    'exhibition design',
    'booth construction',
    'display contractors'
  ];

  const locationKeywords = cityName 
    ? [
        `${cityName} exhibition stands`,
        `${cityName} trade show builders`,
        `${cityName} booth builders`,
        `${cityName} exhibition contractors`,
        `${cityName} trade show services`,
        `exhibition stands ${cityName}`,
        `trade shows ${cityName}`,
        `${countryName} exhibition services`
      ]
    : [
        `${countryName} exhibition stands`,
        `${countryName} trade show builders`,
        `${countryName} booth builders`,
        `${countryName} exhibition contractors`,
        `${countryName} trade show services`,
        `exhibition stands ${countryName}`,
        `trade shows ${countryName}`
      ];

  return [...baseKeywords, ...locationKeywords];
}

// Major trade shows by country (for enhanced descriptions)
export const majorTradeShowsByCountry: Record<string, string[]> = {
  'united-states': ['CES Las Vegas', 'NAB Show', 'SEMA', 'IMTS Chicago', 'Pack Expo'],
  'germany': ['Hannover Messe', 'IFA Berlin', 'Drupa', 'K Fair', 'Bauma Munich'],
  'united-kingdom': ['London Tech Week', 'Farnborough Airshow', 'BETT London'],
  'france': ['Cannes Lions', 'Paris Air Show', 'Maison & Objet Paris'],
  'italy': ['Salone del Mobile Milan', 'Pitti Uomo Florence', 'Bologna Motor Show'],
  'spain': ['Mobile World Congress Barcelona', 'FITUR Madrid', 'Alimentaria Barcelona'],
  'united-arab-emirates': ['GITEX Dubai', 'Arab Health', 'Big 5 Dubai', 'ADIPEC Abu Dhabi'],
  'china': ['Canton Fair Guangzhou', 'China Import Expo Shanghai', 'Beijing Auto Show'],
  'australia': ['CeBIT Australia', 'Australian International Airshow', 'Good Food & Wine Show'],
  'canada': ['Toronto International Film Festival', 'Canadian International AutoShow'],
  'india': ['India International Trade Fair', 'Auto Expo Delhi', 'Bangalore Tech Summit'],
  'singapore': ['Singapore Airshow', 'Food & Hotel Asia', 'CommunicAsia'],
  'switzerland': ['Baselworld', 'SIHH Geneva', 'Art Basel'],
  'belgium': ['Brussels Motor Show', 'Antwerp Diamond Trade Fair'],
  'saudi-arabia': ['Saudi Build Riyadh', 'Future Investment Initiative'],
  'egypt': ['Cairo ICT', 'Egypt International Trade Fair'],
  'indonesia': ['Indonesia International Motor Show', 'Jakarta Fair'],
  'malaysia': ['Malaysia International Trade Fair', 'Kuala Lumpur Motor Show'],
  'turkey': ['Istanbul Autoshow', 'CNR Expo Istanbul'],
  'russia': ['Moscow International Auto Salon', 'St. Petersburg Economic Forum'],
  'iran': ['Tehran International Trade Fair']
};

// Get enhanced description with trade shows
export function getEnhancedLocationDescription(countryName: string, countrySlug: string, cityName?: string): string {
  const tradeShows = majorTradeShowsByCountry[countrySlug] || [];
  const tradeShowText = tradeShows.length > 0 
    ? ` Major events include ${tradeShows.slice(0, 3).join(', ')}.`
    : '';

  if (cityName) {
    return `Expert exhibition stand builders in ${cityName}, ${countryName}. Professional contractors for all major ${cityName} trade shows, exhibitions, and conventions.${tradeShowText} Custom booth design, construction, and installation services with local expertise.`;
  } else {
    return `Leading exhibition stand builders in ${countryName}. Professional contractors serving major cities with comprehensive trade show services.${tradeShowText} Custom stands, modular systems, and full-service exhibition solutions nationwide.`;
  }
}