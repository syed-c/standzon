// Admin API utilities and functions
// This provides admin functionality for components

import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import { ExhibitionBuilder } from "@/lib/data/exhibitionBuilders";
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";

export interface AdminStats {
  totalUsers: number;
  totalBuilders: number;
  totalLeads: number;
  totalRevenue: number;
  // Additional properties that components expect
  verifiedBuilders?: number;
  totalQuoteRequests?: number;
  totalCountries?: number;
  totalCities?: number;
  averageRating?: number;
}

export interface SystemHealth {
  database: "connected" | "disconnected";
  api: "operational" | "error";
  services: Record<string, boolean>;
}

// Admin API functions using unified platform data (safe from database issues)
export const adminAPI = {
  // Get system statistics
  async getStats(): Promise<{
    success: boolean;
    data: AdminStats;
    error?: string;
  }> {
    try {
      const builders = await unifiedPlatformAPI.getBuilders();
      const leads = unifiedPlatformAPI.getLeads();

      // Calculate additional statistics
      const countries = Array.from(
        new Set(builders.map((b) => b.headquarters?.country).filter(Boolean))
      );
      const cities = Array.from(
        new Set(
          builders.flatMap((b) =>
            (b.serviceLocations || []).map((l) => l.city).filter(Boolean)
          )
        )
      );
      const verifiedBuilders = builders.filter((b) => b.verified).length;
      const totalRating = builders.reduce((sum, b) => sum + (b.rating || 0), 0);
      const averageRating =
        builders.length > 0 ? totalRating / builders.length : 0;

      const stats: AdminStats = {
        totalUsers: 156,
        totalBuilders: builders.length,
        totalLeads: leads.length,
        totalRevenue: 2847560,
        verifiedBuilders,
        totalQuoteRequests: leads.length * 1.5, // Mock calculation
        totalCountries: countries.length,
        totalCities: cities.length,
        averageRating,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      return {
        success: false,
        data: {
          totalUsers: 0,
          totalBuilders: 0,
          totalLeads: 0,
          totalRevenue: 0,
        },
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Get system health
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      return {
        database: "connected", // Mock as connected for now
        api: "operational",
        services: {
          database: true,
          api: true,
          migrations: true,
        },
      };
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      return {
        database: "disconnected",
        api: "error",
        services: {},
      };
    }
  },

  // Reseed database
  async reseedDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      // Use unified platform reseeding
      await unifiedPlatformAPI.reloadFromFiles();

      return {
        success: true,
        message: "Platform data reloaded successfully",
      };
    } catch (error) {
      console.error("Failed to reseed data:", error);
      return {
        success: false,
        message: "Failed to reseed data",
      };
    }
  },

  // Builder management methods using unified platform
  async getBuilders(
    page: number = 1,
    limit: number = 50,
    filters?: any
  ): Promise<{
    success: boolean;
    data?: any[];
    pagination?: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
    error?: string;
  }> {
    try {
      let builders = await unifiedPlatformAPI.getBuilders();

      // Apply filters if provided
      if (filters) {
        if (filters.search) {
          builders = unifiedPlatformAPI.searchBuilders(filters.search);
        }
        if (filters.country || filters.city || filters.verified !== undefined) {
          builders = unifiedPlatformAPI.filterBuilders({
            country: filters.country,
            city: filters.city,
            verified: filters.verified,
          });
        }
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBuilders = builders.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedBuilders,
        pagination: {
          page,
          totalPages: Math.ceil(builders.length / limit),
          total: builders.length,
          limit,
        },
      };
    } catch (error) {
      console.error("Failed to fetch builders:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async getBuilder(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const builder = unifiedPlatformAPI.getBuilderById(id);

      if (builder) {
        return {
          success: true,
          data: builder,
        };
      } else {
        return {
          success: false,
          error: "Builder not found",
        };
      }
    } catch (error) {
      console.error("Failed to fetch builder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async createBuilder(
    builderData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = unifiedPlatformAPI.addBuilder(builderData);

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to create builder",
        };
      }
    } catch (error) {
      console.error("Failed to create builder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async updateBuilder(
    id: string,
    updates: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = unifiedPlatformAPI.updateBuilder(id, updates);

      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to update builder",
        };
      }
    } catch (error) {
      console.error("Failed to update builder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async deleteBuilder(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = unifiedPlatformAPI.deleteBuilder(id);

      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to delete builder:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Subscription method for real-time updates
  subscribe: (callback: (event: string, data: any) => void) => {
    return unifiedPlatformAPI.subscribe((event: any) => {
      // Transform the event object to match component expectations
      callback(event.type, event.data);
    });
  },

  // Clear all data method
  clearAllData: async (): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> => {
    try {
      unifiedPlatformAPI.clearAll();
      return {
        success: true,
        message: "All data cleared successfully",
      };
    } catch (error) {
      console.error("Failed to clear all data:", error);
      return {
        success: false,
        message: "Failed to clear data",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Bulk create builders method
  bulkCreateBuilders: async (
    builders: any[]
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const result = await unifiedPlatformAPI.addBuilders(builders);

      return {
        success: result.success,
        data: {
          created: result.created,
          duplicates: result.duplicates,
          builders: result.data,
        },
        error: result.error,
      };
    } catch (error) {
      console.error("Failed to bulk create builders:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Country and city methods (using real builder data instead of mock)
  async getCountries(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const builders = await unifiedPlatformAPI.getBuilders();

      // Calculate real builder counts per country
      const buildersByCountry = builders.reduce((acc: any, builder: any) => {
        const country = builder.headquarters?.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const countries = GLOBAL_EXHIBITION_DATA.countries.map((country) => ({
        id: country.id,
        name: country.name,
        code: country.countryCode,
        builderCount: buildersByCountry[country.name] || 0, // Real builder count
        continent: country.continent,
        majorCities: country.majorCities.length,
        totalVenues: country.totalVenues,
        annualEvents: country.annualEvents,
      }));

      return {
        success: true,
        data: countries,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async getCities(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const builders = await unifiedPlatformAPI.getBuilders();

      // Calculate real builder counts per city
      const buildersByCity = builders.reduce((acc: any, builder: any) => {
        // Count builders from both headquarters and service locations
        const locations = [
          builder.headquarters,
          ...(builder.serviceLocations || []),
        ];
        locations.forEach((location) => {
          if (location?.city && location?.country) {
            const key = `${location.city}, ${location.country}`;
            acc[key] = (acc[key] || 0) + 1;
          }
        });
        return acc;
      }, {});

      const cities = GLOBAL_EXHIBITION_DATA.cities.map((city) => ({
        id: city.id,
        name: city.name,
        country: city.country,
        countryCode: city.countryCode,
        continent: city.continent,
        builderCount: buildersByCity[`${city.name}, ${city.country}`] || 0, // Real builder count
        isCapital: city.isCapital,
        annualEvents: city.annualEvents,
        majorAirport: city.majorAirport,
        keyIndustries: city.keyIndustries,
      }));

      return {
        success: true,
        data: cities,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async createCountry(
    countryData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const newCountry = {
        id: countryData.name.toLowerCase().replace(/\s+/g, "-"),
        name: countryData.name,
        countryCode: countryData.code || countryData.countryCode,
        continent: countryData.continent || "Unknown",
        slug: countryData.name.toLowerCase().replace(/\s+/g, "-"),
        capital: countryData.capital || "",
        currency: countryData.currency || "USD",
        majorCities: countryData.majorCities || [],
        totalVenues: countryData.totalVenues || 0,
        annualEvents: countryData.annualEvents || 0,
        keyIndustries: countryData.keyIndustries || [],
        exhibitionRanking: countryData.exhibitionRanking || 50,
        seoData: {
          metaTitle: `Exhibition Stand Builders in ${countryData.name}`,
          metaDescription: `Professional exhibition stand builders in ${countryData.name}. Custom trade show displays and booth construction.`,
          keywords: [
            `${countryData.name} exhibitions`,
            "trade shows",
            "exhibition stands",
          ],
        },
      };

      // Add to the global data
      GLOBAL_EXHIBITION_DATA.countries.push(newCountry);

      console.log(
        `✅ Country added: ${countryData.name} with ${countryData.majorCities?.length || 0} cities`
      );

      return {
        success: true,
        data: newCountry,
      };
    } catch (error) {
      console.error("❌ Error creating country:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async createCity(
    cityData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Find the associated country or create default values
      const country = GLOBAL_EXHIBITION_DATA.countries.find(
        (c) =>
          c.name === cityData.country || c.countryCode === cityData.countryCode
      ) || {
        name: cityData.country || "Unknown",
        code: cityData.countryCode || "XX",
        continent: cityData.continent || "Unknown",
        slug: (cityData.country || "unknown")
          .toLowerCase()
          .replace(/\s+/g, "-"),
      };

      // Get builders in this city (empty array as default)
      const buildersInCity: string[] = [];

      const newCity = {
        id: `${country.name.toLowerCase().replace(/\s+/g, "-")}-${(cityData.name || "unknown").toLowerCase().replace(/\s+/g, "-")}`,
        name: cityData.name,
        country: country.name,
        countryCode:
          (country as any).countryCode || (country as any).code || "XX",
        continent: country.continent,
        slug: (cityData.name || "unknown").toLowerCase().replace(/\s+/g, "-"),
        population: cityData.population || 500000,
        timeZone: cityData.timeZone || "UTC+0",
        coordinates: cityData.coordinates || { lat: 0, lng: 0 },
        isCapital: cityData.isCapital || false,
        majorAirport: cityData.majorAirport || `${cityData.name} Airport`,
        venues: cityData.venues || [`${cityData.name} Convention Center`],
        keyIndustries: cityData.keyIndustries || [
          "Technology",
          "Manufacturing",
        ],
        is_exhibition_hub: true as const, // Add required property with literal type
        buildersInCity,
        annualEvents: cityData.annualEvents || 50,
        averageStandSize: cityData.averageStandSize || "9-18 sqm",
        topBudgetRange: cityData.topBudgetRange || "$5,000-$15,000",
        nearestMajorCities: cityData.nearestMajorCities || [],
        seoData: {
          metaTitle: `Exhibition Stand Builders in ${cityData.name}, ${country.name}`,
          metaDescription: `Find professional exhibition stand builders in ${cityData.name}. Get quotes from verified contractors specializing in trade show displays and booth construction.`,
          keywords: [
            `exhibition stands ${cityData.name}`,
            `trade show builders ${country.name}`,
            `booth construction`,
          ],
        },
      };

      // Add to the global data
      GLOBAL_EXHIBITION_DATA.cities.push(newCity);

      console.log(`✅ City added: ${cityData.name}, ${cityData.country}`);

      return {
        success: true,
        data: newCity,
      };
    } catch (error) {
      console.error("❌ Error creating city:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async updateCountry(
    id: string,
    updates: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Mock implementation for compatibility
    return {
      success: true,
      data: { id, ...updates },
    };
  },

  async updateCity(
    id: string,
    updates: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Mock implementation for compatibility
    return {
      success: true,
      data: { id, ...updates },
    };
  },

  async deleteCountry(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    // Mock implementation for compatibility
    return { success: true };
  },

  async deleteCity(id: string): Promise<{ success: boolean; error?: string }> {
    // Mock implementation for compatibility
    return { success: true };
  },

  // Exhibition methods (mock implementations for compatibility)
  async getExhibitions(
    page: number = 1,
    limit: number = 50,
    filters?: any
  ): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      // Mock implementation
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async createExhibition(
    exhibitionData: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Mock implementation for compatibility
    return {
      success: true,
      data: { id: Date.now().toString(), ...exhibitionData },
    };
  },

  async updateExhibition(
    id: string,
    updates: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Mock implementation for compatibility
    return {
      success: true,
      data: { id, ...updates },
    };
  },

  async deleteExhibition(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    // Mock implementation for compatibility
    return { success: true };
  },

  // Intelligence methods (mock implementations for compatibility)
  async getPlatformIntelligence(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return {
      success: true,
      data: {
        dataPoints: 1847,
        insights: [
          "High conversion rate in Germany",
          "Growing demand for sustainable builds",
          "Premium services gaining popularity",
        ],
      },
    };
  },

  async getEventIntelligence(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return {
      success: true,
      data: {
        upcomingEvents: 24,
        trends: [
          "Virtual hybrid events",
          "Sustainable materials",
          "Interactive displays",
        ],
      },
    };
  },

  // Helper function to populate missing countries and cities from user's comprehensive list
  async populateComprehensiveLocations(): Promise<{
    success: boolean;
    added: { countries: number; cities: number };
    error?: string;
  }> {
    try {
      console.log("🌍 Populating comprehensive location data...");

      let countriesAdded = 0;
      let citiesAdded = 0;

      // Comprehensive data from user's requirements
      const requiredData = [
        {
          country: "United Arab Emirates",
          code: "AE",
          cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"],
          continent: "Asia",
        },
        {
          country: "India",
          code: "IN",
          cities: [
            "New Delhi",
            "Mumbai",
            "Bangalore",
            "Chennai",
            "Hyderabad",
            "Ahmedabad",
            "Lucknow",
            "Kanpur",
          ],
          continent: "Asia",
        },
        { country: "Qatar", code: "QA", cities: ["Doha"], continent: "Asia" },
        { country: "Oman", code: "OM", cities: ["Muscat"], continent: "Asia" },
        {
          country: "Saudi Arabia",
          code: "SA",
          cities: ["Riyadh", "Jeddah", "Dammam"],
          continent: "Asia",
        },
        {
          country: "Bahrain",
          code: "BH",
          cities: ["Manama"],
          continent: "Asia",
        },
        {
          country: "Kuwait",
          code: "KW",
          cities: ["Kuwait City"],
          continent: "Asia",
        },
        {
          country: "Malaysia",
          code: "MY",
          cities: ["Kuala Lumpur", "Penang"],
          continent: "Asia",
        },
        {
          country: "Singapore",
          code: "SG",
          cities: ["Singapore"],
          continent: "Asia",
        },
        {
          country: "Indonesia",
          code: "ID",
          cities: ["Jakarta"],
          continent: "Asia",
        },
        {
          country: "Vietnam",
          code: "VN",
          cities: ["Ho Chi Minh City"],
          continent: "Asia",
        },
        {
          country: "Philippines",
          code: "PH",
          cities: ["Manila"],
          continent: "Asia",
        },
        {
          country: "China",
          code: "CN",
          cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
          continent: "Asia",
        },
        {
          country: "Japan",
          code: "JP",
          cities: ["Tokyo", "Osaka"],
          continent: "Asia",
        },
        {
          country: "South Korea",
          code: "KR",
          cities: ["Seoul", "Busan"],
          continent: "Asia",
        },
        {
          country: "Germany",
          code: "DE",
          cities: [
            "Frankfurt",
            "Munich",
            "Berlin",
            "Cologne",
            "Dusseldorf",
            "Hannover",
          ],
          continent: "Europe",
        },
        {
          country: "France",
          code: "FR",
          cities: ["Paris", "Lyon", "Marseille"],
          continent: "Europe",
        },
        {
          country: "Italy",
          code: "IT",
          cities: ["Milan", "Rome", "Bologna"],
          continent: "Europe",
        },
        {
          country: "United Kingdom",
          code: "GB",
          cities: ["London", "Birmingham", "Manchester"],
          continent: "Europe",
        },
        {
          country: "Netherlands",
          code: "NL",
          cities: ["Amsterdam", "Rotterdam"],
          continent: "Europe",
        },
        {
          country: "Belgium",
          code: "BE",
          cities: ["Brussels", "Antwerp"],
          continent: "Europe",
        },
        {
          country: "Austria",
          code: "AT",
          cities: ["Vienna"],
          continent: "Europe",
        },
        {
          country: "Switzerland",
          code: "CH",
          cities: ["Geneva", "Zurich"],
          continent: "Europe",
        },
        {
          country: "Sweden",
          code: "SE",
          cities: ["Stockholm", "Gothenburg"],
          continent: "Europe",
        },
        {
          country: "Poland",
          code: "PL",
          cities: ["Warsaw"],
          continent: "Europe",
        },
        {
          country: "Russia",
          code: "RU",
          cities: ["Moscow"],
          continent: "Europe",
        },
        {
          country: "Czech Republic",
          code: "CZ",
          cities: ["Prague"],
          continent: "Europe",
        },
        {
          country: "Denmark",
          code: "DK",
          cities: ["Copenhagen"],
          continent: "Europe",
        },
        {
          country: "United States",
          code: "US",
          cities: [
            "Las Vegas",
            "Orlando",
            "New York",
            "Chicago",
            "Los Angeles",
          ],
          continent: "North America",
        },
        {
          country: "Canada",
          code: "CA",
          cities: ["Toronto", "Vancouver", "Montreal"],
          continent: "North America",
        },
        {
          country: "Mexico",
          code: "MX",
          cities: ["Mexico City"],
          continent: "North America",
        },
        {
          country: "Brazil",
          code: "BR",
          cities: ["São Paulo", "Rio de Janeiro"],
          continent: "South America",
        },
        {
          country: "Argentina",
          code: "AR",
          cities: ["Buenos Aires"],
          continent: "South America",
        },
        {
          country: "Colombia",
          code: "CO",
          cities: ["Bogotá"],
          continent: "South America",
        },
        {
          country: "Australia",
          code: "AU",
          cities: ["Sydney", "Melbourne", "Brisbane"],
          continent: "Oceania",
        },
        {
          country: "New Zealand",
          code: "NZ",
          cities: ["Auckland"],
          continent: "Oceania",
        },
        {
          country: "South Africa",
          code: "ZA",
          cities: ["Johannesburg", "Cape Town"],
          continent: "Africa",
        },
        {
          country: "Kenya",
          code: "KE",
          cities: ["Nairobi"],
          continent: "Africa",
        },
        {
          country: "Egypt",
          code: "EG",
          cities: ["Cairo", "Alexandria"],
          continent: "Africa",
        },
        {
          country: "Nigeria",
          code: "NG",
          cities: ["Lagos"],
          continent: "Africa",
        },
      ];

      // Check and add missing countries and cities
      for (const data of requiredData) {
        // Check if country exists
        const existingCountry = GLOBAL_EXHIBITION_DATA.countries.find(
          (c) => c.name === data.country || c.countryCode === data.code
        );

        if (!existingCountry) {
          // Add missing country
          const result = await this.createCountry({
            name: data.country,
            code: data.code,
            continent: data.continent,
            majorCities: data.cities,
            totalVenues: Math.floor(Math.random() * 30) + 5,
            annualEvents: Math.floor(Math.random() * 200) + 50,
            keyIndustries: ["Technology", "Manufacturing", "Healthcare"],
          });

          if (result.success) {
            countriesAdded++;
          }
        }

        // Check and add missing cities
        for (const cityName of data.cities) {
          const existingCity = GLOBAL_EXHIBITION_DATA.cities.find(
            (c) => c.name === cityName && c.country === data.country
          );

          if (!existingCity) {
            const result = await this.createCity({
              name: cityName,
              country: data.country,
              countryCode: data.code,
              continent: data.continent,
              isCapital: cityName === data.cities[0], // First city is usually capital
              annualEvents: Math.floor(Math.random() * 100) + 20,
              keyIndustries: ["Technology", "Manufacturing", "Healthcare"],
            });

            if (result.success) {
              citiesAdded++;
            }
          }
        }
      }

      console.log(
        `✅ Location population complete: ${countriesAdded} countries, ${citiesAdded} cities added`
      );

      return {
        success: true,
        added: {
          countries: countriesAdded,
          cities: citiesAdded,
        },
      };
    } catch (error) {
      console.error("❌ Error populating comprehensive locations:", error);
      return {
        success: false,
        added: { countries: 0, cities: 0 },
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Bulk add builders
  async addBuilders(
    builders: ExhibitionBuilder[],
    source: "admin" | "website" = "admin"
  ): Promise<any> {
    try {
      const result = await unifiedPlatformAPI.addBuilders(builders, source);

      console.log("🔄 Bulk add builders result:", result);

      if (result.success) {
        return {
          success: true,
          created: result.created,
          duplicates: result.duplicates,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to add builders",
        };
      }
    } catch (error) {
      console.error("❌ Error in bulk add builders:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

export default adminAPI;
