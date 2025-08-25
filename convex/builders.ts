import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Query to get all builders with pagination
export const getAllBuilders = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const offset = args.offset || 0;
    
    const builders = await ctx.db
      .query("builders")
      .order("desc")
      .collect();
    
    return {
      builders: builders.slice(offset, offset + limit),
      total: builders.length,
      hasMore: offset + limit < builders.length,
    };
  },
});

// Query to get builders by location
export const getBuildersByLocation = query({
  args: {
    country: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let builders = await ctx.db.query("builders").collect();
    
    if (args.country) {
      builders = builders.filter(b => 
        b.headquartersCountry?.toLowerCase() === args.country?.toLowerCase()
      );
    }
    
    if (args.city) {
      // Check both headquarters and service locations
      const serviceLocations = await ctx.db.query("builderServiceLocations").collect();
      const builderIdsInCity = serviceLocations
        .filter(loc => loc.city.toLowerCase() === args.city?.toLowerCase())
        .map(loc => loc.builderId);
      
      builders = builders.filter(b => 
        b.headquartersCity?.toLowerCase() === args.city?.toLowerCase() ||
        builderIdsInCity.includes(b._id)
      );
    }
    
    return builders;
  },
});

// Query to get a single builder by slug
export const getBuilderBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const builder = await ctx.db
      .query("builders")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (!builder) return null;
    
    // Get related data
    const serviceLocations = await ctx.db
      .query("builderServiceLocations")
      .withIndex("builderId", (q) => q.eq("builderId", builder._id))
      .collect();
    
    const services = await ctx.db
      .query("builderServices")
      .withIndex("builderId", (q) => q.eq("builderId", builder._id))
      .collect();
    
    const specializations = await ctx.db
      .query("builderSpecializations")
      .withIndex("builderId", (q) => q.eq("builderId", builder._id))
      .collect();
    
    const portfolio = await ctx.db
      .query("builderPortfolio")
      .withIndex("builderId", (q) => q.eq("builderId", builder._id))
      .collect();
    
    return {
      ...builder,
      serviceLocations,
      services,
      specializations,
      portfolio,
    };
  },
});

// Query to search builders
export const searchBuilders = query({
  args: { 
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchTerm = args.query.toLowerCase();
    
    const builders = await ctx.db.query("builders").collect();
    
    const filtered = builders.filter(builder =>
      builder.companyName.toLowerCase().includes(searchTerm) ||
      builder.companyDescription?.toLowerCase().includes(searchTerm) ||
      builder.headquartersCity?.toLowerCase().includes(searchTerm) ||
      builder.headquartersCountry?.toLowerCase().includes(searchTerm)
    );
    
    return filtered.slice(0, limit);
  },
});

// Query to get builder statistics
export const getBuilderStats = query({
  args: {},
  handler: async (ctx) => {
    const builders = await ctx.db.query("builders").collect();
    
    const totalBuilders = builders.length;
    const verifiedBuilders = builders.filter(b => b.verified).length;
    const gmbImported = builders.filter(b => b.gmbImported || b.importedFromGMB).length;
    
    const countries = Array.from(new Set(
      builders.map(b => b.headquartersCountry).filter(Boolean)
    ));
    
    const serviceLocations = await ctx.db.query("builderServiceLocations").collect();
    const cities = Array.from(new Set(serviceLocations.map(loc => loc.city)));
    
    const totalRating = builders.reduce((sum, b) => sum + (b.rating || 0), 0);
    const averageRating = totalBuilders > 0 ? totalRating / totalBuilders : 0;
    
    const totalProjects = builders.reduce((sum, b) => sum + (b.projectsCompleted || 0), 0);
    
    return {
      totalBuilders,
      verifiedBuilders,
      totalCountries: countries.length,
      totalCities: cities.length,
      averageRating,
      totalProjectsCompleted: totalProjects,
      importedFromGMB: gmbImported,
    };
  },
});

