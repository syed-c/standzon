import { TradeShowDB } from "@/lib/supabase/types/tradeShows";
import { TradeShow, Venue, Industry, CostBreakdown } from "@/lib/data/tradeShows";
import { Exhibition } from "@/lib/data/exhibitions";

export function mapTradeShowDBToUI(dbData: TradeShowDB): TradeShow {
    return {
        id: dbData.id,
        name: dbData.title,
        slug: dbData.slug,
        year: dbData.start_date ? new Date(dbData.start_date).getFullYear() : new Date().getFullYear(),
        startDate: dbData.start_date || "",
        endDate: dbData.end_date || "",
        venue: {
            name: dbData.venue_name || "",
            address: "", // Not directly in schema
            totalSpace: 0,
            hallCount: 0,
            facilities: dbData.venue_facilities || [],
            nearbyHotels: [],
            transportAccess: dbData.transportation || [],
            parkingSpaces: 0,
            cateringOptions: [],
            wifiQuality: "Good",
            loadingBays: 0,
        },
        city: dbData.location_city || "",
        country: dbData.location_country || "",
        countryCode: "", // We might need a lookup or add to schema
        industries: (dbData.tags || []).map(tag => ({
            id: tag.toLowerCase(),
            name: tag,
            slug: tag.toLowerCase(),
            description: "",
            subcategories: [],
            color: "#3B82F6", // Default color
            icon: "📊",
            annualGrowthRate: 0,
            averageBoothCost: 0,
            popularCountries: [],
        })),
        description: dbData.long_description || dbData.short_description || "",
        website: dbData.organizer_website || "",
        expectedVisitors: dbData.expected_attendees || 0,
        expectedExhibitors: dbData.exhibitors_count || 0,
        standSpace: 0,
        ticketPrice: "Check Website",
        organizerName: dbData.organizer_name || "",
        organizerContact: "",
        isAnnual: true,
        significance: "Major", // Default
        builderRecommendations: [],
        previousEditionStats: dbData.organizer_rating ? {
            visitors: 0,
            exhibitors: 0,
            countries: 0,
            feedback: dbData.organizer_rating,
        } : undefined,
        whyExhibit: [],
        keyFeatures: dbData.key_features || [],
        targetAudience: dbData.target_audience || [],
        networkingOpportunities: [],
        costs: {
            standRental: {
                min: dbData.booth_pricing_min || 0,
                max: dbData.booth_pricing_max || 0,
                unit: "per sqm",
                currency: dbData.booth_pricing_currency || "USD",
            },
            services: {
                basicStand: 0,
                customStand: 0,
                premiumStand: 0,
            },
            additionalCosts: [],
        },
    };
}

