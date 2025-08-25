import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create a new lead
export const createLead = mutation({
  args: {
    // Lead source information
    source: v.string(),
    sourceUrl: v.optional(v.string()),
    
    // Client information
    companyName: v.string(),
    contactPerson: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    
    // Project details
    exhibitionName: v.optional(v.string()),
    exhibitionSlug: v.optional(v.string()),
    standSize: v.optional(v.number()),
    standSizeUnit: v.optional(v.string()),
    budget: v.optional(v.string()),
    timeline: v.optional(v.string()),
    
    // Location information
    countryName: v.optional(v.string()),
    cityName: v.optional(v.string()),
    venue: v.optional(v.string()),
    
    // Requirements and preferences
    services: v.optional(v.array(v.string())),
    specialRequirements: v.optional(v.string()),
    designPreferences: v.optional(v.string()),
    
    // Lead management
    status: v.string(),
    priority: v.optional(v.string()),
    assignedBuilders: v.optional(v.array(v.id("builders"))),
    notifiedBuilders: v.optional(v.array(v.id("builders"))),
    responseCount: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    console.log('🎯 Creating new lead in Convex:', args.companyName);
    
    const leadId = await ctx.db.insert("leads", {
      ...args,
      responseCount: args.responseCount || 0,
    });
    
    console.log('✅ Lead created with ID:', leadId);
    return leadId;
  },
});

// Query to get all leads for admin dashboard
export const getAllLeads = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log('🎯 Fetching all leads for admin dashboard...');
    
    try {
      const limit = args.limit || 50;
      
      let leads;
      
      if (args.status && typeof args.status === 'string') {
        leads = await ctx.db
          .query("leads")
          .withIndex("status", (q) => q.eq("status", args.status as string))
          .order("desc")
          .take(limit);
      } else {
        leads = await ctx.db
          .query("leads")
          .withIndex("createdAt")
          .order("desc")
          .take(limit);
      }
      
      console.log(`📊 Found ${leads.length} leads`);
      return leads;
    } catch (error) {
      console.error('❌ Error fetching leads:', error);
      return [];
    }
  },
});

// Query to get recent leads for public display (limited data for privacy)
export const getRecentLeadsForPublic = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    console.log('🎯 Fetching recent leads for public display...');
    
    try {
      const limit = args.limit || 10;
      
      const recentLeads = await ctx.db
        .query("leads")
        .withIndex("createdAt")
        .order("desc")
        .take(limit);
      
      console.log(`📊 Found ${recentLeads.length} recent leads`);
      
      // Return only public-safe data (no personal information)
      return recentLeads.map(lead => ({
        id: lead._id,
        exhibitionName: lead.exhibitionName || "Exhibition not specified",
        standSize: lead.standSize ? `${lead.standSize} ${lead.standSizeUnit || 'sqm'}` : "Size not specified",
        budget: lead.budget || "Budget not specified",
        cityName: lead.cityName || "Location not specified",
        countryName: lead.countryName || "Country not specified",
        submittedAt: lead.createdAt,
        status: lead.status || "Open"
      }));
    } catch (error) {
      console.error('❌ Error fetching recent leads:', error);
      // Return empty array instead of throwing error
      return [];
    }
  },
});

// Query to get lead statistics
export const getLeadStats = query({
  args: {},
  handler: async (ctx) => {
    console.log('🎯 Fetching lead statistics...');
    
    try {
      const leads = await ctx.db.query("leads").collect();
      
      const totalLeads = leads.length;
      const newLeads = leads.filter(l => l.status === "new").length;
      const assignedLeads = leads.filter(l => l.status === "assigned").length;
      const contactedLeads = leads.filter(l => l.status === "contacted").length;
      const quotedLeads = leads.filter(l => l.status === "quoted").length;
      const wonLeads = leads.filter(l => l.status === "won").length;
      const lostLeads = leads.filter(l => l.status === "lost").length;
      
      // Calculate leads from last 24 hours
      const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
      const recentLeads = leads.filter(l => l.createdAt > last24Hours).length;
      
      return {
        totalLeads,
        newLeads,
        assignedLeads,
        contactedLeads,
        quotedLeads,
        wonLeads,
        lostLeads,
        recentLeads,
        conversionRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
      };
    } catch (error) {
      console.error('❌ Error fetching lead stats:', error);
      return {
        totalLeads: 0,
        newLeads: 0,
        assignedLeads: 0,
        contactedLeads: 0,
        quotedLeads: 0,
        wonLeads: 0,
        lostLeads: 0,
        recentLeads: 0,
        conversionRate: 0,
      };
    }
  },
});

// Mutation to update lead status
export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("leads"),
    status: v.string(),
    assignedBuilders: v.optional(v.array(v.id("builders"))),
    notifiedBuilders: v.optional(v.array(v.id("builders"))),
  },
  handler: async (ctx, args) => {
    console.log('🎯 Updating lead status:', args.leadId, args.status);
    
    await ctx.db.patch(args.leadId, {
      status: args.status,
      assignedBuilders: args.assignedBuilders,
      notifiedBuilders: args.notifiedBuilders,
      updatedAt: Date.now(),
    });
    
    return args.leadId;
  },
});

// Query to get leads by email
export const getLeadsByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("contactEmail", (q) => q.eq("contactEmail", args.email))
      .order("desc")
      .collect();
  },
});

// Mutation to update lead notifications
export const updateLeadNotifications = mutation({
  args: {
    leadId: v.id("leads"),
    notifiedBuilders: v.array(v.id("builders")),
    notificationsSent: v.number(),
    emailsSent: v.number(),
  },
  handler: async (ctx, args) => {
    console.log('🎯 Updating lead notifications:', args.leadId, `${args.notificationsSent} notifications sent`);
    
    await ctx.db.patch(args.leadId, {
      notifiedBuilders: args.notifiedBuilders,
      updatedAt: Date.now(),
    });
    
    return args.leadId;
  },
});
