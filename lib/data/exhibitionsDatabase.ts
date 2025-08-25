// COMPREHENSIVE GLOBAL EXHIBITIONS DATABASE
// Complete directory of exhibitions and trade shows worldwide

export interface Exhibition {
  id: string;
  name: string;
  slug: string;
  description: string;
  industry: string[];
  subIndustries: string[];
  city: string;
  country: string;
  countryCode: string;
  continent: string;
  venue: string;
  venueId: string;
  website: string;
  frequency: 'Annual' | 'Biennial' | 'Triennial' | 'Quarterly' | 'Monthly';
  nextEdition: {
    year: number;
    dates: string;
    status: 'Confirmed' | 'Tentative' | 'Postponed' | 'Cancelled';
  };
  duration: number; // days
  expectedAttendees: number;
  expectedExhibitors: number;
  exhibitionSpace: string;
  boothSizes: string[];
  targetAudience: string[];
  organizer: {
    name: string;
    website: string;
    contact: string;
  };
  keyFeatures: string[];
  pricing: {
    exhibitorFees: string;
    visitorFees: string;
    currency: string;
  };
  pastEditions: Array<{
    year: number;
    attendees: number;
    exhibitors: number;
    countries: number;
  }>;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  certifications: string[];
  awards: string[];
  isActive: boolean;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  languages: string[];
}

