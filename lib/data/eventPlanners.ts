// GLOBAL EVENT PLANNERS DATABASE
// Complete directory of event planners worldwide with all subcategories

export interface EventPlannerSpecialization {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface EventPlanner {
  id: string;
  companyName: string;
  slug: string;
  companyDescription: string;
  rating: number;
  reviewCount: number;
  eventsCompleted: number;
  establishedYear: number;
  headquarters: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  serviceLocations: Array<{
    country: string;
    cities: string[];
    isFullCountryCoverage: boolean;
  }>;
  specializations: EventPlannerSpecialization[];
  teamSize: number;
  responseTime: string;
  minimumBudget: number;
  maximumCapacity: number;
  yearlyEvents: number;
  languages: string[];
  certifications: string[];
  keyStrengths: string[];
  portfolio: Array<{
    eventName: string;
    eventType: string;
    location: string;
    attendees: number;
    year: number;
    description: string;
    budget: string;
    client: string;
  }>;
  services: Array<{
    name: string;
    description: string;
    startingPrice: string;
  }>;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
    socialMedia: {
      linkedin?: string;
      instagram?: string;
      facebook?: string;
      twitter?: string;
      xing?: string;
    };
  };
  verified: boolean;
  premiumMember: boolean;
  lastActiveDate: string;
  joinedDate: string;
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  emergencySupport: boolean;
  insuranceCoverage: boolean;
}

// EVENT PLANNER SPECIALIZATIONS
export const eventPlannerSpecializations: EventPlannerSpecialization[] = [
  {
    id: 'corporate-events',
    name: 'Corporate Event Planner',
    slug: 'corporate-events',
    icon: '🏢',
    color: '#2563EB',
    description: 'Professional corporate events, conferences, team building, product launches'
  },
  {
    id: 'wedding-events',
    name: 'Wedding Event Planner',
    slug: 'wedding-events', 
    icon: '💒',
    color: '#EC4899',
    description: 'Luxury weddings, engagement parties, bridal showers, anniversary celebrations'
  },
  {
    id: 'social-events',
    name: 'Social Event Organizer',
    slug: 'social-events',
    icon: '🎉',
    color: '#10B981',
    description: 'Social gatherings, networking events, charity fundraisers, community events'
  },
  {
    id: 'birthday-parties',
    name: 'Birthday Party Planner',
    slug: 'birthday-parties',
    icon: '🎂',
    color: '#F59E0B',
    description: 'Birthday celebrations, milestone parties, themed events, kids parties'
  },
  {
    id: 'private-events',
    name: 'Private Event Coordinator',
    slug: 'private-events',
    icon: '🏡',
    color: '#8B5CF6',
    description: 'Private parties, intimate gatherings, family celebrations, exclusive events'
  },
  {
    id: 'conference-seminars',
    name: 'Conference & Seminar Planner',
    slug: 'conference-seminars',
    icon: '🎤',
    color: '#EF4444',
    description: 'Business conferences, educational seminars, workshops, symposiums'
  },
  {
    id: 'festival-production',
    name: 'Festival/Event Production',
    slug: 'festival-production',
    icon: '🎪',
    color: '#06B6D4',
    description: 'Large festivals, concerts, exhibitions, outdoor events, entertainment production'
  }
];

