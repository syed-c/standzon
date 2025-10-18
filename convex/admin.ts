import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// One-time super admin creation mutation (remove after use)
export const createSuperAdmin = mutation({
  args: {
    email: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the creation token
    if (args.token !== process.env.ADMIN_CREATION_TOKEN) {
      throw new Error("Unauthorized: Invalid admin creation token");
    }

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User already exists with this email");
    }

    // Create the super admin user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      emailVerificationTime: Date.now(),
      isAnonymous: false,
      role: "admin",
      name: "Super Admin",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    console.log(`✅ Super admin created with ID: ${userId}`);
    return { userId, email: args.email, role: "admin" };
  },
});

// Helper query to check if any admin users exist
export const checkAdminExists = query({
  args: {},
  handler: async (ctx) => {
    const adminUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();
    
    return {
      adminCount: adminUsers.length,
      hasAdmin: adminUsers.length > 0,
      adminEmails: adminUsers.map(u => u.email)
    };
  },
});

// Helper query to get user by email (for debugging)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    
    return user ? {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt
    } : null;
  },
});

// Get all leads for admin dashboard
export const getAllLeads = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Admin: Fetching all leads...');
    
    try {
      const leads = await ctx.db
        .query("leads")
        .withIndex("createdAt")
        .order("desc")
        .collect();
      
      console.log(`📊 Found ${leads.length} leads for admin dashboard`);
      return leads;
    } catch (error) {
      console.error('❌ Error fetching leads for admin:', error);
      return [];
    }
  },
});

// Get all quote requests for admin dashboard
export const getAllQuoteRequests = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Admin: Fetching all quote requests...');
    
    try {
      const quotes = await ctx.db
        .query("quoteRequests")
        .withIndex("createdAt")
        .order("desc")
        .collect();
      
      console.log(`📊 Found ${quotes.length} quote requests for admin dashboard`);
      return quotes;
    } catch (error) {
      console.error('❌ Error fetching quote requests for admin:', error);
      return [];
    }
  },
});

