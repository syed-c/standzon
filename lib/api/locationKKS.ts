// Location KKS (Key Knowledge Store) API
// For superadmin-level functions and GMB API integration
// Comprehensive location hierarchy: Continent → Country → Cities

import { GlobalLocationManager, type ExhibitionHubLocation } from '@/lib/utils/globalLocationManager';
import { GLOBAL_EXHIBITION_DATA } from '@/lib/data/globalCities';

export interface LocationKKSQuery {
  continent?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  exhibitionHubsOnly?: boolean;
  limit?: number;
}

export interface GMBSearchLocation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  coordinates: { lat: number; lng: number };
  searchQueries: string[];
  priority: 'high' | 'medium' | 'low';
  annualEvents: number;
  keyIndustries: string[];
}

export class LocationKKS {
  
  // Get all exhibition regions for GMB API integration
  static getAllExhibitionRegions(): {
    continents: string[];
    countries: { name: string; code: string; continent: string; cities: string[] }[];
    exhibitionHubs: ExhibitionHubLocation[];
    totalStats: {
      continents: number;
      countries: number;
      cities: number;
      exhibitionHubs: number;
      totalEvents: number;
    };
  } {
    console.log('🌍 Loading complete Location KKS for GMB API...');
    
    const exhibitionHubs = GlobalLocationManager.getAllExhibitionHubs();
    
    const countries = GLOBAL_EXHIBITION_DATA.countries.map(country => ({
      name: country.name,
      code: country.countryCode,
      continent: country.continent,
      cities: country.majorCities
    }));

    const totalStats = {
      continents: GLOBAL_EXHIBITION_DATA.continents.length,
      countries: GLOBAL_EXHIBITION_DATA.countries.length,
      cities: GLOBAL_EXHIBITION_DATA.cities.length,
      exhibitionHubs: exhibitionHubs.length,
      totalEvents: GLOBAL_EXHIBITION_DATA.cities.reduce((sum, city) => sum + city.annualEvents, 0)
    };

    console.log('📊 Location KKS Stats:', totalStats);
    
    return {
      continents: GLOBAL_EXHIBITION_DATA.continents,
      countries,
      exhibitionHubs,
      totalStats
    };
  }

