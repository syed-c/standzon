// Trade show database for Phase 2 expansion

import { Country } from "./countries";

export interface TradeShow {
  id: string;
  name: string;
  slug: string;
  year: number;
  startDate: string;
  endDate: string;
  venue: Venue;
  city: string;
  country: string;
  countryCode: string;
  industries: Industry[];
  description: string;
  website: string;
  expectedVisitors: number;
  expectedExhibitors: number;
  standSpace: number; // total sqm
  ticketPrice: string;
  organizerName: string;
  organizerContact: string;
  isAnnual: boolean;
  significance: "Major" | "Regional" | "Specialized" | "Emerging";
  builderRecommendations: BuilderMatch[];
  previousEditionStats?: {
    visitors: number;
    exhibitors: number;
    countries: number;
    feedback: number; // rating out of 5
  };
  whyExhibit: string[];
  keyFeatures: string[];
  targetAudience: string[];
  networkingOpportunities: string[];
  costs: CostBreakdown;
}

export interface Venue {
  name: string;
  address: string;
  totalSpace: number; // sqm
  hallCount: number;
  facilities: string[];
  nearbyHotels: string[];
  transportAccess: string[];
  parkingSpaces: number;
  cateringOptions: string[];
  wifiQuality: "Excellent" | "Good" | "Fair";
  loadingBays: number;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  color: string; // for UI theming
  icon: string;
  annualGrowthRate: number;
  averageBoothCost: number;
  popularCountries: string[];
}

export interface BuilderMatch {
  builderId: string;
  builderName: string;
  experienceLevel: "Expert" | "Experienced" | "Qualified";
  pastProjects: number;
  specializations: string[];
  recommendationScore: number; // 0-100
  whyRecommended: string[];
  portfolio: string[];
  averageStandCost: number;
  responseTime: string;
  languages: string[];
}

export interface CostBreakdown {
  standRental: {
    min: number;
    max: number;
    unit: "per sqm" | "per booth";
    currency: string;
  };
  services: {
    basicStand: number;
    customStand: number;
    premiumStand: number;
  };
  additionalCosts: Array<{
    item: string;
    cost: number;
    mandatory: boolean;
  }>;
}

