import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// GMB Fetch API Integration for Exhibition Stand Builders

// Interface for GMB API response
interface GMBBusinessProfile {
  placeId: string;
  name: string;
  address: {
    streetAddress?: string;
    locality: string; // city
    administrativeArea?: string; // state/province
    country: string;
    postalCode?: string;
  };
  phoneNumber?: string;
  websiteUri?: string;
  businessStatus?: string;
  primaryCategory?: string;
  categories?: string[];
  rating?: number;
  userRatingCount?: number;
  photos?: string[];
  openingHours?: {
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Fetch builders from GMB API
export const fetchBuildersFromGMB = mutation({
  args: {
    searchQuery: v.string(), // e.g., "exhibition stand builders in Berlin"
    location: v.object({
      city: v.string(),
      country: v.string(),
      countryCode: v.string(),
    }),
    maxResults: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log(`Fetching GMB data for: ${args.searchQuery} in ${args.location.city}, ${args.location.country}`);
    
    try {
      // In a real implementation, this would call the actual GMB API
      // For now, we'll simulate the API response
      const mockGMBResponse = await simulateGMBAPICall(args.searchQuery, args.location);
      
      const importedBuilders: Id<"builders">[] = [];
      
      for (const business of mockGMBResponse) {
        // Check if builder already exists by GMB Place ID
        const existingBuilder = await ctx.db
          .query("builders")
          .withIndex("gmbPlaceId", (q) => q.eq("gmbPlaceId", business.placeId))
          .first();
        
        if (existingBuilder) {
          console.log(`Builder already exists: ${business.name}`);
          continue;
        }
        
        // Create slug from business name
        const slug = business.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        // Check if slug already exists and make it unique
        let uniqueSlug = slug;
        let counter = 1;
        while (await ctx.db.query("builders").withIndex("slug", (q) => q.eq("slug", uniqueSlug)).first()) {
          uniqueSlug = `${slug}-${counter}`;
          counter++;
        }
        
        // Create new builder profile
        const builderId = await ctx.db.insert("builders", {
          companyName: business.name,
          slug: uniqueSlug,
          primaryEmail: `info@${uniqueSlug.replace(/-/g, '')}.com`, // Generate email if not available
          
          // Location information
          headquartersCity: business.address.locality,
          headquartersCountry: business.address.country,
          headquartersCountryCode: args.location.countryCode,
          headquartersAddress: [
            business.address.streetAddress,
            business.address.locality,
            business.address.administrativeArea,
            business.address.country,
            business.address.postalCode
          ].filter(Boolean).join(', '),
          headquartersLatitude: business.location?.latitude,
          headquartersLongitude: business.location?.longitude,
          
          // Contact information
          phone: business.phoneNumber,
          website: business.websiteUri,
          
          // Business details
          rating: business.rating,
          reviewCount: business.userRatingCount,
          
          // Status
          verified: false,
          claimed: false,
          claimStatus: "unclaimed",
          
          // GMB specific fields
          gmbImported: true,
          importedFromGMB: true,
          gmbPlaceId: business.placeId,
          source: "GMB_API",
          importedAt: Date.now(),
          lastUpdated: Date.now(),
          
          // Timestamps
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        
        // Add service location
        await ctx.db.insert("builderServiceLocations", {
          builderId,
          city: business.address.locality,
          country: business.address.country,
          countryCode: args.location.countryCode,
          address: business.address.streetAddress,
          latitude: business.location?.latitude,
          longitude: business.location?.longitude,
          isHeadquarters: true,
          createdAt: Date.now(),
        });
        
        // Add default services based on categories
        const services = mapGMBCategoriesToServices(business.categories || []);
        for (const service of services) {
          await ctx.db.insert("builderServices", {
            builderId,
            name: service.name,
            description: service.description,
            category: service.category,
            createdAt: Date.now(),
          });
        }
        
        importedBuilders.push(builderId);
        console.log(`Imported builder: ${business.name} (${uniqueSlug})`);
      }
      
      return {
        success: true,
        importedCount: importedBuilders.length,
        importedBuilders,
        message: `Successfully imported ${importedBuilders.length} builders from GMB API`
      };
      
    } catch (error) {
      console.error("GMB API fetch error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        importedCount: 0,
        importedBuilders: []
      };
    }
  },
});

// Get GMB import statistics
export const getGMBImportStats = query({
  args: {},
  handler: async (ctx) => {
    const totalBuilders = await ctx.db.query("builders").collect();
    const gmbImported = totalBuilders.filter(b => b.gmbImported);
    const claimed = gmbImported.filter(b => b.claimed);
    const unclaimed = gmbImported.filter(b => !b.claimed);
    
    return {
      totalBuilders: totalBuilders.length,
      gmbImported: gmbImported.length,
      claimed: claimed.length,
      unclaimed: unclaimed.length,
      claimRate: gmbImported.length > 0 ? (claimed.length / gmbImported.length) * 100 : 0,
    };
  },
});

// Simulate GMB API call (replace with actual API integration)
async function simulateGMBAPICall(
  searchQuery: string, 
  location: { city: string; country: string; countryCode: string }
): Promise<GMBBusinessProfile[]> {
  // This simulates what a real GMB API response would look like
  // In production, replace this with actual GMB API calls
  
  const mockBusinesses: GMBBusinessProfile[] = [
    {
      placeId: `gmb_${location.countryCode}_${location.city}_001`,
      name: `${location.city} Exhibition Stands Ltd`,
      address: {
        streetAddress: "123 Business Street",
        locality: location.city,
        country: location.country,
        postalCode: "12345",
      },
      phoneNumber: "+1234567890",
      websiteUri: `https://${location.city.toLowerCase()}-exhibition-stands.com`,
      businessStatus: "OPERATIONAL",
      primaryCategory: "Event Management Company",
      categories: ["Event Management Company", "Marketing Agency", "Display Stand Supplier"],
      rating: 4.5,
      userRatingCount: 23,
      location: {
        latitude: 52.5200,
        longitude: 13.4050,
      },
    },
    {
      placeId: `gmb_${location.countryCode}_${location.city}_002`,
      name: `Premium Booth Builders ${location.city}`,
      address: {
        streetAddress: "456 Trade Avenue",
        locality: location.city,
        country: location.country,
        postalCode: "12346",
      },
      phoneNumber: "+1234567891",
      websiteUri: `https://premium-booth-${location.city.toLowerCase()}.com`,
      businessStatus: "OPERATIONAL",
      primaryCategory: "Construction Company",
      categories: ["Construction Company", "Interior Designer", "Event Management Company"],
      rating: 4.8,
      userRatingCount: 45,
      location: {
        latitude: 52.5300,
        longitude: 13.4100,
      },
    },
    {
      placeId: `gmb_${location.countryCode}_${location.city}_003`,
      name: `${location.city} Trade Show Solutions`,
      address: {
        streetAddress: "789 Exhibition Road",
        locality: location.city,
        country: location.country,
        postalCode: "12347",
      },
      phoneNumber: "+1234567892",
      businessStatus: "OPERATIONAL",
      primaryCategory: "Marketing Agency",
      categories: ["Marketing Agency", "Event Management Company", "Graphic Designer"],
      rating: 4.2,
      userRatingCount: 18,
      location: {
        latitude: 52.5100,
        longitude: 13.3950,
      },
    },
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockBusinesses;
}

// Map GMB categories to our service categories
function mapGMBCategoriesToServices(categories: string[]) {
  const serviceMap: Record<string, { name: string; description: string; category: string }[]> = {
    "Event Management Company": [
      { name: "Custom Exhibition Stands", description: "Bespoke exhibition stand design and construction", category: "Design" },
      { name: "Event Planning", description: "Complete event planning and management services", category: "Additional" },
    ],
    "Construction Company": [
      { name: "Stand Construction", description: "Professional exhibition stand construction", category: "Construction" },
      { name: "Installation Services", description: "On-site installation and setup", category: "Construction" },
    ],
    "Marketing Agency": [
      { name: "Brand Design", description: "Brand identity and marketing material design", category: "Design" },
      { name: "Digital Marketing", description: "Digital marketing and promotion services", category: "Additional" },
    ],
    "Interior Designer": [
      { name: "Interior Design", description: "Professional interior design for exhibition spaces", category: "Design" },
      { name: "Space Planning", description: "Optimal space utilization and planning", category: "Design" },
    ],
    "Display Stand Supplier": [
      { name: "Modular Stands", description: "Modular exhibition stand systems", category: "Rental" },
      { name: "Display Equipment", description: "Display equipment and accessories", category: "Rental" },
    ],
    "Graphic Designer": [
      { name: "Graphic Design", description: "Professional graphic design services", category: "Design" },
      { name: "Print Services", description: "High-quality printing services", category: "Additional" },
    ],
  };
  
  const services: { name: string; description: string; category: string }[] = [];
  
  for (const category of categories) {
    if (serviceMap[category]) {
      services.push(...serviceMap[category]);
    }
  }
  
  // Add default services if none found
  if (services.length === 0) {
    services.push(
      { name: "Exhibition Stand Design", description: "Professional exhibition stand design", category: "Design" },
      { name: "Stand Construction", description: "Exhibition stand construction services", category: "Construction" }
    );
  }
  
  return services;
}

// Bulk import builders for multiple locations
export const bulkImportBuildersFromGMB = mutation({
  args: {
    locations: v.array(v.object({
      city: v.string(),
      country: v.string(),
      countryCode: v.string(),
    })),
    maxResultsPerLocation: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const location of args.locations) {
      const searchQuery = `exhibition stand builders in ${location.city}`;
      
      try {
        // Simulate the GMB API response directly here
        const mockGMBResponse = await simulateGMBAPICall(searchQuery, location);
        
        const importedBuilders: Id<"builders">[] = [];
        
        for (const business of mockGMBResponse) {
          // Check if builder already exists by GMB Place ID
          const existingBuilder = await ctx.db
            .query("builders")
            .withIndex("gmbPlaceId", (q) => q.eq("gmbPlaceId", business.placeId))
            .first();
          
          if (existingBuilder) {
            console.log(`Builder already exists: ${business.name}`);
            continue;
          }
          
          // Create slug from business name
          const slug = business.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          
          // Check if slug already exists and make it unique
          let uniqueSlug = slug;
          let counter = 1;
          while (await ctx.db.query("builders").withIndex("slug", (q) => q.eq("slug", uniqueSlug)).first()) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
          }
          
          // Create new builder profile
          const builderId = await ctx.db.insert("builders", {
            companyName: business.name,
            slug: uniqueSlug,
            primaryEmail: `info@${uniqueSlug.replace(/-/g, '')}.com`,
            
            // Location information
            headquartersCity: business.address.locality,
            headquartersCountry: business.address.country,
            headquartersCountryCode: location.countryCode,
            headquartersAddress: [
              business.address.streetAddress,
              business.address.locality,
              business.address.administrativeArea,
              business.address.country,
              business.address.postalCode
            ].filter(Boolean).join(', '),
            headquartersLatitude: business.location?.latitude,
            headquartersLongitude: business.location?.longitude,
            
            // Contact information
            phone: business.phoneNumber,
            website: business.websiteUri,
            
            // Business details
            rating: business.rating,
            reviewCount: business.userRatingCount,
            
            // Status
            verified: false,
            claimed: false,
            claimStatus: "unclaimed",
            
            // GMB specific fields
            gmbImported: true,
            importedFromGMB: true,
            gmbPlaceId: business.placeId,
            source: "GMB_API",
            importedAt: Date.now(),
            lastUpdated: Date.now(),
            
            // Timestamps
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          
          importedBuilders.push(builderId);
        }
        
        results.push({
          location,
          success: true,
          importedCount: importedBuilders.length,
          importedBuilders,
        });
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        results.push({
          location,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          importedCount: 0,
          importedBuilders: [],
        });
      }
    }
    
    const totalImported = results.reduce((sum, r) => sum + r.importedCount, 0);
    
    return {
      success: true,
      totalImported,
      locationResults: results,
      message: `Bulk import completed. Total builders imported: ${totalImported}`,
    };
  },
});