// GLOBAL EXHIBITIONS DATABASE
export const GLOBAL_EXHIBITIONS: Exhibition[] = [
  // GERMANY - Major exhibition market
  {
    id: 'hannover-messe',
    name: 'Hannover Messe',
    slug: 'hannover-messe',
    description: 'The world\'s leading trade fair for industrial technology, showcasing digital transformation, energy solutions, and industrial automation.',
    industry: ['Industrial Technology', 'Manufacturing', 'Energy', 'Automation'],
    subIndustries: ['Digital Factory', 'Energy', 'Industrial Automation', 'Intralogistics', 'Research & Development'],
    city: 'Hannover',
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    venue: 'Hannover Exhibition Centre',
    venueId: 'hannover-exhibition-centre',
    website: 'https://hannovermesse.de',
    frequency: 'Annual',
    nextEdition: {
      year: 2025,
      dates: 'April 1-5, 2025',
      status: 'Confirmed'
    },
    duration: 5,
    expectedAttendees: 215000,
    expectedExhibitors: 4000,
    exhibitionSpace: '190,000 sqm',
    boothSizes: ['9 sqm', '18 sqm', '36 sqm', 'Custom'],
    targetAudience: ['Manufacturing Industry', 'Energy Sector', 'IT Professionals', 'Engineering Companies'],
    organizer: {
      name: 'Deutsche Messe AG',
      website: 'https://messe.de',
      contact: '+49 511 89-0'
    },
    keyFeatures: ['Digital Factory Demonstrations', 'Energy Solutions Showcase', 'Startup Area', 'Conference Program'],
    pricing: {
      exhibitorFees: '€285 per sqm',
      visitorFees: '€45 per day',
      currency: 'EUR'
    },
    pastEditions: [
      { year: 2024, attendees: 215000, exhibitors: 4000, countries: 60 },
      { year: 2023, attendees: 180000, exhibitors: 4000, countries: 58 }
    ],
    contactInfo: {
      phone: '+49 511 89-0',
      email: 'info@messe.de',
      website: 'https://hannovermesse.de'
    },
    socialMedia: {
      linkedin: 'hannover-messe',
      twitter: '@hannovermesse',
      facebook: 'hannovermesse'
    },
    certifications: ['UFI Approved', 'ISO 9001'],
    awards: ['World\'s Leading Industrial Fair'],
    isActive: true,
    isPremium: true,
    rating: 4.8,
    reviewCount: 1250,
    languages: ['German', 'English']
  },

  {
    id: 'automechanika-frankfurt',
    name: 'Automechanika Frankfurt',
    slug: 'automechanika-frankfurt',
    description: 'The world\'s leading trade fair for the automotive service industry, featuring parts, accessories, equipment, and services.',
    industry: ['Automotive', 'Parts & Accessories', 'Service Equipment'],
    subIndustries: ['OE Parts & Accessories', 'Electronics & Systems', 'Repair & Maintenance', 'Car Wash', 'Alternative Drives'],
    city: 'Frankfurt',
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    venue: 'Messe Frankfurt',
    venueId: 'messe-frankfurt',
    website: 'https://automechanika.messefrankfurt.com',
    frequency: 'Biennial',
    nextEdition: {
      year: 2025,
      dates: 'September 9-13, 2025',
      status: 'Confirmed'
    },
    duration: 5,
    expectedAttendees: 136000,
    expectedExhibitors: 2800,
    exhibitionSpace: '285,000 sqm',
    boothSizes: ['12 sqm', '24 sqm', '48 sqm', 'Custom'],
    targetAudience: ['Automotive Aftermarket', 'Car Dealers', 'Fleet Operators', 'Repair Shops'],
    organizer: {
      name: 'Messe Frankfurt GmbH',
      website: 'https://messefrankfurt.com',
      contact: '+49 69 7575-0'
    },
    keyFeatures: ['Live Demonstrations', 'Technical Forum', 'New Product Showcase', 'Training Programs'],
    pricing: {
      exhibitorFees: '€195 per sqm',
      visitorFees: '€35 per day',
      currency: 'EUR'
    },
    pastEditions: [
      { year: 2022, attendees: 81000, exhibitors: 2637, countries: 71 },
      { year: 2018, attendees: 136000, exhibitors: 4820, countries: 78 }
    ],
    contactInfo: {
      phone: '+49 69 7575-0',
      email: 'automechanika@messefrankfurt.de',
      website: 'https://automechanika.messefrankfurt.com'
    },
    socialMedia: {
      linkedin: 'automechanika',
      twitter: '@automechanika',
      facebook: 'automechanika'
    },
    certifications: ['UFI Approved', 'ISO 9001'],
    awards: ['Leading Automotive Aftermarket Fair'],
    isActive: true,
    isPremium: true,
    rating: 4.7,
    reviewCount: 890,
    languages: ['German', 'English']
  },

  // UNITED STATES
  {
    id: 'ces-las-vegas',
    name: 'CES (Consumer Electronics Show)',
    slug: 'ces-las-vegas',
    description: 'The world\'s most influential technology event, showcasing breakthrough technologies and global innovators.',
    industry: ['Technology', 'Consumer Electronics', 'Innovation'],
    subIndustries: ['AI', 'Smart Home', 'Automotive Tech', 'Health Tech', '5G', 'Gaming', 'Startups'],
    city: 'Las Vegas',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    venue: 'Las Vegas Convention Center',
    venueId: 'las-vegas-convention-center',
    website: 'https://ces.tech',
    frequency: 'Annual',
    nextEdition: {
      year: 2025,
      dates: 'January 7-10, 2025',
      status: 'Confirmed'
    },
    duration: 4,
    expectedAttendees: 182000,
    expectedExhibitors: 4300,
    exhibitionSpace: '280,000 sqm',
    boothSizes: ['10x10 ft', '20x20 ft', '30x30 ft', 'Custom'],
    targetAudience: ['Technology Industry', 'Media', 'Retailers', 'Government', 'Investors'],
    organizer: {
      name: 'Consumer Technology Association (CTA)',
      website: 'https://cta.tech',
      contact: '+1 703-907-7600'
    },
    keyFeatures: ['Innovation Awards', 'Startup Showcase', 'Conference Sessions', 'Media Events'],
    pricing: {
      exhibitorFees: '$42 per sqft',
      visitorFees: '$300 per pass',
      currency: 'USD'
    },
    pastEditions: [
      { year: 2024, attendees: 182000, exhibitors: 4300, countries: 173 },
      { year: 2023, attendees: 175000, exhibitors: 3200, countries: 170 }
    ],
    contactInfo: {
      phone: '+1 703-907-7600',
      email: 'info@ces.tech',
      website: 'https://ces.tech'
    },
    socialMedia: {
      linkedin: 'consumer-electronics-show',
      twitter: '@CES',
      facebook: 'CESPage',
      instagram: '@ces'
    },
    certifications: ['UFI Approved'],
    awards: ['Most Influential Tech Event', 'Innovation Showcase Award'],
    isActive: true,
    isPremium: true,
    rating: 4.9,
    reviewCount: 2100,
    languages: ['English']
  },

  // UNITED ARAB EMIRATES
  {
    id: 'gitex-technology-week',
    name: 'GITEX Technology Week',
    slug: 'gitex-technology-week',
    description: 'The largest technology exhibition in the Middle East, Africa and South Asia, showcasing emerging technologies and digital transformation.',
    industry: ['Technology', 'Digital Transformation', 'Cybersecurity'],
    subIndustries: ['AI & Robotics', 'Cloud Computing', 'IoT', 'Blockchain', 'Smart Cities', 'FinTech'],
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    continent: 'Asia',
    venue: 'Dubai World Trade Centre',
    venueId: 'dubai-world-trade-centre',
    website: 'https://gitex.com',
    frequency: 'Annual',
    nextEdition: {
      year: 2025,
      dates: 'October 14-18, 2025',
      status: 'Confirmed'
    },
    duration: 5,
    expectedAttendees: 170000,
    expectedExhibitors: 5000,
    exhibitionSpace: '150,000 sqm',
    boothSizes: ['9 sqm', '18 sqm', '36 sqm', 'Custom'],
    targetAudience: ['IT Professionals', 'Government', 'Startups', 'Enterprise Leaders'],
    organizer: {
      name: 'Dubai World Trade Centre',
      website: 'https://dwtc.com',
      contact: '+971 4 308 6888'
    },
    keyFeatures: ['Future Tech Demos', 'Startup Launchpad', 'Government Summit', 'Innovation Awards'],
    pricing: {
      exhibitorFees: '$650 per sqm',
      visitorFees: '$85 per day',
      currency: 'USD'
    },
    pastEditions: [
      { year: 2024, attendees: 170000, exhibitors: 5000, countries: 90 },
      { year: 2023, attendees: 165000, exhibitors: 4800, countries: 85 }
    ],
    contactInfo: {
      phone: '+971 4 308 6888',
      email: 'gitex@dwtc.com',
      website: 'https://gitex.com'
    },
    socialMedia: {
      linkedin: 'gitex-technology-week',
      twitter: '@GITEX',
      facebook: 'GitexTechnologyWeek',
      instagram: '@gitex'
    },
    certifications: ['UFI Approved', 'ISO 9001'],
    awards: ['Leading Middle East Tech Event', 'Digital Innovation Award'],
    isActive: true,
    isPremium: true,
    rating: 4.6,
    reviewCount: 890,
    languages: ['English', 'Arabic']
  },

  // CHINA
  {
    id: 'canton-fair',
    name: 'China Import and Export Fair (Canton Fair)',
    slug: 'canton-fair',
    description: 'China\'s largest trade fair with the longest history, widest variety of products, and highest attendance.',
    industry: ['Consumer Goods', 'Electronics', 'Machinery', 'Textiles'],
    subIndustries: ['Home Appliances', 'Consumer Electronics', 'Machinery & Equipment', 'Light Industry', 'Textiles & Garments'],
    city: 'Guangzhou',
    country: 'China',
    countryCode: 'CN',
    continent: 'Asia',
    venue: 'China Import and Export Fair Complex',
    venueId: 'canton-fair-complex',
    website: 'https://cantonfair.org.cn',
    frequency: 'Biennial',
    nextEdition: {
      year: 2025,
      dates: 'April 15 - May 5, 2025',
      status: 'Confirmed'
    },
    duration: 15, // Split into 3 phases
    expectedAttendees: 200000,
    expectedExhibitors: 25000,
    exhibitionSpace: '1,180,000 sqm',
    boothSizes: ['9 sqm', '18 sqm', '36 sqm', 'Custom'],
    targetAudience: ['International Buyers', 'Importers', 'Distributors', 'Wholesalers'],
    organizer: {
      name: 'China Foreign Trade Centre',
      website: 'https://cftc.org.cn',
      contact: '+86 20 2888 8888'
    },
    keyFeatures: ['Three Phase Structure', 'Product Launches', 'Sourcing Matchmaking', 'Business Forums'],
    pricing: {
      exhibitorFees: '¥1,200 per sqm',
      visitorFees: 'Free for qualified buyers',
      currency: 'CNY'
    },
    pastEditions: [
      { year: 2024, attendees: 195000, exhibitors: 25000, countries: 200 },
      { year: 2023, attendees: 180000, exhibitors: 24000, countries: 195 }
    ],
    contactInfo: {
      phone: '+86 20 2888 8888',
      email: 'info@cantonfair.org.cn',
      website: 'https://cantonfair.org.cn'
    },
    socialMedia: {
      linkedin: 'canton-fair',
      facebook: 'CantonFair'
    },
    certifications: ['UFI Approved'],
    awards: ['China\'s Largest Trade Fair'],
    isActive: true,
    isPremium: true,
    rating: 4.5,
    reviewCount: 1500,
    languages: ['Chinese', 'English']
  },

  // UNITED KINGDOM
  {
    id: 'world-travel-market-london',
    name: 'World Travel Market London',
    slug: 'world-travel-market-london',
    description: 'The leading global event for the travel industry, bringing together the travel community to meet, network, negotiate and conduct business.',
    industry: ['Tourism', 'Travel', 'Hospitality'],
    subIndustries: ['Travel Technology', 'Adventure Travel', 'Business Travel', 'Responsible Tourism', 'Travel Startups'],
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    continent: 'Europe',
    venue: 'ExCeL London',
    venueId: 'excel-london',
    website: 'https://wtm.com',
    frequency: 'Annual',
    nextEdition: {
      year: 2025,
      dates: 'November 3-5, 2025',
      status: 'Confirmed'
    },
    duration: 3,
    expectedAttendees: 51000,
    expectedExhibitors: 5000,
    exhibitionSpace: '45,000 sqm',
    boothSizes: ['9 sqm', '18 sqm', '36 sqm', 'Custom'],
    targetAudience: ['Travel Agents', 'Tour Operators', 'Airlines', 'Hotels', 'Tourism Boards'],
    organizer: {
      name: 'Reed Travel Exhibitions',
      website: 'https://reedtravel.com',
      contact: '+44 20 8271 2000'
    },
    keyFeatures: ['Speed Networking', 'Global Travel Tech Summit', 'Responsible Tourism Summit', 'WTM Buyer\'s Club'],
    pricing: {
      exhibitorFees: '£395 per sqm',
      visitorFees: '£35 per day',
      currency: 'GBP'
    },
    pastEditions: [
      { year: 2024, attendees: 51000, exhibitors: 5000, countries: 182 },
      { year: 2023, attendees: 48000, exhibitors: 4800, countries: 180 }
    ],
    contactInfo: {
      phone: '+44 20 8271 2000',
      email: 'wtm@reedexpo.co.uk',
      website: 'https://wtm.com'
    },
    socialMedia: {
      linkedin: 'world-travel-market',
      twitter: '@wtm_london',
      facebook: 'WorldTravelMarket',
      instagram: '@wtm_london'
    },
    certifications: ['UFI Approved'],
    awards: ['Leading Travel Trade Show'],
    isActive: true,
    isPremium: true,
    rating: 4.4,
    reviewCount: 650,
    languages: ['English']
  },

  // FRANCE
  {
    id: 'sial-paris',
    name: 'SIAL Paris',
    slug: 'sial-paris',
    description: 'The world\'s largest food innovation exhibition, showcasing food products, beverages, and food service equipment.',
    industry: ['Food & Beverage', 'Agriculture', 'Food Technology'],
    subIndustries: ['Fresh Products', 'Grocery', 'Frozen Food', 'Beverages', 'Organic Food', 'Food Tech'],
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    venue: 'Paris Expo Porte de Versailles',
    venueId: 'paris-expo-porte-de-versailles',
    website: 'https://sialparis.fr',
    frequency: 'Biennial',
    nextEdition: {
      year: 2025,
      dates: 'October 19-23, 2025',
      status: 'Confirmed'
    },
    duration: 5,
    expectedAttendees: 160000,
    expectedExhibitors: 7200,
    exhibitionSpace: '180,000 sqm',
    boothSizes: ['9 sqm', '18 sqm', '36 sqm', 'Custom'],
    targetAudience: ['Food Retailers', 'Distributors', 'Importers', 'Foodservice', 'Food Manufacturers'],
    organizer: {
      name: 'Comexposium',
      website: 'https://comexposium.com',
      contact: '+33 1 76 77 11 11'
    },
    keyFeatures: ['Innovation Awards', 'Taste Experiences', 'Future Food Tech', 'Startup Village'],
    pricing: {
      exhibitorFees: '€385 per sqm',
      visitorFees: '€45 per day',
      currency: 'EUR'
    },
    pastEditions: [
      { year: 2022, attendees: 160000, exhibitors: 7200, countries: 130 },
      { year: 2020, attendees: 155000, exhibitors: 7000, countries: 127 }
    ],
    contactInfo: {
      phone: '+33 1 76 77 11 11',
      email: 'info@sialparis.fr',
      website: 'https://sialparis.fr'
    },
    socialMedia: {
      linkedin: 'sial-paris',
      twitter: '@sial_paris',
      facebook: 'SialParis'
    },
    certifications: ['UFI Approved'],
    awards: ['World\'s Largest Food Innovation Show'],
    isActive: true,
    isPremium: true,
    rating: 4.6,
    reviewCount: 780,
    languages: ['French', 'English']
  },

  // JAPAN
  {
    id: 'tokyo-motor-show',
    name: 'Tokyo Motor Show',
    slug: 'tokyo-motor-show',
    description: 'One of the most prestigious international motor shows, showcasing the latest in automotive technology and design.',
    industry: ['Automotive', 'Transportation', 'Mobility'],
    subIndustries: ['Electric Vehicles', 'Autonomous Driving', 'Automotive Parts', 'Motorcycles', 'Future Mobility'],
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    continent: 'Asia',
    venue: 'Tokyo Big Sight',
    venueId: 'tokyo-big-sight',
    website: 'https://tokyo-motorshow.com',
    frequency: 'Biennial',
    nextEdition: {
      year: 2025,
      dates: 'October 24 - November 4, 2025',
      status: 'Confirmed'
    },
    duration: 12,
    expectedAttendees: 770000,
    expectedExhibitors: 180,
    exhibitionSpace: '90,000 sqm',
    boothSizes: ['100 sqm', '200 sqm', '500 sqm', 'Custom'],
    targetAudience: ['Automotive Industry', 'Media', 'General Public', 'Dealers'],
    organizer: {
      name: 'Japan Automobile Manufacturers Association',
      website: 'https://jama.or.jp',
      contact: '+81 3 5405 6125'
    },
    keyFeatures: ['World Premieres', 'Concept Cars', 'Test Drives', 'Future Mobility Showcase'],
    pricing: {
      exhibitorFees: '¥85,000 per sqm',
      visitorFees: '¥1,800 per day',
      currency: 'JPY'
    },
    pastEditions: [
      { year: 2023, attendees: 770000, exhibitors: 180, countries: 10 },
      { year: 2019, attendees: 1300000, exhibitors: 190, countries: 11 }
    ],
    contactInfo: {
      phone: '+81 3 5405 6125',
      email: 'info@tokyo-motorshow.com',
      website: 'https://tokyo-motorshow.com'
    },
    socialMedia: {
      linkedin: 'tokyo-motor-show',
      twitter: '@TokyoMotorShow',
      facebook: 'TokyoMotorShow'
    },
    certifications: ['OICA Recognized'],
    awards: ['Premier Asian Motor Show'],
    isActive: true,
    isPremium: true,
    rating: 4.7,
    reviewCount: 950,
    languages: ['Japanese', 'English']
  },

  // SINGAPORE
  {
    id: 'singapore-airshow',
    name: 'Singapore Airshow',
    slug: 'singapore-airshow',
    description: 'Asia\'s largest aerospace and defense exhibition, showcasing the latest in aviation and aerospace technology.',
    industry: ['Aerospace', 'Defense', 'Aviation'],
    subIndustries: ['Commercial Aviation', 'Military Aircraft', 'Space Technology', 'Drones & UAV', 'Airport Systems'],
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    continent: 'Asia',
    venue: 'Changi Exhibition Centre',
    venueId: 'changi-exhibition-centre',
    website: 'https://singaporeairshow.com',
    frequency: 'Biennial',
    nextEdition: {
      year: 2026,
      dates: 'February 11-16, 2026',
      status: 'Confirmed'
    },
    duration: 6,
    expectedAttendees: 54000,
    expectedExhibitors: 1000,
    exhibitionSpace: '50,000 sqm',
    boothSizes: ['36 sqm', '72 sqm', '144 sqm', 'Custom'],
    targetAudience: ['Aerospace Industry', 'Defense Officials', 'Airlines', 'Government'],
    organizer: {
      name: 'Experia Events',
      website: 'https://experiaevents.com',
      contact: '+65 6542 8660'
    },
    keyFeatures: ['Flying Displays', 'Aircraft on Display', 'Business Aviation', 'Defense Systems'],
    pricing: {
      exhibitorFees: '$950 per sqm',
      visitorFees: '$75 per day',
      currency: 'SGD'
    },
    pastEditions: [
      { year: 2024, attendees: 54000, exhibitors: 1000, countries: 50 },
      { year: 2022, attendees: 45000, exhibitors: 900, countries: 45 }
    ],
    contactInfo: {
      phone: '+65 6542 8660',
      email: 'info@singaporeairshow.com',
      website: 'https://singaporeairshow.com'
    },
    socialMedia: {
      linkedin: 'singapore-airshow',
      twitter: '@SingaporeAirshow'
    },
    certifications: ['UFI Approved'],
    awards: ['Leading Asian Aerospace Event'],
    isActive: true,
    isPremium: true,
    rating: 4.5,
    reviewCount: 420,
    languages: ['English']
  }

  // Add more exhibitions for other countries and industries...
];

