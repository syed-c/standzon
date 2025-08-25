import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id, Doc } from "./_generated/dataModel";

// Public query to get site settings
export const getSiteSettings = query({
  args: {
    key: v.optional(v.string()), // defaults to "default"
  },
  handler: async (ctx, args) => {
    const key = args.key ?? "default";
    const settings: Doc<"siteSettings"> | null = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return settings;
  },
});

// Protected mutation to create/update settings + audit
export const upsertSiteSettings = mutation({
  args: {
    key: v.optional(v.string()), // default "default"
    payload: v.object({
      companyName: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      primaryColor: v.optional(v.string()),
      contact: v.optional(
        v.object({
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
          address: v.optional(v.string()),
        }),
      ),
      social: v.optional(
        v.object({
          facebook: v.optional(v.string()),
          twitter: v.optional(v.string()),
          instagram: v.optional(v.string()),
          linkedin: v.optional(v.string()),
          youtube: v.optional(v.string()),
          others: v.optional(v.record(v.string(), v.string())),
        }),
      ),
      pages: v.optional(v.record(v.string(), v.string())),
      metadata: v.optional(v.record(v.string(), v.any())),
      note: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const key = args.key ?? "default";
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // check super-admin role
    const user: Doc<"users"> | null = await ctx.db.get(userId);
    if (!user || user.role !== "superadmin") throw new Error("Forbidden");

    // find existing
    const existing: Doc<"siteSettings"> | null = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();

    const now = Date.now();
    const patchOrInsert = {
      key,
      value: {
        companyName: args.payload.companyName,
        logoUrl: args.payload.logoUrl,
        primaryColor: args.payload.primaryColor,
        contact: args.payload.contact || { email: undefined, phone: undefined, address: undefined },
        social: args.payload.social || { 
          facebook: undefined, 
          twitter: undefined, 
          instagram: undefined, 
          linkedin: undefined, 
          youtube: undefined, 
          others: undefined 
        },
        pages: args.payload.pages,
        metadata: args.payload.metadata,
        updatedBy: userId,
        updatedAt: now,
      },
      description: "Site configuration settings",
      category: "general",
      isPublic: false,
      lastModified: now,
      modifiedBy: userId,
    };

    let settingsId: Id<"siteSettings">;
    if (existing) {
      await ctx.db.patch(existing._id, patchOrInsert);
      settingsId = existing._id;
    } else {
      settingsId = await ctx.db.insert("siteSettings", patchOrInsert);
    }

    return settingsId;
  },
});

// Seed initial settings (one-time setup)
export const seedInitialSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // check if settings already exist
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();

    if (existing) {
      return { success: false, message: "Settings already exist" };
    }

    const now = Date.now();
    const defaultSettings = {
      key: "default",
      value: {
        companyName: "StandsZone",
        logoUrl: "",
        primaryColor: "#ec4899",
        contact: {
          email: "hello@standszone.com",
          phone: "+1 (555) 123-4567",
          address: "123 Exhibition Ave, NYC",
        },
        social: {
          facebook: "https://facebook.com/standszone",
          twitter: "https://twitter.com/standszone",
          instagram: "https://instagram.com/standszone",
          linkedin: "https://linkedin.com/company/standszone",
          youtube: "",
          others: {},
        },
        pages: {
          footerText: "Creating extraordinary exhibition experiences that captivate audiences and drive business results across 50+ countries worldwide.",
          heroSubtitle: "Connect with verified exhibition stand builders worldwide",
          aboutText: "We are the leading platform connecting businesses with top-rated exhibition stand builders globally.",
        },
        metadata: {
          defaultMetaTitle: "StandsZone - Global Exhibition Stand Builders Directory",
          defaultMetaDescription: "Find and connect with verified exhibition stand builders worldwide. Get quotes, compare services, and create stunning trade show displays.",
        },
        updatedBy: userId,
        updatedAt: now,
      },
      description: "Default site configuration settings",
      category: "general",
      isPublic: false,
      lastModified: now,
      modifiedBy: userId,
    };

    const settingsId = await ctx.db.insert("siteSettings", defaultSettings);

    return { success: true, settingsId };
  },
});