export function mapTradeShowDBToExhibition(dbData: TradeShowDB): Exhibition {
    const tradeShow = mapTradeShowDBToUI(dbData);

    return {
        id: tradeShow.id,
        name: tradeShow.name,
        slug: tradeShow.slug,
        description: tradeShow.description,
        shortDescription: dbData.short_description || tradeShow.description,
        startDate: tradeShow.startDate,
        endDate: tradeShow.endDate,
        city: tradeShow.city,
        country: tradeShow.country,
        countryCode: tradeShow.countryCode || "US", // Default to US if missing
        venue: {
            name: tradeShow.venue.name,
            address: tradeShow.venue.address || tradeShow.city,
            city: tradeShow.city,
            country: tradeShow.country,
            website: tradeShow.website,
            totalSpace: tradeShow.venue.totalSpace || 50000,
            totalHalls: tradeShow.venue.hallCount || 5,
            facilities: tradeShow.venue.facilities,
            publicTransport: Array.isArray(tradeShow.venue.transportAccess) ? tradeShow.venue.transportAccess : [],
            parkingSpaces: tradeShow.venue.parkingSpaces || 1000,
            rating: 4.5,
            nearestAirport: 'International Airport',
            distanceFromAirport: '15km',
        },
        organizer: {
            name: tradeShow.organizerName,
            email: tradeShow.organizerContact || 'info@organizer.com',
            phone: '+1-555-0123',
            website: tradeShow.website,
            headquarters: tradeShow.city,
            establishedYear: 2000,
            rating: tradeShow.previousEditionStats?.feedback || 4.2,
            otherEvents: []
        },
        industry: tradeShow.industries[0] || { id: 'general', name: 'General', slug: 'general', description: '', subcategories: [], color: '', icon: '', annualGrowthRate: 0, averageBoothCost: 0, popularCountries: [] },
        expectedAttendees: tradeShow.expectedVisitors,
        expectedExhibitors: tradeShow.expectedExhibitors,
        totalSpace: tradeShow.standSpace || 25000,
        year: tradeShow.year,
        status: new Date(tradeShow.startDate) > new Date() ? 'Upcoming' : 'Completed',
        featured: tradeShow.significance === 'Major',
        trending: false,
        tags: dbData.tags || ['Trade Show'],
        keyFeatures: tradeShow.keyFeatures || [],
        targetAudience: tradeShow.targetAudience || [],
        website: tradeShow.website,
        pricing: {
            currency: tradeShow.costs.standRental.currency,
            standardBooth: {
                min: tradeShow.costs.standRental.min,
                max: tradeShow.costs.standRental.max,
                currency: tradeShow.costs.standRental.currency,
                unit: tradeShow.costs.standRental.unit
            },
            premiumBooth: {
                min: Math.round(tradeShow.costs.standRental.max * 1.5),
                max: Math.round(tradeShow.costs.standRental.max * 2),
                currency: tradeShow.costs.standRental.currency,
                unit: tradeShow.costs.standRental.unit
            },
            cornerBooth: {
                min: Math.round(tradeShow.costs.standRental.max * 1.2),
                max: Math.round(tradeShow.costs.standRental.max * 1.8),
                currency: tradeShow.costs.standRental.currency,
                unit: tradeShow.costs.standRental.unit
            },
            islandBooth: {
                min: Math.round(tradeShow.costs.standRental.max * 2),
                max: Math.round(tradeShow.costs.standRental.max * 3),
                currency: tradeShow.costs.standRental.currency,
                unit: tradeShow.costs.standRental.unit
            },
            shellScheme: true,
            spaceOnly: true,
            earlyBirdDiscount: 10
        },
        registrationInfo: {
            visitorRegistration: {
                opens: tradeShow.startDate,
                closes: tradeShow.endDate,
                fee: 0,
                currency: 'USD',
                freeOptions: ['Online Registration', 'Group Discounts']
            },
            exhibitorRegistration: {
                opens: tradeShow.startDate,
                closes: tradeShow.startDate,
                fee: 500,
                currency: tradeShow.costs.standRental.currency,
                requirements: ['Valid Business License', 'Insurance Coverage']
            },
            deadlines: {
                earlyBird: tradeShow.startDate,
                final: tradeShow.startDate,
                onSite: true
            }
        },
        sustainability: {
            carbonNeutral: dbData.sustainability?.includes('Carbon Neutral') || true,
            wasteReduction: dbData.sustainability?.includes('Waste Reduction') || true,
            digitalFirst: dbData.sustainability?.includes('Digital First') || true,
            sustainableCatering: dbData.sustainability?.includes('Sustainable Catering') || true,
            publicTransportIncentives: dbData.sustainability?.includes('Public Transport') || true,
            environmentalGoals: dbData.environmental_goals || ['Carbon Neutral', 'Zero Waste'],
            greenCertifications: ['LEED Certified', 'ISO 14001']
        },
        networkingOpportunities: tradeShow.networkingOpportunities || [],
        specialEvents: [],
        hallsUsed: tradeShow.venue.hallCount || 10,
        images: dbData.hero_image_url ? [dbData.hero_image_url] : ['/images/exhibitions/default-1.jpg'],
        logo: '/images/exhibitions/default-logo.png',
        socialMedia: {
            website: tradeShow.website,
            hashtag: `#${tradeShow.slug.replace(/-/g, '')}`
        },
        contactInfo: {
            generalInfo: tradeShow.organizerContact || 'info@organizer.com',
            exhibitorServices: tradeShow.organizerContact || 'info@organizer.com',
            visitorServices: tradeShow.organizerContact || 'info@organizer.com',
            media: tradeShow.organizerContact || 'info@organizer.com',
            emergencyContact: '+1-555-0123'
        },
        linkedVendors: [],
        previousEditions: [],
        accessibility: {
            wheelchairAccessible: true,
            assistedListening: true,
            signLanguage: false,
            brailleSignage: true,
            accessibleParking: true,
            services: ['Wheelchair access', 'Accessible restrooms']
        },
        covid19Measures: ['Enhanced cleaning', 'Health screening'],
        awards: [],
        mediaPartners: [],
        sponsorshipLevels: [],
        newEvent: false
    };
}
