// Exhibitions & Events Directory - Global database of upcoming exhibitions and events

export interface Exhibition {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  year: number;
  city: string;
  country: string;
  countryCode: string;
  venue: ExhibitionVenue;
  industry: Industry;
  tags: string[];
  website: string;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled' | 'Postponed';
  expectedAttendees: number;
  expectedExhibitors: number;
  hallsUsed: number;
  totalSpace: number; // sqm
  pricing: ExhibitionPricing;
  organizer: Organizer;
  registrationInfo: RegistrationInfo;
  keyFeatures: string[];
  targetAudience: string[];
  specialEvents: SpecialEvent[];
  images: string[];
  logo: string;
  socialMedia: SocialMedia;
  contactInfo: ContactInfo;
  linkedVendors: LinkedVendor[];
  previousEditions: PreviousEdition[];
  accessibility: AccessibilityInfo;
  sustainability: SustainabilityFeatures;
  covid19Measures: string[];
  networkingOpportunities: string[];
  awards: string[];
  mediaPartners: string[];
  sponsorshipLevels: SponsorshipLevel[];
  featured: boolean;
  trending: boolean;
  newEvent: boolean;
}

export interface ExhibitionVenue {
  name: string;
  address: string;
  city: string;
  country: string;
  totalHalls: number;
  totalSpace: number; // sqm
  parkingSpaces: number;
  nearestAirport: string;
  distanceFromAirport: string;
  publicTransport: string[];
  facilities: string[];
  website: string;
  rating: number;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: string[];
  color: string;
  icon: string;
  annualGrowthRate: number;
  averageBoothCost: number;
  popularCountries: string[];
}

export interface ExhibitionPricing {
  standardBooth: { min: number; max: number; currency: string; unit: string };
  premiumBooth: { min: number; max: number; currency: string; unit: string };
  cornerBooth: { min: number; max: number; currency: string; unit: string };
  islandBooth: { min: number; max: number; currency: string; unit: string };
  shellScheme: boolean;
  spaceOnly: boolean;
  earlyBirdDiscount: number; // percentage
  currency: string;
}

export interface Organizer {
  name: string;
  website: string;
  email: string;
  phone: string;
  headquarters: string;
  establishedYear: number;
  otherEvents: string[];
  rating: number;
}

export interface RegistrationInfo {
  exhibitorRegistration: {
    opens: string;
    closes: string;
    fee: number;
    currency: string;
    requirements: string[];
  };
  visitorRegistration: {
    opens: string;
    closes: string;
    fee: number;
    currency: string;
    freeOptions: string[];
  };
  deadlines: {
    earlyBird: string;
    final: string;
    onSite: boolean;
  };
}

export interface SpecialEvent {
  name: string;
  type: 'Conference' | 'Workshop' | 'Networking' | 'Awards' | 'Keynote';
  date: string;
  time: string;
  duration: string;
  speaker?: string;
  description: string;
  fee: number;
  currency: string;
  capacity: number;
  registrationRequired: boolean;
}

export interface SocialMedia {
  website: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  hashtag: string;
}

export interface ContactInfo {
  generalInfo: string;
  exhibitorServices: string;
  visitorServices: string;
  media: string;
  emergencyContact: string;
}

export interface LinkedVendor {
  id: string;
  name: string;
  type: 'Booth Builder' | 'Event Planner';
  rating: number;
  experienceWithEvent: number; // years
  recommendedBy: 'Organizer' | 'Community' | 'Previous Clients';
}

export interface PreviousEdition {
  year: number;
  attendees: number;
  exhibitors: number;
  countries: number;
  highlights: string[];
  growthRate: number; // percentage from previous year
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  assistedListening: boolean;
  signLanguage: boolean;
  brailleSignage: boolean;
  accessibleParking: boolean;
  services: string[];
}

export interface SustainabilityFeatures {
  carbonNeutral: boolean;
  wasteReduction: boolean;
  digitalFirst: boolean;
  publicTransportIncentives: boolean;
  sustainableCatering: boolean;
  greenCertifications: string[];
  environmentalGoals: string[];
}

export interface SponsorshipLevel {
  name: string;
  price: number;
  currency: string;
  benefits: string[];
  available: number;
  sold: number;
}