// GLOBAL EVENT PLANNERS DATA
export const eventPlanners: EventPlanner[] = [
  // UNITED STATES
  {
    id: 'elite-corporate-events-nyc',
    companyName: 'Elite Corporate Events NYC',
    slug: 'elite-corporate-events-nyc',
    companyDescription: 'Premier corporate event planning company specializing in Fortune 500 conferences, product launches, and executive retreats across New York and nationwide.',
    rating: 4.9,
    reviewCount: 127,
    eventsCompleted: 450,
    establishedYear: 2012,
    headquarters: {
      address: '1247 Broadway, Suite 300',
      city: 'New York',
      country: 'United States',
      postalCode: '10001',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    serviceLocations: [
      { country: 'United States', cities: ['New York', 'Boston', 'Philadelphia', 'Washington D.C.'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[0], // Corporate
      eventPlannerSpecializations[5]  // Conference
    ],
    teamSize: 25,
    responseTime: '2 hours',
    minimumBudget: 15000,
    maximumCapacity: 5000,
    yearlyEvents: 85,
    languages: ['English', 'Spanish'],
    certifications: ['CMP (Certified Meeting Professional)', 'CSEP (Certified Special Events Professional)'],
    keyStrengths: ['Fortune 500 Experience', 'Venue Sourcing', 'A/V Technology', 'VIP Management'],
    portfolio: [
      {
        eventName: 'Microsoft Annual Conference 2024',
        eventType: 'Corporate Conference',
        location: 'New York, NY',
        attendees: 2500,
        year: 2024,
        description: 'Three-day technology conference with keynotes, breakout sessions, and networking events',
        budget: '$350K - $500K',
        client: 'Microsoft Corporation'
      }
    ],
    services: [
      { name: 'Corporate Conference Planning', description: 'Full-service conference management', startingPrice: '$25,000' },
      { name: 'Product Launch Events', description: 'Brand activations and product reveals', startingPrice: '$35,000' },
      { name: 'Executive Retreats', description: 'Exclusive C-level gatherings', startingPrice: '$40,000' }
    ],
    contactInfo: {
      phone: '+1 (212) 555-0101',
      email: 'info@elitecorporateevents.com',
      website: 'https://elitecorporateevents.com',
      socialMedia: {
        linkedin: 'elite-corporate-events',
        instagram: '@elitecorporateevents'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-20',
    joinedDate: '2023-01-15',
    businessHours: {
      monday: { open: '8:00', close: '18:00' },
      tuesday: { open: '8:00', close: '18:00' },
      wednesday: { open: '8:00', close: '18:00' },
      thursday: { open: '8:00', close: '18:00' },
      friday: { open: '8:00', close: '18:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  {
    id: 'dream-weddings-la',
    companyName: 'Dream Weddings Los Angeles',
    slug: 'dream-weddings-la',
    companyDescription: 'Luxury wedding planners creating unforgettable celebrations with personalized service, stunning venues, and exquisite attention to detail.',
    rating: 4.8,
    reviewCount: 89,
    eventsCompleted: 275,
    establishedYear: 2015,
    headquarters: {
      address: '8942 Wilshire Blvd, Suite 200',
      city: 'Los Angeles',
      country: 'United States',
      postalCode: '90211',
      coordinates: { lat: 34.0669, lng: -118.3758 }
    },
    serviceLocations: [
      { country: 'United States', cities: ['Los Angeles', 'San Diego', 'San Francisco', 'Las Vegas'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[4]  // Private Events
    ],
    teamSize: 18,
    responseTime: '4 hours',
    minimumBudget: 25000,
    maximumCapacity: 800,
    yearlyEvents: 45,
    languages: ['English', 'Spanish'],
    certifications: ['CWEP (Certified Wedding & Event Planner)'],
    keyStrengths: ['Luxury Venues', 'Vendor Network', 'Destination Weddings', 'Cultural Ceremonies'],
    portfolio: [
      {
        eventName: 'Celebrity Wedding at Four Seasons',
        eventType: 'Luxury Wedding',
        location: 'Beverly Hills, CA',
        attendees: 350,
        year: 2024,
        description: 'Three-day wedding celebration with welcome party, ceremony, and reception',
        budget: '$150K - $300K',
        client: 'Private Celebrity Client'
      }
    ],
    services: [
      { name: 'Full Wedding Planning', description: 'Complete wedding coordination from start to finish', startingPrice: '$8,000' },
      { name: 'Destination Weddings', description: 'International and domestic destination celebrations', startingPrice: '$15,000' },
      { name: 'Elopement Planning', description: 'Intimate wedding ceremonies', startingPrice: '$3,500' }
    ],
    contactInfo: {
      phone: '+1 (310) 555-0202',
      email: 'hello@dreamweddingsla.com',
      website: 'https://dreamweddingsla.com',
      socialMedia: {
        instagram: '@dreamweddingsla',
        facebook: 'dreamweddingsla'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-19',
    joinedDate: '2023-03-10',
    businessHours: {
      tuesday: { open: '10:00', close: '19:00' },
      wednesday: { open: '10:00', close: '19:00' },
      thursday: { open: '10:00', close: '19:00' },
      friday: { open: '10:00', close: '19:00' },
      saturday: { open: '10:00', close: '16:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // UNITED KINGDOM
  {
    id: 'london-event-specialists',
    companyName: 'London Event Specialists',
    slug: 'london-event-specialists',
    companyDescription: 'Award-winning event planning agency delivering exceptional corporate and social events across London and the UK with 15+ years of expertise.',
    rating: 4.7,
    reviewCount: 156,
    eventsCompleted: 680,
    establishedYear: 2009,
    headquarters: {
      address: '42 Covent Garden, WC2E 8RF',
      city: 'London',
      country: 'United Kingdom',
      postalCode: 'WC2E 8RF',
      coordinates: { lat: 51.5118, lng: -0.1226 }
    },
    serviceLocations: [
      { country: 'United Kingdom', cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham'], isFullCountryCoverage: true }
    ],
    specializations: [
      eventPlannerSpecializations[0], // Corporate
      eventPlannerSpecializations[2], // Social
      eventPlannerSpecializations[5]  // Conference
    ],
    teamSize: 32,
    responseTime: '1 hour',
    minimumBudget: 12000,
    maximumCapacity: 3000,
    yearlyEvents: 120,
    languages: ['English', 'French', 'German'],
    certifications: ['AEME Certified', 'EVCOM Member'],
    keyStrengths: ['Historic Venues', 'Royal Events', 'International Clients', 'Sustainability Focus'],
    portfolio: [
      {
        eventName: 'Tech Innovation Summit 2024',
        eventType: 'Corporate Conference',
        location: 'London, UK',
        attendees: 1200,
        year: 2024,
        description: 'Two-day technology summit with international speakers and exhibitions',
        budget: '£180K - £250K',
        client: 'UK Tech Association'
      }
    ],
    services: [
      { name: 'Corporate Events', description: 'Business conferences and corporate celebrations', startingPrice: '£15,000' },
      { name: 'Gala Dinners', description: 'Prestigious award ceremonies and fundraising galas', startingPrice: '£25,000' },
      { name: 'Product Launches', description: 'Brand activations and media events', startingPrice: '£20,000' }
    ],
    contactInfo: {
      phone: '+44 20 7946 0958',
      email: 'enquiries@londoneventspecialists.co.uk',
      website: 'https://londoneventspecialists.co.uk',
      socialMedia: {
        linkedin: 'london-event-specialists',
        twitter: '@londonevents'
      }
    },
    verified: true,
    premiumMember: false,
    lastActiveDate: '2024-12-18',
    joinedDate: '2023-02-20',
    businessHours: {
      monday: { open: '9:00', close: '17:30' },
      tuesday: { open: '9:00', close: '17:30' },
      wednesday: { open: '9:00', close: '17:30' },
      thursday: { open: '9:00', close: '17:30' },
      friday: { open: '9:00', close: '17:30' }
    },
    emergencySupport: false,
    insuranceCoverage: true
  },

  // GERMANY
  {
    id: 'berlin-conference-masters',
    companyName: 'Berlin Conference Masters',
    slug: 'berlin-conference-masters',
    companyDescription: 'Leading conference and seminar organizers in Germany, specializing in international business events, trade conferences, and educational symposiums.',
    rating: 4.6,
    reviewCount: 94,
    eventsCompleted: 380,
    establishedYear: 2011,
    headquarters: {
      address: 'Potsdamer Platz 10, 10785',
      city: 'Berlin',
      country: 'Germany',
      postalCode: '10785',
      coordinates: { lat: 52.5096, lng: 13.3761 }
    },
    serviceLocations: [
      { country: 'Germany', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'], isFullCountryCoverage: true },
      { country: 'Austria', cities: ['Vienna'], isFullCountryCoverage: false },
      { country: 'Switzerland', cities: ['Zurich'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[5], // Conference
      eventPlannerSpecializations[0]  // Corporate
    ],
    teamSize: 20,
    responseTime: '3 hours',
    minimumBudget: 18000,
    maximumCapacity: 2500,
    yearlyEvents: 65,
    languages: ['German', 'English', 'French'],
    certifications: ['MICE Certified', 'German Event Association Member'],
    keyStrengths: ['Technical Conferences', 'Multilingual Support', 'EU Compliance', 'Innovation Focus'],
    portfolio: [
      {
        eventName: 'European AI Conference 2024',
        eventType: 'Technology Conference',
        location: 'Berlin, Germany',
        attendees: 1800,
        year: 2024,
        description: 'Three-day artificial intelligence conference with workshops and exhibitions',
        budget: '€220K - €350K',
        client: 'European Tech Alliance'
      }
    ],
    services: [
      { name: 'Business Conferences', description: 'Professional conferences and symposiums', startingPrice: '€22,000' },
      { name: 'Trade Seminars', description: 'Industry-specific educational seminars', startingPrice: '€18,000' },
      { name: 'International Events', description: 'Cross-border business gatherings', startingPrice: '€35,000' }
    ],
    contactInfo: {
      phone: '+49 30 12345678',
      email: 'info@berlinconferencemasters.de',
      website: 'https://berlinconferencemasters.de',
      socialMedia: {
        linkedin: 'berlin-conference-masters',
        xing: 'berlin-conference-masters'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-17',
    joinedDate: '2023-04-05',
    businessHours: {
      monday: { open: '8:30', close: '17:00' },
      tuesday: { open: '8:30', close: '17:00' },
      wednesday: { open: '8:30', close: '17:00' },
      thursday: { open: '8:30', close: '17:00' },
      friday: { open: '8:30', close: '16:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // DUBAI, UAE
  {
    id: 'dubai-luxury-events',
    companyName: 'Dubai Luxury Events',
    slug: 'dubai-luxury-events',
    companyDescription: 'Premium event planning company in Dubai specializing in high-end corporate events, luxury weddings, and exclusive private celebrations in the Middle East.',
    rating: 4.9,
    reviewCount: 78,
    eventsCompleted: 195,
    establishedYear: 2016,
    headquarters: {
      address: 'Business Bay, Level 42, Burj Al Arab Tower',
      city: 'Dubai',
      country: 'United Arab Emirates',
      postalCode: '00000',
      coordinates: { lat: 25.1972, lng: 55.2744 }
    },
    serviceLocations: [
      { country: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'], isFullCountryCoverage: true },
      { country: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah'], isFullCountryCoverage: false },
      { country: 'Qatar', cities: ['Doha'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[4], // Private Events
      eventPlannerSpecializations[0]  // Corporate
    ],
    teamSize: 15,
    responseTime: '1 hour',
    minimumBudget: 35000,
    maximumCapacity: 1500,
    yearlyEvents: 35,
    languages: ['English', 'Arabic', 'Hindi'],
    certifications: ['UAE Event Specialist', 'International Wedding Planner'],
    keyStrengths: ['Luxury Venues', '5-Star Hotels', 'VIP Services', 'Cultural Events'],
    portfolio: [
      {
        eventName: 'Royal Wedding at Atlantis',
        eventType: 'Luxury Wedding',
        location: 'Dubai, UAE',
        attendees: 500,
        year: 2024,
        description: 'Extravagant three-day wedding celebration with traditional and modern elements',
        budget: '$200K - $500K',
        client: 'Private Royal Family'
      }
    ],
    services: [
      { name: 'Luxury Weddings', description: '5-star wedding planning with premium venues', startingPrice: '$50,000' },
      { name: 'Corporate Galas', description: 'High-end business events and award ceremonies', startingPrice: '$40,000' },
      { name: 'Private Celebrations', description: 'Exclusive parties and milestone events', startingPrice: '$25,000' }
    ],
    contactInfo: {
      phone: '+971 4 123 4567',
      email: 'info@dubailuxuryevents.ae',
      website: 'https://dubailuxuryevents.ae',
      socialMedia: {
        instagram: '@dubailuxuryevents',
        linkedin: 'dubai-luxury-events'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-20',
    joinedDate: '2023-06-12',
    businessHours: {
      sunday: { open: '9:00', close: '18:00' },
      monday: { open: '9:00', close: '18:00' },
      tuesday: { open: '9:00', close: '18:00' },
      wednesday: { open: '9:00', close: '18:00' },
      thursday: { open: '9:00', close: '18:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // SINGAPORE
  {
    id: 'singapore-festival-productions',
    companyName: 'Singapore Festival Productions',
    slug: 'singapore-festival-productions',
    companyDescription: 'Southeast Asia\'s premier festival and large-scale event production company, creating memorable experiences from music festivals to cultural celebrations.',
    rating: 4.8,
    reviewCount: 112,
    eventsCompleted: 420,
    establishedYear: 2010,
    headquarters: {
      address: '1 Marina Bay Sands, Level 20',
      city: 'Singapore',
      country: 'Singapore',
      postalCode: '018956',
      coordinates: { lat: 1.2834, lng: 103.8607 }
    },
    serviceLocations: [
      { country: 'Singapore', cities: ['Singapore'], isFullCountryCoverage: true },
      { country: 'Malaysia', cities: ['Kuala Lumpur', 'Johor Bahru'], isFullCountryCoverage: false },
      { country: 'Thailand', cities: ['Bangkok'], isFullCountryCoverage: false },
      { country: 'Indonesia', cities: ['Jakarta'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[6], // Festival Production
      eventPlannerSpecializations[2]  // Social Events
    ],
    teamSize: 45,
    responseTime: '2 hours',
    minimumBudget: 50000,
    maximumCapacity: 15000,
    yearlyEvents: 25,
    languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    certifications: ['Singapore Events Certified', 'ASEAN Production License'],
    keyStrengths: ['Large Scale Production', 'Cultural Events', 'Government Relations', 'Multi-Country Experience'],
    portfolio: [
      {
        eventName: 'Singapore Music Festival 2024',
        eventType: 'Music Festival',
        location: 'Marina Bay, Singapore',
        attendees: 12000,
        year: 2024,
        description: 'Three-day international music festival with multiple stages and food courts',
        budget: '$800K - $1.2M',
        client: 'Singapore Tourism Board'
      }
    ],
    services: [
      { name: 'Music Festivals', description: 'Large-scale music event production', startingPrice: '$150,000' },
      { name: 'Cultural Celebrations', description: 'Traditional and cultural event organization', startingPrice: '$80,000' },
      { name: 'Corporate Festivals', description: 'Brand activation festivals and exhibitions', startingPrice: '$120,000' }
    ],
    contactInfo: {
      phone: '+65 6123 4567',
      email: 'hello@sgfestivalproductions.sg',
      website: 'https://sgfestivalproductions.sg',
      socialMedia: {
        instagram: '@sgfestivalproductions',
        facebook: 'sgfestivalproductions'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-19',
    joinedDate: '2023-01-30',
    businessHours: {
      monday: { open: '9:00', close: '18:00' },
      tuesday: { open: '9:00', close: '18:00' },
      wednesday: { open: '9:00', close: '18:00' },
      thursday: { open: '9:00', close: '18:00' },
      friday: { open: '9:00', close: '17:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // EXPANDED MIDDLE EAST & GCC COUNTRIES
  
  // RAS AL KHAIMAH, UAE
  {
    id: 'rak-elite-events',
    companyName: 'RAK Elite Events',
    slug: 'rak-elite-events',
    companyDescription: 'Premier event planning company in Ras Al Khaimah specializing in luxury weddings, corporate events, and cultural celebrations with stunning mountain and beach venues.',
    rating: 4.7,
    reviewCount: 56,
    eventsCompleted: 165,
    establishedYear: 2018,
    headquarters: {
      address: 'Al Hamra Village, RAK Tower, Level 15',
      city: 'Ras Al Khaimah',
      country: 'United Arab Emirates',
      postalCode: '00000',
      coordinates: { lat: 25.6947, lng: 55.7703 }
    },
    serviceLocations: [
      { country: 'United Arab Emirates', cities: ['Ras Al Khaimah', 'Dubai', 'Sharjah', 'Fujairah'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[0], // Corporate
      eventPlannerSpecializations[4]  // Private Events
    ],
    teamSize: 12,
    responseTime: '2 hours',
    minimumBudget: 25000,
    maximumCapacity: 800,
    yearlyEvents: 28,
    languages: ['English', 'Arabic', 'Hindi', 'Urdu'],
    certifications: ['UAE Tourism Certified', 'Destination Wedding Specialist'],
    keyStrengths: ['Beach Venues', 'Mountain Resorts', 'Cultural Events', 'Destination Weddings'],
    portfolio: [
      {
        eventName: 'Royal Beach Wedding at Waldorf Astoria',
        eventType: 'Luxury Beach Wedding',
        location: 'Ras Al Khaimah, UAE',
        attendees: 300,
        year: 2024,
        description: 'Spectacular beachfront wedding with traditional and modern Arabian elements',
        budget: '$80K - $150K',
        client: 'International Royal Family'
      }
    ],
    services: [
      { name: 'Destination Beach Weddings', description: 'Luxury beachfront wedding planning', startingPrice: '$35,000' },
      { name: 'Mountain Resort Events', description: 'Exclusive mountain venue celebrations', startingPrice: '$30,000' },
      { name: 'Cultural Heritage Events', description: 'Traditional Arabian celebrations', startingPrice: '$25,000' }
    ],
    contactInfo: {
      phone: '+971 7 244 5555',
      email: 'info@rakeliteevents.ae',
      website: 'https://rakeliteevents.ae',
      socialMedia: {
        instagram: '@rakeliteevents',
        linkedin: 'rak-elite-events'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-20',
    joinedDate: '2023-08-15',
    businessHours: {
      sunday: { open: '9:00', close: '18:00' },
      monday: { open: '9:00', close: '18:00' },
      tuesday: { open: '9:00', close: '18:00' },
      wednesday: { open: '9:00', close: '18:00' },
      thursday: { open: '9:00', close: '18:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // OMAN
  {
    id: 'muscat-royal-celebrations',
    companyName: 'Muscat Royal Celebrations',
    slug: 'muscat-royal-celebrations',
    companyDescription: 'Oman\'s leading luxury event planning company specializing in royal celebrations, corporate galas, and traditional Omani cultural events.',
    rating: 4.8,
    reviewCount: 42,
    eventsCompleted: 85,
    establishedYear: 2017,
    headquarters: {
      address: 'Qurum Business District, Muscat Grand Mall, Suite 401',
      city: 'Muscat',
      country: 'Oman',
      postalCode: '112',
      coordinates: { lat: 23.5859, lng: 58.4059 }
    },
    serviceLocations: [
      { country: 'Oman', cities: ['Muscat', 'Salalah', 'Nizwa'], isFullCountryCoverage: true }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[0], // Corporate
      eventPlannerSpecializations[2]  // Social Events
    ],
    teamSize: 8,
    responseTime: '3 hours',
    minimumBudget: 20000,
    maximumCapacity: 600,
    yearlyEvents: 18,
    languages: ['Arabic', 'English', 'Hindi'],
    certifications: ['Oman Tourism Certified', 'Cultural Events Specialist'],
    keyStrengths: ['Royal Protocol', 'Traditional Ceremonies', 'Desert Venues', 'Palace Events'],
    portfolio: [
      {
        eventName: 'Sultan\'s Golden Jubilee Corporate Gala',
        eventType: 'Corporate Gala',
        location: 'Muscat, Oman',
        attendees: 500,
        year: 2024,
        description: 'Grand corporate celebration honoring 50 years of business excellence',
        budget: '$60K - $120K',
        client: 'Omani Conglomerate'
      }
    ],
    services: [
      { name: 'Royal Celebrations', description: 'High-end royal and VIP events', startingPrice: '$40,000' },
      { name: 'Traditional Omani Weddings', description: 'Authentic cultural wedding ceremonies', startingPrice: '$25,000' },
      { name: 'Corporate Desert Events', description: 'Unique desert venue experiences', startingPrice: '$30,000' }
    ],
    contactInfo: {
      phone: '+968 24 123 456',
      email: 'events@muscatroyalcelebrations.om',
      website: 'https://muscatroyalcelebrations.om',
      socialMedia: {
        instagram: '@muscatroyalcelebrations',
        linkedin: 'muscat-royal-celebrations'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-19',
    joinedDate: '2023-07-20',
    businessHours: {
      sunday: { open: '8:00', close: '17:00' },
      monday: { open: '8:00', close: '17:00' },
      tuesday: { open: '8:00', close: '17:00' },
      wednesday: { open: '8:00', close: '17:00' },
      thursday: { open: '8:00', close: '17:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // KUWAIT
  {
    id: 'kuwait-platinum-events',
    companyName: 'Kuwait Platinum Events',
    slug: 'kuwait-platinum-events',
    companyDescription: 'Kuwait\'s premier event planning company delivering exceptional corporate conferences, luxury weddings, and exclusive social gatherings.',
    rating: 4.6,
    reviewCount: 38,
    eventsCompleted: 95,
    establishedYear: 2016,
    headquarters: {
      address: 'Sharq, Al Hamra Tower, Level 32',
      city: 'Kuwait City',
      country: 'Kuwait',
      postalCode: '15301',
      coordinates: { lat: 29.3759, lng: 47.9774 }
    },
    serviceLocations: [
      { country: 'Kuwait', cities: ['Kuwait City'], isFullCountryCoverage: true }
    ],
    specializations: [
      eventPlannerSpecializations[0], // Corporate
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[5]  // Conference
    ],
    teamSize: 10,
    responseTime: '2 hours',
    minimumBudget: 30000,
    maximumCapacity: 1000,
    yearlyEvents: 22,
    languages: ['Arabic', 'English'],
    certifications: ['Kuwait Chamber of Commerce Member', 'GCC Events Certified'],
    keyStrengths: ['Corporate Excellence', 'VIP Protocol', 'Government Relations', 'Luxury Venues'],
    portfolio: [
      {
        eventName: 'Kuwait Oil & Gas Summit 2024',
        eventType: 'Corporate Conference',
        location: 'Kuwait City, Kuwait',
        attendees: 800,
        year: 2024,
        description: 'Three-day international energy conference with government officials',
        budget: '$120K - $200K',
        client: 'Kuwait Petroleum Corporation'
      }
    ],
    services: [
      { name: 'Corporate Conferences', description: 'High-level business conferences', startingPrice: '$50,000' },
      { name: 'Government Protocol Events', description: 'Official state and diplomatic events', startingPrice: '$60,000' },
      { name: 'Luxury Kuwaiti Weddings', description: 'Traditional and modern wedding celebrations', startingPrice: '$40,000' }
    ],
    contactInfo: {
      phone: '+965 2220 5555',
      email: 'info@kuwaitplatinumevents.com',
      website: 'https://kuwaitplatinumevents.com',
      socialMedia: {
        linkedin: 'kuwait-platinum-events',
        instagram: '@kuwaitplatinumevents'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-18',
    joinedDate: '2023-05-10',
    businessHours: {
      sunday: { open: '8:30', close: '17:30' },
      monday: { open: '8:30', close: '17:30' },
      tuesday: { open: '8:30', close: '17:30' },
      wednesday: { open: '8:30', close: '17:30' },
      thursday: { open: '8:30', close: '16:30' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // BAHRAIN
  {
    id: 'bahrain-pearl-events',
    companyName: 'Bahrain Pearl Events',
    slug: 'bahrain-pearl-events',
    companyDescription: 'Bahrain\'s exclusive event planning boutique specializing in intimate luxury celebrations, corporate events, and traditional Gulf weddings.',
    rating: 4.7,
    reviewCount: 29,
    eventsCompleted: 68,
    establishedYear: 2019,
    headquarters: {
      address: 'Diplomatic Area, World Trade Center, Suite 1205',
      city: 'Manama',
      country: 'Bahrain',
      postalCode: '317',
      coordinates: { lat: 26.2361, lng: 50.5831 }
    },
    serviceLocations: [
      { country: 'Bahrain', cities: ['Manama'], isFullCountryCoverage: true }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[4], // Private Events
      eventPlannerSpecializations[0]  // Corporate
    ],
    teamSize: 6,
    responseTime: '1 hour',
    minimumBudget: 15000,
    maximumCapacity: 400,
    yearlyEvents: 15,
    languages: ['Arabic', 'English', 'Hindi'],
    certifications: ['Bahrain Tourism Authority Certified', 'Gulf Wedding Specialist'],
    keyStrengths: ['Intimate Celebrations', 'Pearl Themes', 'Banking Sector Events', 'Cultural Fusion'],
    portfolio: [
      {
        eventName: 'Banking Excellence Awards Gala',
        eventType: 'Corporate Awards',
        location: 'Manama, Bahrain',
        attendees: 250,
        year: 2024,
        description: 'Elegant awards ceremony for Gulf banking sector',
        budget: '$35K - $60K',
        client: 'Bahrain Banking Association'
      }
    ],
    services: [
      { name: 'Gulf Traditional Weddings', description: 'Authentic Bahraini wedding ceremonies', startingPrice: '$20,000' },
      { name: 'Banking Sector Events', description: 'Financial industry conferences and galas', startingPrice: '$25,000' },
      { name: 'Pearl-themed Celebrations', description: 'Unique pearl-inspired luxury events', startingPrice: '$18,000' }
    ],
    contactInfo: {
      phone: '+973 1700 8888',
      email: 'events@bahrainpearlevents.bh',
      website: 'https://bahrainpearlevents.bh',
      socialMedia: {
        instagram: '@bahrainpearlevents',
        linkedin: 'bahrain-pearl-events'
      }
    },
    verified: true,
    premiumMember: false,
    lastActiveDate: '2024-12-17',
    joinedDate: '2023-09-25',
    businessHours: {
      sunday: { open: '9:00', close: '17:00' },
      monday: { open: '9:00', close: '17:00' },
      tuesday: { open: '9:00', close: '17:00' },
      wednesday: { open: '9:00', close: '17:00' },
      thursday: { open: '9:00', close: '16:00' }
    },
    emergencySupport: false,
    insuranceCoverage: true
  },

  // ADDITIONAL EUROPEAN EVENT PLANNERS

  // PARIS, FRANCE
  {
    id: 'paris-elegance-events',
    companyName: 'Paris Elegance Events',
    slug: 'paris-elegance-events',
    companyDescription: 'Luxury Parisian event planning company specializing in haute couture weddings, fashion events, and exclusive corporate galas in the city of lights.',
    rating: 4.9,
    reviewCount: 86,
    eventsCompleted: 185,
    establishedYear: 2014,
    headquarters: {
      address: '16 Avenue des Champs-Élysées, 8th Arrondissement',
      city: 'Paris',
      country: 'France',
      postalCode: '75008',
      coordinates: { lat: 48.8698, lng: 2.3076 }
    },
    serviceLocations: [
      { country: 'France', cities: ['Paris', 'Cannes', 'Lyon', 'Nice', 'Bordeaux'], isFullCountryCoverage: false },
      { country: 'Monaco', cities: ['Monaco'], isFullCountryCoverage: true }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[4], // Private Events
      eventPlannerSpecializations[0]  // Corporate
    ],
    teamSize: 22,
    responseTime: '1 hour',
    minimumBudget: 45000,
    maximumCapacity: 600,
    yearlyEvents: 32,
    languages: ['French', 'English', 'Italian'],
    certifications: ['French Wedding Guild', 'Luxury Events International'],
    keyStrengths: ['Palace Venues', 'Fashion Events', 'Michelin Star Catering', 'Artistic Direction'],
    portfolio: [
      {
        eventName: 'Chanel Fashion Week After-Party',
        eventType: 'Corporate Fashion Event',
        location: 'Paris, France',
        attendees: 400,
        year: 2024,
        description: 'Exclusive fashion industry celebration at historic Parisian venue',
        budget: '€180K - €300K',
        client: 'International Fashion House'
      }
    ],
    services: [
      { name: 'Château Weddings', description: 'Luxury castle and château celebrations', startingPrice: '€65,000' },
      { name: 'Fashion Events', description: 'High-end fashion industry events', startingPrice: '€55,000' },
      { name: 'Parisian Corporate Galas', description: 'Elegant business celebrations', startingPrice: '€50,000' }
    ],
    contactInfo: {
      phone: '+33 1 42 86 55 55',
      email: 'bonjour@pariseleganceevents.fr',
      website: 'https://pariseleganceevents.fr',
      socialMedia: {
        instagram: '@pariseleganceevents',
        linkedin: 'paris-elegance-events'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-20',
    joinedDate: '2023-03-15',
    businessHours: {
      monday: { open: '9:30', close: '18:30' },
      tuesday: { open: '9:30', close: '18:30' },
      wednesday: { open: '9:30', close: '18:30' },
      thursday: { open: '9:30', close: '18:30' },
      friday: { open: '9:30', close: '17:30' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // MILAN, ITALY
  {
    id: 'milano-luxury-weddings',
    companyName: 'Milano Luxury Weddings',
    slug: 'milano-luxury-weddings',
    companyDescription: 'Italy\'s premier luxury wedding and event planning company, creating unforgettable celebrations in Milan\'s most prestigious venues and historic villas.',
    rating: 4.8,
    reviewCount: 74,
    eventsCompleted: 155,
    establishedYear: 2013,
    headquarters: {
      address: 'Via Montenapoleone 12, Quadrilatero della Moda',
      city: 'Milan',
      country: 'Italy',
      postalCode: '20121',
      coordinates: { lat: 45.4685, lng: 9.1917 }
    },
    serviceLocations: [
      { country: 'Italy', cities: ['Milan', 'Rome', 'Florence', 'Venice', 'Lake Como'], isFullCountryCoverage: false }
    ],
    specializations: [
      eventPlannerSpecializations[1], // Wedding
      eventPlannerSpecializations[4], // Private Events
      eventPlannerSpecializations[2]  // Social Events
    ],
    teamSize: 18,
    responseTime: '2 hours',
    minimumBudget: 40000,
    maximumCapacity: 500,
    yearlyEvents: 26,
    languages: ['Italian', 'English', 'French', 'German'],
    certifications: ['Italian Wedding Association', 'Destination Wedding Certified'],
    keyStrengths: ['Historic Villas', 'Lake Como Venues', 'Italian Cuisine', 'Fashion Connections'],
    portfolio: [
      {
        eventName: 'Celebrity Lake Como Wedding',
        eventType: 'Luxury Destination Wedding',
        location: 'Lake Como, Italy',
        attendees: 150,
        year: 2024,
        description: 'Three-day destination wedding at historic lakeside villa',
        budget: '€250K - €500K',
        client: 'International Celebrity Couple'
      }
    ],
    services: [
      { name: 'Lake Como Weddings', description: 'Exclusive lakeside destination weddings', startingPrice: '€80,000' },
      { name: 'Tuscan Villa Celebrations', description: 'Historic villa wedding experiences', startingPrice: '€70,000' },
      { name: 'Milan Fashion Events', description: 'Fashion week and luxury brand events', startingPrice: '€45,000' }
    ],
    contactInfo: {
      phone: '+39 02 7600 8888',
      email: 'ciao@milanoluxuryweddings.it',
      website: 'https://milanoluxuryweddings.it',
      socialMedia: {
        instagram: '@milanoluxuryweddings',
        linkedin: 'milano-luxury-weddings'
      }
    },
    verified: true,
    premiumMember: true,
    lastActiveDate: '2024-12-19',
    joinedDate: '2023-04-22',
    businessHours: {
      monday: { open: '9:00', close: '18:00' },
      tuesday: { open: '9:00', close: '18:00' },
      wednesday: { open: '9:00', close: '18:00' },
      thursday: { open: '9:00', close: '18:00' },
      friday: { open: '9:00', close: '17:00' }
    },
    emergencySupport: true,
    insuranceCoverage: true
  },

  // Add more event planners from different countries and categories...
];

// EVENT PLANNER STATISTICS
export const eventPlannerStats = {
  totalPlanners: eventPlanners.length,
  totalEventsCompleted: eventPlanners.reduce((sum, planner) => sum + planner.eventsCompleted, 0),
  totalCountries: Array.from(new Set(eventPlanners.flatMap(planner => 
    planner.serviceLocations.map(loc => loc.country)
  ))).length,
  totalCities: Array.from(new Set(eventPlanners.flatMap(planner => 
    planner.serviceLocations.flatMap(loc => loc.cities)
  ))).length,
  averageRating: eventPlanners.reduce((sum, planner) => sum + planner.rating, 0) / eventPlanners.length,
  verifiedPlanners: eventPlanners.filter(planner => planner.verified).length,
  premiumPlanners: eventPlanners.filter(planner => planner.premiumMember).length,
  averageTeamSize: Math.round(eventPlanners.reduce((sum, planner) => sum + planner.teamSize, 0) / eventPlanners.length),
  totalYearlyEvents: eventPlanners.reduce((sum, planner) => sum + planner.yearlyEvents, 0),
  emergencySupport: eventPlanners.filter(planner => planner.emergencySupport).length
};

// EVENT PLANNER MATCHING SERVICE
export class EventPlannerMatchingService {
  static findPlannersByLocation(country: string, city?: string): EventPlanner[] {
    return eventPlanners.filter(planner => {
      return planner.serviceLocations.some(location => {
        if (location.country !== country) return false;
        if (!city) return true;
        return location.cities.includes(city) || location.isFullCountryCoverage;
      });
    });
  }

  static findPlannersBySpecialization(specializationSlug: string): EventPlanner[] {
    return eventPlanners.filter(planner => 
      planner.specializations.some(spec => spec.slug === specializationSlug)
    );
  }

  static findPlannersByBudget(minBudget: number, maxBudget?: number): EventPlanner[] {
    return eventPlanners.filter(planner => {
      if (maxBudget) {
        return planner.minimumBudget >= minBudget && planner.minimumBudget <= maxBudget;
      }
      return planner.minimumBudget >= minBudget;
    });
  }

  static getTopRatedPlanners(limit: number = 5): EventPlanner[] {
    return [...eventPlanners]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static getPremiumPlanners(): EventPlanner[] {
    return eventPlanners.filter(planner => planner.premiumMember);
  }

  static searchPlanners(query: string): EventPlanner[] {
    const lowercaseQuery = query.toLowerCase();
    return eventPlanners.filter(planner => {
      return (
        planner.companyName.toLowerCase().includes(lowercaseQuery) ||
        planner.companyDescription.toLowerCase().includes(lowercaseQuery) ||
        planner.keyStrengths.some(strength => strength.toLowerCase().includes(lowercaseQuery)) ||
        planner.specializations.some(spec => spec.name.toLowerCase().includes(lowercaseQuery)) ||
        planner.headquarters.city.toLowerCase().includes(lowercaseQuery) ||
        planner.headquarters.country.toLowerCase().includes(lowercaseQuery)
      );
    });
  }
}

console.log('Event Planners Database initialized:', {
  totalPlanners: eventPlannerStats.totalPlanners,
  specializations: eventPlannerSpecializations.length,
  countries: eventPlannerStats.totalCountries,
  cities: eventPlannerStats.totalCities
});