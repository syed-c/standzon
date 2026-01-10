import { TradeShowDB } from "@/lib/supabase/types/tradeShows";
import { TradeShow, Venue, CostBreakdown } from "@/lib/data/tradeShows";
import { Industry } from "@/lib/data/industries";
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
        industries: (() => {
            const rawTags = dbData.tags;
            let tags: string[] = [];
            if (Array.isArray(rawTags)) {
                tags = rawTags;
            } else if (typeof rawTags === 'string' && (rawTags as string).startsWith('{') && (rawTags as string).endsWith('}')) {
                // Handle Postgres array format {tag1,tag2}
                tags = (rawTags as string).replace(/{|}/g, '').split(',').map((t: string) => t.trim().replace(/^"|"$/g, ''));
            } else if (typeof rawTags === 'string') {
                tags = [rawTags];
            }

            return (tags || []).filter(Boolean).map(tag => ({
                id: tag.toLowerCase().replace(/\s+/g, '-'),
                name: tag,
                slug: tag.toLowerCase().replace(/\s+/g, '-'),
                description: "",
                subcategories: [],
                color: "#3B82F6", // Default color
                icon: "📊",
                annualGrowthRate: 0,
                averageBoothCost: 0,
                popularCountries: [],
            }));
        })(),
        description: dbData.long_description || dbData.short_description || "",
        website: dbData.organizer_website || "",
        expectedVisitors: Number(dbData.expected_attendees) || 0,
        expectedExhibitors: Number(dbData.exhibitors_count) || 0,
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
                min: Number(dbData.booth_pricing_min) || 0,
                max: Number(dbData.booth_pricing_max) || 0,
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
            email: 'info@organizer.com',
            phone: '+1-555-0123',
            website: tradeShow.website,
            headquarters: tradeShow.city,
            establishedYear: 2000,
            rating: Number(dbData.organizer_rating) || 4.2,
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
                min: Number(dbData.booth_pricing_min) || 0,
                max: Number(dbData.booth_pricing_max) || 0,
                currency: dbData.booth_pricing_currency || "USD",
                unit: "sqm"
            },
            premiumBooth: {
                min: Math.round((Number(dbData.booth_pricing_max) || 0) * 1.5),
                max: Math.round((Number(dbData.booth_pricing_max) || 0) * 2),
                currency: dbData.booth_pricing_currency || "USD",
                unit: "sqm"
            },
            cornerBooth: {
                min: Math.round((Number(dbData.booth_pricing_max) || 0) * 1.2),
                max: Math.round((Number(dbData.booth_pricing_max) || 0) * 1.8),
                currency: dbData.booth_pricing_currency || "USD",
                unit: "sqm"
            },
            islandBooth: {
                min: Math.round((Number(dbData.booth_pricing_max) || 0) * 2),
                max: Math.round((Number(dbData.booth_pricing_max) || 0) * 3),
                currency: dbData.booth_pricing_currency || "USD",
                unit: "sqm"
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
                closes: dbData.exhibitor_registration_deadline || tradeShow.startDate,
                fee: 0,
                currency: dbData.booth_pricing_currency || 'USD',
                requirements: ['Valid Business License', 'Insurance Coverage']
            },
            deadlines: {
                earlyBird: tradeShow.startDate,
                final: dbData.exhibitor_registration_deadline || tradeShow.startDate,
                onSite: true
            }
        },
        sustainability: {
            carbonNeutral: dbData.sustainability?.some(s => s.toLowerCase().includes('carbon neutral')) || false,
            wasteReduction: dbData.sustainability?.some(s => s.toLowerCase().includes('waste')) || false,
            digitalFirst: dbData.sustainability?.some(s => s.toLowerCase().includes('digital')) || false,
            sustainableCatering: dbData.sustainability?.some(s => s.toLowerCase().includes('catering')) || false,
            publicTransportIncentives: dbData.sustainability?.some(s => s.toLowerCase().includes('transport')) || false,
            environmentalGoals: dbData.environmental_goals || [],
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
