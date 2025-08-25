import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { comprehensiveLocationData, CountryData, CityData } from "../lib/data/comprehensiveLocationData";

// Cache configuration
const CACHE_TTL = {
  COUNTRIES: 30 * 60 * 1000, // 30 minutes
  CITIES: 15 * 60 * 1000,    // 15 minutes
  BUILDERS: 10 * 60 * 1000,  // 10 minutes
  STATS: 5 * 60 * 1000,      // 5 minutes
};

// Cache storage (in-memory for this implementation)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache helper functions
const getCacheKey = (prefix: string, ...args: string[]) => `${prefix}:${args.join(':')}`;

const getFromCache = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
};

const setCache = <T>(key: string, data: T, ttl: number): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Clear cache for specific patterns
const clearCachePattern = (pattern: string): void => {
  for (const key of cache.keys()) {
    if (key.startsWith(pattern)) {
      cache.delete(key);
    }
  }
};

// Initialize countries and cities from comprehensive location data
export const initializeComprehensiveLocations = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Initializing comprehensive countries and cities from location data...");
    
    try {
      const results = {
        countriesCreated: 0,
        citiesCreated: 0,
        countriesSkipped: 0,
        citiesSkipped: 0,
      };
      
      for (const countryData of comprehensiveLocationData) {
        // Check if country already exists
        const existingCountry = await ctx.db
          .query("countries")
          .withIndex("countryCode", (q) => q.eq("countryCode", countryData.countryCode))
          .first();
        
        let countryId: Id<"countries">;
        
        if (existingCountry) {
          countryId = existingCountry._id;
          results.countriesSkipped++;
          console.log(`Country already exists: ${countryData.countryName}`);
        } else {
          // Create new country
          countryId = await ctx.db.insert("countries", {
            countryName: countryData.countryName,
            countryCode: countryData.countryCode,
            countrySlug: countryData.countrySlug,
            continent: countryData.continent,
            currency: countryData.currency,
            timezone: countryData.timezone,
            language: countryData.language,
            active: true,
            builderCount: 0,
            exhibitionCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          
          results.countriesCreated++;
          console.log(`Created country: ${countryData.countryName}`);
        }
        
        // Process cities for this country
        for (const cityData of countryData.cities) {
          // Check if city already exists
          const existingCity = await ctx.db
            .query("cities")
            .withIndex("location", (q) => 
              q.eq("countryCode", countryData.countryCode).eq("citySlug", cityData.citySlug)
            )
            .first();
          
          if (existingCity) {
            results.citiesSkipped++;
            console.log(`City already exists: ${cityData.cityName}, ${countryData.countryName}`);
          } else {
            // Create new city
            await ctx.db.insert("cities", {
              cityName: cityData.cityName,
              citySlug: cityData.citySlug,
              countryId,
              countryName: countryData.countryName,
              countryCode: countryData.countryCode,
              state: cityData.state,
              timezone: cityData.timezone,
              latitude: cityData.latitude,
              longitude: cityData.longitude,
              population: cityData.population,
              active: true,
              builderCount: 0,
              exhibitionCount: 0,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
            
            results.citiesCreated++;
            console.log(`Created city: ${cityData.cityName}, ${countryData.countryName}`);
          }
        }
      }
      
      return {
        success: true,
        message: `Comprehensive location initialization completed. Countries: ${results.countriesCreated} created, ${results.countriesSkipped} skipped. Cities: ${results.citiesCreated} created, ${results.citiesSkipped} skipped.`,
        results,
      };
      
    } catch (error) {
      console.error("Comprehensive location initialization error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Get all countries with city counts (cached)
export const getAllCountries = query({
  args: {},
  handler: async (ctx) => {
    const cacheKey = getCacheKey('countries', 'all');
    
    // Try to get from cache first
    const cached = getFromCache<any[]>(cacheKey);
    if (cached) {
      console.log('Returning cached countries data');
      return cached;
    }
    
    console.log('Fetching fresh countries data');
    const countries = await ctx.db.query("countries").collect();
    
    // Get city counts for each country
    const countriesWithCounts = await Promise.all(
      countries.map(async (country) => {
        const cities = await ctx.db
          .query("cities")
          .withIndex("countryId", (q) => q.eq("countryId", country._id))
          .collect();
        
        const builders = await ctx.db
          .query("builders")
          .withIndex("country", (q) => q.eq("headquartersCountry", country.countryName))
          .collect();
        
        return {
          ...country,
          cityCount: cities.length,
          builderCount: builders.length,
          cities: cities.map(city => ({
            _id: city._id,
            cityName: city.cityName,
            citySlug: city.citySlug,
            builderCount: city.builderCount || 0,
          })),
        };
      })
    );
    
    const result = countriesWithCounts.sort((a, b) => a.countryName.localeCompare(b.countryName));
    
    // Cache the result
    setCache(cacheKey, result, CACHE_TTL.COUNTRIES);
    
    return result;
  },
});

// Get country by slug with cities and builders (cached)
export const getCountryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const cacheKey = getCacheKey('country', args.slug);
    
    // Try to get from cache first
    const cached = getFromCache<any>(cacheKey);
    if (cached) {
      console.log(`Returning cached country data for: ${args.slug}`);
      return cached;
    }
    
    console.log(`Fetching fresh country data for: ${args.slug}`);
    const country = await ctx.db
      .query("countries")
      .withIndex("countrySlug", (q) => q.eq("countrySlug", args.slug))
      .first();
    
    if (!country) {
      return null;
    }
    
    // Get cities in this country
    const cities = await ctx.db
      .query("cities")
      .withIndex("countryId", (q) => q.eq("countryId", country._id))
      .collect();
    
    // Get builders in this country
    const builders = await ctx.db
      .query("builders")
      .withIndex("country", (q) => q.eq("headquartersCountry", country.countryName))
      .collect();
    
    // Get trade shows in this country
    const tradeShows = await ctx.db
      .query("tradeShows")
      .withIndex("country", (q) => q.eq("country", country.countryName))
      .collect();
    
    const result = {
      ...country,
      cities: cities.sort((a, b) => a.cityName.localeCompare(b.cityName)),
      builders: builders.sort((a, b) => a.companyName.localeCompare(b.companyName)),
      tradeShows: tradeShows.sort((a, b) => a.name.localeCompare(b.name)),
      stats: {
        cityCount: cities.length,
        builderCount: builders.length,
        tradeShowCount: tradeShows.length,
      },
    };
    
    // Cache the result
    setCache(cacheKey, result, CACHE_TTL.CITIES);
    
    return result;
  },
});

// Get city by slug with builders
export const getCityBySlug = query({
  args: { 
    countrySlug: v.string(),
    citySlug: v.string() 
  },
  handler: async (ctx, args) => {
    console.log(`🏙️ Getting city data for: ${args.citySlug}, ${args.countrySlug}`);
    
    // First get the country
    const country = await ctx.db
      .query("countries")
      .withIndex("countrySlug", (q) => q.eq("countrySlug", args.countrySlug))
      .first();
    
    if (!country) {
      console.log(`❌ Country not found: ${args.countrySlug}`);
      return null;
    }
    
    // Get the city
    const city = await ctx.db
      .query("cities")
      .withIndex("location", (q) => 
        q.eq("countryCode", country.countryCode).eq("citySlug", args.citySlug)
      )
      .first();
    
    if (!city) {
      console.log(`❌ City not found: ${args.citySlug} in ${country.countryName}`);
      return null;
    }
    
    console.log(`✅ Found city: ${city.cityName}, ${country.countryName}`);
    
    // Get builders serving this city
    const builderServiceLocations = await ctx.db
      .query("builderServiceLocations")
      .withIndex("location", (q) => q.eq("country", country.countryName).eq("city", city.cityName))
      .collect();
    
    const builderIds = builderServiceLocations.map(bsl => bsl.builderId);
    const builders = await Promise.all(
      builderIds.map(id => ctx.db.get(id))
    );
    
    // Filter out null builders and sort
    const validBuilders = builders.filter(Boolean).sort((a, b) => 
      a!.companyName.localeCompare(b!.companyName)
    );
    
    // Get trade shows in this city
    const tradeShows = await ctx.db
      .query("tradeShows")
      .withIndex("city", (q) => q.eq("city", city.cityName))
      .collect();
    
    const result = {
      ...city,
      country: {
        _id: country._id,
        countryName: country.countryName,
        countryCode: country.countryCode,
        countrySlug: country.countrySlug,
        continent: country.continent,
        currency: country.currency,
        timezone: country.timezone,
        language: country.language
      },
      builders: validBuilders,
      tradeShows: tradeShows.sort((a, b) => a.name.localeCompare(b.name)),
      stats: {
        builderCount: validBuilders.length,
        tradeShowCount: tradeShows.length,
      },
    };
    
    console.log(`📊 City data prepared: ${result.cityName}, builders: ${result.builders.length}, trade shows: ${result.tradeShows.length}`);
    
    return result;
  },
});

// Get builders for a specific location
export const getBuildersForLocation = query({
  args: {
    country: v.optional(v.string()),
    city: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let builders: Doc<"builders">[] = [];
    
    if (args.city && args.country) {
      // Get builders serving this specific city
      const builderServiceLocations = await ctx.db
        .query("builderServiceLocations")
        .withIndex("location", (q) => q.eq("country", args.country!).eq("city", args.city!))
        .collect();
      
      const builderIds = builderServiceLocations.map(bsl => bsl.builderId);
      const builderPromises = builderIds.map(id => ctx.db.get(id));
      const builderResults = await Promise.all(builderPromises);
      builders = builderResults.filter(Boolean) as Doc<"builders">[];
      
    } else if (args.country) {
      // Get builders in this country
      builders = await ctx.db
        .query("builders")
        .withIndex("country", (q) => q.eq("headquartersCountry", args.country!))
        .collect();
    } else {
      // Get all builders
      builders = await ctx.db.query("builders").collect();
    }
    
    // Sort by rating and verification status
    builders.sort((a, b) => {
      if (a.verified !== b.verified) {
        return b.verified ? 1 : -1;
      }
      if (a.rating !== b.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.companyName.localeCompare(b.companyName);
    });
    
    // Apply limit if specified
    if (args.limit) {
      builders = builders.slice(0, args.limit);
    }
    
    return builders;
  },
});

// Update builder counts for countries and cities
export const updateLocationBuilderCounts = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Updating builder counts for countries and cities...");
    
    try {
      // Update country builder counts
      const countries = await ctx.db.query("countries").collect();
      
      for (const country of countries) {
        const builders = await ctx.db
          .query("builders")
          .withIndex("country", (q) => q.eq("headquartersCountry", country.countryName))
          .collect();
        
        await ctx.db.patch(country._id, {
          builderCount: builders.length,
          updatedAt: Date.now(),
        });
      }
      
      // Update city builder counts
      const cities = await ctx.db.query("cities").collect();
      
      for (const city of cities) {
        const builderServiceLocations = await ctx.db
          .query("builderServiceLocations")
          .withIndex("location", (q) => q.eq("country", city.countryName).eq("city", city.cityName))
          .collect();
        
        await ctx.db.patch(city._id, {
          builderCount: builderServiceLocations.length,
          updatedAt: Date.now(),
        });
      }
      
      return {
        success: true,
        message: "Builder counts updated successfully",
      };
      
    } catch (error) {
      console.error("Error updating builder counts:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Get location statistics
export const getLocationStats = query({
  args: {},
  handler: async (ctx) => {
    const countries = await ctx.db.query("countries").collect();
    const cities = await ctx.db.query("cities").collect();
    const builders = await ctx.db.query("builders").collect();
    const tradeShows = await ctx.db.query("tradeShows").collect();
    
    const activeCountries = countries.filter(c => c.active);
    const activeCities = cities.filter(c => c.active);
    const verifiedBuilders = builders.filter(b => b.verified);
    const claimedBuilders = builders.filter(b => b.claimed);
    
    return {
      totalCountries: countries.length,
      activeCountries: activeCountries.length,
      totalCities: cities.length,
      activeCities: activeCities.length,
      totalBuilders: builders.length,
      verifiedBuilders: verifiedBuilders.length,
      claimedBuilders: claimedBuilders.length,
      totalTradeShows: tradeShows.length,
      claimRate: builders.length > 0 ? (claimedBuilders.length / builders.length) * 100 : 0,
      verificationRate: builders.length > 0 ? (verifiedBuilders.length / builders.length) * 100 : 0,
    };
  },
});

// Search locations (countries and cities)
export const searchLocations = query({
  args: { 
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const searchTerm = args.searchTerm.toLowerCase();
    
    // Search countries
    const countries = await ctx.db.query("countries").collect();
    const matchingCountries = countries
      .filter(country => 
        country.countryName.toLowerCase().includes(searchTerm) ||
        country.countrySlug.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
    
    // Search cities
    const cities = await ctx.db.query("cities").collect();
    const matchingCities = cities
      .filter(city => 
        city.cityName.toLowerCase().includes(searchTerm) ||
        city.citySlug.toLowerCase().includes(searchTerm) ||
        city.countryName.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
    
    return {
      countries: matchingCountries,
      cities: matchingCities,
    };
  },
});

// Get all cities for static page generation
export const getAllCities = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db.query("cities").collect();
    
    // Get country data for each city
    const citiesWithCountry = await Promise.all(
      cities.map(async (city) => {
        const country = await ctx.db.get(city.countryId);
        return {
          ...city,
          country,
          countrySlug: country?.countrySlug || '',
          slug: city.citySlug
        };
      })
    );
    
    return citiesWithCountry.filter(city => city.country && city.active);
  },
});


