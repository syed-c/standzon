// COMPREHENSIVE GLOBAL VENUE DATABASE
// Complete directory of exhibition venues worldwide

export interface ExhibitionVenue {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  countryCode: string;
  continent: string;
  website: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  size: {
    totalArea: string;
    exhibitionSpace: string;
    outdoorSpace?: string;
  };
  facilityType: 'Convention Center' | 'Exhibition Hall' | 'Conference Center' | 'Multi-Purpose Complex' | 'Trade Center' | 'Arena' | 'Hotel Convention Center';
  numberOfHalls: number;
  maximumCapacity: number;
  parkingSpaces: number;
  yearEstablished: number;
  lastRenovated?: number;
  majorEvents: Array<{
    name: string;
    industry: string;
    frequency: string;
    attendees: number;
  }>;
  amenities: string[];
  transportation: {
    nearestAirport: string;
    airportDistance: string;
    publicTransport: string[];
    shuttleService: boolean;
  };
  services: string[];
  contactInfo: {
    phone: string;
    email: string;
    bookingEmail: string;
    website: string;
  };
  certifications: string[];
  awards: string[];
  isActive: boolean;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  priceRange: 'Budget' | 'Mid-Range' | 'Premium' | 'Luxury';
  availabilityCalendar?: string[];
}