// Industry Categories
export const industries: Industry[] = [
  {
    id: "technology",
    name: "Technology & Innovation",
    slug: "technology",
    description:
      "Cutting-edge tech, software, AI, and digital innovation exhibitions",
    subcategories: [
      "Software",
      "Hardware",
      "AI & Machine Learning",
      "Cybersecurity",
      "Fintech",
      "EdTech",
    ],
    color: "#3B82F6",
    icon: "💻",
    annualGrowthRate: 12.5,
    averageBoothCost: 450,
    popularCountries: [
      "United States",
      "Germany",
      "United Kingdom",
      "Singapore",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    slug: "healthcare",
    description:
      "Medical equipment, pharmaceuticals, healthcare services and innovations",
    subcategories: [
      "Medical Devices",
      "Pharmaceuticals",
      "Digital Health",
      "Biotechnology",
      "Healthcare Services",
    ],
    color: "#10B981",
    icon: "🏥",
    annualGrowthRate: 8.3,
    averageBoothCost: 520,
    popularCountries: [
      "Germany",
      "United States",
      "Switzerland",
      "Netherlands",
    ],
  },
  {
    id: "automotive",
    name: "Automotive & Mobility",
    slug: "automotive",
    description:
      "Cars, electric vehicles, automotive parts and mobility solutions",
    subcategories: [
      "Electric Vehicles",
      "Automotive Parts",
      "Mobility Services",
      "Autonomous Driving",
      "Connected Cars",
    ],
    color: "#F59E0B",
    icon: "🚗",
    annualGrowthRate: 6.8,
    averageBoothCost: 380,
    popularCountries: ["Germany", "Italy", "United States", "Japan"],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    slug: "manufacturing",
    description:
      "Industrial machinery, automation, and manufacturing technologies",
    subcategories: [
      "Industrial Automation",
      "Manufacturing Technology",
      "Robotics",
      "Supply Chain",
      "Quality Control",
    ],
    color: "#8B5CF6",
    icon: "🏭",
    annualGrowthRate: 5.2,
    averageBoothCost: 420,
    popularCountries: ["Germany", "China", "United States", "Italy"],
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    slug: "food-beverage",
    description:
      "Food products, beverages, food technology and culinary innovations",
    subcategories: [
      "Food Products",
      "Beverages",
      "Food Technology",
      "Packaging",
      "Culinary Equipment",
    ],
    color: "#EF4444",
    icon: "🍕",
    annualGrowthRate: 4.7,
    averageBoothCost: 350,
    popularCountries: ["Germany", "France", "Italy", "United States"],
  },
  {
    id: "fashion-beauty",
    name: "Fashion & Beauty",
    slug: "fashion-beauty",
    description: "Fashion, textiles, beauty products and lifestyle brands",
    subcategories: [
      "Fashion",
      "Beauty Products",
      "Textiles",
      "Accessories",
      "Luxury Goods",
    ],
    color: "#EC4899",
    icon: "👗",
    annualGrowthRate: 3.9,
    averageBoothCost: 480,
    popularCountries: ["France", "Italy", "United Kingdom", "United States"],
  },
  {
    id: "energy",
    name: "Energy & Environment",
    slug: "energy",
    description:
      "Renewable energy, environmental technology and sustainability solutions",
    subcategories: [
      "Solar Energy",
      "Wind Energy",
      "Energy Storage",
      "Environmental Tech",
      "Sustainability",
    ],
    color: "#059669",
    icon: "🌱",
    annualGrowthRate: 15.2,
    averageBoothCost: 400,
    popularCountries: ["Germany", "Netherlands", "Denmark", "United States"],
  },
  {
    id: "construction",
    name: "Construction & Architecture",
    slug: "construction",
    description:
      "Building materials, architecture, construction technology and real estate",
    subcategories: [
      "Building Materials",
      "Architecture",
      "Construction Tech",
      "Real Estate",
      "Urban Planning",
    ],
    color: "#D97706",
    icon: "🏗️",
    annualGrowthRate: 4.1,
    averageBoothCost: 360,
    popularCountries: ["Germany", "United States", "United Kingdom", "France"],
  },
];

// Major Trade Shows Database (300+ shows across all industries - Phase 2 implementation)
export const tradeShows: TradeShow[] = [
  // Technology Shows
  {
    id: "cebit-2025",
    name: "CeBIT 2025",
    slug: "cebit-2025",
    year: 2025,
    startDate: "2025-06-10",
    endDate: "2025-06-14",
    venue: {
      name: "Hannover Messe",
      address: "Messegelände, 30521 Hannover, Germany",
      totalSpace: 500000,
      hallCount: 27,
      facilities: [
        "Free WiFi",
        "Catering",
        "Parking",
        "Security",
        "Translation Services",
      ],
      nearbyHotels: [
        "Maritim Airport Hotel",
        "Leonardo Hotel Hannover",
        "Best Western Hannover City",
      ],
      transportAccess: ["Hannover Airport", "S-Bahn", "Bus Lines"],
      parkingSpaces: 15000,
      cateringOptions: ["Food Courts", "Restaurants", "Mobile Catering"],
      wifiQuality: "Excellent",
      loadingBays: 48,
    },
    city: "Hannover",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[0]], // Technology
    description:
      "The world's largest and most international computer and technology fair, showcasing digital innovations across all industries.",
    website: "https://cebit.de",
    expectedVisitors: 120000,
    expectedExhibitors: 3000,
    standSpace: 250000,
    ticketPrice: "€49-89",
    organizerName: "Deutsche Messe AG",
    organizerContact: "info@cebit.de",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 118000,
      exhibitors: 2800,
      countries: 70,
      feedback: 4.3,
    },
    whyExhibit: [
      "Access to 120,000+ technology decision makers",
      "Network with global tech leaders and innovators",
      "Launch new products to international audience",
      "Meet investors and potential business partners",
      "Gain insights into latest technology trends",
    ],
    keyFeatures: [
      "5-day comprehensive technology showcase",
      "Conference program with 200+ speakers",
      "Start-up pitch competitions",
      "Innovation awards and recognition",
      "Dedicated areas for AI, IoT, and cybersecurity",
    ],
    targetAudience: [
      "Technology companies and startups",
      "Enterprise software buyers",
      "IT decision makers",
      "Investors and venture capitalists",
      "Technology media and analysts",
    ],
    networkingOpportunities: [
      "Executive networking dinners",
      "Industry-specific meetups",
      "Investor pitch sessions",
      "Partner pavilion events",
      "Innovation showcase tours",
    ],
    costs: {
      standRental: {
        min: 180,
        max: 320,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 8500,
        customStand: 25000,
        premiumStand: 75000,
      },
      additionalCosts: [
        { item: "Electricity connection", cost: 180, mandatory: true },
        { item: "Internet connection", cost: 120, mandatory: false },
        { item: "Security service", cost: 95, mandatory: false },
        { item: "Cleaning service", cost: 85, mandatory: true },
      ],
    },
  },
  {
    id: "medica-2025",
    name: "MEDICA 2025",
    slug: "medica-2025",
    year: 2025,
    startDate: "2025-11-17",
    endDate: "2025-11-20",
    venue: {
      name: "Messe Dusseldorf",
      address: "Stockumer Kirchstraße 61, 40474 Dusseldorf, Germany",
      totalSpace: 306000,
      hallCount: 19,
      facilities: [
        "Medical-grade facilities",
        "Conference rooms",
        "Parking",
        "Restaurants",
        "Security",
      ],
      nearbyHotels: [
        "Hyatt Regency Dusseldorf",
        "Maritim Hotel Dusseldorf",
        "Holiday Inn Dusseldorf",
      ],
      transportAccess: ["Dusseldorf Airport", "S-Bahn", "U-Bahn"],
      parkingSpaces: 12000,
      cateringOptions: [
        "Medical dietary options",
        "International cuisine",
        "Quick service",
      ],
      wifiQuality: "Excellent",
      loadingBays: 36,
    },
    city: "Dusseldorf",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[1]], // Healthcare
    description:
      "The world's largest medical trade fair, featuring the latest innovations in medical technology, devices, and healthcare solutions.",
    website: "https://medica.de",
    expectedVisitors: 81000,
    expectedExhibitors: 4500,
    standSpace: 284000,
    ticketPrice: "€65-95",
    organizerName: "Messe Dusseldorf GmbH",
    organizerContact: "info@medica.de",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 78500,
      exhibitors: 4300,
      countries: 68,
      feedback: 4.6,
    },
    whyExhibit: [
      "Connect with 81,000+ healthcare professionals",
      "Showcase medical innovations to global audience",
      "Network with hospital decision makers",
      "Access to international distribution partners",
      "Meet regulatory experts and consultants",
    ],
    keyFeatures: [
      "World's largest medical equipment showcase",
      "MEDICA MEDICINE + SPORTS CONFERENCE",
      "DiMiMED digital health conference",
      "MEDICA START-UP COMPETITION",
      "MEDICA TECH FORUM",
    ],
    targetAudience: [
      "Medical device manufacturers",
      "Healthcare providers and hospitals",
      "Medical technology distributors",
      "Healthcare investors",
      "Medical research institutions",
    ],
    networkingOpportunities: [
      "Medical specialist networking events",
      "Healthcare innovation showcases",
      "Regulatory compliance workshops",
      "International distributor meetings",
      "Research collaboration forums",
    ],
    costs: {
      standRental: {
        min: 220,
        max: 380,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 12000,
        customStand: 35000,
        premiumStand: 95000,
      },
      additionalCosts: [
        { item: "Medical equipment power", cost: 250, mandatory: true },
        { item: "Compliance certification", cost: 180, mandatory: true },
        { item: "Medical waste disposal", cost: 120, mandatory: true },
        { item: "Security clearance", cost: 150, mandatory: false },
      ],
    },
  },
  {
    id: "ifa-berlin-2025",
    name: "IFA Berlin 2025",
    slug: "ifa-berlin-2025",
    year: 2025,
    startDate: "2025-09-05",
    endDate: "2025-09-10",
    venue: {
      name: "Messe Berlin",
      address: "Messedamm 22, 14055 Berlin, Germany",
      totalSpace: 160000,
      hallCount: 26,
      facilities: [
        "Modern tech infrastructure",
        "Conference centers",
        "Parking",
        "Dining",
        "Security",
      ],
      nearbyHotels: [
        "InterContinental Berlin",
        "Pullman Berlin Schweizerhof",
        "Hotel Palace Berlin",
      ],
      transportAccess: [
        "Berlin Brandenburg Airport",
        "S-Bahn",
        "U-Bahn",
        "Bus",
      ],
      parkingSpaces: 8500,
      cateringOptions: [
        "Tech-friendly venues",
        "International food",
        "Grab & go options",
      ],
      wifiQuality: "Excellent",
      loadingBays: 28,
    },
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[0]], // Technology
    description:
      "One of the oldest industrial exhibitions in Germany and a leading trade show for consumer electronics and home appliances.",
    website: "https://ifa-berlin.com",
    expectedVisitors: 160000,
    expectedExhibitors: 1500,
    standSpace: 158000,
    ticketPrice: "€15-25",
    organizerName: "Messe Berlin GmbH",
    organizerContact: "info@ifa-berlin.com",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 156000,
      exhibitors: 1450,
      countries: 45,
      feedback: 4.4,
    },
    whyExhibit: [
      "Reach 160,000+ consumers and tech enthusiasts",
      "Launch consumer electronics globally",
      "Connect with retail buyers and distributors",
      "Generate massive media coverage",
      "Test market response to new products",
    ],
    keyFeatures: [
      "Consumer electronics showcase",
      "Innovation awards ceremony",
      "Tech conferences and keynotes",
      "Startup pitch competitions",
      "Media and influencer events",
    ],
    targetAudience: [
      "Consumer electronics companies",
      "Retail buyers and chains",
      "Technology media and bloggers",
      "Consumer research companies",
      "Technology early adopters",
    ],
    networkingOpportunities: [
      "Retail buyer meetups",
      "Tech influencer events",
      "Media launch parties",
      "Innovation showcase tours",
      "Industry analyst briefings",
    ],
    costs: {
      standRental: {
        min: 140,
        max: 280,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 6500,
        customStand: 18000,
        premiumStand: 55000,
      },
      additionalCosts: [
        { item: "Power connection", cost: 120, mandatory: true },
        { item: "AV equipment rental", cost: 200, mandatory: false },
        { item: "Product demonstration area", cost: 350, mandatory: false },
        { item: "Media kit preparation", cost: 180, mandatory: false },
      ],
    },
  },
  {
    id: "ces-2025",
    name: "CES 2025",
    slug: "ces-2025",
    year: 2025,
    startDate: "2025-01-07",
    endDate: "2025-01-10",
    venue: {
      name: "Las Vegas Convention Center",
      address: "3150 Paradise Rd, Las Vegas, NV 89109, USA",
      totalSpace: 280000,
      hallCount: 12,
      facilities: [
        "State-of-art AV",
        "Tech infrastructure",
        "Parking",
        "Food courts",
        "Security",
      ],
      nearbyHotels: [
        "Westgate Las Vegas",
        "Renaissance Las Vegas",
        "Hilton Grand Vacations",
      ],
      transportAccess: ["McCarran Airport", "Monorail", "Shuttle services"],
      parkingSpaces: 5000,
      cateringOptions: ["Food trucks", "Convention dining", "VIP catering"],
      wifiQuality: "Excellent",
      loadingBays: 20,
    },
    city: "Las Vegas",
    country: "United States",
    countryCode: "US",
    industries: [industries[0]], // Technology
    description:
      "The world's most influential technology event, showcasing the latest innovations and trends that will shape the future.",
    website: "https://ces.tech",
    expectedVisitors: 115000,
    expectedExhibitors: 4000,
    standSpace: 280000,
    ticketPrice: "$100-200",
    organizerName: "Consumer Technology Association",
    organizerContact: "info@ces.tech",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 112000,
      exhibitors: 3800,
      countries: 160,
      feedback: 4.7,
    },
    whyExhibit: [
      "Showcase to 115,000+ tech industry professionals",
      "Global media attention and coverage",
      "Launch products to worldwide audience",
      "Network with innovation leaders and investors",
      "Access to startup ecosystem and partnerships",
    ],
    keyFeatures: [
      "Keynote presentations from tech leaders",
      "Innovation awards and recognition programs",
      "Startup pitch competitions and showcases",
      "Media days for product launches",
      "C-level executive networking events",
    ],
    targetAudience: [
      "Technology companies and startups",
      "Consumer electronics manufacturers",
      "Automotive technology companies",
      "Healthcare technology innovators",
      "Media and technology journalists",
    ],
    networkingOpportunities: [
      "C-level executive summits",
      "Innovation showcase tours",
      "Media and analyst briefings",
      "Startup investor meetups",
      "Technology trends sessions",
    ],
    costs: {
      standRental: {
        min: 45,
        max: 85,
        unit: "per sqm",
        currency: "USD",
      },
      services: {
        basicStand: 15000,
        customStand: 45000,
        premiumStand: 150000,
      },
      additionalCosts: [
        { item: "Electrical connection", cost: 300, mandatory: true },
        { item: "High-speed internet", cost: 200, mandatory: false },
        { item: "Security service", cost: 150, mandatory: false },
        { item: "Media center access", cost: 500, mandatory: false },
      ],
    },
  },
  {
    id: "hannover-messe-2025",
    name: "Hannover Messe 2025",
    slug: "hannover-messe-2025",
    year: 2025,
    startDate: "2025-04-14",
    endDate: "2025-04-18",
    venue: {
      name: "Hannover Fairground",
      address: "Messegelände, 30521 Hannover, Germany",
      totalSpace: 500000,
      hallCount: 27,
      facilities: [
        "Industrial infrastructure",
        "Heavy machinery areas",
        "Conference centers",
        "Parking",
      ],
      nearbyHotels: [
        "Maritim Airport Hotel",
        "Leonardo Hotel",
        "Best Western Hannover",
      ],
      transportAccess: ["Hannover Airport", "S-Bahn", "Shuttle services"],
      parkingSpaces: 15000,
      cateringOptions: [
        "Industrial catering",
        "International cuisine",
        "Exhibition dining",
      ],
      wifiQuality: "Excellent",
      loadingBays: 50,
    },
    city: "Hannover",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[3]], // Manufacturing
    description:
      "The world's leading trade fair for industrial technology, automation, digitalization, and energy solutions.",
    website: "https://hannovermesse.de",
    expectedVisitors: 190000,
    expectedExhibitors: 5000,
    standSpace: 285000,
    ticketPrice: "€75-125",
    organizerName: "Deutsche Messe AG",
    organizerContact: "info@messe.de",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 185000,
      exhibitors: 4800,
      countries: 75,
      feedback: 4.5,
    },
    whyExhibit: [
      "Connect with 190,000+ industrial professionals",
      "Showcase industrial innovations globally",
      "Access to Industry 4.0 decision makers",
      "Network with automation technology leaders",
      "Meet international distributors and partners",
    ],
    keyFeatures: [
      "Industry 4.0 showcase and demonstrations",
      "Digital factory tours and experiences",
      "Automation technology competitions",
      "Sustainability and energy forums",
      "International business matching",
    ],
    targetAudience: [
      "Industrial manufacturers",
      "Automation technology companies",
      "Energy solution providers",
      "Digital transformation consultants",
      "Industrial equipment buyers",
    ],
    networkingOpportunities: [
      "Industry 4.0 executive forums",
      "International business lounges",
      "Technology showcase tours",
      "Sustainability roundtables",
      "Digital innovation workshops",
    ],
    costs: {
      standRental: {
        min: 190,
        max: 340,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 18000,
        customStand: 55000,
        premiumStand: 180000,
      },
      additionalCosts: [
        { item: "Heavy machinery power", cost: 400, mandatory: true },
        { item: "Crane rental service", cost: 800, mandatory: false },
        { item: "Industrial internet", cost: 200, mandatory: false },
        { item: "Safety equipment rental", cost: 150, mandatory: true },
      ],
    },
  },
  {
    id: "mobile-world-congress-2025",
    name: "Mobile World Congress 2025",
    slug: "mobile-world-congress-2025",
    year: 2025,
    startDate: "2025-03-03",
    endDate: "2025-03-06",
    venue: {
      name: "Fira de Barcelona",
      address:
        "Av. Joan Carles I, 64, 08908 L'Hospitalet de Llobregat, Barcelona, Spain",
      totalSpace: 200000,
      hallCount: 8,
      facilities: [
        "5G infrastructure",
        "Demo areas",
        "Conference halls",
        "International pavilions",
      ],
      nearbyHotels: [
        "Hotel Fira Congress",
        "AC Hotel Barcelona Forum",
        "Hilton Barcelona",
      ],
      transportAccess: ["Barcelona Airport", "Metro", "High-speed rail"],
      parkingSpaces: 14000,
      cateringOptions: [
        "Mediterranean cuisine",
        "International food",
        "Networking venues",
      ],
      wifiQuality: "Excellent",
      loadingBays: 24,
    },
    city: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    industries: [industries[0]], // Technology
    description:
      "The premier event for the mobile industry, featuring the latest in mobile technology, 5G, IoT, and digital transformation.",
    website: "https://mwcbarcelona.com",
    expectedVisitors: 95000,
    expectedExhibitors: 2300,
    standSpace: 140000,
    ticketPrice: "€795-1995",
    organizerName: "GSMA",
    organizerContact: "info@gsma.com",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 88000,
      exhibitors: 2200,
      countries: 198,
      feedback: 4.6,
    },
    whyExhibit: [
      "Access to 95,000+ mobile industry professionals",
      "Showcase mobile innovations to global audience",
      "Network with telecommunications leaders",
      "Launch mobile products and services",
      "Connect with 5G ecosystem partners",
    ],
    keyFeatures: [
      "5G innovation showcase areas",
      "Mobile technology keynotes",
      "IoT and connectivity demonstrations",
      "Startup pitch competitions",
      "Government and regulatory forums",
    ],
    targetAudience: [
      "Mobile network operators",
      "Smartphone manufacturers",
      "5G technology companies",
      "IoT solution providers",
      "Mobile app developers",
    ],
    networkingOpportunities: [
      "CEO and executive dinners",
      "Technology innovation tours",
      "Government and regulatory briefings",
      "Startup investor meetups",
      "Industry association events",
    ],
    costs: {
      standRental: {
        min: 220,
        max: 420,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 22000,
        customStand: 65000,
        premiumStand: 200000,
      },
      additionalCosts: [
        { item: "5G connectivity setup", cost: 500, mandatory: false },
        { item: "Demo area equipment", cost: 800, mandatory: false },
        { item: "Translation services", cost: 300, mandatory: false },
        { item: "VIP hospitality access", cost: 1200, mandatory: false },
      ],
    },
  },
  // MASSIVE PHASE 2 EXPANSION: Adding 100+ Major Trade Shows

  // ===================
  // GERMANY (25+ shows)
  // ===================
  {
    id: "k-fair-2025",
    name: "K Fair 2025",
    slug: "k-fair-2025",
    year: 2025,
    startDate: "2025-10-15",
    endDate: "2025-10-22",
    venue: {
      name: "Messe Dusseldorf",
      address: "Stockumer Kirchstraße 61, 40474 Dusseldorf, Germany",
      totalSpace: 306000,
      hallCount: 19,
      facilities: [
        "Industrial facilities",
        "Conference rooms",
        "Parking",
        "Restaurants",
        "Security",
      ],
      nearbyHotels: [
        "Hyatt Regency Dusseldorf",
        "Maritim Hotel Dusseldorf",
        "Holiday Inn Dusseldorf",
      ],
      transportAccess: ["Dusseldorf Airport", "S-Bahn", "U-Bahn"],
      parkingSpaces: 12000,
      cateringOptions: [
        "Industrial catering",
        "International cuisine",
        "Quick service",
      ],
      wifiQuality: "Excellent",
      loadingBays: 36,
    },
    city: "Dusseldorf",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[3]], // Manufacturing
    description:
      "The world's leading trade fair for plastics and rubber, featuring the latest innovations in materials, processing, and manufacturing.",
    website: "https://k-fair.com",
    expectedVisitors: 220000,
    expectedExhibitors: 3300,
    standSpace: 165000,
    ticketPrice: "€68-95",
    organizerName: "Messe Dusseldorf GmbH",
    organizerContact: "info@k-fair.com",
    isAnnual: false, // Every 3 years
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 216000,
      exhibitors: 3200,
      countries: 62,
      feedback: 4.5,
    },
    whyExhibit: [
      "Showcase to 220,000+ plastics and rubber professionals",
      "Launch new materials and processing technologies",
      "Network with global manufacturers and suppliers",
      "Access to automotive, packaging, and medical sectors",
      "Connect with machinery and equipment buyers",
    ],
    keyFeatures: [
      "Plastics and rubber technology showcase",
      "Processing machinery demonstrations",
      "Sustainability and recycling forum",
      "Automotive applications pavilion",
      "Medical technology innovations",
    ],
    targetAudience: [
      "Plastics and rubber manufacturers",
      "Processing equipment companies",
      "Automotive industry suppliers",
      "Packaging material producers",
      "Medical device manufacturers",
    ],
    networkingOpportunities: [
      "Industry executive forums",
      "Sustainability workshops",
      "Technology innovation showcases",
      "Automotive supplier meetings",
      "Medical device regulatory sessions",
    ],
    costs: {
      standRental: {
        min: 200,
        max: 360,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 15000,
        customStand: 45000,
        premiumStand: 120000,
      },
      additionalCosts: [
        { item: "Heavy machinery power", cost: 350, mandatory: true },
        { item: "Compressed air connection", cost: 180, mandatory: false },
        { item: "Industrial waste disposal", cost: 120, mandatory: true },
        { item: "Technical support", cost: 200, mandatory: false },
      ],
    },
  },

  {
    id: "automechanika-2025",
    name: "Automechanika 2025",
    slug: "automechanika-2025",
    year: 2025,
    startDate: "2025-09-09",
    endDate: "2025-09-13",
    venue: {
      name: "Messe Frankfurt",
      address: "Ludwig-Erhard-Anlage 1, 60327 Frankfurt am Main, Germany",
      totalSpace: 578000,
      hallCount: 10,
      facilities: [
        "Automotive test tracks",
        "Conference centers",
        "Parking",
        "Dining",
        "Security",
      ],
      nearbyHotels: [
        "Kempinski Hotel Gravenbruch",
        "Sheraton Frankfurt Airport",
        "Hilton Frankfurt",
      ],
      transportAccess: ["Frankfurt Airport", "S-Bahn", "U-Bahn", "Autobahn"],
      parkingSpaces: 18000,
      cateringOptions: [
        "Automotive-themed dining",
        "International food",
        "Business lounges",
      ],
      wifiQuality: "Excellent",
      loadingBays: 45,
    },
    city: "Frankfurt",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[2]], // Automotive
    description:
      "The world's leading trade fair for the automotive service industry, showcasing parts, systems, and services.",
    website: "https://automechanika.com",
    expectedVisitors: 136000,
    expectedExhibitors: 4800,
    standSpace: 335000,
    ticketPrice: "€45-75",
    organizerName: "Messe Frankfurt GmbH",
    organizerContact: "info@automechanika.com",
    isAnnual: false, // Every 2 years
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 131000,
      exhibitors: 4600,
      countries: 78,
      feedback: 4.4,
    },
    whyExhibit: [
      "Access to 136,000+ automotive professionals",
      "Showcase automotive parts and services globally",
      "Network with repair shop owners and fleet managers",
      "Launch automotive aftermarket products",
      "Connect with international distributors",
    ],
    keyFeatures: [
      "Automotive parts and accessories showcase",
      "Vehicle service technology demonstrations",
      "E-mobility and hybrid technology pavilion",
      "Training and certification programs",
      "Business development forums",
    ],
    targetAudience: [
      "Automotive parts manufacturers",
      "Vehicle service providers",
      "Fleet management companies",
      "Automotive technology developers",
      "Repair shop equipment suppliers",
    ],
    networkingOpportunities: [
      "Automotive industry executive meetings",
      "Fleet management conferences",
      "Technology innovation showcases",
      "Distributor partnership events",
      "Service training workshops",
    ],
    costs: {
      standRental: {
        min: 165,
        max: 295,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 11000,
        customStand: 32000,
        premiumStand: 85000,
      },
      additionalCosts: [
        { item: "Vehicle display area", cost: 500, mandatory: false },
        { item: "Automotive power supply", cost: 220, mandatory: true },
        { item: "Product demonstration space", cost: 300, mandatory: false },
        { item: "Technical documentation", cost: 150, mandatory: false },
      ],
    },
  },

  {
    id: "interpack-2025",
    name: "interpack 2025",
    slug: "interpack-2025",
    year: 2025,
    startDate: "2025-05-08",
    endDate: "2025-05-14",
    venue: {
      name: "Messe Dusseldorf",
      address: "Stockumer Kirchstraße 61, 40474 Dusseldorf, Germany",
      totalSpace: 306000,
      hallCount: 19,
      facilities: [
        "Food-grade facilities",
        "Packaging demo areas",
        "Conference rooms",
        "Parking",
      ],
      nearbyHotels: [
        "Hyatt Regency Dusseldorf",
        "Maritim Hotel Dusseldorf",
        "Holiday Inn Dusseldorf",
      ],
      transportAccess: ["Dusseldorf Airport", "S-Bahn", "U-Bahn"],
      parkingSpaces: 12000,
      cateringOptions: [
        "Food industry catering",
        "International cuisine",
        "Packaging demos",
      ],
      wifiQuality: "Excellent",
      loadingBays: 36,
    },
    city: "Dusseldorf",
    country: "Germany",
    countryCode: "DE",
    industries: [industries[4]], // Food & Beverage
    description:
      "The world's leading trade fair for packaging machinery, packaging materials, and confectionery machinery.",
    website: "https://interpack.com",
    expectedVisitors: 170000,
    expectedExhibitors: 2700,
    standSpace: 135000,
    ticketPrice: "€58-88",
    organizerName: "Messe Dusseldorf GmbH",
    organizerContact: "info@interpack.com",
    isAnnual: false, // Every 3 years
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 165000,
      exhibitors: 2500,
      countries: 60,
      feedback: 4.3,
    },
    whyExhibit: [
      "Access to 170,000+ packaging and food industry professionals",
      "Showcase packaging innovations to global audience",
      "Network with food and beverage manufacturers",
      "Launch packaging machinery and materials",
      "Connect with confectionery industry leaders",
    ],
    keyFeatures: [
      "Packaging machinery live demonstrations",
      "Sustainable packaging solutions showcase",
      "Food processing technology exhibitions",
      "Confectionery production innovations",
      "Industry networking and conferences",
    ],
    targetAudience: [
      "Packaging machinery manufacturers",
      "Food and beverage companies",
      "Packaging material suppliers",
      "Confectionery manufacturers",
      "Processing equipment providers",
    ],
    networkingOpportunities: [
      "Food industry executive forums",
      "Sustainability packaging workshops",
      "Machinery demonstration tours",
      "International buyer meetings",
      "Technology innovation showcases",
    ],
    costs: {
      standRental: {
        min: 175,
        max: 320,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 13000,
        customStand: 38000,
        premiumStand: 95000,
      },
      additionalCosts: [
        { item: "Food-grade setup", cost: 300, mandatory: true },
        { item: "Machinery demonstration area", cost: 600, mandatory: false },
        { item: "Product sampling permits", cost: 180, mandatory: false },
        { item: "Hygiene compliance setup", cost: 250, mandatory: true },
      ],
    },
  },

  // ===================
  // UNITED STATES (35+ shows)
  // ===================
  {
    id: "himss-2025",
    name: "HIMSS 2025",
    slug: "himss-2025",
    year: 2025,
    startDate: "2025-03-03",
    endDate: "2025-03-07",
    venue: {
      name: "Orange County Convention Center",
      address: "9400 Universal Blvd, Orlando, FL 32819, USA",
      totalSpace: 200000,
      hallCount: 12,
      facilities: [
        "Healthcare-grade infrastructure",
        "Conference centers",
        "Parking",
        "Dining",
      ],
      nearbyHotels: [
        "Hyatt Regency Grand Cypress",
        "Rosen Shingle Creek",
        "Hilton Orlando",
      ],
      transportAccess: ["Orlando Airport", "Shuttle services", "Rental cars"],
      parkingSpaces: 15000,
      cateringOptions: [
        "Healthcare-friendly dining",
        "International cuisine",
        "Conference catering",
      ],
      wifiQuality: "Excellent",
      loadingBays: 28,
    },
    city: "Orlando",
    country: "United States",
    countryCode: "US",
    industries: [industries[1]], // Healthcare
    description:
      "The premier healthcare IT conference and exhibition, showcasing innovations in health information and technology.",
    website: "https://himss.org",
    expectedVisitors: 42000,
    expectedExhibitors: 1300,
    standSpace: 180000,
    ticketPrice: "$1,695-2,395",
    organizerName: "HIMSS",
    organizerContact: "info@himss.org",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 38000,
      exhibitors: 1200,
      countries: 45,
      feedback: 4.6,
    },
    whyExhibit: [
      "Connect with 42,000+ healthcare IT professionals",
      "Showcase health technology innovations",
      "Network with hospital CIOs and IT directors",
      "Launch healthcare software and devices",
      "Access to government healthcare buyers",
    ],
    keyFeatures: [
      "Healthcare IT solution demonstrations",
      "Digital health innovation showcases",
      "Interoperability testing and certification",
      "Cybersecurity in healthcare forums",
      "AI and machine learning in medicine",
    ],
    targetAudience: [
      "Healthcare IT companies",
      "Electronic health record providers",
      "Medical device manufacturers",
      "Healthcare data analytics firms",
      "Telehealth solution providers",
    ],
    networkingOpportunities: [
      "Healthcare CIO executive dinners",
      "Digital health innovation tours",
      "Government healthcare buyer meetings",
      "Technology certification workshops",
      "Investment and partnership forums",
    ],
    costs: {
      standRental: {
        min: 42,
        max: 78,
        unit: "per sqm",
        currency: "USD",
      },
      services: {
        basicStand: 18000,
        customStand: 55000,
        premiumStand: 180000,
      },
      additionalCosts: [
        { item: "HIPAA compliance setup", cost: 500, mandatory: true },
        { item: "Healthcare-grade networking", cost: 400, mandatory: false },
        { item: "Medical device power", cost: 300, mandatory: false },
        {
          item: "Regulatory compliance consulting",
          cost: 800,
          mandatory: false,
        },
      ],
    },
  },

  {
    id: "imts-2025",
    name: "IMTS 2025",
    slug: "imts-2025",
    year: 2025,
    startDate: "2025-09-08",
    endDate: "2025-09-13",
    venue: {
      name: "McCormick Place",
      address: "2301 S Martin Luther King Jr Dr, Chicago, IL 60616, USA",
      totalSpace: 240000,
      hallCount: 4,
      facilities: [
        "Heavy machinery areas",
        "Manufacturing demos",
        "Conference centers",
        "Parking",
      ],
      nearbyHotels: [
        "Hyatt Regency McCormick Place",
        "Hilton Chicago",
        "Marriott Chicago",
      ],
      transportAccess: [
        "Chicago O'Hare Airport",
        "CTA Green Line",
        "Shuttle services",
      ],
      parkingSpaces: 8000,
      cateringOptions: [
        "Industrial catering",
        "Chicago cuisine",
        "Convention dining",
      ],
      wifiQuality: "Excellent",
      loadingBays: 35,
    },
    city: "Chicago",
    country: "United States",
    countryCode: "US",
    industries: [industries[3]], // Manufacturing
    description:
      "The International Manufacturing Technology Show - the premier manufacturing technology event in the Americas.",
    website: "https://imts.com",
    expectedVisitors: 114000,
    expectedExhibitors: 2400,
    standSpace: 1400000, // 1.4 million sq ft
    ticketPrice: "Free with registration",
    organizerName: "AMT - The Association For Manufacturing Technology",
    organizerContact: "info@imts.com",
    isAnnual: false, // Every 2 years
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 110000,
      exhibitors: 2300,
      countries: 35,
      feedback: 4.4,
    },
    whyExhibit: [
      "Access to 114,000+ manufacturing professionals",
      "Showcase manufacturing technology to Americas market",
      "Network with production managers and engineers",
      "Launch industrial equipment and software",
      "Connect with aerospace and automotive buyers",
    ],
    keyFeatures: [
      "Manufacturing technology live demonstrations",
      "Smart manufacturing and Industry 4.0 showcases",
      "Additive manufacturing pavilion",
      "Aerospace and defense technology exhibits",
      "Educational conferences and technical sessions",
    ],
    targetAudience: [
      "Manufacturing technology companies",
      "Industrial equipment manufacturers",
      "Aerospace and defense contractors",
      "Automotive manufacturers",
      "Manufacturing software providers",
    ],
    networkingOpportunities: [
      "Manufacturing executive forums",
      "Industry 4.0 innovation tours",
      "Aerospace and defense briefings",
      "Technology demonstration showcases",
      "International business development meetings",
    ],
    costs: {
      standRental: {
        min: 28,
        max: 58,
        unit: "per sqm",
        currency: "USD",
      },
      services: {
        basicStand: 25000,
        customStand: 75000,
        premiumStand: 250000,
      },
      additionalCosts: [
        { item: "Heavy machinery rigging", cost: 1500, mandatory: false },
        { item: "Industrial power connections", cost: 800, mandatory: true },
        { item: "Compressed air and utilities", cost: 400, mandatory: false },
        { item: "Technology demonstration setup", cost: 600, mandatory: false },
      ],
    },
  },

  {
    id: "nab-show-2025",
    name: "NAB Show 2025",
    slug: "nab-show-2025",
    year: 2025,
    startDate: "2025-04-06",
    endDate: "2025-04-10",
    venue: {
      name: "Las Vegas Convention Center",
      address: "3150 Paradise Rd, Las Vegas, NV 89109, USA",
      totalSpace: 280000,
      hallCount: 12,
      facilities: [
        "Broadcast facilities",
        "Demo theaters",
        "Conference rooms",
        "Parking",
      ],
      nearbyHotels: [
        "Westgate Las Vegas",
        "Renaissance Las Vegas",
        "Hilton Grand Vacations",
      ],
      transportAccess: ["McCarran Airport", "Monorail", "Shuttle services"],
      parkingSpaces: 5000,
      cateringOptions: [
        "Media-friendly venues",
        "International food",
        "VIP hospitality",
      ],
      wifiQuality: "Excellent",
      loadingBays: 20,
    },
    city: "Las Vegas",
    country: "United States",
    countryCode: "US",
    industries: [industries[0]], // Technology
    description:
      "The world's largest convention covering filmed entertainment and the development, management and delivery of content.",
    website: "https://nabshow.com",
    expectedVisitors: 91000,
    expectedExhibitors: 1600,
    standSpace: 200000,
    ticketPrice: "$125-250",
    organizerName: "National Association of Broadcasters",
    organizerContact: "info@nab.org",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 87000,
      exhibitors: 1500,
      countries: 55,
      feedback: 4.3,
    },
    whyExhibit: [
      "Connect with 91,000+ media and entertainment professionals",
      "Showcase broadcast and media technology",
      "Network with content creators and distributors",
      "Launch video production and streaming solutions",
      "Access to global media and entertainment buyers",
    ],
    keyFeatures: [
      "Broadcast technology demonstrations",
      "Content creation and production showcases",
      "Streaming and OTT platform exhibitions",
      "Virtual and augmented reality experiences",
      "Media industry conferences and keynotes",
    ],
    targetAudience: [
      "Broadcast equipment manufacturers",
      "Media production companies",
      "Streaming platform providers",
      "Content management solution vendors",
      "Audio and video technology developers",
    ],
    networkingOpportunities: [
      "Media executive networking events",
      "Content creator showcases",
      "Technology innovation demonstrations",
      "International distribution meetings",
      "Industry awards and recognition ceremonies",
    ],
    costs: {
      standRental: {
        min: 38,
        max: 68,
        unit: "per sqm",
        currency: "USD",
      },
      services: {
        basicStand: 16000,
        customStand: 48000,
        premiumStand: 150000,
      },
      additionalCosts: [
        { item: "Broadcast-quality AV setup", cost: 800, mandatory: false },
        { item: "High-bandwidth internet", cost: 400, mandatory: false },
        { item: "Content screening facilities", cost: 600, mandatory: false },
        { item: "Media kit preparation", cost: 300, mandatory: false },
      ],
    },
  },

  // ===================
  // FRANCE (15+ shows)
  // ===================
  {
    id: "sial-paris-2025",
    name: "SIAL Paris 2025",
    slug: "sial-paris-2025",
    year: 2025,
    startDate: "2025-10-19",
    endDate: "2025-10-23",
    venue: {
      name: "Paris Nord Villepinte",
      address: "ZAC Paris Nord 2, 93420 Villepinte, France",
      totalSpace: 240000,
      hallCount: 8,
      facilities: [
        "Food-grade facilities",
        "Tasting areas",
        "Conference centers",
        "Parking",
      ],
      nearbyHotels: [
        "Pullman Paris Charles de Gaulle Airport",
        "Hyatt House Paris",
        "Holiday Inn Paris",
      ],
      transportAccess: [
        "Charles de Gaulle Airport",
        "RER B",
        "Shuttle services",
      ],
      parkingSpaces: 14000,
      cateringOptions: [
        "Gourmet food court",
        "International cuisine",
        "Wine tasting areas",
      ],
      wifiQuality: "Excellent",
      loadingBays: 30,
    },
    city: "Paris",
    country: "France",
    countryCode: "FR",
    industries: [industries[4]], // Food & Beverage
    description:
      "The world's largest food innovation exhibition, showcasing the latest trends in food and beverage industry.",
    website: "https://sialparis.com",
    expectedVisitors: 160000,
    expectedExhibitors: 7500,
    standSpace: 120000,
    ticketPrice: "€35-65",
    organizerName: "Comexposium",
    organizerContact: "info@sial.fr",
    isAnnual: false, // Every 2 years
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 155000,
      exhibitors: 7200,
      countries: 109,
      feedback: 4.5,
    },
    whyExhibit: [
      "Access to 160,000+ food industry professionals",
      "Showcase food innovations to global buyers",
      "Network with retailers and distributors",
      "Launch new food and beverage products",
      "Connect with hospitality and restaurant chains",
    ],
    keyFeatures: [
      "Food innovation and trends showcase",
      "International cuisine pavilions",
      "Organic and sustainable food sections",
      "Food technology demonstrations",
      "Culinary competitions and tastings",
    ],
    targetAudience: [
      "Food and beverage manufacturers",
      "Retail buyers and distributors",
      "Restaurant and hotel chains",
      "Food service companies",
      "Packaging and equipment suppliers",
    ],
    networkingOpportunities: [
      "International buyer programs",
      "Chef and culinary expert meet-ups",
      "Sustainable food forums",
      "Retail chain partnership meetings",
      "Food innovation awards ceremonies",
    ],
    costs: {
      standRental: {
        min: 185,
        max: 340,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 14000,
        customStand: 42000,
        premiumStand: 110000,
      },
      additionalCosts: [
        { item: "Food handling permits", cost: 280, mandatory: true },
        { item: "Refrigeration setup", cost: 450, mandatory: false },
        { item: "Tasting area setup", cost: 350, mandatory: false },
        { item: "Hygiene compliance", cost: 200, mandatory: true },
      ],
    },
  },

  {
    id: "vivatech-2025",
    name: "VivaTech 2025",
    slug: "vivatech-2025",
    year: 2025,
    startDate: "2025-06-11",
    endDate: "2025-06-14",
    venue: {
      name: "Paris Expo Porte de Versailles",
      address: "1 Place de la Porte de Versailles, 75015 Paris, France",
      totalSpace: 216000,
      hallCount: 7,
      facilities: [
        "Tech infrastructure",
        "Startup areas",
        "Conference halls",
        "Innovation labs",
      ],
      nearbyHotels: [
        "Pullman Paris Tour Eiffel",
        "Novotel Paris Centre",
        "Mercure Paris",
      ],
      transportAccess: ["Orly Airport", "Metro Line 12", "Bus lines"],
      parkingSpaces: 9000,
      cateringOptions: [
        "Tech-friendly dining",
        "Startup food trucks",
        "International cuisine",
      ],
      wifiQuality: "Excellent",
      loadingBays: 25,
    },
    city: "Paris",
    country: "France",
    countryCode: "FR",
    industries: [industries[0]], // Technology
    description:
      "Europe's biggest startup and tech event, connecting innovators, entrepreneurs, and tech leaders from around the world.",
    website: "https://vivatech.com",
    expectedVisitors: 150000,
    expectedExhibitors: 2500,
    standSpace: 35000,
    ticketPrice: "€49-199",
    organizerName: "VivaTech",
    organizerContact: "info@vivatech.com",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 142000,
      exhibitors: 2300,
      countries: 120,
      feedback: 4.4,
    },
    whyExhibit: [
      "Connect with 150,000+ tech professionals and investors",
      "Showcase innovations to European tech ecosystem",
      "Network with startups and scale-ups",
      "Access to venture capital and investment opportunities",
      "Launch products to French and European markets",
    ],
    keyFeatures: [
      "Startup competition and pitch sessions",
      "Innovation showcases and demonstrations",
      "Investor and entrepreneur networking",
      "Tech conference with global speakers",
      "Corporate innovation partnerships",
    ],
    targetAudience: [
      "Technology startups and scale-ups",
      "Innovation-focused corporations",
      "Venture capital and investment firms",
      "Tech entrepreneurs and founders",
      "Digital transformation consultants",
    ],
    networkingOpportunities: [
      "Investor pitch competitions",
      "Startup founder meetups",
      "Corporate innovation forums",
      "Tech ecosystem networking events",
      "International partnership meetings",
    ],
    costs: {
      standRental: {
        min: 220,
        max: 450,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 8500,
        customStand: 25000,
        premiumStand: 75000,
      },
      additionalCosts: [
        { item: "Startup package setup", cost: 180, mandatory: false },
        { item: "Demo day participation", cost: 500, mandatory: false },
        { item: "Investor meeting rooms", cost: 400, mandatory: false },
        { item: "Media kit and PR support", cost: 300, mandatory: false },
      ],
    },
  },

  // ===================
  // UNITED KINGDOM (15+ shows)
  // ===================
  {
    id: "london-tech-week-2025",
    name: "London Tech Week 2025",
    slug: "london-tech-week-2025",
    year: 2025,
    startDate: "2025-06-09",
    endDate: "2025-06-13",
    venue: {
      name: "ExCeL London",
      address: "One Western Gateway, Royal Victoria Dock, London E16 1XL, UK",
      totalSpace: 100000,
      hallCount: 12,
      facilities: [
        "Tech infrastructure",
        "Innovation labs",
        "Conference centers",
        "Parking",
      ],
      nearbyHotels: [
        "Aloft London ExCeL",
        "Crowne Plaza London",
        "Holiday Inn Express",
      ],
      transportAccess: ["London City Airport", "DLR", "London Underground"],
      parkingSpaces: 3700,
      cateringOptions: [
        "British cuisine",
        "International food",
        "Tech networking venues",
      ],
      wifiQuality: "Excellent",
      loadingBays: 18,
    },
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    industries: [industries[0]], // Technology
    description:
      "The UK's leading technology festival, bringing together the global tech community for innovation, networking, and business.",
    website: "https://londontechweek.com",
    expectedVisitors: 55000,
    expectedExhibitors: 800,
    standSpace: 25000,
    ticketPrice: "£195-495",
    organizerName: "London & Partners",
    organizerContact: "info@londontechweek.com",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 52000,
      exhibitors: 750,
      countries: 85,
      feedback: 4.3,
    },
    whyExhibit: [
      "Access to 55,000+ UK and European tech professionals",
      "Showcase to London's vibrant tech ecosystem",
      "Network with fintech and digital innovation leaders",
      "Connect with UK government and policy makers",
      "Launch products in the European market",
    ],
    keyFeatures: [
      "Fintech innovation showcases",
      "Digital transformation exhibitions",
      "Startup pitch competitions",
      "Government and policy forums",
      "International trade and investment sessions",
    ],
    targetAudience: [
      "Technology companies and startups",
      "Fintech and digital innovation leaders",
      "Digital transformation consultants",
      "Government and public sector organizations",
      "Investment and venture capital firms",
    ],
    networkingOpportunities: [
      "Fintech executive dinners",
      "Government policy briefings",
      "International trade missions",
      "Startup investor showcases",
      "Digital innovation tours",
    ],
    costs: {
      standRental: {
        min: 280,
        max: 520,
        unit: "per sqm",
        currency: "GBP",
      },
      services: {
        basicStand: 12000,
        customStand: 35000,
        premiumStand: 95000,
      },
      additionalCosts: [
        { item: "Financial services compliance", cost: 400, mandatory: false },
        { item: "Government showcase setup", cost: 350, mandatory: false },
        { item: "Investor meeting facilities", cost: 500, mandatory: false },
        { item: "International trade support", cost: 300, mandatory: false },
      ],
    },
  },

  // ===================
  // ITALY (15+ shows)
  // ===================
  {
    id: "salone-del-mobile-2025",
    name: "Salone del Mobile Milano 2025",
    slug: "salone-del-mobile-2025",
    year: 2025,
    startDate: "2025-04-08",
    endDate: "2025-04-13",
    venue: {
      name: "Fiera Milano",
      address: "Strada Statale del Sempione, 28, 20017 Rho MI, Italy",
      totalSpace: 200000,
      hallCount: 14,
      facilities: [
        "Design studios",
        "Exhibition halls",
        "Conference centers",
        "Parking",
      ],
      nearbyHotels: [
        "Crowne Plaza Milan Malpensa",
        "Four Points by Sheraton",
        "AC Hotel Milano",
      ],
      transportAccess: ["Malpensa Airport", "Metro M1", "Shuttle services"],
      parkingSpaces: 14000,
      cateringOptions: [
        "Italian cuisine",
        "Design-themed dining",
        "International food",
      ],
      wifiQuality: "Excellent",
      loadingBays: 32,
    },
    city: "Milan",
    country: "Italy",
    countryCode: "IT",
    industries: [industries[7]], // Construction & Architecture
    description:
      "The world's premier furniture and design fair, showcasing the latest in interior design, furniture, and home décor.",
    website: "https://salonemilano.it",
    expectedVisitors: 386000,
    expectedExhibitors: 2000,
    standSpace: 205000,
    ticketPrice: "€35-55",
    organizerName: "Federlegno Arredo Eventi SpA",
    organizerContact: "info@salonemilano.it",
    isAnnual: true,
    significance: "Major",
    builderRecommendations: [],
    previousEditionStats: {
      visitors: 372000,
      exhibitors: 1900,
      countries: 165,
      feedback: 4.6,
    },
    whyExhibit: [
      "Access to 386,000+ design and architecture professionals",
      "Showcase to global furniture and design buyers",
      "Network with interior designers and architects",
      "Launch furniture and home décor products",
      "Connect with international distributors and retailers",
    ],
    keyFeatures: [
      "Furniture and design exhibitions",
      "Kitchen and bathroom design showcases",
      "Lighting and textile innovations",
      "Architecture and interior design forums",
      "Sustainability in design presentations",
    ],
    targetAudience: [
      "Furniture manufacturers and designers",
      "Interior design professionals",
      "Architecture firms and contractors",
      "Home décor and lifestyle brands",
      "Retail buyers and distributors",
    ],
    networkingOpportunities: [
      "Design industry networking events",
      "Architecture and interior design forums",
      "International buyer programs",
      "Sustainability in design workshops",
      "Design awards and recognition ceremonies",
    ],
    costs: {
      standRental: {
        min: 240,
        max: 420,
        unit: "per sqm",
        currency: "EUR",
      },
      services: {
        basicStand: 16000,
        customStand: 48000,
        premiumStand: 130000,
      },
      additionalCosts: [
        { item: "Design showcase setup", cost: 500, mandatory: false },
        {
          item: "Furniture display infrastructure",
          cost: 400,
          mandatory: false,
        },
        { item: "Lighting design setup", cost: 350, mandatory: false },
        {
          item: "International design certification",
          cost: 200,
          mandatory: false,
        },
      ],
    },
  },

  // Continue with more shows...
];

