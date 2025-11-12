import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,
  
  // Users table with email index for authentication
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.string()), // 'admin', 'builder', 'user'
    planType: v.optional(v.string()), // 'free', 'basic', 'professional', 'enterprise'
    createdAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
  }).index("email", ["email"]),

  // Site settings table for platform configuration
  siteSettings: defineTable({
    key: v.string(), // Unique key for the setting
    value: v.any(), // The setting value (can be any type)
    description: v.optional(v.string()),
    category: v.optional(v.string()), // 'general', 'email', 'payment', etc.
    isPublic: v.optional(v.boolean()), // Whether this setting can be accessed publicly
    lastModified: v.optional(v.number()),
    modifiedBy: v.optional(v.id("users")),
  }).index("by_key", ["key"]),

  // Countries table for location management
  countries: defineTable({
    countryName: v.string(),
    countryCode: v.string(), // ISO 2-letter code (US, DE, etc.)
    countrySlug: v.string(), // URL-friendly slug
    continent: v.optional(v.string()),
    currency: v.optional(v.string()),
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    active: v.optional(v.boolean()),
    builderCount: v.optional(v.number()),
    exhibitionCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("countryCode", ["countryCode"])
    .index("countrySlug", ["countrySlug"])
    .index("active", ["active"]),

  // Cities table for location management
  cities: defineTable({
    cityName: v.string(),
    citySlug: v.string(), // URL-friendly slug
    countryId: v.id("countries"),
    countryName: v.string(), // Denormalized for easier queries
    countryCode: v.string(), // Denormalized for easier queries
    state: v.optional(v.string()),
    timezone: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    population: v.optional(v.number()),
    active: v.optional(v.boolean()),
    builderCount: v.optional(v.number()),
    exhibitionCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("citySlug", ["citySlug"])
    .index("countryId", ["countryId"])
    .index("countryCode", ["countryCode"])
    .index("location", ["countryCode", "citySlug"])
    .index("active", ["active"]),

  // Leads table for quote requests and inquiries
  leads: defineTable({
    // Lead source information
    source: v.string(), // 'country_page', 'city_page', 'builder_page', 'exhibition_page'
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
    standSizeUnit: v.optional(v.string()), // 'sqm', 'sqft'
    budget: v.optional(v.string()), // 'Under $10k', '$10k-$50k', '$50k-$100k', 'Over $100k'
    budgetMin: v.optional(v.number()),
    budgetMax: v.optional(v.number()),
    currency: v.optional(v.string()),
    timeline: v.optional(v.string()),
    
    // Location information
    countryId: v.optional(v.id("countries")),
    cityId: v.optional(v.id("cities")),
    countryName: v.optional(v.string()),
    cityName: v.optional(v.string()),
    venue: v.optional(v.string()),
    
    // Requirements and preferences
    services: v.optional(v.array(v.string())), // Services needed
    specialRequirements: v.optional(v.string()),
    designPreferences: v.optional(v.string()),
    
    // Lead management
    status: v.string(), // 'new', 'assigned', 'contacted', 'quoted', 'won', 'lost'
    priority: v.optional(v.string()), // 'low', 'medium', 'high', 'urgent'
    assignedBuilders: v.optional(v.array(v.id("users"))),
    notifiedBuilders: v.optional(v.array(v.id("users"))),
    responseCount: v.optional(v.number()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    followUpDate: v.optional(v.number()),
  })
    .index("status", ["status"])
    .index("contactEmail", ["contactEmail"])
    .index("countryId", ["countryId"])
    .index("cityId", ["cityId"])
    .index("location", ["countryId", "cityId"])
    .index("createdAt", ["createdAt"])
    .index("priority", ["priority"]),

  // Quote requests from potential clients
  quoteRequests: defineTable({
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
    status: v.string(), // 'Open', 'Matched', 'Responded', 'Closed'
    priority: v.optional(v.string()), // 'Standard', 'Urgent', 'High'
    matchedBuilders: v.optional(v.array(v.id("users"))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("status", ["status"])
    .index("email", ["contactEmail"])
    .index("tradeShow", ["tradeShowSlug"])
    .index("createdAt", ["createdAt"]),

  // Quote responses from builders
  quoteResponses: defineTable({
    quoteRequestId: v.id("quoteRequests"),
    builderId: v.id("users"),
    builderName: v.string(),
    estimatedCost: v.optional(v.number()),
    currency: v.optional(v.string()),
    timeline: v.optional(v.string()),
    proposal: v.optional(v.string()),
    inclusions: v.optional(v.array(v.string())),
    status: v.string(), // 'Pending', 'Accepted', 'Declined'
    viewedByClient: v.optional(v.boolean()),
    responseDate: v.number(),
    createdAt: v.number(),
  })
    .index("quoteRequestId", ["quoteRequestId"])
    .index("builderId", ["builderId"])
    .index("status", ["status"]),

  // Trade shows and exhibitions
  tradeShows: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("slug", ["slug"])
    .index("country", ["country"])
    .index("city", ["city"])
    .index("industry", ["industry"])
    .index("active", ["active"])
    .index("featured", ["featured"]),

  // Comprehensive exhibitions database for all countries and cities
  exhibitions: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    
    // Location information
    cityId: v.optional(v.id("cities")),
    countryId: v.optional(v.id("countries")),
    cityName: v.string(),
    countryName: v.string(),
    countryCode: v.string(), // ISO 2-letter code
    venue: v.optional(v.string()),
    venueAddress: v.optional(v.string()),
    
    // Date information
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
    frequency: v.optional(v.string()), // 'annual', 'biennial', 'quarterly', 'monthly'
    
    // Exhibition details
    industry: v.optional(v.string()),
    category: v.optional(v.string()), // 'Trade Show', 'Conference', 'Exhibition', 'Fair'
    expectedAttendees: v.optional(v.number()),
    expectedExhibitors: v.optional(v.number()),
    boothSizes: v.optional(v.array(v.string())), // ['3x3', '6x3', '9x3', 'Custom']
    
    // Contact and web information
    website: v.optional(v.string()),
    organizerName: v.optional(v.string()),
    organizerEmail: v.optional(v.string()),
    organizerPhone: v.optional(v.string()),
    
    // Status and visibility
    active: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    
    // Metadata
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("slug", ["slug"])
    .index("countryCode", ["countryCode"])
    .index("countryName", ["countryName"])
    .index("cityName", ["cityName"])
    .index("location", ["countryCode", "cityName"])
    .index("industry", ["industry"])
    .index("category", ["category"])
    .index("active", ["active"])
    .index("featured", ["featured"])
    .index("year", ["year"])
    .index("startDate", ["startDate"]),
})