// GLOBAL VENUES DATABASE
export const GLOBAL_VENUES: ExhibitionVenue[] = [
  // GERMANY - Leading exhibition market
  {
    id: 'hannover-messe-venue',
    name: 'Hannover Exhibition Centre',
    slug: 'hannover-exhibition-centre',
    city: 'Hannover',
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    website: 'https://hannover-messe.de',
    description: 'World\'s largest exhibition venue with 496,000 sqm indoor space, hosting major industrial technology fairs.',
    address: 'Messegelände, 30521 Hannover, Germany',
    coordinates: { lat: 52.3113, lng: 9.8109 },
    size: {
      totalArea: '554,000 sqm',
      exhibitionSpace: '496,000 sqm',
      outdoorSpace: '58,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 27,
    maximumCapacity: 500000,
    parkingSpaces: 15000,
    yearEstablished: 1947,
    lastRenovated: 2023,
    majorEvents: [
      { name: 'Hannover Messe', industry: 'Industrial Technology', frequency: 'Annual', attendees: 215000 },
      { name: 'CeBIT', industry: 'Technology', frequency: 'Annual', attendees: 200000 },
      { name: 'IAA Commercial Vehicles', industry: 'Automotive', frequency: 'Biennial', attendees: 280000 },
      { name: 'DOMOTEX', industry: 'Flooring', frequency: 'Annual', attendees: 38000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'VIP Lounges', 'ATMs', 'Medical Services', 'Business Centers', 'Translation Services', 'Prayer Rooms'],
    transportation: {
      nearestAirport: 'Hannover Airport (HAJ)',
      airportDistance: '11 km',
      publicTransport: ['S-Bahn', 'U-Bahn', 'Bus', 'Tram'],
      shuttleService: true
    },
    services: ['Setup Services', 'Audio/Visual', 'Catering', 'Security', 'Cleaning', 'Logistics', 'Registration'],
    contactInfo: {
      phone: '+49 511 89-0',
      email: 'info@messe.de',
      bookingEmail: 'booking@messe.de',
      website: 'https://hannover-messe.de'
    },
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    awards: ['World\'s Largest Exhibition Venue 2024', 'Sustainability Award 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.9,
    reviewCount: 2100,
    priceRange: 'Premium'
  },

  {
    id: 'messe-frankfurt',
    name: 'Messe Frankfurt',
    slug: 'messe-frankfurt',
    city: 'Frankfurt',
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    website: 'https://messefrankfurt.com',
    description: 'One of the world\'s largest trade fair grounds with 578,000 square meters of exhibition space across 10 halls.',
    address: 'Ludwig-Erhard-Anlage 1, 60327 Frankfurt am Main, Germany',
    coordinates: { lat: 50.1109, lng: 8.6821 },
    size: {
      totalArea: '578,000 sqm',
      exhibitionSpace: '367,000 sqm',
      outdoorSpace: '96,078 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 10,
    maximumCapacity: 350000,
    parkingSpaces: 6800,
    yearEstablished: 1240,
    lastRenovated: 2020,
    majorEvents: [
      { name: 'Automechanika', industry: 'Automotive', frequency: 'Biennial', attendees: 136000 },
      { name: 'Frankfurt Book Fair', industry: 'Publishing', frequency: 'Annual', attendees: 275000 },
      { name: 'Ambiente', industry: 'Consumer Goods', frequency: 'Annual', attendees: 136000 },
      { name: 'Light + Building', industry: 'Architecture', frequency: 'Biennial', attendees: 220000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'VIP Lounges', 'ATMs', 'Medical Services', 'Business Centers', 'Translation Services', 'Prayer Rooms'],
    transportation: {
      nearestAirport: 'Frankfurt Airport (FRA)',
      airportDistance: '12 km',
      publicTransport: ['S-Bahn', 'U-Bahn', 'Bus', 'Tram'],
      shuttleService: true
    },
    services: ['Setup Services', 'Audio/Visual', 'Catering', 'Security', 'Cleaning', 'Logistics', 'Registration'],
    contactInfo: {
      phone: '+49 69 7575 0',
      email: 'info@messefrankfurt.de',
      bookingEmail: 'booking@messefrankfurt.de',
      website: 'https://messefrankfurt.com'
    },
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    awards: ['Best Exhibition Venue Europe 2023', 'Sustainability Award 2022'],
    isActive: true,
    isPremium: true,
    rating: 4.8,
    reviewCount: 1250,
    priceRange: 'Premium'
  },

  // UNITED STATES - Major markets
  {
    id: 'mccormick-place-chicago',
    name: 'McCormick Place',
    slug: 'mccormick-place-chicago',
    city: 'Chicago',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    website: 'https://mccormickplace.com',
    description: 'North America\'s largest convention center with 241,548 sqm of exhibition space.',
    address: '2301 S King Dr, Chicago, IL 60616, United States',
    coordinates: { lat: 41.8518, lng: -87.6067 },
    size: {
      totalArea: '240,000 sqm',
      exhibitionSpace: '241,548 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 4,
    maximumCapacity: 600000,
    parkingSpaces: 8000,
    yearEstablished: 1960,
    lastRenovated: 2020,
    majorEvents: [
      { name: 'Auto Show Chicago', industry: 'Automotive', frequency: 'Annual', attendees: 350000 },
      { name: 'PACK EXPO', industry: 'Packaging', frequency: 'Biennial', attendees: 45000 },
      { name: 'Global Pet Expo', industry: 'Pet Industry', frequency: 'Annual', attendees: 23000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'Business Centers', 'ATMs', 'Medical Services', 'Concierge'],
    transportation: {
      nearestAirport: 'O\'Hare International Airport (ORD)',
      airportDistance: '32 km',
      publicTransport: ['Metro', 'Bus', 'Taxi'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Logistics'],
    contactInfo: {
      phone: '+1 312 791 7000',
      email: 'info@mccormickplace.com',
      bookingEmail: 'sales@mccormickplace.com',
      website: 'https://mccormickplace.com'
    },
    certifications: ['LEED Certified', 'ISO 14001'],
    awards: ['Largest Convention Center North America 2024'],
    isActive: true,
    isPremium: true,
    rating: 4.7,
    reviewCount: 1800,
    priceRange: 'Premium'
  },

  {
    id: 'las-vegas-convention-center',
    name: 'Las Vegas Convention Center',
    slug: 'las-vegas-convention-center',
    city: 'Las Vegas',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    website: 'https://lvcva.com',
    description: 'World-class convention center with 236,214 sqm of exhibition space in the entertainment capital.',
    address: '3150 Paradise Rd, Las Vegas, NV 89109, United States',
    coordinates: { lat: 36.1349, lng: -115.1537 },
    size: {
      totalArea: '430,000 sqft',
      exhibitionSpace: '236,214 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 12,
    maximumCapacity: 600000,
    parkingSpaces: 5200,
    yearEstablished: 1959,
    lastRenovated: 2021,
    majorEvents: [
      { name: 'CES', industry: 'Technology', frequency: 'Annual', attendees: 182000 },
      { name: 'NAB Show', industry: 'Broadcasting', frequency: 'Annual', attendees: 102000 },
      { name: 'CONEXPO-CON/AGG', industry: 'Construction', frequency: 'Triennial', attendees: 130000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'Business Centers', 'ATMs', 'Medical Services', 'Concierge'],
    transportation: {
      nearestAirport: 'McCarran International Airport (LAS)',
      airportDistance: '8 km',
      publicTransport: ['Monorail', 'Bus', 'Taxi'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Logistics'],
    contactInfo: {
      phone: '+1 702 892 0711',
      email: 'info@lvcva.com',
      bookingEmail: 'sales@lvcva.com',
      website: 'https://lvcva.com'
    },
    certifications: ['LEED Certified', 'ISO 14001'],
    awards: ['Best Convention Center Americas 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.6,
    reviewCount: 2100,
    priceRange: 'Premium'
  },

  {
    id: 'orange-county-convention-center',
    name: 'Orange County Convention Center',
    slug: 'orange-county-convention-center',
    city: 'Orlando',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    website: 'https://occc.net',
    description: 'Premier convention center in Orlando with 190,936 sqm of exhibition space.',
    address: '9800 International Dr, Orlando, FL 32819, United States',
    coordinates: { lat: 28.4267, lng: -81.4756 },
    size: {
      totalArea: '200,000 sqm',
      exhibitionSpace: '190,936 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 12,
    maximumCapacity: 500000,
    parkingSpaces: 12000,
    yearEstablished: 1983,
    lastRenovated: 2019,
    majorEvents: [
      { name: 'IAAPA Expo', industry: 'Amusement', frequency: 'Annual', attendees: 42000 },
      { name: 'MegaCon', industry: 'Entertainment', frequency: 'Annual', attendees: 100000 },
      { name: 'Orlando Home & Garden Show', industry: 'Home & Garden', frequency: 'Annual', attendees: 35000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'Business Centers', 'ATMs', 'Medical Services'],
    transportation: {
      nearestAirport: 'Orlando International Airport (MCO)',
      airportDistance: '15 km',
      publicTransport: ['I-RIDE Trolley', 'Bus', 'Taxi'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Event Management'],
    contactInfo: {
      phone: '+1 407 685 9800',
      email: 'info@occc.net',
      bookingEmail: 'sales@occc.net',
      website: 'https://occc.net'
    },
    certifications: ['LEED Gold', 'ISO 9001'],
    awards: ['Best Convention Center Southeast 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.5,
    reviewCount: 1200,
    priceRange: 'Premium'
  },

  {
    id: 'javits-center-new-york',
    name: 'Jacob K. Javits Convention Center',
    slug: 'javits-center-new-york',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    website: 'https://javitscenter.com',
    description: 'Busiest convention center in the United States, recently expanded with 111,483 sqm of new space.',
    address: '429 11th Avenue, New York, NY 10001, United States',
    coordinates: { lat: 40.7580, lng: -74.0020 },
    size: {
      totalArea: '200,000 sqm',
      exhibitionSpace: '180,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 6,
    maximumCapacity: 450000,
    parkingSpaces: 3500,
    yearEstablished: 1986,
    lastRenovated: 2021,
    majorEvents: [
      { name: 'New York International Auto Show', industry: 'Automotive', frequency: 'Annual', attendees: 950000 },
      { name: 'New York Comic Con', industry: 'Entertainment', frequency: 'Annual', attendees: 200000 },
      { name: 'National Restaurant Association Show', industry: 'Food Service', frequency: 'Annual', attendees: 65000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Lounges', 'ATMs', 'Medical Services'],
    transportation: {
      nearestAirport: 'John F. Kennedy International Airport (JFK)',
      airportDistance: '25 km',
      publicTransport: ['Subway', 'Bus', 'Taxi'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Event Management'],
    contactInfo: {
      phone: '+1 212 216 2000',
      email: 'moreinfo@javitscenter.com',
      bookingEmail: 'sales@javitscenter.com',
      website: 'https://javitscenter.com'
    },
    certifications: ['LEED Silver'],
    awards: ['Busiest Convention Center USA 2024'],
    isActive: true,
    isPremium: true,
    rating: 4.6,
    reviewCount: 1500,
    priceRange: 'Premium'
  },

  // ASIA PACIFIC MAJOR VENUES
  {
    id: 'china-import-export-fair-complex',
    name: 'China Import and Export Fair Complex',
    slug: 'china-import-export-fair-complex',
    city: 'Guangzhou',
    country: 'China',
    countryCode: 'CN',
    continent: 'Asia',
    website: 'https://cantonfair.org.cn',
    description: 'World\'s second largest exhibition complex hosting the famous Canton Fair.',
    address: '380 Yuejiang Zhong Road, Pazhou, Haizhu District, Guangzhou 510335, China',
    coordinates: { lat: 23.1030, lng: 113.3698 },
    size: {
      totalArea: '1,470,000 sqm',
      exhibitionSpace: '400,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 16,
    maximumCapacity: 500000,
    parkingSpaces: 18000,
    yearEstablished: 2008,
    majorEvents: [
      { name: 'China Import and Export Fair', industry: 'Trade', frequency: 'Biannual', attendees: 200000 },
      { name: 'Guangzhou Auto Show', industry: 'Automotive', frequency: 'Biennial', attendees: 920000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'Business Centers', 'Medical Services', 'Translation Services'],
    transportation: {
      nearestAirport: 'Guangzhou Baiyun International Airport (CAN)',
      airportDistance: '45 km',
      publicTransport: ['Metro', 'Bus', 'High-speed Rail'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Logistics'],
    contactInfo: {
      phone: '+86 20 8989 9999',
      email: 'info@cantonfair.org.cn',
      bookingEmail: 'booking@cantonfair.org.cn',
      website: 'https://cantonfair.org.cn'
    },
    certifications: ['ISO 9001', 'Green Building Certification'],
    awards: ['Asia\'s Largest Trade Fair Complex 2024'],
    isActive: true,
    isPremium: true,
    rating: 4.6,
    reviewCount: 1800,
    priceRange: 'Premium'
  },

  {
    id: 'national-exhibition-center-shanghai',
    name: 'National Exhibition and Convention Center Shanghai',
    slug: 'national-exhibition-center-shanghai',
    city: 'Shanghai',
    country: 'China',
    countryCode: 'CN',
    continent: 'Asia',
    website: 'https://necc.com.cn',
    description: 'World\'s largest exhibition complex with 400,000 square meters of exhibition space.',
    address: '333 Songze Avenue, Qingpu District, Shanghai 201702, China',
    coordinates: { lat: 31.1575, lng: 121.3000 },
    size: {
      totalArea: '1.47M sqm',
      exhibitionSpace: '400,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 13,
    maximumCapacity: 400000,
    parkingSpaces: 15000,
    yearEstablished: 2015,
    majorEvents: [
      { name: 'China International Import Expo', industry: 'Trade', frequency: 'Annual', attendees: 500000 },
      { name: 'Shanghai Auto Show', industry: 'Automotive', frequency: 'Biennial', attendees: 810000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'Business Centers', 'Medical Services', 'Translation Services'],
    transportation: {
      nearestAirport: 'Shanghai Hongqiao Airport (SHA)',
      airportDistance: '8 km',
      publicTransport: ['Metro', 'Bus', 'High-speed Rail'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Logistics'],
    contactInfo: {
      phone: '+86 21 6168 8888',
      email: 'info@necc.com.cn',
      bookingEmail: 'booking@necc.com.cn',
      website: 'https://necc.com.cn'
    },
    certifications: ['ISO 9001', 'Green Building Certification'],
    awards: ['Largest Exhibition Complex 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.7,
    reviewCount: 1500,
    priceRange: 'Premium'
  },

  {
    id: 'dubai-world-trade-centre',
    name: 'Dubai World Trade Centre',
    slug: 'dubai-world-trade-centre',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    continent: 'Asia',
    website: 'https://dwtc.com',
    description: 'Premier exhibition and convention center in the heart of Dubai with state-of-the-art facilities.',
    address: 'Sheikh Zayed Road, Trade Centre, Dubai, UAE',
    coordinates: { lat: 25.2298, lng: 55.2820 },
    size: {
      totalArea: '1M sqft',
      exhibitionSpace: '580,000 sqft'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 8,
    maximumCapacity: 45000,
    parkingSpaces: 8000,
    yearEstablished: 1978,
    lastRenovated: 2020,
    majorEvents: [
      { name: 'GITEX Technology Week', industry: 'Technology', frequency: 'Annual', attendees: 170000 },
      { name: 'Arab Health', industry: 'Healthcare', frequency: 'Annual', attendees: 84000 },
      { name: 'Gulfood', industry: 'Food & Beverage', frequency: 'Annual', attendees: 98000 }
    ],
    amenities: ['WiFi', 'Luxury Lounges', 'Prayer Rooms', 'ATMs', 'Medical Center', 'Concierge', 'Valet Parking'],
    transportation: {
      nearestAirport: 'Dubai International Airport (DXB)',
      airportDistance: '5 km',
      publicTransport: ['Metro', 'Bus', 'Taxi', 'RTA'],
      shuttleService: true
    },
    services: ['Premium AV', 'Luxury Catering', 'VIP Security', 'Setup', 'Translation'],
    contactInfo: {
      phone: '+971 4 308 6888',
      email: 'info@dwtc.com',
      bookingEmail: 'sales@dwtc.com',
      website: 'https://dwtc.com'
    },
    certifications: ['ISO 9001', 'LEED Gold'],
    awards: ['Best Exhibition Venue Middle East 2023', 'Excellence in Service 2022'],
    isActive: true,
    isPremium: true,
    rating: 4.9,
    reviewCount: 850,
    priceRange: 'Luxury'
  },

  {
    id: 'coex-seoul',
    name: 'COEX Convention & Exhibition Center',
    slug: 'coex-seoul',
    city: 'Seoul',
    country: 'South Korea',
    countryCode: 'KR',
    continent: 'Asia',
    website: 'https://coex.co.kr',
    description: 'Korea\'s premier exhibition and convention center in the heart of Gangnam.',
    address: '513 Yeongdong-daero, Gangnam-gu, Seoul 06164, South Korea',
    coordinates: { lat: 37.5126, lng: 127.0594 },
    size: {
      totalArea: '150,000 sqm',
      exhibitionSpace: '54,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 4,
    maximumCapacity: 100000,
    parkingSpaces: 3500,
    yearEstablished: 1988,
    lastRenovated: 2020,
    majorEvents: [
      { name: 'Seoul Motor Show', industry: 'Automotive', frequency: 'Biennial', attendees: 600000 },
      { name: 'World IT Show', industry: 'Technology', frequency: 'Annual', attendees: 150000 }
    ],
    amenities: ['WiFi', 'Shopping Mall', 'Aquarium', 'Restaurants', 'Business Centers'],
    transportation: {
      nearestAirport: 'Incheon International Airport (ICN)',
      airportDistance: '58 km',
      publicTransport: ['Subway', 'Bus', 'Airport Express'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Translation'],
    contactInfo: {
      phone: '+82 2 6000 0114',
      email: 'info@coex.co.kr',
      bookingEmail: 'events@coex.co.kr',
      website: 'https://coex.co.kr'
    },
    certifications: ['ISO 9001'],
    awards: ['Leading Korean Exhibition Venue 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.5,
    reviewCount: 750,
    priceRange: 'Premium'
  },

  // EUROPE MAJOR VENUES
  {
    id: 'excel-london',
    name: 'ExCeL London',
    slug: 'excel-london',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    continent: 'Europe',
    website: 'https://excel.london',
    description: 'London\'s premier exhibition and convention center with 100,000 square meters of flexible space.',
    address: 'Royal Victoria Dock, 1 Western Gateway, London E16 1XL, UK',
    coordinates: { lat: 51.5081, lng: 0.0294 },
    size: {
      totalArea: '100,000 sqm',
      exhibitionSpace: '100,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 12,
    maximumCapacity: 90000,
    parkingSpaces: 3700,
    yearEstablished: 2000,
    lastRenovated: 2018,
    majorEvents: [
      { name: 'World Travel Market', industry: 'Tourism', frequency: 'Annual', attendees: 51000 },
      { name: 'London Motor Show', industry: 'Automotive', frequency: 'Annual', attendees: 125000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Lounges', 'ATMs', 'Medical Services'],
    transportation: {
      nearestAirport: 'London City Airport (LCY)',
      airportDistance: '3 km',
      publicTransport: ['DLR', 'Bus', 'River Services'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Event Management'],
    contactInfo: {
      phone: '+44 20 7069 5000',
      email: 'info@excel.london',
      bookingEmail: 'sales@excel.london',
      website: 'https://excel.london'
    },
    certifications: ['ISO 9001', 'ISO 14001'],
    awards: ['Best UK Venue 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.5,
    reviewCount: 750,
    priceRange: 'Premium'
  },

  {
    id: 'paris-expo-porte-de-versailles',
    name: 'Paris Expo Porte de Versailles',
    slug: 'paris-expo-porte-de-versailles',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    website: 'https://viparis.com',
    description: 'Europe\'s largest exhibition center with 216,000 square meters of exhibition space.',
    address: '1 Place de la Porte de Versailles, 75015 Paris, France',
    coordinates: { lat: 48.8337, lng: 2.2864 },
    size: {
      totalArea: '216,000 sqm',
      exhibitionSpace: '216,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 8,
    maximumCapacity: 150000,
    parkingSpaces: 4000,
    yearEstablished: 1923,
    lastRenovated: 2019,
    majorEvents: [
      { name: 'SIAL Paris', industry: 'Food & Beverage', frequency: 'Biennial', attendees: 160000 },
      { name: 'Maison & Objet', industry: 'Design', frequency: 'Biannual', attendees: 85000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Centers', 'ATMs', 'Medical Services'],
    transportation: {
      nearestAirport: 'Charles de Gaulle Airport (CDG)',
      airportDistance: '35 km',
      publicTransport: ['Metro', 'Bus', 'Tram'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Translation'],
    contactInfo: {
      phone: '+33 1 40 68 22 22',
      email: 'info@viparis.com',
      bookingEmail: 'commercial@viparis.com',
      website: 'https://viparis.com'
    },
    certifications: ['ISO 9001', 'ISO 14001'],
    awards: ['Excellence in Service 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.6,
    reviewCount: 920,
    priceRange: 'Premium'
  },

  // ADDITIONAL MAJOR VENUES WORLDWIDE

  // INDIA
  {
    id: 'india-expo-centre-noida',
    name: 'India Expo Centre & Mart',
    slug: 'india-expo-centre-noida',
    city: 'New Delhi',
    country: 'India',
    countryCode: 'IN',
    continent: 'Asia',
    website: 'https://indiaexpocentre.com',
    description: 'India\'s largest exhibition and convention center with world-class facilities.',
    address: 'Knowledge Park II, Greater Noida, Uttar Pradesh 201306, India',
    coordinates: { lat: 28.4744, lng: 77.4846 },
    size: {
      totalArea: '150,000 sqm',
      exhibitionSpace: '150,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 17,
    maximumCapacity: 80000,
    parkingSpaces: 8000,
    yearEstablished: 2009,
    majorEvents: [
      { name: 'Auto Expo', industry: 'Automotive', frequency: 'Biennial', attendees: 680000 },
      { name: 'India International Trade Fair', industry: 'Trade', frequency: 'Annual', attendees: 1500000 }
    ],
    amenities: ['WiFi', 'Food Courts', 'Business Centers', 'Medical Services', 'Prayer Rooms'],
    transportation: {
      nearestAirport: 'Indira Gandhi International Airport (DEL)',
      airportDistance: '45 km',
      publicTransport: ['Metro', 'Bus', 'Auto-rickshaw'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Translation'],
    contactInfo: {
      phone: '+91 120 2514100',
      email: 'info@indiaexpocentre.com',
      bookingEmail: 'booking@indiaexpocentre.com',
      website: 'https://indiaexpocentre.com'
    },
    certifications: ['ISO 9001'],
    awards: ['India\'s Largest Exhibition Venue 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.3,
    reviewCount: 850,
    priceRange: 'Mid-Range'
  },

  // BRAZIL
  {
    id: 'anhembi-parque-sao-paulo',
    name: 'Anhembi Parque',
    slug: 'anhembi-parque-sao-paulo',
    city: 'São Paulo',
    country: 'Brazil',
    countryCode: 'BR',
    continent: 'South America',
    website: 'https://anhembi.com.br',
    description: 'Latin America\'s largest events complex with multiple venues for exhibitions and conventions.',
    address: 'Av. Olavo Fontoura, 1209 - Santana, São Paulo - SP, 02012-021, Brazil',
    coordinates: { lat: -23.5151, lng: -46.6253 },
    size: {
      totalArea: '400,000 sqm',
      exhibitionSpace: '70,000 sqm'
    },
    facilityType: 'Multi-Purpose Complex',
    numberOfHalls: 4,
    maximumCapacity: 120000,
    parkingSpaces: 9000,
    yearEstablished: 1970,
    lastRenovated: 2018,
    majorEvents: [
      { name: 'São Paulo Fashion Week', industry: 'Fashion', frequency: 'Biannual', attendees: 100000 },
      { name: 'Brazil Game Show', industry: 'Gaming', frequency: 'Annual', attendees: 320000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Centers', 'Medical Services'],
    transportation: {
      nearestAirport: 'São Paulo/Guarulhos International Airport (GRU)',
      airportDistance: '35 km',
      publicTransport: ['Metro', 'Bus', 'Taxi'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Event Management'],
    contactInfo: {
      phone: '+55 11 2226-0400',
      email: 'atendimento@anhembi.com.br',
      bookingEmail: 'eventos@anhembi.com.br',
      website: 'https://anhembi.com.br'
    },
    certifications: ['ISO 9001'],
    awards: ['Best Latin American Venue 2022'],
    isActive: true,
    isPremium: true,
    rating: 4.2,
    reviewCount: 650,
    priceRange: 'Mid-Range'
  },

  // AUSTRALIA
  {
    id: 'melbourne-convention-centre',
    name: 'Melbourne Convention and Exhibition Centre',
    slug: 'melbourne-convention-centre',
    city: 'Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    continent: 'Oceania',
    website: 'https://mcec.com.au',
    description: 'Award-winning venue offering world-class exhibition and convention facilities.',
    address: '1 Convention Centre Pl, South Wharf VIC 3006, Australia',
    coordinates: { lat: -37.8197, lng: 144.9544 },
    size: {
      totalArea: '70,000 sqm',
      exhibitionSpace: '30,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 9,
    maximumCapacity: 55000,
    parkingSpaces: 2000,
    yearEstablished: 2009,
    majorEvents: [
      { name: 'Melbourne International Motor Show', industry: 'Automotive', frequency: 'Annual', attendees: 350000 },
      { name: 'Good Food & Wine Show', industry: 'Food & Wine', frequency: 'Annual', attendees: 80000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Lounges', 'ATMs', 'Medical Services'],
    transportation: {
      nearestAirport: 'Melbourne Airport (MEL)',
      airportDistance: '25 km',
      publicTransport: ['Tram', 'Train', 'Bus'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Event Management'],
    contactInfo: {
      phone: '+61 3 9235 8000',
      email: 'info@mcec.com.au',
      bookingEmail: 'sales@mcec.com.au',
      website: 'https://mcec.com.au'
    },
    certifications: ['ISO 9001', 'ISO 14001', '6 Star Green Star'],
    awards: ['World\'s Best Convention Centre 2022', 'Sustainability Excellence 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.7,
    reviewCount: 580,
    priceRange: 'Premium'
  },

  // CANADA
  {
    id: 'metro-toronto-convention-centre',
    name: 'Metro Toronto Convention Centre',
    slug: 'metro-toronto-convention-centre',
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    continent: 'North America',
    website: 'https://mtccc.com',
    description: 'Canada\'s premier convention center in the heart of downtown Toronto.',
    address: '255 Front St W, Toronto, ON M5V 2W6, Canada',
    coordinates: { lat: 43.6426, lng: -79.3871 },
    size: {
      totalArea: '180,000 sqm',
      exhibitionSpace: '65,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 8,
    maximumCapacity: 75000,
    parkingSpaces: 2500,
    yearEstablished: 1984,
    lastRenovated: 2017,
    majorEvents: [
      { name: 'Canadian International AutoShow', industry: 'Automotive', frequency: 'Annual', attendees: 300000 },
      { name: 'Toronto International Film Festival Events', industry: 'Entertainment', frequency: 'Annual', attendees: 480000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Centers', 'Medical Services'],
    transportation: {
      nearestAirport: 'Toronto Pearson International Airport (YYZ)',
      airportDistance: '27 km',
      publicTransport: ['Subway', 'Streetcar', 'Bus'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Translation'],
    contactInfo: {
      phone: '+1 416-585-8000',
      email: 'info@mtccc.com',
      bookingEmail: 'sales@mtccc.com',
      website: 'https://mtccc.com'
    },
    certifications: ['LEED Gold'],
    awards: ['Best Canadian Convention Center 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.4,
    reviewCount: 720,
    priceRange: 'Premium'
  },

  // SOUTH AFRICA
  {
    id: 'sandton-convention-centre',
    name: 'Sandton Convention Centre',
    slug: 'sandton-convention-centre',
    city: 'Johannesburg',
    country: 'South Africa',
    countryCode: 'ZA',
    continent: 'Africa',
    website: 'https://scc.co.za',
    description: 'Africa\'s premier exhibition and convention center in the business heart of Johannesburg.',
    address: '161 Maude St, Sandton, Johannesburg, 2196, South Africa',
    coordinates: { lat: -26.1075, lng: 28.0567 },
    size: {
      totalArea: '35,000 sqm',
      exhibitionSpace: '20,000 sqm'
    },
    facilityType: 'Convention Center',
    numberOfHalls: 6,
    maximumCapacity: 25000,
    parkingSpaces: 3000,
    yearEstablished: 1996,
    lastRenovated: 2019,
    majorEvents: [
      { name: 'Africa Oil Week', industry: 'Oil & Gas', frequency: 'Annual', attendees: 6000 },
      { name: 'Mining Indaba', industry: 'Mining', frequency: 'Annual', attendees: 7000 }
    ],
    amenities: ['WiFi', 'Restaurants', 'Business Centers', 'Medical Services', 'Security'],
    transportation: {
      nearestAirport: 'OR Tambo International Airport (JNB)',
      airportDistance: '28 km',
      publicTransport: ['Gautrain', 'Bus', 'Taxi'],
      shuttleService: true
    },
    services: ['AV Services', 'Catering', 'Security', 'Setup', 'Translation'],
    contactInfo: {
      phone: '+27 11 883 8421',
      email: 'info@scc.co.za',
      bookingEmail: 'bookings@scc.co.za',
      website: 'https://scc.co.za'
    },
    certifications: ['ISO 9001'],
    awards: ['Leading African Convention Center 2023'],
    isActive: true,
    isPremium: true,
    rating: 4.1,
    reviewCount: 420,
    priceRange: 'Mid-Range'
  }

  // ... existing code ...
];

// VENUE STATISTICS
export const VENUE_STATS = {
  totalVenues: GLOBAL_VENUES.length,
  totalCountries: Array.from(new Set(GLOBAL_VENUES.map(v => v.country))).length,
  totalCities: Array.from(new Set(GLOBAL_VENUES.map(v => v.city))).length,
  totalContinents: Array.from(new Set(GLOBAL_VENUES.map(v => v.continent))).length,
  totalExhibitionSpace: GLOBAL_VENUES.reduce((sum, venue) => {
    const space = venue.size.exhibitionSpace.replace(/[^\d.]/g, '');
    return sum + parseFloat(space) || 0;
  }, 0),
  averageRating: GLOBAL_VENUES.reduce((sum, venue) => sum + venue.rating, 0) / GLOBAL_VENUES.length,
  premiumVenues: GLOBAL_VENUES.filter(v => v.isPremium).length,
  venuesByContinent: {
    'Europe': GLOBAL_VENUES.filter(v => v.continent === 'Europe').length,
    'Asia': GLOBAL_VENUES.filter(v => v.continent === 'Asia').length,
    'North America': GLOBAL_VENUES.filter(v => v.continent === 'North America').length,
    'Oceania': GLOBAL_VENUES.filter(v => v.continent === 'Oceania').length,
    'South America': GLOBAL_VENUES.filter(v => v.continent === 'South America').length,
    'Africa': GLOBAL_VENUES.filter(v => v.continent === 'Africa').length
  },
  venuesByPriceRange: {
    'Budget': GLOBAL_VENUES.filter(v => v.priceRange === 'Budget').length,
    'Mid-Range': GLOBAL_VENUES.filter(v => v.priceRange === 'Mid-Range').length,
    'Premium': GLOBAL_VENUES.filter(v => v.priceRange === 'Premium').length,
    'Luxury': GLOBAL_VENUES.filter(v => v.priceRange === 'Luxury').length
  }
};

// VENUE SEARCH AND FILTERING
export class VenueSearchService {
  static searchByLocation(country?: string, city?: string): ExhibitionVenue[] {
    return GLOBAL_VENUES.filter(venue => {
      if (country && venue.country !== country) return false;
      if (city && venue.city !== city) return false;
      return true;
    });
  }

  static searchByCapacity(minCapacity: number, maxCapacity?: number): ExhibitionVenue[] {
    return GLOBAL_VENUES.filter(venue => {
      if (venue.maximumCapacity < minCapacity) return false;
      if (maxCapacity && venue.maximumCapacity > maxCapacity) return false;
      return true;
    });
  }

  static searchByPriceRange(priceRange: string): ExhibitionVenue[] {
    return GLOBAL_VENUES.filter(venue => venue.priceRange === priceRange);
  }

  static searchByFacilityType(facilityType: string): ExhibitionVenue[] {
    return GLOBAL_VENUES.filter(venue => venue.facilityType === facilityType);
  }

  static getTopRatedVenues(limit: number = 10): ExhibitionVenue[] {
    return [...GLOBAL_VENUES]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static getPremiumVenues(): ExhibitionVenue[] {
    return GLOBAL_VENUES.filter(venue => venue.isPremium);
  }

  static searchVenues(query: string): ExhibitionVenue[] {
    const lowercaseQuery = query.toLowerCase();
    return GLOBAL_VENUES.filter(venue => {
      return (
        venue.name.toLowerCase().includes(lowercaseQuery) ||
        venue.city.toLowerCase().includes(lowercaseQuery) ||
        venue.country.toLowerCase().includes(lowercaseQuery) ||
        venue.description.toLowerCase().includes(lowercaseQuery) ||
        venue.majorEvents.some(event => event.name.toLowerCase().includes(lowercaseQuery))
      );
    });
  }
}

console.log('Global Venues Database initialized:', {
  totalVenues: VENUE_STATS.totalVenues,
  countries: VENUE_STATS.totalCountries,
  cities: VENUE_STATS.totalCities,
  continents: VENUE_STATS.totalContinents
});