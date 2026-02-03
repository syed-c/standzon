import GlobalLocationManager, { type LocationOption, type LocationSelection } from '@/lib/utils/globalLocationManager';
import { GLOBAL_EXHIBITION_DATA, type ExhibitionCity, type ExhibitionCountry } from '@/lib/data/globalCities';

export interface LocationAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface BuilderSearchParams {
  country?: string;
  city?: string;
  continent?: string;
  specialization?: string;
  minRating?: number;
  budgetRange?: string;
  limit?: number;
  offset?: number;
}

export interface LocationMetrics {
  buildersCount: number;
  eventsCount: number;
  venuesCount: number;
  averageRating: number;
  topSpecializations: string[];
  budgetRanges: Array<{ range: string; count: number; }>;
}

export class GlobalLocationAPI {
  
  // Get all continents
  static async getContinents(): Promise<LocationAPIResponse<LocationOption[]>> {
    try {
      const continents = GlobalLocationManager.getContinents();
      return {
        success: true,
        data: continents,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch continents',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get countries by continent
  static async getCountries(continent?: string): Promise<LocationAPIResponse<LocationOption[]>> {
    try {
      const countries = GlobalLocationManager.getCountriesByContinent(continent);
      return {
        success: true,
        data: countries,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch countries',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get cities by country
  static async getCities(country?: string): Promise<LocationAPIResponse<LocationOption[]>> {
    try {
      const cities = GlobalLocationManager.getCitiesByCountry(country);
      return {
        success: true,
        data: cities,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch cities',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Search locations
  static async searchLocations(query: string, limit: number = 10): Promise<LocationAPIResponse<LocationOption[]>> {
    try {
      if (!query || query.length < 2) {
        return {
          success: false,
          error: 'Search query must be at least 2 characters',
          timestamp: new Date().toISOString()
        };
      }

      const results = GlobalLocationManager.searchLocations(query, limit);
      return {
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Search failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get location details
  static async getLocationDetails(slug: string, type: 'country' | 'city'): Promise<LocationAPIResponse<ExhibitionCountry | ExhibitionCity>> {
    try {
      const location = GlobalLocationManager.getLocationDetails(slug, type);
      if (!location) {
        return {
          success: false,
          error: 'Location not found',
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: location,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch location details',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get top exhibition destinations
  static async getTopDestinations(limit: number = 20): Promise<LocationAPIResponse<LocationOption[]>> {
    try {
      const destinations = GlobalLocationManager.getTopExhibitionDestinations(limit);
      return {
        success: true,
        data: destinations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch top destinations',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get builders for location
  static async getBuildersForLocation(params: BuilderSearchParams): Promise<LocationAPIResponse<any[]>> {
    try {
      // This would integrate with your builder database
      // For now, returning mock data based on location
      
      const mockBuilders: any[] = [];
      let buildersCount = GlobalLocationManager.getBuildersCountByLocation(params.country, params.city);
      
      // Generate mock builder data based on actual location data
      const locationData = params.city ? 
        GlobalLocationManager.getLocationDetails(params.city, 'city') :
        params.country ? GlobalLocationManager.getLocationDetails(params.country, 'country') : null;
      
      if (locationData) {
        for (let i = 0; i < Math.min(buildersCount, params.limit || 10); i++) {
          mockBuilders.push({
            id: `builder-${params.country || 'global'}-${i + 1}`,
            name: `Professional Builder ${i + 1}`,
            rating: 4.0 + Math.random() * 1.0,
            reviewCount: Math.floor(Math.random() * 100) + 10,
            specializations: locationData.keyIndustries.slice(0, 3),
            verified: true,
            location: {
              country: params.country,
              city: params.city
            }
          });
        }
      }

      return {
        success: true,
        data: mockBuilders,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch builders',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get location metrics
  static async getLocationMetrics(country?: string, city?: string): Promise<LocationAPIResponse<LocationMetrics>> {
    try {
      const buildersCount = GlobalLocationManager.getBuildersCountByLocation(country, city);
      
      const locationData = city ? 
        GlobalLocationManager.getLocationDetails(city, 'city') as ExhibitionCity :
        country ? GlobalLocationManager.getLocationDetails(country, 'country') as ExhibitionCountry : null;

      if (!locationData) {
        return {
          success: false,
          error: 'Location not found',
          timestamp: new Date().toISOString()
        };
      }

      const metrics: LocationMetrics = {
        buildersCount,
        eventsCount: locationData.annualEvents,
        venuesCount: 'venues' in locationData ? locationData.venues.length : 0,
        averageRating: 4.3 + Math.random() * 0.5, // Mock data
        topSpecializations: locationData.keyIndustries.slice(0, 5),
        budgetRanges: [
          { range: 'Under $25K', count: Math.floor(buildersCount * 0.2) },
          { range: '$25K - $50K', count: Math.floor(buildersCount * 0.3) },
          { range: '$50K - $100K', count: Math.floor(buildersCount * 0.3) },
          { range: 'Over $100K', count: Math.floor(buildersCount * 0.2) }
        ]
      };

      return {
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch location metrics',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Validate location path for URL routing
  static async validateLocationPath(country?: string, city?: string): Promise<LocationAPIResponse<{
    isValid: boolean;
    countryData?: ExhibitionCountry;
    cityData?: ExhibitionCity;
    suggestions?: LocationOption[];
  }>> {
    try {
      const validation = GlobalLocationManager.validateLocationPath(country, city);
      return {
        success: true,
        data: validation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Validation failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get similar locations
  static async getSimilarLocations(slug: string, type: 'country' | 'city', limit: number = 5): Promise<LocationAPIResponse<LocationOption[]>> {
    try {
      const similar = GlobalLocationManager.getSimilarLocations(slug, type, limit);
      return {
        success: true,
        data: similar,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch similar locations',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generate SEO data for location
  static async getLocationSEO(country?: string, city?: string): Promise<LocationAPIResponse<{
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    alternateUrls: string[];
  }>> {
    try {
      const locationData = city ? 
        GlobalLocationManager.getLocationDetails(city, 'city') as ExhibitionCity :
        country ? GlobalLocationManager.getLocationDetails(country, 'country') as ExhibitionCountry : null;

      if (!locationData) {
        return {
          success: false,
          error: 'Location not found',
          timestamp: new Date().toISOString()
        };
      }

      const buildersCount = GlobalLocationManager.getBuildersCountByLocation(country, city);
      const locationName = city ? 
        `${locationData.name}, ${(locationData as ExhibitionCity).country}` : 
        locationData.name;

      const seoData = {
        title: `Exhibition Stand Builders in ${locationName} | ${buildersCount} Verified Companies`,
        description: `Find professional exhibition stand builders in ${locationName}. Compare quotes from ${buildersCount} verified companies. Expert displays for trade shows and exhibitions.`,
        keywords: [
          `${locationName} exhibition stands`,
          `${locationName} trade shows`,
          `exhibition builders ${locationName}`,
          `trade show displays ${locationName}`,
          ...locationData.keyIndustries.map(industry => `${industry} exhibitions ${locationName}`)
        ],
        canonicalUrl: GlobalLocationManager.generateLocationURL(country, city),
        alternateUrls: []
      };

      return {
        success: true,
        data: seoData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate SEO data',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Submit location feedback/suggestion
  static async submitLocationFeedback(feedback: {
    type: 'missing_location' | 'incorrect_data' | 'suggestion';
    location: string;
    message: string;
    email?: string;
  }): Promise<LocationAPIResponse<{ id: string }>> {
    try {
      // In a real implementation, this would save to database
      const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Location feedback submitted:', {
        id: feedbackId,
        ...feedback,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: { id: feedbackId },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to submit feedback',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get location statistics for admin dashboard
  static async getGlobalStatistics(): Promise<LocationAPIResponse<{
    totalCountries: number;
    totalCities: number;
    totalBuilders: number;
    totalEvents: number;
    topCountries: Array<{ name: string; events: number; rank: number; }>;
    topCities: Array<{ name: string; country: string; events: number; }>;
    continentDistribution: Array<{ continent: string; countries: number; cities: number; }>;
  }>> {
    try {
      const countries = GLOBAL_EXHIBITION_DATA.countries;
      const cities = GLOBAL_EXHIBITION_DATA.cities;
      
      const topCountries = countries
        .sort((a, b) => a.exhibitionRanking - b.exhibitionRanking)
        .slice(0, 10)
        .map(country => ({
          name: country.name,
          events: country.annualEvents,
          rank: country.exhibitionRanking
        }));

      const topCities = cities
        .sort((a, b) => b.annualEvents - a.annualEvents)
        .slice(0, 10)
        .map(city => ({
          name: city.name,
          country: city.country,
          events: city.annualEvents
        }));

      const continentDistribution = GLOBAL_EXHIBITION_DATA.continents.map(continent => ({
        continent,
        countries: countries.filter(c => c.continent === continent).length,
        cities: cities.filter(c => c.continent === continent).length
      }));

      const totalBuilders = countries.reduce((sum, c) => sum + (c.totalVenues * 2), 0);
      const totalEvents = countries.reduce((sum, c) => sum + c.annualEvents, 0);

      return {
        success: true,
        data: {
          totalCountries: countries.length,
          totalCities: cities.length,
          totalBuilders,
          totalEvents,
          topCountries,
          topCities,
          continentDistribution
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch global statistics',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get builders in a specific city
  static async getBuildersInCity(cityName: string, countryName: string): Promise<LocationAPIResponse<any[]>> {
    try {
      // This would integrate with your actual builder database
      // For now, returning mock data based on the location
      const mockBuilders: any[] = [];
      const buildersCount = GlobalLocationManager.getBuildersCountByLocation(countryName, cityName);
      
      for (let i = 0; i < Math.min(buildersCount, 10); i++) {
        mockBuilders.push({
          id: `builder-${countryName}-${cityName}-${i + 1}`,
          name: `Professional Builder ${i + 1}`,
          rating: 4.0 + Math.random() * 1.0,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          specializations: ['Custom Stands', 'Modular Displays', 'Trade Shows'],
          verified: true,
          location: {
            country: countryName,
            city: cityName
          }
        });
      }

      return {
        success: true,
        data: mockBuilders,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch builders in city',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default GlobalLocationAPI;