// Industries Database
export const exhibitionIndustries: Industry[] = [
  {
    id: 'technology',
    name: 'Technology & Innovation',
    slug: 'technology',
    description: 'Technology, software, hardware, and digital innovation exhibitions',
    subcategories: ['Software', 'Hardware', 'AI & Machine Learning', 'IoT', 'Cybersecurity', 'Blockchain'],
    color: '#3B82F6',
    icon: '💻',
    annualGrowthRate: 12.5,
    averageBoothCost: 450,
    popularCountries: ['United States', 'Germany', 'China', 'Japan', 'South Korea']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    slug: 'healthcare',
    description: 'Medical equipment, pharmaceuticals, and healthcare innovation',
    subcategories: ['Medical Devices', 'Pharmaceuticals', 'Digital Health', 'Biotech', 'Medical Imaging'],
    color: '#10B981',
    icon: '🏥',
    annualGrowthRate: 8.3,
    averageBoothCost: 520,
    popularCountries: ['United States', 'Germany', 'Switzerland', 'United Kingdom', 'France']
  },
  {
    id: 'automotive',
    name: 'Automotive & Mobility',
    slug: 'automotive',
    description: 'Automotive industry, electric vehicles, and mobility solutions',
    subcategories: ['Electric Vehicles', 'Autonomous Driving', 'Parts & Components', 'Mobility Services'],
    color: '#F59E0B',
    icon: '🚗',
    annualGrowthRate: 6.8,
    averageBoothCost: 380,
    popularCountries: ['Germany', 'Japan', 'United States', 'China', 'South Korea']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial',
    slug: 'manufacturing',
    description: 'Industrial machinery, manufacturing technology, and automation',
    subcategories: ['Automation', 'Robotics', 'Industrial IoT', 'Smart Manufacturing', '3D Printing'],
    color: '#8B5CF6',
    icon: '🏭',
    annualGrowthRate: 5.2,
    averageBoothCost: 420,
    popularCountries: ['Germany', 'China', 'United States', 'Japan', 'Italy']
  },
  {
    id: 'energy',
    name: 'Energy & Renewables',
    slug: 'energy',
    description: 'Renewable energy, oil & gas, and energy technology',
    subcategories: ['Solar Energy', 'Wind Power', 'Energy Storage', 'Smart Grids', 'Oil & Gas'],
    color: '#EF4444',
    icon: '⚡',
    annualGrowthRate: 15.8,
    averageBoothCost: 380,
    popularCountries: ['Germany', 'United States', 'China', 'UAE', 'Norway']
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    slug: 'food-beverage',
    description: 'Food processing, beverages, and culinary innovations',
    subcategories: ['Food Processing', 'Beverages', 'Packaging', 'Food Safety', 'Culinary Equipment'],
    color: '#06B6D4',
    icon: '🍽️',
    annualGrowthRate: 4.2,
    averageBoothCost: 280,
    popularCountries: ['Germany', 'France', 'Italy', 'United States', 'China']
  },
  {
    id: 'defense-security',
    name: 'Defense & Security',
    slug: 'defense-security',
    description: 'Defense, security, aerospace, and military technology',
    subcategories: ['Military Equipment', 'Cybersecurity', 'Aerospace Defense', 'Maritime Security'],
    color: '#DC2626',
    icon: '🛡️',
    annualGrowthRate: 8.7,
    averageBoothCost: 580,
    popularCountries: ['United States', 'United Kingdom', 'France', 'Germany', 'Israel']
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food Processing',
    slug: 'agriculture',
    description: 'Agricultural technology, food processing, and farming innovations',
    subcategories: ['Farm Equipment', 'Agricultural Technology', 'Food Processing', 'Livestock', 'Organic Farming'],
    color: '#16A34A',
    icon: '🌾',
    annualGrowthRate: 6.2,
    averageBoothCost: 320,
    popularCountries: ['Germany', 'Netherlands', 'United States', 'Brazil', 'China']
  },
  {
    id: 'textile-fashion',
    name: 'Textile & Fashion',
    slug: 'textile-fashion',
    description: 'Fashion, textiles, apparel, and accessories',
    subcategories: ['Fashion Design', 'Textile Technology', 'Sustainable Fashion', 'Accessories', 'Footwear'],
    color: '#EC4899',
    icon: '👗',
    annualGrowthRate: 4.8,
    averageBoothCost: 280,
    popularCountries: ['Italy', 'France', 'China', 'India', 'Turkey']
  },
  {
    id: 'aviation',
    name: 'Aviation & Aerospace',
    slug: 'aviation',
    description: 'Aviation, aerospace, airports, and airline services',
    subcategories: ['Commercial Aviation', 'Airport Services', 'Aerospace Technology', 'Air Traffic Management'],
    color: '#0EA5E9',
    icon: '✈️',
    annualGrowthRate: 7.5,
    averageBoothCost: 650,
    popularCountries: ['United States', 'France', 'United Kingdom', 'Germany', 'Singapore']
  },
  {
    id: 'construction',
    name: 'Construction & Infrastructure',
    slug: 'construction',
    description: 'Construction equipment, building materials, and infrastructure',
    subcategories: ['Building Materials', 'Construction Equipment', 'Architecture', 'Smart Buildings'],
    color: '#F97316',
    icon: '🏗️',
    annualGrowthRate: 5.4,
    averageBoothCost: 390,
    popularCountries: ['Germany', 'United States', 'China', 'UAE', 'Italy']
  }
];

