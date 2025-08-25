import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Query to get all quote requests with pagination
export const getAllQuoteRequests = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const offset = args.offset || 0;
    
    let quotes;
    
    if (args.status && typeof args.status === 'string') {
      quotes = await ctx.db
        .query("quoteRequests")
        .withIndex("status", (q) => q.eq("status", args.status as string))
        .order("desc")
        .collect();
    } else {
      quotes = await ctx.db
        .query("quoteRequests")
        .order("desc")
        .collect();
    }
    
    return {
      quotes: quotes.slice(offset, offset + limit),
      total: quotes.length,
      hasMore: offset + limit < quotes.length,
    };
  },
});

// Query to get quote requests by email
export const getQuoteRequestsByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quoteRequests")
      .withIndex("email", (q) => q.eq("contactEmail", args.email))
      .order("desc")
      .collect();
  },
});

// Query to get a single quote request with responses
export const getQuoteRequestById = query({
  args: { id: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    const quote = await ctx.db.get(args.id);
    if (!quote) return null;
    
    const responses = await ctx.db
      .query("quoteResponses")
      .withIndex("quoteRequestId", (q) => q.eq("quoteRequestId", args.id))
      .collect();
    
    return {
      ...quote,
      responses,
    };
  },
});

// Mutation to create a new quote request
export const createQuoteRequest = mutation({
  args: {
    userId: v.optional(v.id("users")),
    tradeShow: v.string(),
    tradeShowSlug: v.optional(v.string()),
    standSize: v.optional(v.number()),
    budget: v.optional(v.string()),
    timeline: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    companyName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    contactPerson: v.string(),
    specialRequests: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const quoteId = await ctx.db.insert("quoteRequests", {
      ...args,
      status: "Open",
      matchedBuilders: [],
      createdAt: now,
      updatedAt: now,
    });
    
    return quoteId;
  },
});

// Mutation to update quote request status
export const updateQuoteRequestStatus = mutation({
  args: {
    id: v.id("quoteRequests"),
    status: v.string(),
    matchedBuilders: v.optional(v.array(v.id("builders"))),
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

// Mutation to create a quote response
export const createQuoteResponse = mutation({
  args: {
    quoteRequestId: v.id("quoteRequests"),
    builderId: v.id("builders"),
    builderName: v.string(),
    estimatedCost: v.optional(v.number()),
    currency: v.optional(v.string()),
    timeline: v.optional(v.string()),
    proposal: v.optional(v.string()),
    inclusions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const responseId = await ctx.db.insert("quoteResponses", {
      ...args,
      status: "Pending",
      viewedByClient: false,
      responseDate: now,
      createdAt: now,
    });
    
    // Update quote request status to "Responded"
    await ctx.db.patch(args.quoteRequestId, {
      status: "Responded",
      updatedAt: now,
    });
    
    return responseId;
  },
});

// Query to get quote responses for a builder
export const getQuoteResponsesForBuilder = query({
  args: { builderId: v.id("builders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quoteResponses")
      .withIndex("builderId", (q) => q.eq("builderId", args.builderId))
      .order("desc")
      .collect();
  },
});

// Query to get quote statistics
export const getQuoteStats = query({
  args: {},
  handler: async (ctx) => {
    const quotes = await ctx.db.query("quoteRequests").collect();
    const responses = await ctx.db.query("quoteResponses").collect();
    
    const totalQuotes = quotes.length;
    const openQuotes = quotes.filter(q => q.status === "Open").length;
    const matchedQuotes = quotes.filter(q => q.status === "Matched").length;
    const respondedQuotes = quotes.filter(q => q.status === "Responded").length;
    const closedQuotes = quotes.filter(q => q.status === "Closed").length;
    
    const totalResponses = responses.length;
    const pendingResponses = responses.filter(r => r.status === "Pending").length;
    const acceptedResponses = responses.filter(r => r.status === "Accepted").length;
    
    return {
      totalQuotes,
      openQuotes,
      matchedQuotes,
      respondedQuotes,
      closedQuotes,
      totalResponses,
      pendingResponses,
      acceptedResponses,
      averageResponseTime: "2.5 hours", // This would need more complex calculation
    };
  },
});

