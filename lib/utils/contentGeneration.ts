// Content generation utilities for automated page creation

import { Country, City } from '@/lib/data/countries';

export interface PageContent {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  content: string;
  seoKeywords: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface CountryPageContent extends PageContent {
  marketOverview: string;
  businessInsights: string;
  keyStats: {
    builderCount: number;
    cityCount: number;
    annualTradeShows: number;
    averageCostSaving: string;
  };
}

export interface CityPageContent extends PageContent {
  cityOverview: string;
  venueSpotlight: Array<{
    name: string;
    description: string;
    facilities: string[];
    nearbyBuilders: number;
  }>;
  logisticsInfo: string;
}

export class ContentGenerator {
  /**
   * Generate comprehensive country page content
   */
  static generateCountryContent(country: Country): CountryPageContent {
    console.log(`Generating content for ${country.name}`);
    
    const heroTitle = `Exhibition Stand Builders in ${country.name}`;
    const heroSubtitle = `Connect with ${country.builderCount}+ verified contractors across ${country.majorCities.length} major cities. Get competitive quotes for your trade show displays in ${country.name}.`;
    
    const marketOverview = `
      ${country.name} hosts one of the world's most dynamic exhibition markets, with an estimated annual value of €${(country.exhibitionMarketSize).toLocaleString()} million. 
      The country's strategic location and advanced infrastructure make it a premier destination for international trade shows and exhibitions.
      
      Major exhibition cities include ${country.majorCities.slice(0, 3).map(c => c.name).join(', ')}, each offering world-class venues and experienced local contractors.
      With over ${country.builderCount} verified exhibition stand builders across the country, businesses can find specialized expertise for every industry and budget.
    `;
    
    const businessInsights = `
      Exhibition planning in ${country.name} requires understanding local business customs and regulations. 
      ${country.businessCulture.join('. ')}. 
      Our verified builders understand these nuances and can guide international exhibitors through the entire process.
      
      Language support includes ${country.languages.join(', ')}, ensuring clear communication throughout your project.
      Payment is typically processed in ${country.currency}, with most builders offering flexible terms for international clients.
      
      The average stand construction costs range from €${Math.round(country.majorCities[0]?.averageStandCost * 0.8)} to €${Math.round(country.majorCities[0]?.averageStandCost * 1.2)} per square meter, 
      depending on design complexity and materials selected.
    `;
    
    const content = `
      ## Why Choose ${country.name} for Your Exhibition?
      
      ${country.name} attracts millions of international visitors annually to its trade shows and exhibitions. The country's robust infrastructure, 
      professional exhibition industry, and strategic location make it an ideal choice for businesses looking to expand their market reach.
      
      ### Key Advantages:
      - **Professional Infrastructure**: World-class exhibition venues with modern facilities
      - **Experienced Builders**: ${country.builderCount}+ verified contractors with international experience  
      - **Strategic Location**: Easy access for visitors from across ${country.continent}
      - **Cultural Diversity**: ${country.languages.join(', ')} language support available
      - **Strong Economy**: GDP of $${country.gdp} billion supporting business growth
      
      ### Major Exhibition Cities
      
      ${country.majorCities.map(city => `
      **${city.name}** (${city.builderCount} builders available)
      - Population: ${city.population.toLocaleString()}
      - Annual Trade Shows: ${city.upcomingShows}
      - Average Stand Cost: €${city.averageStandCost}/sqm
      - Major Venues: ${city.majorVenues.map(v => v.name).join(', ')}
      `).join('\n')}
      
      ### Getting Started
      
      Our platform connects you with pre-screened exhibition stand builders who understand local regulations, 
      customs procedures, and venue requirements. Simply submit your project details, and we'll match you with 
      up to 5 qualified contractors who can deliver your exhibition stand on time and within budget.
      
      All builders in our network are verified for:
      - Professional credentials and certifications
      - Insurance coverage and legal compliance
      - Quality of previous work and client satisfaction
      - Financial stability and project delivery capability
    `;
    
    return {
      title: `Exhibition Stand Builders ${country.name}`,
      description: `Find the best exhibition stand builders in ${country.name}. Compare quotes from ${country.builderCount}+ verified contractors across ${country.majorCities.length} cities.`,
      heroTitle,
      heroSubtitle,
      content,
      marketOverview,
      businessInsights,
      keyStats: {
        builderCount: country.builderCount,
        cityCount: country.majorCities.length,
        annualTradeShows: country.annualTradeShows,
        averageCostSaving: '23%'
      },
      seoKeywords: [
        `exhibition stand builders ${country.name.toLowerCase()}`,
        `trade show displays ${country.name.toLowerCase()}`,
        `booth contractors ${country.name.toLowerCase()}`,
        ...country.majorCities.map(city => `exhibition stands ${city.name.toLowerCase()}`),
        `${country.name.toLowerCase()} exhibition services`,
        `custom booth design ${country.name.toLowerCase()}`
      ],
      metaTitle: `Exhibition Stand Builders ${country.name} | ${country.builderCount}+ Verified Contractors`,
      metaDescription: `Find the best exhibition stand builders in ${country.name}. Compare quotes from ${country.builderCount}+ verified contractors across ${country.majorCities.length} cities. Free quotes, competitive pricing.`
    };
  }