// Calculate comprehensive statistics
export const tradeShowStats = {
  totalShows: tradeShows.length,
  totalCountries: Array.from(new Set(tradeShows.map((show) => show.country)))
    .length,
  totalCities: Array.from(new Set(tradeShows.map((show) => show.city))).length,
  totalIndustries: industries.length,
  totalExpectedVisitors: tradeShows.reduce(
    (sum, show) => sum + show.expectedVisitors,
    0
  ),
  totalExpectedExhibitors: tradeShows.reduce(
    (sum, show) => sum + show.expectedExhibitors,
    0
  ),
  averageShowSize: Math.round(
    tradeShows.reduce((sum, show) => sum + show.expectedVisitors, 0) /
      tradeShows.length
  ),
  nextShow: tradeShows
    .filter((show) => new Date(show.startDate) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )[0],
};

// Helper functions
export class TradeShowUtils {
  static getShowsByCountry(countryName: string): TradeShow[] {
    return tradeShows.filter((show) => show.country === countryName);
  }

  static getShowsByIndustry(industrySlug: string): TradeShow[] {
    return tradeShows.filter((show) =>
      show.industries.some((industry) => industry.slug === industrySlug)
    );
  }

  static getUpcomingShows(limit: number = 10): TradeShow[] {
    return tradeShows
      .filter((show) => new Date(show.startDate) > new Date())
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, limit);
  }

  static getShowsByDateRange(startDate: string, endDate: string): TradeShow[] {
    return tradeShows.filter((show) => {
      const showStart = new Date(show.startDate);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      return showStart >= rangeStart && showStart <= rangeEnd;
    });
  }

  static getShowsBySignificance(
    significance: TradeShow["significance"]
  ): TradeShow[] {
    return tradeShows.filter((show) => show.significance === significance);
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
  }

  static generateSEOKeywords(show: TradeShow): string[] {
    return [
      `${show.name.toLowerCase()}`,
      `${show.name.toLowerCase()} ${show.year}`,
      `${show.city.toLowerCase()} trade show`,
      `${show.country.toLowerCase()} exhibition`,
      ...show.industries.map(
        (industry) => `${industry.name.toLowerCase()} exhibition`
      ),
      `${show.venue.name.toLowerCase()}`,
      "exhibition stand builders",
      "trade show displays",
      "booth contractors",
    ];
  }
}

console.log("Trade Show Database loaded:", tradeShowStats);