// Bulk import trade shows
export const bulkImportTradeShows = mutation({
  args: {
    tradeShows: v.array(v.object({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      city: v.string(),
      country: v.string(),
      venue: v.optional(v.string()),
      startDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      website: v.optional(v.string()),
      industry: v.optional(v.string()),
      expectedAttendees: v.optional(v.number()),
      boothSizes: v.optional(v.array(v.string())),
      active: v.optional(v.boolean()),
      featured: v.optional(v.boolean()),
    }))
  },
  handler: async (ctx, args) => {
    console.log(`🎯 Admin: Bulk importing ${args.tradeShows.length} trade shows...`);
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const tradeShow of args.tradeShows) {
      try {
        // Check if trade show already exists
        const existing = await ctx.db
          .query("tradeShows")
          .withIndex("slug", (q) => q.eq("slug", tradeShow.slug))
          .first();
        
        if (existing) {
          console.log(`⚠️ Trade show already exists: ${tradeShow.name}`);
          results.push({ 
            name: tradeShow.name, 
            status: 'skipped', 
            reason: 'Already exists' 
          });
          continue;
        }
        
        const tradeShowId = await ctx.db.insert("tradeShows", {
          ...tradeShow,
          active: tradeShow.active ?? true,
          featured: tradeShow.featured ?? false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        
        console.log(`✅ Imported trade show: ${tradeShow.name} (${tradeShowId})`);
        results.push({ 
          name: tradeShow.name, 
          status: 'success', 
          id: tradeShowId 
        });
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error importing trade show ${tradeShow.name}:`, error);
        results.push({ 
          name: tradeShow.name, 
          status: 'error', 
          error: error instanceof Error ? error.message : String(error)
        });
        errorCount++;
      }
    }
    
    console.log(`🎯 Trade show import completed: ${successCount} success, ${errorCount} errors`);
    
    return {
      success: true,
      imported: successCount,
      errors: errorCount,
      results
    };
  },
});

// Get all trade shows for admin dashboard
export const getAllTradeShows = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Admin: Fetching all trade shows...');
    
    try {
      const tradeShows = await ctx.db
        .query("tradeShows")
        .order("desc")
        .collect();
      
      console.log(`📊 Found ${tradeShows.length} trade shows for admin dashboard`);
      return tradeShows;
    } catch (error) {
      console.error('❌ Error fetching trade shows for admin:', error);
      return [];
    }
  },
});

// Get all countries for admin dashboard
export const getAllCountries = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Admin: Fetching all countries...');
    
    try {
      const countries = await ctx.db
        .query("countries")
        .order("asc")
        .collect();
      
      console.log(`📊 Found ${countries.length} countries for admin dashboard`);
      return countries;
    } catch (error) {
      console.error('❌ Error fetching countries for admin:', error);
      return [];
    }
  },
});

// Get all cities for admin dashboard
export const getAllCities = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Admin: Fetching all cities...');
    
    try {
      const allCities = await ctx.db
        .query("cities")
        .order("asc")
        .collect();
      
      // Filter out Düsseldorf (with umlaut) but keep Dusseldorf (without umlaut)
      const cities = allCities.filter(city => city.cityName !== "Düsseldorf");
      
      console.log(`📊 Found ${cities.length} cities for admin dashboard`);
      return cities;
    } catch (error) {
      console.error('❌ Error fetching cities for admin:', error);
      return [];
    }
  },
});

// Get all page contents for admin dashboard
export const getAllPageContents = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Admin: Fetching all page contents...');
    
    try {
      // TODO: Re-implement after schema deployment
      // const pageContents = await ctx.db
      //   .query("pageContent")
      //   .order("desc")
      //   .collect();
      
      console.log(`📊 Found 0 page contents for admin dashboard (temporarily disabled)`);
      return [];
    } catch (error) {
      console.error('❌ Error fetching page contents for admin:', error);
      return [];
    }
  },
});

// Update page content
export const updatePageContent = mutation({
  args: {
    pageId: v.string(),
    updates: v.object({
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      heroTitle: v.optional(v.string()),
      heroSubtitle: v.optional(v.string()),
      heroDescription: v.optional(v.string()),
      introduction: v.optional(v.string()),
      whyChooseSection: v.optional(v.string()),
      industryOverview: v.optional(v.string()),
      venueInformation: v.optional(v.string()),
      builderAdvantages: v.optional(v.string()),
      conclusion: v.optional(v.string()),
    })
  },
  handler: async (ctx, args) => {
    console.log(`🎯 Admin: Updating page content for ${args.pageId}...`);
    
    try {
      // TODO: Re-implement after schema deployment
      // Find the page content by pageId
      // const pageContent = await ctx.db
      //   .query("pageContent")
      //   .withIndex("pageId", (q) => q.eq("pageId", args.pageId))
      //   .first();
      
      // if (!pageContent) {
      //   throw new Error(`Page content not found for pageId: ${args.pageId}`);
      // }
      
      // Update the page content
      // await ctx.db.patch(pageContent._id, {
      //   ...args.updates,
      //   updatedAt: Date.now(),
      // });
      
      console.log(`✅ Updated page content for ${args.pageId} (temporarily disabled)`);
      
      return {
        success: true,
        pageId: args.pageId,
        updated: Object.keys(args.updates).length
      };
      
    } catch (error) {
      console.error(`❌ Error updating page content for ${args.pageId}:`, error);
      throw error;
    }
  },
});

// Page Content Management
export const getPageContent = query({
  args: { 
    pageId: v.string(),
    pageType: v.union(v.literal("country"), v.literal("city"))
  },
  handler: async (ctx, args) => {
    console.log(`📄 Getting page content for: ${args.pageId} (${args.pageType})`);
    
    // TODO: Re-implement after schema deployment
    // Check if custom content exists
    // const customContent = await ctx.db
    //   .query("pageContent")
    //   .withIndex("pageId", (q) => q.eq("pageId", args.pageId))
    //   .first();
    
    // if (customContent) {
    //   console.log(`✅ Found custom content for: ${args.pageId}`);
    //   return customContent;
    // }
    
    // Generate default content based on location data
    if (args.pageType === "country") {
      const country = await ctx.db
        .query("countries")
        .withIndex("countrySlug", (q) => q.eq("countrySlug", args.pageId))
        .first();
      
      if (country) {
        return generateDefaultCountryContent(country);
      }
    } else if (args.pageType === "city") {
      // Parse city pageId (format: country-slug/city-slug)
      const [countrySlug, citySlug] = args.pageId.split('/');
      
      const country = await ctx.db
        .query("countries")
        .withIndex("countrySlug", (q) => q.eq("countrySlug", countrySlug))
        .first();
      
      if (country) {
        const city = await ctx.db
          .query("cities")
          .withIndex("location", (q) => 
            q.eq("countryCode", country.countryCode).eq("citySlug", citySlug)
          )
          .first();
        
        if (city) {
          return generateDefaultCityContent(city, country);
        }
      }
    }
    
    return null;
  },
});

export const savePageContent = mutation({
  args: {
    pageId: v.string(),
    pageType: v.union(v.literal("country"), v.literal("city")),
    content: v.object({
      seo: v.object({
        metaTitle: v.string(),
        metaDescription: v.string(),
        keywords: v.array(v.string()),
        canonicalUrl: v.string(),
      }),
      hero: v.object({
        title: v.string(),
        subtitle: v.string(),
        description: v.string(),
        backgroundImage: v.optional(v.string()),
        ctaText: v.string(),
      }),
      content: v.object({
        introduction: v.string(),
        whyChooseSection: v.string(),
        industryOverview: v.string(),
        venueInformation: v.string(),
        builderAdvantages: v.string(),
        conclusion: v.string(),
      }),
      design: v.object({
        primaryColor: v.string(),
        accentColor: v.string(),
        layout: v.union(v.literal("modern"), v.literal("classic"), v.literal("minimal")),
        showStats: v.boolean(),
        showMap: v.boolean(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    console.log(`💾 Saving page content for: ${args.pageId}`);
    
    // TODO: Re-implement after schema deployment
    // Check if content already exists
    // const existingContent = await ctx.db
    //   .query("pageContent")
    //   .withIndex("pageId", (q) => q.eq("pageId", args.pageId))
    //   .first();
    
    // const contentData = {
    //   pageId: args.pageId,
    //   pageType: args.pageType,
    //   ...args.content,
    //   updatedAt: Date.now(),
    // };
    
    // if (existingContent) {
    //   // Update existing content
    //   await ctx.db.patch(existingContent._id, contentData);
    //   console.log(`✅ Updated existing content for: ${args.pageId}`);
    // } else {
    //   // Create new content
    //   await ctx.db.insert("pageContent", {
    //     ...contentData,
    //     createdAt: Date.now(),
    //   });
    //   console.log(`✅ Created new content for: ${args.pageId}`);
    // }
    
    console.log(`✅ Saved content for: ${args.pageId} (temporarily disabled)`);
    return { success: true, pageId: args.pageId };
  },
});

export const getAllPageContent = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Re-implement after schema deployment
    // const pageContent = await ctx.db.query("pageContent").collect();
    // return pageContent.sort((a, b) => b.updatedAt - a.updatedAt);
    return [];
  },
});

export const getGlobalPagesStatistics = query({
  args: {},
  handler: async (ctx) => {
    const countries = await ctx.db.query("countries").collect();
    const allCities = await ctx.db.query("cities").collect();
    // Filter out Düsseldorf (with umlaut) but keep Dusseldorf (without umlaut)
    const cities = allCities.filter(city => city.cityName !== "Düsseldorf");
    const builders = await ctx.db.query("builders").collect();
    // TODO: Re-implement after schema deployment
    // const pageContent = await ctx.db.query("pageContent").collect();
    
    const activeCountries = countries.filter(c => c.active);
    const activeCities = cities.filter(c => c.active);
    
    // Calculate pages with builders
    const countriesWithBuilders = countries.filter(country => {
      const countryBuilders = builders.filter(b => b.headquartersCountry === country.countryName);
      return countryBuilders.length > 0;
    });
    
    const citiesWithBuilders = cities.filter(city => {
      const cityBuilders = builders.filter(b => 
        b.headquartersCountry === city.countryName && 
        b.headquartersCity === city.cityName
      );
      return cityBuilders.length > 0;
    });
    
    return {
      totalPages: activeCountries.length + activeCities.length,
      countryPages: activeCountries.length,
      cityPages: activeCities.length,
      pagesWithBuilders: countriesWithBuilders.length + citiesWithBuilders.length,
      countriesWithBuilders: countriesWithBuilders.length,
      citiesWithBuilders: citiesWithBuilders.length,
      totalBuilders: builders.length,
      customContentPages: 0, // pageContent.length,
    };
  },
});

export const generateAllGlobalPages = query({
  args: {},
  handler: async (ctx) => {
    console.log('🌍 Generating all global pages configuration...');
    
    const countries = await ctx.db.query("countries").collect();
    const allCities = await ctx.db.query("cities").collect();
    // Filter out Düsseldorf (with umlaut) but keep Dusseldorf (without umlaut)
    const cities = allCities.filter(city => city.cityName !== "Düsseldorf");
    const builders = await ctx.db.query("builders").collect();
    
    // Generate country page configs
    const countryPages = countries
      .filter(country => country.active)
      .map(country => {
        const countryBuilders = builders.filter(b => b.headquartersCountry === country.countryName);
        const countryCities = cities.filter(c => c.countryId === country._id);
        
        return {
          type: 'country' as const,
          location: {
            name: country.countryName,
            country: country.countryName,
            continent: country.continent,
            region: country.continent,
            slug: country.countrySlug,
          },
          hasBuilders: countryBuilders.length > 0,
          builderCount: countryBuilders.length,
          venues: [], // Could be populated from venue data
          industries: ['Technology', 'Manufacturing', 'Healthcare', 'Automotive'], // Default industries
          seoData: {
            title: `Exhibition Stand Builders in ${country.countryName} | Professional Trade Show Displays`,
            description: `Find professional exhibition stand builders in ${country.countryName}. Custom trade show displays, booth design, and comprehensive exhibition services from verified contractors.`,
            keywords: ['exhibition stands', country.countryName.toLowerCase(), 'builders', 'contractors', 'trade show displays'],
          },
        };
      });
    
    // Generate city page configs
    const cityPages = cities
      .filter(city => city.active)
      .map(city => {
        const cityBuilders = builders.filter(b => 
          b.headquartersCountry === city.countryName && 
          b.headquartersCity === city.cityName
        );
        
        return {
          type: 'city' as const,
          location: {
            name: city.cityName,
            country: city.countryName,
            continent: city.countryName, // This should be mapped properly
            region: city.state || city.countryName,
            slug: city.citySlug,
          },
          hasBuilders: cityBuilders.length > 0,
          builderCount: cityBuilders.length,
          venues: [], // Could be populated from venue data
          industries: ['Technology', 'Manufacturing', 'Healthcare', 'Automotive'], // Default industries
          seoData: {
            title: `Exhibition Stand Builders in ${city.cityName}, ${city.countryName} | Professional Trade Show Displays`,
            description: `Find professional exhibition stand builders in ${city.cityName}, ${city.countryName}. Custom trade show displays, booth design, and comprehensive exhibition services from verified contractors.`,
            keywords: ['exhibition stands', city.cityName.toLowerCase(), city.countryName.toLowerCase(), 'builders', 'contractors'],
          },
        };
      });
    
    console.log(`✅ Generated ${countryPages.length} country pages and ${cityPages.length} city pages`);
    
    return {
      countries: countryPages,
      cities: cityPages,
    };
  },
});

// Helper functions for generating default content
function generateDefaultCountryContent(country: any) {
  return {
    pageId: country.countrySlug,
    pageType: 'country' as const,
    seo: {
      metaTitle: `Exhibition Stand Builders in ${country.countryName} | Professional Trade Show Displays`,
      metaDescription: `Find professional exhibition stand builders in ${country.countryName}. Custom trade show displays, booth design, and comprehensive exhibition services from verified contractors.`,
      keywords: ['exhibition stands', country.countryName.toLowerCase(), 'builders', 'contractors', 'trade show displays'],
      canonicalUrl: `/exhibition-stands/${country.countrySlug}`,
    },
    hero: {
      title: `Exhibition Stand Builders in ${country.countryName}`,
      subtitle: 'Professional booth design and construction services',
      description: `Connect with verified exhibition stand builders in ${country.countryName}. Get custom trade show displays, professional booth design, and comprehensive exhibition services.`,
      ctaText: 'Get Free Quote',
      backgroundImage: '',
    },
    content: {
      introduction: `${country.countryName} stands as a premier exhibition destination, hosting dynamic trade shows and business events across diverse industries. The country's strategic location and robust infrastructure make it an ideal choice for international exhibitions.`,
      whyChooseSection: `${country.countryName} offers unique advantages for exhibition projects with its strategic location, skilled local builders, and world-class exhibition facilities. The country's business-friendly environment and excellent connectivity make it a preferred destination for international trade shows.`,
      industryOverview: `${country.countryName}'s exhibition industry serves diverse sectors including technology, manufacturing, healthcare, and automotive. The country hosts numerous international trade shows annually, contributing significantly to its position as a key business destination.`,
      venueInformation: `${country.countryName} offers modern exhibition facilities equipped with contemporary amenities and flexible spaces. Major exhibition centers provide state-of-the-art infrastructure, supporting events of all sizes from intimate trade shows to large-scale international exhibitions.`,
      builderAdvantages: `Choosing local ${country.countryName} exhibition stand builders provides strategic advantages including deep knowledge of venue requirements, local regulations, and cultural preferences. Local builders offer cost-effective solutions with faster turnaround times and ongoing support.`,
      conclusion: `${country.countryName} presents excellent opportunities for exhibition success with its growing business environment, skilled workforce, and commitment to innovation. Partner with local exhibition stand builders to maximize your trade show impact and achieve your business objectives.`,
    },
    design: {
      primaryColor: '#ec4899',
      accentColor: '#f97316',
      layout: 'modern' as const,
      showStats: true,
      showMap: false,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function generateDefaultCityContent(city: any, country: any) {
  return {
    pageId: `${country.countrySlug}/${city.citySlug}`,
    pageType: 'city' as const,
    seo: {
      metaTitle: `Exhibition Stand Builders in ${city.cityName}, ${country.countryName} | Professional Trade Show Displays`,
      metaDescription: `Find professional exhibition stand builders in ${city.cityName}, ${country.countryName}. Custom trade show displays, booth design, and comprehensive exhibition services from verified contractors.`,
      keywords: ['exhibition stands', city.cityName.toLowerCase(), country.countryName.toLowerCase(), 'builders', 'contractors'],
      canonicalUrl: `/exhibition-stands/${country.countrySlug}/${city.citySlug}`,
    },
    hero: {
      title: `Exhibition Stand Builders in ${city.cityName}, ${country.countryName}`,
      subtitle: 'Professional booth design and construction services',
      description: `Connect with verified exhibition stand builders in ${city.cityName}. Get custom trade show displays, professional booth design, and comprehensive exhibition services in this dynamic business hub.`,
      ctaText: 'Get Free Quote',
      backgroundImage: '',
    },
    content: {
      introduction: `${city.cityName} stands as a premier exhibition destination in ${country.countryName}, hosting dynamic trade shows and business events. The city's strategic location and modern infrastructure make it an ideal choice for international exhibitions.`,
      whyChooseSection: `${city.cityName} offers unique advantages for exhibition projects with its strategic location, skilled local builders, and world-class exhibition facilities. The city's business-friendly environment and excellent connectivity make it a preferred destination for trade shows.`,
      industryOverview: `${city.cityName}'s exhibition industry serves diverse sectors, contributing to its position as a key business destination in ${country.countryName}. The city hosts numerous trade shows annually, attracting international exhibitors and visitors.`,
      venueInformation: `${city.cityName} offers modern exhibition facilities equipped with contemporary amenities and flexible spaces. The city's exhibition centers provide state-of-the-art infrastructure, supporting events of all sizes.`,
      builderAdvantages: `Choosing local ${city.cityName} exhibition stand builders provides strategic advantages including knowledge of venue requirements, local regulations, and efficient logistics. Local builders offer personalized service with deep understanding of the local market.`,
      conclusion: `${city.cityName} presents excellent opportunities for exhibition success with its growing business environment and commitment to innovation. Partner with local exhibition stand builders to maximize your trade show impact in this vibrant city.`,
    },
    design: {
      primaryColor: '#ec4899',
      accentColor: '#f97316',
      layout: 'modern' as const,
      showStats: true,
      showMap: true,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}