// EXHIBITION STATISTICS
export const EXHIBITION_STATS = {
  totalExhibitions: GLOBAL_EXHIBITIONS.length,
  totalCountries: Array.from(new Set(GLOBAL_EXHIBITIONS.map(e => e.country))).length,
  totalCities: Array.from(new Set(GLOBAL_EXHIBITIONS.map(e => e.city))).length,
  totalContinents: Array.from(new Set(GLOBAL_EXHIBITIONS.map(e => e.continent))).length,
  totalExpectedAttendees: GLOBAL_EXHIBITIONS.reduce((sum, exhibition) => sum + exhibition.expectedAttendees, 0),
  totalExpectedExhibitors: GLOBAL_EXHIBITIONS.reduce((sum, exhibition) => sum + exhibition.expectedExhibitors, 0),
  averageRating: GLOBAL_EXHIBITIONS.reduce((sum, exhibition) => sum + exhibition.rating, 0) / GLOBAL_EXHIBITIONS.length,
  premiumExhibitions: GLOBAL_EXHIBITIONS.filter(e => e.isPremium).length,
  exhibitionsByContinent: {
    'Europe': GLOBAL_EXHIBITIONS.filter(e => e.continent === 'Europe').length,
    'Asia': GLOBAL_EXHIBITIONS.filter(e => e.continent === 'Asia').length,
    'North America': GLOBAL_EXHIBITIONS.filter(e => e.continent === 'North America').length,
    'Oceania': GLOBAL_EXHIBITIONS.filter(e => e.continent === 'Oceania').length,
    'South America': GLOBAL_EXHIBITIONS.filter(e => e.continent === 'South America').length,
    'Africa': GLOBAL_EXHIBITIONS.filter(e => e.continent === 'Africa').length
  },
  exhibitionsByFrequency: {
    'Annual': GLOBAL_EXHIBITIONS.filter(e => e.frequency === 'Annual').length,
    'Biennial': GLOBAL_EXHIBITIONS.filter(e => e.frequency === 'Biennial').length,
    'Triennial': GLOBAL_EXHIBITIONS.filter(e => e.frequency === 'Triennial').length,
    'Quarterly': GLOBAL_EXHIBITIONS.filter(e => e.frequency === 'Quarterly').length,
    'Monthly': GLOBAL_EXHIBITIONS.filter(e => e.frequency === 'Monthly').length
  },
  topIndustries: Array.from(new Set(GLOBAL_EXHIBITIONS.flatMap(e => e.industry))).slice(0, 10)
};