  /**
   * Generate comprehensive city page content
   */
  static generateCityContent(city: City, country: Country): CityPageContent {
    console.log(`Generating content for ${city.name}, ${country.name}`);
    
    const heroTitle = `Exhibition Stand Builders in ${city.name}`;
    const heroSubtitle = `${city.builderCount} verified contractors ready to build your trade show display in ${city.name}. Compare quotes and find the perfect partner for your exhibition needs.`;
    
    const cityOverview = `
      ${city.name} stands as a major exhibition hub in ${country.name}, hosting numerous international trade shows throughout the year.
      The city's ${city.majorVenues.length} world-class exhibition venues attract exhibitors from around the globe, creating a competitive environment for stand builders.
      
      Our network includes ${city.builderCount} verified exhibition contractors in ${city.name}, ranging from boutique design studios to full-service international builders.
      Average stand construction costs range from €${Math.round(city.averageStandCost * 0.7)} to €${Math.round(city.averageStandCost * 1.3)} per square meter, 
      depending on design complexity, materials, and services required.
      
      The city's ${city.isCapital ? 'capital status and ' : ''}population of ${city.population.toLocaleString()} provides a strong business environment 
      with excellent infrastructure supporting the exhibition industry.
    `;
    
    const logisticsInfo = `
      ${city.transportation.airports.length > 0 ? `${city.name} is served by ${city.transportation.airports.join(' and ')}, providing excellent international connectivity.` : ''}
      ${city.transportation.publicTransport ? `The city's efficient public transport system includes ${city.transportation.publicTransport.join(', ')}.` : ''}
      
      ${city.transportation.accessibility}
      
      Most exhibition venues are easily accessible by public transport, with dedicated shuttle services during major trade shows.
      Freight and logistics services are well-developed, ensuring smooth delivery and installation of exhibition materials.
      
      ### Local Business Environment
      - **Time Zone**: ${country.name} Standard Time
      - **Currency**: ${country.currency}
      - **Languages**: ${country.languages.join(', ')}
      - **Business Culture**: Professional and punctual approach expected
    `;
    
    const content = `
      ## Exhibition Venues in ${city.name}
      
      ${city.majorVenues.map(venue => `
      ### ${venue.name}
      - **Total Space**: ${venue.totalSpace.toLocaleString()} sqm
      - **Halls**: ${venue.hallCount} exhibition halls
      - **Facilities**: ${venue.facilities.join(', ')}
      - **Nearby Builders**: ${venue.nearbyBuilderCount} verified contractors in vicinity
      `).join('\n')}
      
      ## Why Choose ${city.name} for Your Exhibition?
      
      ### Strategic Advantages
      - **Location**: ${city.isCapital ? 'Capital city with government and business centers' : 'Major business hub with excellent infrastructure'}
      - **Accessibility**: ${city.transportation.accessibility}
      - **Professional Network**: ${city.builderCount} experienced exhibition contractors
      - **Cost Efficiency**: Competitive rates starting from €${city.averageStandCost}/sqm
      
      ### Services Available
      Our verified builders in ${city.name} offer comprehensive exhibition services:
      - Custom stand design and 3D visualization
      - Project management and timeline coordination
      - Installation, dismantling, and storage services
      - Graphics production and audio-visual equipment
      - Compliance with local safety and building regulations
      
      ### Getting Quotes
      Submit your exhibition requirements and receive up to 5 competitive quotes from qualified builders in ${city.name}. 
      Our matching system considers your specific needs including:
      - Stand size and design requirements
      - Budget constraints and timeline
      - Industry expertise and venue experience
      - Additional services like storage and logistics
    `;
    
    return {
      title: `Exhibition Stand Builders ${city.name}`,
      description: `Top exhibition stand builders in ${city.name}, ${country.name}. Get quotes from ${city.builderCount} verified contractors.`,
      heroTitle,
      heroSubtitle,
      content,
      cityOverview,
      venueSpotlight: city.majorVenues.map(venue => ({
        name: venue.name,
        description: `${venue.name} spans ${venue.totalSpace.toLocaleString()} sqm across ${venue.hallCount} halls, making it one of ${city.name}'s premier exhibition destinations. The venue's modern infrastructure and strategic location make it ideal for international exhibitions.`,
        facilities: venue.facilities,
        nearbyBuilders: venue.nearbyBuilderCount
      })),
      logisticsInfo,
      seoKeywords: [
        `exhibition stand builders ${city.name.toLowerCase()}`,
        `${city.name.toLowerCase()} trade show displays`,
        `booth contractors ${city.name.toLowerCase()}`,
        ...city.majorVenues.map(venue => `exhibition stands ${venue.name.toLowerCase()}`),
        `${city.name.toLowerCase()} exhibition services`,
        `custom booth design ${city.name.toLowerCase()}`
      ],
      metaTitle: `Exhibition Stand Builders ${city.name} | ${city.builderCount} Local Contractors`,
      metaDescription: `Top exhibition stand builders in ${city.name}, ${country.name}. Get quotes from ${city.builderCount} verified contractors. Custom stands from €${city.averageStandCost}/sqm.`
    };
  }

  /**
   * Generate SEO-optimized URL slug
   */
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  /**
   * Format currency values for display
   */
  static formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Generate structured data for SEO
   */
  static generateStructuredData(content: PageContent, type: 'country' | 'city') {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": content.metaTitle,
      "description": content.metaDescription,
      "url": `https://exhibitbay.com/${type}/${ContentGenerator.generateSlug(content.title)}`,
      "mainEntity": {
        "@type": "Service",
        "name": "Exhibition Stand Building Services",
        "description": content.description,
        "provider": {
          "@type": "Organization",
          "name": "ExhibitBay",
          "url": "https://exhibitbay.com"
        }
      }
    };
  }
}

console.log('Content generation utilities loaded');