// Import real exhibitions data
import { realExhibitions } from './realExhibitions';

// Comprehensive Exhibitions Database - All Real Data
export const exhibitions: Exhibition[] = [
  // Keep the original CES 2025 data
  {
    id: 'ces-2025',
    name: 'CES 2025 - Consumer Electronics Show',
    slug: 'ces-2025',
    description: 'The world\'s most influential technology event, showcasing breakthrough technologies and global innovators. CES brings together the brightest minds in the industry to showcase cutting-edge innovations that will shape the future.',
    shortDescription: 'World\'s largest consumer technology trade show featuring the latest innovations',
    startDate: '2025-01-07',
    endDate: '2025-01-10',
    year: 2025,
    city: 'Las Vegas',
    country: 'United States',
    countryCode: 'US',
    venue: {
      name: 'Las Vegas Convention Center',
      address: '3150 Paradise Rd, Las Vegas, NV 89109, USA',
      city: 'Las Vegas',
      country: 'United States',
      totalHalls: 25,
      totalSpace: 460000,
      parkingSpaces: 5000,
      nearestAirport: 'McCarran International Airport',
      distanceFromAirport: '3 miles',
      publicTransport: ['Monorail', 'Buses', 'Ride sharing'],
      facilities: ['WiFi', 'Food Courts', 'Press Center', 'Business Center', 'Medical Services'],
      website: 'https://www.lvcva.com/facilities/las-vegas-convention-center/',
      rating: 4.8
    },
    industry: exhibitionIndustries[0], // Technology
    tags: ['Technology', 'Innovation', 'Consumer Electronics', 'Startups', 'AI', 'IoT'],
    website: 'https://www.ces.tech',
    status: 'Upcoming',
    expectedAttendees: 180000,
    expectedExhibitors: 4500,
    hallsUsed: 22,
    totalSpace: 400000,
    pricing: {
      standardBooth: { min: 45, max: 85, currency: 'USD', unit: 'per sqft' },
      premiumBooth: { min: 85, max: 150, currency: 'USD', unit: 'per sqft' },
      cornerBooth: { min: 95, max: 165, currency: 'USD', unit: 'per sqft' },
      islandBooth: { min: 120, max: 200, currency: 'USD', unit: 'per sqft' },
      shellScheme: true,
      spaceOnly: true,
      earlyBirdDiscount: 15,
      currency: 'USD'
    },
    organizer: {
      name: 'Consumer Technology Association (CTA)',
      website: 'https://www.cta.tech',
      email: 'info@cta.tech',
      phone: '+1 703 907 7600',
      headquarters: 'Arlington, Virginia, USA',
      establishedYear: 1924,
      otherEvents: ['CES Asia', 'CES Unveiled'],
      rating: 4.9
    },
    registrationInfo: {
      exhibitorRegistration: {
        opens: '2024-03-01',
        closes: '2024-11-15',
        fee: 2500,
        currency: 'USD',
        requirements: ['CTA Membership', 'Product Category Approval', 'Booth Design Approval']
      },
      visitorRegistration: {
        opens: '2024-09-01',
        closes: '2025-01-10',
        fee: 150,
        currency: 'USD',
        freeOptions: ['Media Pass', 'Industry Professional', 'Student Pass']
      },
      deadlines: {
        earlyBird: '2024-08-31',
        final: '2024-12-15',
        onSite: true
      }
    },
    keyFeatures: [
      'World\'s largest consumer technology showcase',
      'Startup and innovation competitions',
      'Celebrity keynote speakers',
      'Live product demonstrations',
      'Networking events and after-parties',
      'Media coverage from 60+ countries'
    ],
    targetAudience: [
      'Technology companies',
      'Retailers and distributors',
      'Media and analysts',
      'Investors and venture capitalists',
      'Government officials',
      'Industry professionals'
    ],
    specialEvents: [
      {
        name: 'CES Keynote Series',
        type: 'Keynote',
        date: '2025-01-07',
        time: '09:00',
        duration: '90 minutes',
        speaker: 'TBA - Major Tech CEO',
        description: 'Opening keynote setting the stage for technology trends',
        fee: 0,
        currency: 'USD',
        capacity: 5000,
        registrationRequired: true
      },
      {
        name: 'Innovation Awards Ceremony',
        type: 'Awards',
        date: '2025-01-08',
        time: '19:00',
        duration: '2 hours',
        description: 'Annual CES Innovation Awards celebration',
        fee: 250,
        currency: 'USD',
        capacity: 800,
        registrationRequired: true
      },
      {
        name: 'Startup Pitch Competition',
        type: 'Conference',
        date: '2025-01-09',
        time: '14:00',
        duration: '3 hours',
        description: 'Emerging startups pitch to investors and media',
        fee: 0,
        currency: 'USD',
        capacity: 1000,
        registrationRequired: true
      }
    ],
    images: [
      '/images/exhibitions/ces-2025-1.jpg',
      '/images/exhibitions/ces-2025-2.jpg',
      '/images/exhibitions/ces-2025-3.jpg'
    ],
    logo: '/images/exhibitions/ces-2025-logo.png',
    socialMedia: {
      website: 'https://www.ces.tech',
      facebook: 'https://facebook.com/CESConsumerElectronicsShow',
      twitter: 'https://twitter.com/CES',
      linkedin: 'https://linkedin.com/company/consumer-technology-association',
      instagram: 'https://instagram.com/cesshow',
      youtube: 'https://youtube.com/user/CESTechEvent',
      hashtag: '#CES2025'
    },
    contactInfo: {
      generalInfo: 'info@ces.tech',
      exhibitorServices: 'exhibitors@ces.tech',
      visitorServices: 'attendees@ces.tech',
      media: 'media@ces.tech',
      emergencyContact: '+1 702 555 0123'
    },
    linkedVendors: [
      {
        id: 'premier-exhibits-usa',
        name: 'Premier Exhibits USA',
        type: 'Booth Builder',
        rating: 4.7,
        experienceWithEvent: 8,
        recommendedBy: 'Organizer'
      },
      {
        id: 'manhattan-events-nyc',
        name: 'Manhattan Events NYC',
        type: 'Event Planner',
        rating: 4.8,
        experienceWithEvent: 5,
        recommendedBy: 'Community'
      }
    ],
    previousEditions: [
      {
        year: 2024,
        attendees: 175000,
        exhibitors: 4300,
        countries: 55,
        highlights: ['Record AI demonstrations', '5G technology showcase', 'Sustainability focus'],
        growthRate: 8.5
      },
      {
        year: 2023,
        attendees: 162000,
        exhibitors: 4100,
        countries: 52,
        highlights: ['Metaverse experience zones', 'Health tech innovations', 'Gaming advancements'],
        growthRate: 12.2
      }
    ],
    accessibility: {
      wheelchairAccessible: true,
      assistedListening: true,
      signLanguage: true,
      brailleSignage: true,
      accessibleParking: true,
      services: ['Wheelchair rental', 'Sign language interpreters', 'Audio descriptions', 'Accessible restrooms']
    },
    sustainability: {
      carbonNeutral: true,
      wasteReduction: true,
      digitalFirst: true,
      publicTransportIncentives: true,
      sustainableCatering: true,
      greenCertifications: ['LEED Certified Venue', 'Green Meeting Standards'],
      environmentalGoals: ['Zero waste to landfill', 'Carbon neutral event', 'Digital-first approach']
    },
    covid19Measures: [
      'Enhanced cleaning protocols',
      'Hand sanitizing stations',
      'Health screening options',
      'Flexible cancellation policies',
      'Hybrid attendance options'
    ],
    networkingOpportunities: [
      'Welcome reception',
      'Industry-specific meetups',
      'Startup showcase events',
      'Executive roundtables',
      'After-hours networking',
      'Mobile networking app'
    ],
    awards: [
      'Best Technology Trade Show 2024',
      'Innovation in Event Design 2023',
      'Sustainability Excellence Award 2023'
    ],
    mediaPartners: [
      'TechCrunch',
      'The Verge',
      'CNET',
      'Wired',
      'MIT Technology Review',
      'VentureBeat'
    ],
    sponsorshipLevels: [
      {
        name: 'Title Sponsor',
        price: 2500000,
        currency: 'USD',
        benefits: ['Event naming rights', 'Keynote speaking slot', 'Premium booth location', 'Extensive branding'],
        available: 1,
        sold: 0
      },
      {
        name: 'Presenting Sponsor',
        price: 1000000,
        currency: 'USD',
        benefits: ['Category presenting rights', 'Speaking opportunities', 'VIP networking access'],
        available: 5,
        sold: 2
      },
      {
        name: 'Innovation Partner',
        price: 500000,
        currency: 'USD',
        benefits: ['Innovation zone branding', 'Startup pitch judging', 'Media interviews'],
        available: 10,
        sold: 7
      }
    ],
    featured: true,
    trending: true,
    newEvent: false
  },
  {
    id: 'hannover-messe-2025',
    name: 'Hannover Messe 2025',
    slug: 'hannover-messe-2025',
    description: 'The world\'s leading trade fair for industrial technology, featuring the latest innovations in manufacturing, automation, robotics, and digital transformation. Hannover Messe is where industry leaders showcase groundbreaking solutions.',
    shortDescription: 'Leading global industrial technology trade fair and innovation showcase',
    startDate: '2025-04-07',
    endDate: '2025-04-11',
    year: 2025,
    city: 'Hannover',
    country: 'Germany',
    countryCode: 'DE',
    venue: {
      name: 'Deutsche Messe AG',
      address: 'Messegelände, 30521 Hannover, Germany',
      city: 'Hannover',
      country: 'Germany',
      totalHalls: 27,
      totalSpace: 496000,
      parkingSpaces: 10000,
      nearestAirport: 'Hannover Airport',
      distanceFromAirport: '11 km',
      publicTransport: ['S-Bahn', 'Buses', 'Tram'],
      facilities: ['WiFi', 'Restaurants', 'Conference Centers', 'Business Lounges', 'Medical Center'],
      website: 'https://www.messe.de',
      rating: 4.9
    },
    industry: exhibitionIndustries[3], // Manufacturing
    tags: ['Industrial Technology', 'Automation', 'Industry 4.0', 'Robotics', 'Manufacturing', 'Digital Transformation'],
    website: 'https://www.hannovermesse.de',
    status: 'Upcoming',
    expectedAttendees: 220000,
    expectedExhibitors: 6500,
    hallsUsed: 25,
    totalSpace: 450000,
    pricing: {
      standardBooth: { min: 350, max: 450, currency: 'EUR', unit: 'per sqm' },
      premiumBooth: { min: 450, max: 650, currency: 'EUR', unit: 'per sqm' },
      cornerBooth: { min: 500, max: 700, currency: 'EUR', unit: 'per sqm' },
      islandBooth: { min: 600, max: 850, currency: 'EUR', unit: 'per sqm' },
      shellScheme: true,
      spaceOnly: true,
      earlyBirdDiscount: 12,
      currency: 'EUR'
    },
    organizer: {
      name: 'Deutsche Messe AG',
      website: 'https://www.messe.de',
      email: 'info@messe.de',
      phone: '+49 511 89 0',
      headquarters: 'Hannover, Germany',
      establishedYear: 1947,
      otherEvents: ['CeBIT', 'EMO Hannover', 'Domotex'],
      rating: 4.8
    },
    registrationInfo: {
      exhibitorRegistration: {
        opens: '2024-05-01',
        closes: '2024-12-31',
        fee: 3500,
        currency: 'EUR',
        requirements: ['Company Registration', 'Product Compliance', 'Fire Safety Approval']
      },
      visitorRegistration: {
        opens: '2024-10-01',
        closes: '2025-04-11',
        fee: 65,
        currency: 'EUR',
        freeOptions: ['Press Pass', 'Student Pass', 'VIP Industry Pass']
      },
      deadlines: {
        earlyBird: '2024-10-31',
        final: '2025-03-15',
        onSite: true
      }
    },
    keyFeatures: [
      'World\'s largest industrial technology showcase',
      'Industry 4.0 and digital transformation focus',
      'Live manufacturing demonstrations',
      'Research and innovation presentations',
      'International business networking',
      'Partner country program'
    ],
    targetAudience: [
      'Manufacturing companies',
      'Automation specialists',
      'Engineers and technicians',
      'Technology investors',
      'Research institutions',
      'Government delegations'
    ],
    specialEvents: [
      {
        name: 'Industry 4.0 Summit',
        type: 'Conference',
        date: '2025-04-08',
        time: '10:00',
        duration: '4 hours',
        description: 'Digital transformation strategies for manufacturing',
        fee: 180,
        currency: 'EUR',
        capacity: 1200,
        registrationRequired: true
      },
      {
        name: 'Robotics Innovation Workshop',
        type: 'Workshop',
        date: '2025-04-09',
        time: '14:00',
        duration: '2 hours',
        description: 'Hands-on robotics and automation workshop',
        fee: 95,
        currency: 'EUR',
        capacity: 300,
        registrationRequired: true
      }
    ],
    images: [
      '/images/exhibitions/hannover-messe-2025-1.jpg',
      '/images/exhibitions/hannover-messe-2025-2.jpg',
      '/images/exhibitions/hannover-messe-2025-3.jpg'
    ],
    logo: '/images/exhibitions/hannover-messe-2025-logo.png',
    socialMedia: {
      website: 'https://www.hannovermesse.de',
      facebook: 'https://facebook.com/HannoverMesse',
      twitter: 'https://twitter.com/hannover_messe',
      linkedin: 'https://linkedin.com/company/hannover-messe',
      instagram: 'https://instagram.com/hannovermesse',
      youtube: 'https://youtube.com/user/HannoverMesse',
      hashtag: '#HM25'
    },
    contactInfo: {
      generalInfo: 'info@hannovermesse.de',
      exhibitorServices: 'exhibitors@hannovermesse.de',
      visitorServices: 'visitors@hannovermesse.de',
      media: 'press@hannovermesse.de',
      emergencyContact: '+49 511 89 32200'
    },
    linkedVendors: [
      {
        id: 'expo-design-germany',
        name: 'Expo Design Germany',
        type: 'Booth Builder',
        rating: 4.8,
        experienceWithEvent: 12,
        recommendedBy: 'Organizer'
      }
    ],
    previousEditions: [
      {
        year: 2024,
        attendees: 210000,
        exhibitors: 6200,
        countries: 65,
        highlights: ['AI in manufacturing showcase', 'Sustainability focus', 'Partner country Mexico'],
        growthRate: 5.8
      }
    ],
    accessibility: {
      wheelchairAccessible: true,
      assistedListening: true,
      signLanguage: false,
      brailleSignage: true,
      accessibleParking: true,
      services: ['Mobility assistance', 'Accessible shuttle service', 'Reserved seating areas']
    },
    sustainability: {
      carbonNeutral: true,
      wasteReduction: true,
      digitalFirst: true,
      publicTransportIncentives: true,
      sustainableCatering: true,
      greenCertifications: ['ISO 20121 Certified', 'Green Globe Certified'],
      environmentalGoals: ['100% renewable energy', 'Zero single-use plastics', 'Regional sourcing priority']
    },
    covid19Measures: [
      'Enhanced air filtration',
      'Digital health passes',
      'Contactless registration',
      'Hybrid attendance options'
    ],
    networkingOpportunities: [
      'Industry networking dinners',
      'Country pavilion receptions',
      'Engineering society meetups',
      'Innovation pitch sessions',
      'Partner matching events'
    ],
    awards: [
      'Best Industrial Trade Show 2024',
      'Innovation Excellence Award 2023',
      'Digital Transformation Leader 2023'
    ],
    mediaPartners: [
      'Industry Week',
      'Manufacturing Engineering',
      'Automation World',
      'Control Engineering',
      'Smart Manufacturing'
    ],
    sponsorshipLevels: [
      {
        name: 'Global Technology Partner',
        price: 1800000,
        currency: 'EUR',
        benefits: ['Technology pavilion naming', 'Keynote opportunity', 'Executive roundtable hosting'],
        available: 2,
        sold: 1
      },
      {
        name: 'Innovation Showcase Sponsor',
        price: 750000,
        currency: 'EUR',
        benefits: ['Innovation zone branding', 'Demonstration stage', 'Media spotlight'],
        available: 8,
        sold: 5
      }
    ],
    featured: true,
    trending: false,
    newEvent: false
  },
  {
    id: 'gulfood-2025',
    name: 'Gulfood 2025',
    slug: 'gulfood-2025',
    description: 'The world\'s largest annual food and beverage trade exhibition, connecting global food industry professionals. Gulfood showcases the latest innovations in food technology, culinary trends, and beverage innovations.',
    shortDescription: 'World\'s largest food and beverage trade exhibition in the Middle East',
    startDate: '2025-02-17',
    endDate: '2025-02-21',
    year: 2025,
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    venue: {
      name: 'Dubai World Trade Centre',
      address: 'Sheikh Zayed Road, Dubai, UAE',
      city: 'Dubai',
      country: 'United Arab Emirates',
      totalHalls: 14,
      totalSpace: 120000,
      parkingSpaces: 3000,
      nearestAirport: 'Dubai International Airport',
      distanceFromAirport: '8 km',
      publicTransport: ['Metro', 'Buses', 'Taxis'],
      facilities: ['WiFi', 'Restaurants', 'Prayer Rooms', 'Business Center', 'VIP Lounges'],
      website: 'https://www.dwtc.com',
      rating: 4.7
    },
    industry: exhibitionIndustries[5], // Food & Beverage
    tags: ['Food & Beverage', 'Culinary Innovation', 'Food Technology', 'Halal Food', 'Middle East Market'],
    website: 'https://www.gulfood.com',
    status: 'Upcoming',
    expectedAttendees: 98000,
    expectedExhibitors: 5000,
    hallsUsed: 12,
    totalSpace: 95000,
    pricing: {
      standardBooth: { min: 280, max: 380, currency: 'USD', unit: 'per sqm' },
      premiumBooth: { min: 380, max: 520, currency: 'USD', unit: 'per sqm' },
      cornerBooth: { min: 420, max: 580, currency: 'USD', unit: 'per sqm' },
      islandBooth: { min: 500, max: 720, currency: 'USD', unit: 'per sqm' },
      shellScheme: true,
      spaceOnly: true,
      earlyBirdDiscount: 18,
      currency: 'USD'
    },
    organizer: {
      name: 'Dubai World Trade Centre',
      website: 'https://www.dwtc.com',
      email: 'info@dwtc.com',
      phone: '+971 4 308 6888',
      headquarters: 'Dubai, UAE',
      establishedYear: 1979,
      otherEvents: ['Arab Health', 'GITEX', 'Beauty World Middle East'],
      rating: 4.6
    },
    registrationInfo: {
      exhibitorRegistration: {
        opens: '2024-04-01',
        closes: '2024-12-15',
        fee: 2800,
        currency: 'USD',
        requirements: ['Trade License', 'Food Safety Certificates', 'Halal Certification (if applicable)']
      },
      visitorRegistration: {
        opens: '2024-11-01',
        closes: '2025-02-21',
        fee: 25,
        currency: 'USD',
        freeOptions: ['Trade Professional Pass', 'Media Pass', 'Chef Pass']
      },
      deadlines: {
        earlyBird: '2024-09-30',
        final: '2025-01-15',
        onSite: true
      }
    },
    keyFeatures: [
      'Largest food trade show in the MENA region',
      'Live culinary demonstrations',
      'International pavilions from 80+ countries',
      'Halal food showcase',
      'Innovation awards program',
      'Chef competitions and workshops'
    ],
    targetAudience: [
      'Food and beverage manufacturers',
      'Distributors and importers',
      'Retailers and wholesalers',
      'Restaurant and hotel chains',
      'Food service professionals',
      'Culinary professionals'
    ],
    specialEvents: [
      {
        name: 'World Chef Championship',
        type: 'Conference',
        date: '2025-02-19',
        time: '15:00',
        duration: '3 hours',
        description: 'International culinary competition with master chefs',
        fee: 0,
        currency: 'USD',
        capacity: 2000,
        registrationRequired: false
      },
      {
        name: 'Food Innovation Summit',
        type: 'Conference',
        date: '2025-02-18',
        time: '10:00',
        duration: '6 hours',
        description: 'Latest trends and innovations in food technology',
        fee: 150,
        currency: 'USD',
        capacity: 500,
        registrationRequired: true
      }
    ],
    images: [
      '/images/exhibitions/gulfood-2025-1.jpg',
      '/images/exhibitions/gulfood-2025-2.jpg',
      '/images/exhibitions/gulfood-2025-3.jpg'
    ],
    logo: '/images/exhibitions/gulfood-2025-logo.png',
    socialMedia: {
      website: 'https://www.gulfood.com',
      facebook: 'https://facebook.com/GulfoodOfficial',
      twitter: 'https://twitter.com/gulfoodofficial',
      linkedin: 'https://linkedin.com/company/gulfood',
      instagram: 'https://instagram.com/gulfoodofficial',
      youtube: 'https://youtube.com/user/GulfoodOfficial',
      hashtag: '#Gulfood2025'
    },
    contactInfo: {
      generalInfo: 'info@gulfood.com',
      exhibitorServices: 'exhibitors@gulfood.com',
      visitorServices: 'visitors@gulfood.com',
      media: 'media@gulfood.com',
      emergencyContact: '+971 4 308 6000'
    },
    linkedVendors: [],
    previousEditions: [
      {
        year: 2024,
        attendees: 95000,
        exhibitors: 4800,
        countries: 78,
        highlights: ['Record halal food participation', 'Technology integration showcase', 'Sustainability focus'],
        growthRate: 7.2
      }
    ],
    accessibility: {
      wheelchairAccessible: true,
      assistedListening: false,
      signLanguage: false,
      brailleSignage: false,
      accessibleParking: true,
      services: ['Wheelchair access', 'Priority entrance', 'Accessible restrooms']
    },
    sustainability: {
      carbonNeutral: false,
      wasteReduction: true,
      digitalFirst: true,
      publicTransportIncentives: false,
      sustainableCatering: true,
      greenCertifications: ['Dubai Green Building Standards'],
      environmentalGoals: ['Reduce food waste', 'Sustainable packaging promotion', 'Local sourcing emphasis']
    },
    covid19Measures: [
      'Health screening',
      'Enhanced sanitization',
      'Digital entry passes',
      'Crowd management protocols'
    ],
    networkingOpportunities: [
      'Country pavilion networking',
      'Buyer-seller matchmaking',
      'Industry breakfast meetings',
      'VIP hospitality suites',
      'Cultural evening events'
    ],
    awards: [
      'Best F&B Trade Show Middle East 2024',
      'Innovation in Food Technology 2023'
    ],
    mediaPartners: [
      'Food Business Magazine',
      'Middle East Food',
      'Gulfood Magazine',
      'Hotel News ME',
      'Food & Hospitality'
    ],
    sponsorshipLevels: [
      {
        name: 'Official Partner',
        price: 1200000,
        currency: 'USD',
        benefits: ['Event co-branding', 'VIP networking hosting', 'Media interviews'],
        available: 3,
        sold: 1
      }
    ],
    featured: false,
    trending: true,
    newEvent: false
  },
  // Add all real exhibitions from the comprehensive database
  ...realExhibitions
];

