import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get all exhibitions
export const getAllExhibitions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exhibitions").collect()
  },
})

// Get exhibitions by country
export const getExhibitionsByCountry = query({
  args: { countryCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exhibitions")
      .withIndex("countryCode", (q) => q.eq("countryCode", args.countryCode))
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// Get exhibitions by city
export const getExhibitionsByCity = query({
  args: { 
    countryCode: v.string(),
    cityName: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exhibitions")
      .withIndex("location", (q) => 
        q.eq("countryCode", args.countryCode).eq("cityName", args.cityName)
      )
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// Get exhibitions by industry
export const getExhibitionsByIndustry = query({
  args: { industry: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exhibitions")
      .withIndex("industry", (q) => q.eq("industry", args.industry))
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// Get featured exhibitions
export const getFeaturedExhibitions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("exhibitions")
      .withIndex("featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("active"), true))
      .collect()
  },
})

// Add new exhibition
export const addExhibition = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    cityName: v.string(),
    countryName: v.string(),
    countryCode: v.string(),
    venue: v.optional(v.string()),
    venueAddress: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
    frequency: v.optional(v.string()),
    industry: v.optional(v.string()),
    category: v.optional(v.string()),
    expectedAttendees: v.optional(v.number()),
    expectedExhibitors: v.optional(v.number()),
    boothSizes: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    organizerName: v.optional(v.string()),
    organizerEmail: v.optional(v.string()),
    organizerPhone: v.optional(v.string()),
    active: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    return await ctx.db.insert("exhibitions", {
      ...args,
      active: args.active ?? true,
      featured: args.featured ?? false,
      verified: args.verified ?? false,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Update exhibition
export const updateExhibition = mutation({
  args: {
    id: v.id("exhibitions"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    cityName: v.optional(v.string()),
    countryName: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    venue: v.optional(v.string()),
    venueAddress: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    year: v.optional(v.number()),
    month: v.optional(v.number()),
    frequency: v.optional(v.string()),
    industry: v.optional(v.string()),
    category: v.optional(v.string()),
    expectedAttendees: v.optional(v.number()),
    expectedExhibitors: v.optional(v.number()),
    boothSizes: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    organizerName: v.optional(v.string()),
    organizerEmail: v.optional(v.string()),
    organizerPhone: v.optional(v.string()),
    active: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})

// Delete exhibition
export const deleteExhibition = mutation({
  args: { id: v.id("exhibitions") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})

// Initialize comprehensive exhibitions data
export const initializeExhibitionsData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    
    // Check if exhibitions already exist
    const existingExhibitions = await ctx.db.query("exhibitions").collect()
    if (existingExhibitions.length > 0) {
      return { success: false, message: "Exhibitions data already exists" }
    }

    const exhibitions = [
      // UAE - Dubai
      {
        name: "Arab Health",
        slug: "arab-health-dubai",
        description: "The largest healthcare exhibition in the Middle East",
        cityName: "Dubai",
        countryName: "United Arab Emirates",
        countryCode: "AE",
        venue: "Dubai World Trade Centre",
        industry: "Healthcare",
        category: "Trade Show",
        expectedAttendees: 84000,
        expectedExhibitors: 4000,
        frequency: "annual",
        month: 1,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "Custom"],
        website: "https://www.arabhealthonline.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["healthcare", "medical", "technology"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "GITEX Technology Week",
        slug: "gitex-technology-week-dubai",
        description: "The largest tech event in the Middle East, Africa and South Asia",
        cityName: "Dubai",
        countryName: "United Arab Emirates",
        countryCode: "AE",
        venue: "Dubai World Trade Centre",
        industry: "Technology",
        category: "Trade Show",
        expectedAttendees: 175000,
        expectedExhibitors: 5000,
        frequency: "annual",
        month: 10,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.gitex.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["technology", "innovation", "digital"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Dubai International Boat Show",
        slug: "dubai-international-boat-show",
        description: "The premier marine lifestyle event in the Middle East",
        cityName: "Dubai",
        countryName: "United Arab Emirates",
        countryCode: "AE",
        venue: "Dubai Harbour",
        industry: "Marine",
        category: "Trade Show",
        expectedAttendees: 28000,
        expectedExhibitors: 800,
        frequency: "annual",
        month: 3,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "Custom"],
        website: "https://www.dubaiboatshow.com",
        active: true,
        featured: false,
        verified: true,
        tags: ["marine", "boats", "luxury"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "ADIPEC",
        slug: "adipec-abu-dhabi",
        description: "Abu Dhabi International Petroleum Exhibition and Conference",
        cityName: "Abu Dhabi",
        countryName: "United Arab Emirates",
        countryCode: "AE",
        venue: "ADNEC Centre Abu Dhabi",
        industry: "Oil & Gas",
        category: "Trade Show",
        expectedAttendees: 145000,
        expectedExhibitors: 2200,
        frequency: "annual",
        month: 11,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.adipec.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["oil", "gas", "energy", "petroleum"],
        createdAt: now,
        updatedAt: now,
      },

      // Qatar - Doha
      {
        name: "Qatar International Food Festival",
        slug: "qatar-international-food-festival",
        description: "The largest food and hospitality exhibition in Qatar",
        cityName: "Doha",
        countryName: "Qatar",
        countryCode: "QA",
        venue: "Doha Exhibition and Convention Center",
        industry: "Food & Beverage",
        category: "Trade Show",
        expectedAttendees: 25000,
        expectedExhibitors: 500,
        frequency: "annual",
        month: 3,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "Custom"],
        website: "https://www.qiff.com.qa",
        active: true,
        featured: false,
        verified: true,
        tags: ["food", "hospitality", "culinary"],
        createdAt: now,
        updatedAt: now,
      },

      // Saudi Arabia - Riyadh
      {
        name: "Saudi Health",
        slug: "saudi-health-riyadh",
        description: "The largest healthcare exhibition in Saudi Arabia",
        cityName: "Riyadh",
        countryName: "Saudi Arabia",
        countryCode: "SA",
        venue: "Riyadh International Convention & Exhibition Center",
        industry: "Healthcare",
        category: "Trade Show",
        expectedAttendees: 45000,
        expectedExhibitors: 1200,
        frequency: "annual",
        month: 10,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "Custom"],
        website: "https://www.saudihealth.com.sa",
        active: true,
        featured: true,
        verified: true,
        tags: ["healthcare", "medical", "saudi"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Future Investment Initiative",
        slug: "future-investment-initiative-riyadh",
        description: "Davos in the Desert - Global investment summit",
        cityName: "Riyadh",
        countryName: "Saudi Arabia",
        countryCode: "SA",
        venue: "King Abdulaziz Conference Center",
        industry: "Finance",
        category: "Conference",
        expectedAttendees: 6000,
        expectedExhibitors: 200,
        frequency: "annual",
        month: 10,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "Custom"],
        website: "https://www.futureinvestmentinitiative.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["investment", "finance", "technology"],
        createdAt: now,
        updatedAt: now,
      },

      // India - New Delhi
      {
        name: "India International Trade Fair",
        slug: "india-international-trade-fair-delhi",
        description: "One of Asia's largest trade fairs",
        cityName: "New Delhi",
        countryName: "India",
        countryCode: "IN",
        venue: "Pragati Maidan",
        industry: "General Trade",
        category: "Trade Show",
        expectedAttendees: 3500000,
        expectedExhibitors: 7000,
        frequency: "annual",
        month: 11,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.iitf.co.in",
        active: true,
        featured: true,
        verified: true,
        tags: ["trade", "general", "manufacturing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Auto Expo",
        slug: "auto-expo-delhi",
        description: "India's premier automotive show",
        cityName: "New Delhi",
        countryName: "India",
        countryCode: "IN",
        venue: "India Expo Mart",
        industry: "Automotive",
        category: "Trade Show",
        expectedAttendees: 600000,
        expectedExhibitors: 1200,
        frequency: "biennial",
        month: 1,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.autoexpo.in",
        active: true,
        featured: true,
        verified: true,
        tags: ["automotive", "cars", "technology"],
        createdAt: now,
        updatedAt: now,
      },

      // India - Mumbai
      {
        name: "Convergence India",
        slug: "convergence-india-mumbai",
        description: "India's largest telecom and digital infrastructure exhibition",
        cityName: "Mumbai",
        countryName: "India",
        countryCode: "IN",
        venue: "Bombay Exhibition Centre",
        industry: "Telecommunications",
        category: "Trade Show",
        expectedAttendees: 45000,
        expectedExhibitors: 800,
        frequency: "annual",
        month: 3,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "Custom"],
        website: "https://www.convergenceindia.org",
        active: true,
        featured: false,
        verified: true,
        tags: ["telecom", "digital", "infrastructure"],
        createdAt: now,
        updatedAt: now,
      },

      // Germany - Berlin
      {
        name: "ITB Berlin",
        slug: "itb-berlin",
        description: "The World's Leading Travel Trade Show",
        cityName: "Berlin",
        countryName: "Germany",
        countryCode: "DE",
        venue: "Messe Berlin",
        industry: "Travel & Tourism",
        category: "Trade Show",
        expectedAttendees: 160000,
        expectedExhibitors: 10000,
        frequency: "annual",
        month: 3,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.itb-berlin.de",
        active: true,
        featured: true,
        verified: true,
        tags: ["travel", "tourism", "hospitality"],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "IFA Berlin",
        slug: "ifa-berlin",
        description: "The world's leading trade show for consumer electronics",
        cityName: "Berlin",
        countryName: "Germany",
        countryCode: "DE",
        venue: "Messe Berlin",
        industry: "Consumer Electronics",
        category: "Trade Show",
        expectedAttendees: 245000,
        expectedExhibitors: 1800,
        frequency: "annual",
        month: 9,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.ifa-berlin.de",
        active: true,
        featured: true,
        verified: true,
        tags: ["electronics", "consumer", "technology"],
        createdAt: now,
        updatedAt: now,
      },

      // France - Paris
      {
        name: "Maison&Objet Paris",
        slug: "maison-objet-paris",
        description: "The international authority for home decor, interior design, architecture and lifestyle culture",
        cityName: "Paris",
        countryName: "France",
        countryCode: "FR",
        venue: "Paris Nord Villepinte",
        industry: "Home & Decor",
        category: "Trade Show",
        expectedAttendees: 85000,
        expectedExhibitors: 3000,
        frequency: "biannual",
        month: 1,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "Custom"],
        website: "https://www.maison-objet.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["home", "decor", "design", "lifestyle"],
        createdAt: now,
        updatedAt: now,
      },

      // UK - London
      {
        name: "London Tech Week",
        slug: "london-tech-week",
        description: "Europe's largest festival of technology and innovation",
        cityName: "London",
        countryName: "United Kingdom",
        countryCode: "GB",
        venue: "ExCeL London",
        industry: "Technology",
        category: "Conference",
        expectedAttendees: 55000,
        expectedExhibitors: 1000,
        frequency: "annual",
        month: 6,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "Custom"],
        website: "https://londontechweek.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["technology", "innovation", "startups"],
        createdAt: now,
        updatedAt: now,
      },

      // USA - Las Vegas
      {
        name: "CES",
        slug: "ces-las-vegas",
        description: "The most influential tech event in the world",
        cityName: "Las Vegas",
        countryName: "United States",
        countryCode: "US",
        venue: "Las Vegas Convention Center",
        industry: "Technology",
        category: "Trade Show",
        expectedAttendees: 170000,
        expectedExhibitors: 4400,
        frequency: "annual",
        month: 1,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "24x3", "Custom"],
        website: "https://www.ces.tech",
        active: true,
        featured: true,
        verified: true,
        tags: ["technology", "innovation", "consumer electronics"],
        createdAt: now,
        updatedAt: now,
      },

      // Italy - Milan
      {
        name: "Salone del Mobile",
        slug: "salone-del-mobile-milan",
        description: "The world's premier furniture and design fair",
        cityName: "Milan",
        countryName: "Italy",
        countryCode: "IT",
        venue: "Fiera Milano",
        industry: "Furniture & Design",
        category: "Trade Show",
        expectedAttendees: 386000,
        expectedExhibitors: 2400,
        frequency: "annual",
        month: 4,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.salonemilano.it",
        active: true,
        featured: true,
        verified: true,
        tags: ["furniture", "design", "interior"],
        createdAt: now,
        updatedAt: now,
      },

      // Spain - Barcelona
      {
        name: "Mobile World Congress",
        slug: "mobile-world-congress-barcelona",
        description: "The world's largest exhibition for the mobile industry",
        cityName: "Barcelona",
        countryName: "Spain",
        countryCode: "ES",
        venue: "Fira Barcelona Gran Via",
        industry: "Mobile Technology",
        category: "Trade Show",
        expectedAttendees: 101000,
        expectedExhibitors: 2400,
        frequency: "annual",
        month: 2,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.mwcbarcelona.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["mobile", "technology", "telecommunications"],
        createdAt: now,
        updatedAt: now,
      },

      // Netherlands - Amsterdam
      {
        name: "ISE",
        slug: "ise-amsterdam",
        description: "Integrated Systems Europe - The world's largest AV and systems integration exhibition",
        cityName: "Amsterdam",
        countryName: "Netherlands",
        countryCode: "NL",
        venue: "RAI Amsterdam",
        industry: "Audio Visual",
        category: "Trade Show",
        expectedAttendees: 81000,
        expectedExhibitors: 1300,
        frequency: "annual",
        month: 2,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "Custom"],
        website: "https://www.iseurope.org",
        active: true,
        featured: true,
        verified: true,
        tags: ["audio", "visual", "systems", "integration"],
        createdAt: now,
        updatedAt: now,
      },

      // Switzerland - Geneva
      {
        name: "Geneva International Motor Show",
        slug: "geneva-international-motor-show",
        description: "One of the most important motor shows in the world",
        cityName: "Geneva",
        countryName: "Switzerland",
        countryCode: "CH",
        venue: "Palexpo",
        industry: "Automotive",
        category: "Trade Show",
        expectedAttendees: 600000,
        expectedExhibitors: 900,
        frequency: "annual",
        month: 3,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.gims.swiss",
        active: true,
        featured: true,
        verified: true,
        tags: ["automotive", "cars", "luxury"],
        createdAt: now,
        updatedAt: now,
      },

      // Singapore
      {
        name: "Singapore Airshow",
        slug: "singapore-airshow",
        description: "Asia's largest aerospace and defense exhibition",
        cityName: "Singapore",
        countryName: "Singapore",
        countryCode: "SG",
        venue: "Changi Exhibition Centre",
        industry: "Aerospace",
        category: "Trade Show",
        expectedAttendees: 54000,
        expectedExhibitors: 1000,
        frequency: "biennial",
        month: 2,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.singaporeairshow.com",
        active: true,
        featured: true,
        verified: true,
        tags: ["aerospace", "defense", "aviation"],
        createdAt: now,
        updatedAt: now,
      },

      // China - Beijing
      {
        name: "China International Import Expo",
        slug: "china-international-import-expo-beijing",
        description: "The world's first import-themed national-level expo",
        cityName: "Beijing",
        countryName: "China",
        countryCode: "CN",
        venue: "China National Convention Center",
        industry: "General Trade",
        category: "Trade Show",
        expectedAttendees: 400000,
        expectedExhibitors: 3000,
        frequency: "annual",
        month: 11,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.ciie.org",
        active: true,
        featured: true,
        verified: true,
        tags: ["import", "trade", "international"],
        createdAt: now,
        updatedAt: now,
      },

      // Turkey - Istanbul
      {
        name: "CNR Expo",
        slug: "cnr-expo-istanbul",
        description: "Turkey's largest multi-industry exhibition",
        cityName: "Istanbul",
        countryName: "Turkey",
        countryCode: "TR",
        venue: "CNR Expo",
        industry: "General Trade",
        category: "Trade Show",
        expectedAttendees: 150000,
        expectedExhibitors: 2000,
        frequency: "annual",
        month: 10,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "12x3", "Custom"],
        website: "https://www.cnrexpo.com",
        active: true,
        featured: false,
        verified: true,
        tags: ["trade", "general", "manufacturing"],
        createdAt: now,
        updatedAt: now,
      },

      // Australia - Melbourne
      {
        name: "Melbourne International Coffee Expo",
        slug: "melbourne-international-coffee-expo",
        description: "The Southern Hemisphere's largest coffee trade exhibition",
        cityName: "Melbourne",
        countryName: "Australia",
        countryCode: "AU",
        venue: "Melbourne Convention and Exhibition Centre",
        industry: "Food & Beverage",
        category: "Trade Show",
        expectedAttendees: 18000,
        expectedExhibitors: 300,
        frequency: "annual",
        month: 2,
        year: 2024,
        boothSizes: ["3x3", "6x3", "9x3", "Custom"],
        website: "https://www.internationalcoffeeexpo.com",
        active: true,
        featured: false,
        verified: true,
        tags: ["coffee", "food", "beverage"],
        createdAt: now,
        updatedAt: now,
      },

      // Australia - Sydney
      {
        name: "Sydney International Boat Show",
        slug: "sydney-international-boat-show",
        description: "Australia's premier marine lifestyle event",
        cityName: "Sydney",
        countryName: "Australia",
        countryCode: "AU",
        venue: "Sydney Olympic Park",
        industry: "Marine",
        category: "Trade Show",
        expectedAttendees: 50000,
        expectedExhibitors: 600,
        frequency: "annual",
        month: 8,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "Custom"],
        website: "https://www.sydneyboatshow.com.au",
        active: true,
        featured: false,
        verified: true,
        tags: ["marine", "boats", "lifestyle"],
        createdAt: now,
        updatedAt: now,
      },

      // Canada - Toronto
      {
        name: "Canadian International AutoShow",
        slug: "canadian-international-autoshow-toronto",
        description: "Canada's largest automotive exhibition",
        cityName: "Toronto",
        countryName: "Canada",
        countryCode: "CA",
        venue: "Metro Toronto Convention Centre",
        industry: "Automotive",
        category: "Trade Show",
        expectedAttendees: 300000,
        expectedExhibitors: 1000,
        frequency: "annual",
        month: 2,
        year: 2024,
        boothSizes: ["6x3", "9x3", "12x3", "18x3", "Custom"],
        website: "https://www.autoshow.ca",
        active: true,
        featured: true,
        verified: true,
        tags: ["automotive", "cars", "canada"],
        createdAt: now,
        updatedAt: now,
      },
    ]

    // Insert all exhibitions
    const insertedExhibitions = []
    for (const exhibition of exhibitions) {
      const id = await ctx.db.insert("exhibitions", exhibition)
      insertedExhibitions.push(id)
    }

    return {
      success: true,
      message: `Successfully initialized ${insertedExhibitions.length} exhibitions`,
      count: insertedExhibitions.length,
      exhibitions: insertedExhibitions,
    }
  },
})

// Search exhibitions by name
export const searchExhibitions = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allExhibitions = await ctx.db.query("exhibitions").collect()
    
    return allExhibitions.filter(exhibition => 
      exhibition.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      exhibition.description?.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      exhibition.industry?.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      exhibition.tags?.some(tag => tag.toLowerCase().includes(args.searchTerm.toLowerCase()))
    )
  },
})