// Mutation to create a new builder
export const createBuilder = mutation({
  args: {
    companyName: v.string(),
    slug: v.string(),
    primaryEmail: v.string(),
    logo: v.optional(v.string()),
    establishedYear: v.optional(v.number()),
    headquartersCity: v.optional(v.string()),
    headquartersCountry: v.optional(v.string()),
    headquartersCountryCode: v.optional(v.string()),
    headquartersAddress: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
    position: v.optional(v.string()),
    companyDescription: v.optional(v.string()),
    teamSize: v.optional(v.number()),
    projectsCompleted: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    responseTime: v.optional(v.string()),
    languages: v.optional(v.array(v.string())),
    verified: v.optional(v.boolean()),
    premiumMember: v.optional(v.boolean()),
    businessLicense: v.optional(v.string()),
    currency: v.optional(v.string()),
    basicStandMin: v.optional(v.number()),
    basicStandMax: v.optional(v.number()),
    customStandMin: v.optional(v.number()),
    customStandMax: v.optional(v.number()),
    premiumStandMin: v.optional(v.number()),
    premiumStandMax: v.optional(v.number()),
    averageProject: v.optional(v.number()),
    gmbImported: v.optional(v.boolean()),
    importedFromGMB: v.optional(v.boolean()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const builderId = await ctx.db.insert("builders", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    
    return builderId;
  },
});

// ✅ NEW: GMB Builder Import Mutation - Direct to Convex
export const importGMBBuilder = mutation({
  args: {
    builderData: v.object({
      companyName: v.string(),
      primaryEmail: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      headquartersCity: v.optional(v.string()),
      headquartersCountry: v.optional(v.string()),
      headquartersCountryCode: v.optional(v.string()),
      headquartersAddress: v.optional(v.string()),
      headquartersLatitude: v.optional(v.number()),
      headquartersLongitude: v.optional(v.number()),
      contactPerson: v.optional(v.string()),
      position: v.optional(v.string()),
      companyDescription: v.optional(v.string()),
      rating: v.optional(v.number()),
      reviewCount: v.optional(v.number()),
      verified: v.optional(v.boolean()),
      claimed: v.optional(v.boolean()),
      claimStatus: v.optional(v.string()),
      gmbPlaceId: v.optional(v.string()),
      source: v.optional(v.string()),
      importedAt: v.optional(v.number()),
      lastUpdated: v.optional(v.number()),
    }),
    serviceLocations: v.optional(v.array(v.object({
      city: v.string(),
      country: v.string(),
      countryCode: v.optional(v.string()),
      address: v.optional(v.string()),
      latitude: v.optional(v.number()),
      longitude: v.optional(v.number()),
      isHeadquarters: v.optional(v.boolean()),
    }))),
    services: v.optional(v.array(v.object({
      name: v.string(),
      description: v.optional(v.string()),
      category: v.string(),
      priceFrom: v.optional(v.number()),
      currency: v.optional(v.string()),
      unit: v.optional(v.string()),
      popular: v.optional(v.boolean()),
      turnoverTime: v.optional(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const { builderData, serviceLocations = [], services = [] } = args;
    
    // Check for duplicates by GMB Place ID or company name + location
    if (builderData.gmbPlaceId) {
      const existingByGmbId = await ctx.db
        .query("builders")
        .withIndex("gmbPlaceId", (q) => q.eq("gmbPlaceId", builderData.gmbPlaceId))
        .first();
      
      if (existingByGmbId) {
        throw new Error(`Builder already exists with GMB Place ID: ${builderData.gmbPlaceId}`);
      }
    }
    
    // Check by company name + location combination
    const existingByNameLocation = await ctx.db
      .query("builders")
      .filter((q) => 
        q.and(
          q.eq(q.field("companyName"), builderData.companyName),
          q.eq(q.field("headquartersCity"), builderData.headquartersCity),
          q.eq(q.field("headquartersCountry"), builderData.headquartersCountry)
        )
      )
      .first();
    
    if (existingByNameLocation) {
      throw new Error(`Builder already exists: ${builderData.companyName} in ${builderData.headquartersCity}, ${builderData.headquartersCountry}`);
    }
    
    // Generate unique slug
    const baseSlug = builderData.companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    let slug = baseSlug;
    let counter = 1;
    while (await ctx.db.query("builders").withIndex("slug", (q) => q.eq("slug", slug)).first()) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    const now = Date.now();
    
    // Insert builder
    const builderId = await ctx.db.insert("builders", {
      companyName: builderData.companyName,
      slug,
      primaryEmail: builderData.primaryEmail || "",
      phone: builderData.phone,
      website: builderData.website,
      contactPerson: builderData.contactPerson || "Contact Person",
      position: builderData.position || "Manager",
      
      // Location information
      headquartersCity: builderData.headquartersCity,
      headquartersCountry: builderData.headquartersCountry,
      headquartersCountryCode: builderData.headquartersCountryCode,
      headquartersAddress: builderData.headquartersAddress,
      headquartersLatitude: builderData.headquartersLatitude,
      headquartersLongitude: builderData.headquartersLongitude,
      
      // Business details
      companyDescription: builderData.companyDescription,
      rating: builderData.rating,
      reviewCount: builderData.reviewCount,
      responseTime: "New to platform",
      languages: ["English"],
      
      // Status and verification
      verified: builderData.verified || false,
      premiumMember: false,
      claimed: builderData.claimed || false,
      claimStatus: builderData.claimStatus || "unclaimed",
      
      // GMB specific fields
      gmbImported: true,
      importedFromGMB: true,
      gmbPlaceId: builderData.gmbPlaceId,
      source: builderData.source || "GMB_API",
      importedAt: builderData.importedAt || now,
      lastUpdated: builderData.lastUpdated || now,
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
    });
    
    // Add service locations
    for (const location of serviceLocations) {
      await ctx.db.insert("builderServiceLocations", {
        builderId,
        city: location.city,
        country: location.country,
        countryCode: location.countryCode,
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        isHeadquarters: location.isHeadquarters || false,
        createdAt: now,
      });
    }
    
    // Add services
    for (const service of services) {
      await ctx.db.insert("builderServices", {
        builderId,
        name: service.name,
        description: service.description,
        category: service.category,
        priceFrom: service.priceFrom,
        currency: service.currency,
        unit: service.unit,
        popular: service.popular || false,
        turnoverTime: service.turnoverTime,
        createdAt: now,
      });
    }
    
    console.log(`✅ GMB Builder imported to Convex: ${builderData.companyName}`);
    return builderId;
  },
});

// ✅ NEW: Bulk GMB Import Mutation
export const bulkImportGMBBuilders = mutation({
  args: {
    builders: v.array(v.object({
      builderData: v.object({
        companyName: v.string(),
        primaryEmail: v.optional(v.string()),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        headquartersCity: v.optional(v.string()),
        headquartersCountry: v.optional(v.string()),
        headquartersCountryCode: v.optional(v.string()),
        headquartersAddress: v.optional(v.string()),
        headquartersLatitude: v.optional(v.number()),
        headquartersLongitude: v.optional(v.number()),
        contactPerson: v.optional(v.string()),
        position: v.optional(v.string()),
        companyDescription: v.optional(v.string()),
        rating: v.optional(v.number()),
        reviewCount: v.optional(v.number()),
        verified: v.optional(v.boolean()),
        claimed: v.optional(v.boolean()),
        claimStatus: v.optional(v.string()),
        gmbPlaceId: v.optional(v.string()),
        source: v.optional(v.string()),
        importedAt: v.optional(v.number()),
        lastUpdated: v.optional(v.number()),
      }),
      serviceLocations: v.optional(v.array(v.object({
        city: v.string(),
        country: v.string(),
        countryCode: v.optional(v.string()),
        address: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        isHeadquarters: v.optional(v.boolean()),
      }))),
      services: v.optional(v.array(v.object({
        name: v.string(),
        description: v.optional(v.string()),
        category: v.string(),
        priceFrom: v.optional(v.number()),
        currency: v.optional(v.string()),
        unit: v.optional(v.string()),
        popular: v.optional(v.boolean()),
        turnoverTime: v.optional(v.string()),
      }))),
    })),
  },
  handler: async (ctx, args) => {
    const results = {
      created: 0,
      failed: 0,
      duplicates: 0,
      errors: [] as string[],
    };
    
    for (const builderImport of args.builders) {
      try {
        await ctx.runMutation(api.builders.importGMBBuilder, builderImport);
        results.created++;
      } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
          results.duplicates++;
        } else {
          results.failed++;
          results.errors.push(error instanceof Error ? error.message : "Unknown error");
        }
      }
    }
    
    console.log(`✅ Bulk GMB import completed: ${results.created} created, ${results.duplicates} duplicates, ${results.failed} failed`);
    return results;
  },
});

// Mutation to update a builder
export const updateBuilder = mutation({
  args: {
    id: v.id("builders"),
    companyName: v.optional(v.string()),
    primaryEmail: v.optional(v.string()),
    logo: v.optional(v.string()),
    establishedYear: v.optional(v.number()),
    headquartersCity: v.optional(v.string()),
    headquartersCountry: v.optional(v.string()),
    headquartersCountryCode: v.optional(v.string()),
    headquartersAddress: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
    position: v.optional(v.string()),
    companyDescription: v.optional(v.string()),
    teamSize: v.optional(v.number()),
    projectsCompleted: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    responseTime: v.optional(v.string()),
    languages: v.optional(v.array(v.string())),
    verified: v.optional(v.boolean()),
    premiumMember: v.optional(v.boolean()),
    businessLicense: v.optional(v.string()),
    currency: v.optional(v.string()),
    basicStandMin: v.optional(v.number()),
    basicStandMax: v.optional(v.number()),
    customStandMin: v.optional(v.number()),
    customStandMax: v.optional(v.number()),
    premiumStandMin: v.optional(v.number()),
    premiumStandMax: v.optional(v.number()),
    averageProject: v.optional(v.number()),
    claimed: v.optional(v.boolean()),
    claimStatus: v.optional(v.string()),
    claimedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

// Mutation to delete a builder
export const deleteBuilder = mutation({
  args: { id: v.id("builders") },
  handler: async (ctx, args) => {
    // Delete related data first
    const serviceLocations = await ctx.db
      .query("builderServiceLocations")
      .withIndex("builderId", (q) => q.eq("builderId", args.id))
      .collect();
    
    for (const location of serviceLocations) {
      await ctx.db.delete(location._id);
    }
    
    const services = await ctx.db
      .query("builderServices")
      .withIndex("builderId", (q) => q.eq("builderId", args.id))
      .collect();
    
    for (const service of services) {
      await ctx.db.delete(service._id);
    }
    
    const specializations = await ctx.db
      .query("builderSpecializations")
      .withIndex("builderId", (q) => q.eq("builderId", args.id))
      .collect();
    
    for (const spec of specializations) {
      await ctx.db.delete(spec._id);
    }
    
    const portfolio = await ctx.db
      .query("builderPortfolio")
      .withIndex("builderId", (q) => q.eq("builderId", args.id))
      .collect();
    
    for (const item of portfolio) {
      await ctx.db.delete(item._id);
    }
    
    // Finally delete the builder
    await ctx.db.delete(args.id);
    
    return { success: true };
  },
});

// Mutation to add service location to builder
export const addServiceLocation = mutation({
  args: {
    builderId: v.id("builders"),
    city: v.string(),
    country: v.string(),
    countryCode: v.optional(v.string()),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isHeadquarters: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const locationId = await ctx.db.insert("builderServiceLocations", {
      ...args,
      createdAt: Date.now(),
    });
    
    return locationId;
  },
});

// Mutation to add service to builder
export const addService = mutation({
  args: {
    builderId: v.id("builders"),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    priceFrom: v.optional(v.number()),
    currency: v.optional(v.string()),
    unit: v.optional(v.string()),
    popular: v.optional(v.boolean()),
    turnoverTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const serviceId = await ctx.db.insert("builderServices", {
      ...args,
      createdAt: Date.now(),
    });
    
    return serviceId;
  },
});

// Mutation to add specialization to builder
export const addSpecialization = mutation({
  args: {
    builderId: v.id("builders"),
    industryName: v.string(),
    industrySlug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const specId = await ctx.db.insert("builderSpecializations", {
      ...args,
      createdAt: Date.now(),
    });
    
    return specId;
  },
});