  // Get GMB search locations with priority ranking
  static getGMBSearchLocations(query: LocationKKSQuery = {}): GMBSearchLocation[] {
    console.log('🔍 Generating GMB search locations...', query);
    
    let locations = GlobalLocationManager.getAllExhibitionHubs();
    
    // Filter by continent
    if (query.continent) {
      locations = locations.filter(loc => 
        loc.continent.toLowerCase() === query.continent!.toLowerCase()
      );
    }
    
    // Filter by country
    if (query.country) {
      locations = locations.filter(loc => 
        loc.country.toLowerCase().includes(query.country!.toLowerCase()) ||
        loc.countryCode.toLowerCase() === query.country!.toLowerCase()
      );
    }
    
    // Filter by city
    if (query.city) {
      locations = locations.filter(loc => 
        loc.name.toLowerCase().includes(query.city!.toLowerCase())
      );
    }

    // Convert to GMB search locations with priority
    const gmbLocations: GMBSearchLocation[] = locations.map(location => {
      const priority = this.calculateLocationPriority(location);
      const searchQueries = GlobalLocationManager.generateGMBSearchQueries(location);
      
      return {
        id: location.id,
        name: location.name,
        country: location.country,
        countryCode: location.countryCode,
        continent: location.continent,
        coordinates: location.coordinates,
        searchQueries,
        priority,
        annualEvents: location.annualEvents,
        keyIndustries: location.keyIndustries
      };
    });

    // Sort by priority and annual events
    const sortedLocations = gmbLocations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.annualEvents - a.annualEvents;
    });

    const result = query.limit ? sortedLocations.slice(0, query.limit) : sortedLocations;
    console.log(`📍 Generated ${result.length} GMB search locations`);
    
    return result;
  }

  // Calculate priority for GMB searches
  private static calculateLocationPriority(location: ExhibitionHubLocation): 'high' | 'medium' | 'low' {
    if (location.annualEvents >= 300) return 'high';
    if (location.annualEvents >= 150) return 'medium';
    return 'low';
  }

  // Get European exhibition hubs (highest priority region)
  static getEuropeanExhibitionHubs(): GMBSearchLocation[] {
    console.log('🇪🇺 Getting European exhibition hubs...');
    return this.getGMBSearchLocations({ continent: 'Europe' });
  }

  // Get Asian exhibition hubs (second priority region)
  static getAsianExhibitionHubs(): GMBSearchLocation[] {
    console.log('🇨🇳 Getting Asian exhibition hubs...');
    return this.getGMBSearchLocations({ continent: 'Asia' });
  }

  // Get North American exhibition hubs (third priority region)
  static getNorthAmericanExhibitionHubs(): GMBSearchLocation[] {
    console.log('🇺🇸 Getting North American exhibition hubs...');
    return this.getGMBSearchLocations({ continent: 'North America' });
  }

  // Get top global exhibition destinations (for priority GMB searches)
  static getTopGlobalExhibitionDestinations(limit: number = 25): GMBSearchLocation[] {
    console.log(`🌟 Getting top ${limit} global exhibition destinations...`);
    
    const topLocations = this.getGMBSearchLocations({ limit });
    
    console.log('🎯 Top destinations by priority:', 
      topLocations.slice(0, 10).map(loc => `${loc.name}, ${loc.country} (${loc.annualEvents} events)`));
    
    return topLocations;
  }

  // Get exhibition hubs by industry focus (for targeted GMB searches)
  static getExhibitionHubsByIndustry(industry: string, limit: number = 20): GMBSearchLocation[] {
    console.log(`🏭 Getting exhibition hubs for ${industry} industry...`);
    
    const allLocations = this.getGMBSearchLocations();
    const industryLocations = allLocations.filter(location =>
      location.keyIndustries.some(ind => 
        ind.toLowerCase().includes(industry.toLowerCase())
      )
    );

    const result = industryLocations.slice(0, limit);
    console.log(`📊 Found ${result.length} exhibition hubs for ${industry}`);
    
    return result;
  }

  // Generate comprehensive GMB search plan
  static generateGMBSearchPlan(): {
    totalLocations: number;
    priorityLocations: GMBSearchLocation[];
    regionalBreakdown: {
      continent: string;
      locations: number;
      highPriority: number;
      totalEvents: number;
    }[];
    industryBreakdown: {
      industry: string;
      locations: number;
    }[];
    searchQueries: {
      location: string;
      queries: string[];
    }[];
  } {
    console.log('📋 Generating comprehensive GMB search plan...');
    
    const allLocations = this.getGMBSearchLocations();
    const priorityLocations = allLocations.filter(loc => loc.priority === 'high');
    
    // Regional breakdown
    const continents = [...new Set(allLocations.map(loc => loc.continent))];
    const regionalBreakdown = continents.map(continent => {
      const continentLocations = allLocations.filter(loc => loc.continent === continent);
      return {
        continent,
        locations: continentLocations.length,
        highPriority: continentLocations.filter(loc => loc.priority === 'high').length,
        totalEvents: continentLocations.reduce((sum, loc) => sum + loc.annualEvents, 0)
      };
    });

    // Industry breakdown
    const allIndustries = [...new Set(allLocations.flatMap(loc => loc.keyIndustries))];
    const industryBreakdown = allIndustries.map(industry => ({
      industry,
      locations: allLocations.filter(loc => 
        loc.keyIndustries.some(ind => ind === industry)
      ).length
    })).sort((a, b) => b.locations - a.locations);

    // Sample search queries for top 10 locations
    const searchQueries = priorityLocations.slice(0, 10).map(location => ({
      location: `${location.name}, ${location.country}`,
      queries: location.searchQueries.slice(0, 5)
    }));

    const plan = {
      totalLocations: allLocations.length,
      priorityLocations,
      regionalBreakdown,
      industryBreakdown,
      searchQueries
    };

    console.log('✅ GMB Search Plan generated:', {
      total: plan.totalLocations,
      priority: plan.priorityLocations.length,
      regions: plan.regionalBreakdown.length,
      industries: plan.industryBreakdown.length
    });

    return plan;
  }

  // Validate location exists in KKS
  static validateLocation(countryCode: string, cityName?: string): {
    isValid: boolean;
    location?: GMBSearchLocation;
    suggestions?: string[];
  } {
    const allLocations = this.getGMBSearchLocations();
    
    let location = allLocations.find(loc => loc.countryCode === countryCode);
    
    if (cityName) {
      location = allLocations.find(loc => 
        loc.countryCode === countryCode && 
        loc.name.toLowerCase() === cityName.toLowerCase()
      );
    }

    if (location) {
      return { isValid: true, location };
    }

    // Provide suggestions
    const suggestions = allLocations
      .filter(loc => loc.countryCode === countryCode)
      .map(loc => loc.name)
      .slice(0, 5);

    return { 
      isValid: false, 
      suggestions: suggestions.length > 0 ? suggestions : ['No locations found for this country'] 
    };
  }

  // Get location hierarchy for a specific path
  static getLocationHierarchy(countryCode?: string, cityName?: string): {
    continent?: string;
    country?: string;
    city?: string;
    exhibitionHub?: boolean;
    stats?: {
      annualEvents: number;
      keyIndustries: string[];
      coordinates: { lat: number; lng: number };
    };
  } {
    if (!countryCode) return {};

    const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.countryCode === countryCode);
    if (!country) return {};

    const result: any = {
      continent: country.continent,
      country: country.name
    };

    if (cityName) {
      const city = GLOBAL_EXHIBITION_DATA.cities.find(c => 
        c.countryCode === countryCode && 
        c.name.toLowerCase() === cityName.toLowerCase()
      );
      
      if (city) {
        result.city = city.name;
        result.exhibitionHub = city.is_exhibition_hub;
        result.stats = {
          annualEvents: city.annualEvents,
          keyIndustries: city.keyIndustries,
          coordinates: city.coordinates
        };
      }
    }

    return result;
  }
}

export default LocationKKS;