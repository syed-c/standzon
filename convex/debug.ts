import { query } from "./_generated/server";
import { v } from "convex/values";

// Debug query to count builders in database
export const countBuilders = query({
  args: {},
  handler: async (ctx) => {
    const builders = await ctx.db.query("builders").collect();
    const count = builders.length;
    console.log("Total builders in database:", count);
    return count;
  },
});

// Debug query to get recent builders
export const getRecentBuilders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    const builders = await ctx.db
      .query("builders")
      .order("desc")
      .take(limit);
    
    console.log(`Recent ${limit} builders:`, builders.map(b => ({
      id: b._id,
      name: b.companyName,
      country: b.headquartersCountry,
      city: b.headquartersCity,
      gmbImported: b.gmbImported,
      createdAt: new Date(b.createdAt).toISOString()
    })));
    
    return builders;
  },
});

// Debug query to get GMB imported builders specifically
export const getGMBImportedBuilders = query({
  args: {},
  handler: async (ctx) => {
    const gmbBuilders = await ctx.db
      .query("builders")
      .filter((q) => q.eq(q.field("gmbImported"), true))
      .collect();
    
    console.log("GMB imported builders count:", gmbBuilders.length);
    console.log("GMB builders:", gmbBuilders.map(b => ({
      id: b._id,
      name: b.companyName,
      country: b.headquartersCountry,
      city: b.headquartersCity,
      source: b.source,
      importedAt: b.importedAt ? new Date(b.importedAt).toISOString() : null
    })));
    
    return gmbBuilders;
  },
});

// Debug query to get all builders with full details
export const getAllBuildersDebug = query({
  args: {},
  handler: async (ctx) => {
    const builders = await ctx.db.query("builders").collect();
    
    console.log("=== FULL BUILDERS DEBUG ===");
    console.log("Total builders found:", builders.length);
    
    builders.forEach((builder, index) => {
      console.log(`Builder ${index + 1}:`, {
        id: builder._id,
        name: builder.companyName,
        email: builder.primaryEmail,
        country: builder.headquartersCountry,
        city: builder.headquartersCity,
        gmbImported: builder.gmbImported,
        importedFromGMB: builder.importedFromGMB,
        source: builder.source,
        verified: builder.verified,
        createdAt: new Date(builder.createdAt).toISOString()
      });
    });
    
    return {
      total: builders.length,
      gmbImported: builders.filter(b => b.gmbImported || b.importedFromGMB).length,
      verified: builders.filter(b => b.verified).length,
      builders: builders.map(b => ({
        id: b._id,
        name: b.companyName,
        email: b.primaryEmail,
        country: b.headquartersCountry,
        city: b.headquartersCity,
        gmbImported: b.gmbImported || b.importedFromGMB,
        source: b.source,
        verified: b.verified
      }))
    };
  },
});