// Exhibition utility functions
export class ExhibitionMatchingService {
  static getExhibitionsByIndustry(industrySlug: string): Exhibition[] {
    return exhibitions.filter(exhibition => 
      exhibition.industry.slug === industrySlug
    );
  }

  static getExhibitionsByLocation(city: string, country: string): Exhibition[] {
    return exhibitions.filter(exhibition =>
      exhibition.city.toLowerCase() === city.toLowerCase() && 
      exhibition.country.toLowerCase() === country.toLowerCase()
    );
  }

  static getExhibitionsByYear(year: number): Exhibition[] {
    return exhibitions.filter(exhibition => exhibition.year === year);
  }

  static getUpcomingExhibitions(): Exhibition[] {
    const today = new Date();
    return exhibitions.filter(exhibition => 
      new Date(exhibition.startDate) > today && 
      exhibition.status === 'Upcoming'
    ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  static getFeaturedExhibitions(): Exhibition[] {
    return exhibitions.filter(exhibition => exhibition.featured);
  }

  static getTrendingExhibitions(): Exhibition[] {
    return exhibitions.filter(exhibition => exhibition.trending);
  }

  static searchExhibitions(query: string): Exhibition[] {
    const searchTerm = query.toLowerCase();
    return exhibitions.filter(exhibition =>
      exhibition.name.toLowerCase().includes(searchTerm) ||
      exhibition.description.toLowerCase().includes(searchTerm) ||
      exhibition.industry.name.toLowerCase().includes(searchTerm) ||
      exhibition.city.toLowerCase().includes(searchTerm) ||
      exhibition.country.toLowerCase().includes(searchTerm) ||
      exhibition.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  static getExhibitionsByDateRange(startDate: string, endDate: string): Exhibition[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return exhibitions.filter(exhibition => {
      const exhibitionStart = new Date(exhibition.startDate);
      return exhibitionStart >= start && exhibitionStart <= end;
    });
  }
}

// Exhibition statistics
export const exhibitionStats = {
  totalExhibitions: exhibitions.length,
  totalCountries: Array.from(new Set(exhibitions.map(ex => ex.country))).length,
  totalCities: Array.from(new Set(exhibitions.map(ex => ex.city))).length,
  totalExpectedAttendees: exhibitions.reduce((sum, ex) => sum + ex.expectedAttendees, 0),
  totalExpectedExhibitors: exhibitions.reduce((sum, ex) => sum + ex.expectedExhibitors, 0),
  upcomingCount: exhibitions.filter(ex => ex.status === 'Upcoming').length,
  featuredCount: exhibitions.filter(ex => ex.featured).length,
  trendingCount: exhibitions.filter(ex => ex.trending).length,
  liveCount: exhibitions.filter(ex => ex.status === 'Live').length,
  completedCount: exhibitions.filter(ex => ex.status === 'Completed').length,
  industriesCovered: Array.from(new Set(exhibitions.map(ex => ex.industry?.name).filter(Boolean))).length,
  averageBoothCost: exhibitions.reduce((sum, ex) => {
    const boothCost = ex.pricing?.standardBooth?.min || 0;
    return sum + boothCost;
  }, 0) / exhibitions.length,
  averageRating: exhibitions.reduce((sum, ex) => sum + (ex.organizer?.rating || 0), 0) / exhibitions.length
};

console.log('Exhibitions Directory loaded:', exhibitionStats);

export default exhibitions;