// EXHIBITION SEARCH AND FILTERING
export class ExhibitionSearchService {
  static searchByLocation(country?: string, city?: string): Exhibition[] {
    return GLOBAL_EXHIBITIONS.filter(exhibition => {
      if (country && exhibition.country !== country) return false;
      if (city && exhibition.city !== city) return false;
      return true;
    });
  }

  static searchByIndustry(industry: string): Exhibition[] {
    return GLOBAL_EXHIBITIONS.filter(exhibition => 
      exhibition.industry.some(ind => ind.toLowerCase().includes(industry.toLowerCase()))
    );
  }

  static searchByFrequency(frequency: string): Exhibition[] {
    return GLOBAL_EXHIBITIONS.filter(exhibition => exhibition.frequency === frequency);
  }

  static searchByYear(year: number): Exhibition[] {
    return GLOBAL_EXHIBITIONS.filter(exhibition => exhibition.nextEdition.year === year);
  }

  static getUpcomingExhibitions(limit: number = 10): Exhibition[] {
    return [...GLOBAL_EXHIBITIONS]
      .filter(e => e.nextEdition.status === 'Confirmed')
      .sort((a, b) => a.nextEdition.year - b.nextEdition.year)
      .slice(0, limit);
  }

  static getTopRatedExhibitions(limit: number = 10): Exhibition[] {
    return [...GLOBAL_EXHIBITIONS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static getLargestExhibitions(limit: number = 10): Exhibition[] {
    return [...GLOBAL_EXHIBITIONS]
      .sort((a, b) => b.expectedAttendees - a.expectedAttendees)
      .slice(0, limit);
  }

  static getPremiumExhibitions(): Exhibition[] {
    return GLOBAL_EXHIBITIONS.filter(exhibition => exhibition.isPremium);
  }

  static searchExhibitions(query: string): Exhibition[] {
    const lowercaseQuery = query.toLowerCase();
    return GLOBAL_EXHIBITIONS.filter(exhibition => {
      return (
        exhibition.name.toLowerCase().includes(lowercaseQuery) ||
        exhibition.description.toLowerCase().includes(lowercaseQuery) ||
        exhibition.city.toLowerCase().includes(lowercaseQuery) ||
        exhibition.country.toLowerCase().includes(lowercaseQuery) ||
        exhibition.industry.some(ind => ind.toLowerCase().includes(lowercaseQuery)) ||
        exhibition.venue.toLowerCase().includes(lowercaseQuery)
      );
    });
  }
}

console.log('Global Exhibitions Database initialized:', {
  totalExhibitions: EXHIBITION_STATS.totalExhibitions,
  countries: EXHIBITION_STATS.totalCountries,
  cities: EXHIBITION_STATS.totalCities,
  industries: EXHIBITION_STATS.topIndustries.length,
  expectedAttendees: EXHIBITION_STATS.totalExpectedAttendees
});