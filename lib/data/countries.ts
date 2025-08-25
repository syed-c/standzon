// Global countries and cities data for Phase 1 expansion

export interface Country {
  code: string;
  name: string;
  continent: string;
  population: number;
  gdp: number; // in billions USD
  exhibitionMarketSize: number; // in millions USD
  languages: string[];
  currency: string;
  businessCulture: string[];
  majorCities: City[];
  builderCount: number;
  annualTradeShows: number;
  tier: 1 | 2 | 3; // Implementation priority
}

export interface City {
  name: string;
  slug: string;
  population: number;
  isCapital: boolean;
  majorVenues: Venue[];
  builderCount: number;
  upcomingShows: number;
  averageStandCost: number; // EUR per sqm
  transportation: TransportationInfo;
}

export interface Venue {
  name: string;
  totalSpace: number; // sqm
  hallCount: number;
  facilities: string[];
  nearbyBuilderCount: number;
}

export interface TransportationInfo {
  airports: string[];
  publicTransport: string[];
  accessibility: string;
}

// Tier 1 Countries (Phase 1 - Weeks 1-3) - MASSIVELY EXPANDED GLOBAL COVERAGE
export const tier1Countries: Country[] = [
  {
    code: 'GB',
    name: 'United Kingdom',
    continent: 'Europe',
    population: 67500000,
    gdp: 3100,
    exhibitionMarketSize: 4500,
    languages: ['English'],
    currency: 'GBP',
    businessCulture: [
      'Punctuality is highly valued in business meetings',
      'Professional dress code is standard for exhibitions',
      'Business cards are exchanged formally at introductions',
      'Networking over tea or coffee is common practice'
    ],
    majorCities: [
      {
        name: 'London',
        slug: 'london',
        population: 9500000,
        isCapital: true,
        builderCount: 125,
        upcomingShows: 180,
        averageStandCost: 450,
        majorVenues: [
          {
            name: 'ExCeL London',
            totalSpace: 100000,
            hallCount: 12,
            facilities: ['Freight Access', 'Parking', 'Restaurants', 'Hotels'],
            nearbyBuilderCount: 45
          },
          {
            name: 'Olympia London',
            totalSpace: 40000,
            hallCount: 8,
            facilities: ['Central Location', 'Historic Venue', 'Transport Links'],
            nearbyBuilderCount: 28
          }
        ],
        transportation: {
          airports: ['Heathrow', 'Gatwick', 'Stansted'],
          publicTransport: ['Underground', 'Buses', 'DLR'],
          accessibility: 'Excellent public transport connections to all venues'
        }
      },
      {
        name: 'Birmingham',
        slug: 'birmingham',
        population: 2900000,
        isCapital: false,
        builderCount: 68,
        upcomingShows: 85,
        averageStandCost: 380,
        majorVenues: [
          {
            name: 'NEC Birmingham',
            totalSpace: 186000,
            hallCount: 20,
            facilities: ['Airport Adjacent', 'Hotels', 'Restaurants', 'Parking'],
            nearbyBuilderCount: 32
          }
        ],
        transportation: {
          airports: ['Birmingham Airport'],
          publicTransport: ['Buses', 'Rail'],
          accessibility: 'Direct airport connection and motorway access'
        }
      },
      {
        name: 'Manchester',
        slug: 'manchester',
        population: 2720000,
        isCapital: false,
        builderCount: 42,
        upcomingShows: 55,
        averageStandCost: 360,
        majorVenues: [
          {
            name: 'Manchester Central',
            totalSpace: 25000,
            hallCount: 6,
            facilities: ['City Center', 'Historic Building', 'Transport Links'],
            nearbyBuilderCount: 18
          }
        ],
        transportation: {
          airports: ['Manchester Airport'],
          publicTransport: ['Trams', 'Buses', 'Rail'],
          accessibility: 'City center location with excellent transport links'
        }
      },
      {
        name: 'Glasgow',
        slug: 'glasgow',
        population: 1800000,
        isCapital: false,
        builderCount: 24,
        upcomingShows: 35,
        averageStandCost: 340,
        majorVenues: [
          {
            name: 'SEC Centre',
            totalSpace: 22000,
            hallCount: 8,
            facilities: ['Waterfront Location', 'Modern Design', 'Airport Access'],
            nearbyBuilderCount: 12
          }
        ],
        transportation: {
          airports: ['Glasgow Airport'],
          publicTransport: ['Subway', 'Buses', 'Rail'],
          accessibility: 'Waterfront location with good transport connections'
        }
      }
    ],
    builderCount: 259,
    annualTradeShows: 355,
    tier: 1
  },
  
  // UNITED STATES - COMPREHENSIVE EXPANSION
  {
    code: 'US',
    name: 'United States',
    continent: 'North America',
    population: 331900000,
    gdp: 25500,
    exhibitionMarketSize: 18500,
    languages: ['English', 'Spanish'],
    currency: 'USD',
    businessCulture: [
      'Direct communication style preferred in business',
      'Networking is crucial for building business relationships',
      'Innovation and technology focus is highly valued',
      'Professional presentation and punctuality expected'
    ],
    majorCities: [
      {
        name: 'Las Vegas',
        slug: 'las-vegas',
        population: 2300000,
        isCapital: false,
        builderCount: 185,
        upcomingShows: 280,
        averageStandCost: 520,
        majorVenues: [
          {
            name: 'Las Vegas Convention Center',
            totalSpace: 460000,
            hallCount: 25,
            facilities: ['World Class Technology', 'Resort Integration', 'Entertainment'],
            nearbyBuilderCount: 85
          },
          {
            name: 'Mandalay Bay Convention Center',
            totalSpace: 210000,
            hallCount: 12,
            facilities: ['Luxury Venue', 'Casino Integration', 'Premium Services'],
            nearbyBuilderCount: 42
          }
        ],
        transportation: {
          airports: ['McCarran International'],
          publicTransport: ['Monorail', 'Buses', 'Taxi'],
          accessibility: 'Direct monorail and shuttle connections to venues'
        }
      },
      {
        name: 'Chicago',
        slug: 'chicago',
        population: 2700000,
        isCapital: false,
        builderCount: 158,
        upcomingShows: 240,
        averageStandCost: 480,
        majorVenues: [
          {
            name: 'McCormick Place',
            totalSpace: 260000,
            hallCount: 18,
            facilities: ['Largest in North America', 'Lakefront Location', 'Premium Services'],
            nearbyBuilderCount: 72
          }
        ],
        transportation: {
          airports: ['O\'Hare International', 'Midway'],
          publicTransport: ['CTA', 'Metra', 'Buses'],
          accessibility: 'Multiple transport options with dedicated convention connections'
        }
      },
      {
        name: 'New York',
        slug: 'new-york',
        population: 8300000,
        isCapital: false,
        builderCount: 142,
        upcomingShows: 220,
        averageStandCost: 580,
        majorVenues: [
          {
            name: 'Jacob K. Javits Convention Center',
            totalSpace: 330000,
            hallCount: 15,
            facilities: ['Manhattan Location', 'Hudson River Views', 'Premium Technology'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['JFK', 'LaGuardia', 'Newark'],
          publicTransport: ['Subway', 'Buses', 'Taxi'],
          accessibility: 'Comprehensive NYC transport network access'
        }
      },
      {
        name: 'Orlando',
        slug: 'orlando',
        population: 2500000,
        isCapital: false,
        builderCount: 128,
        upcomingShows: 200,
        averageStandCost: 420,
        majorVenues: [
          {
            name: 'Orange County Convention Center',
            totalSpace: 700000,
            hallCount: 22,
            facilities: ['Massive Scale', 'Theme Park Proximity', 'Tourist Integration'],
            nearbyBuilderCount: 58
          }
        ],
        transportation: {
          airports: ['Orlando International'],
          publicTransport: ['Lynx Buses', 'Rideshare', 'Convention Shuttles'],
          accessibility: 'Tourist-friendly transport with convention focus'
        }
      },
      {
        name: 'Los Angeles',
        slug: 'los-angeles',
        population: 4000000,
        isCapital: false,
        builderCount: 124,
        upcomingShows: 185,
        averageStandCost: 540,
        majorVenues: [
          {
            name: 'Los Angeles Convention Center',
            totalSpace: 180000,
            hallCount: 14,
            facilities: ['Downtown Location', 'Entertainment Industry Access', 'Modern Design'],
            nearbyBuilderCount: 48
          }
        ],
        transportation: {
          airports: ['LAX', 'Burbank', 'Long Beach'],
          publicTransport: ['Metro', 'Buses', 'Light Rail'],
          accessibility: 'Metro and bus connections to convention district'
        }
      }
    ],
    builderCount: 737,
    annualTradeShows: 1125,
    tier: 1
  },
  
  // GERMANY - EXPANDED
  {
    code: 'DE',
    name: 'Germany',
    continent: 'Europe',
    population: 83200000,
    gdp: 4100,
    exhibitionMarketSize: 8500,
    languages: ['German', 'English'],
    currency: 'EUR',
    businessCulture: [
      'Precision and punctuality are fundamental business values',
      'Formal business protocols and titles are important',
      'Engineering excellence and quality focus drive decisions',
      'Long-term business relationships are highly valued'
    ],
    majorCities: [
      {
        name: 'Frankfurt',
        slug: 'frankfurt',
        population: 5300000,
        isCapital: false,
        builderCount: 195,
        upcomingShows: 320,
        averageStandCost: 520,
        majorVenues: [
          {
            name: 'Messe Frankfurt',
            totalSpace: 592000,
            hallCount: 24,
            facilities: ['World\'s Largest Fairground', 'Airport Access', 'Global Hub'],
            nearbyBuilderCount: 85
          }
        ],
        transportation: {
          airports: ['Frankfurt Airport'],
          publicTransport: ['S-Bahn', 'U-Bahn', 'Buses'],
          accessibility: 'Direct S-Bahn connection from airport to Messe'
        }
      },
      {
        name: 'Munich',
        slug: 'munich',
        population: 6100000,
        isCapital: false,
        builderCount: 148,
        upcomingShows: 220,
        averageStandCost: 480,
        majorVenues: [
          {
            name: 'Messe München',
            totalSpace: 200000,
            hallCount: 18,
            facilities: ['ICM Integration', 'Bavarian Hospitality', 'Technology Focus'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['Munich Airport'],
          publicTransport: ['S-Bahn', 'U-Bahn', 'Buses'],
          accessibility: 'S-Bahn line S8 provides direct connection'
        }
      },
      {
        name: 'Berlin',
        slug: 'berlin',
        population: 3700000,
        isCapital: true,
        builderCount: 118,
        upcomingShows: 180,
        averageStandCost: 450,
        majorVenues: [
          {
            name: 'Messe Berlin',
            totalSpace: 160000,
            hallCount: 14,
            facilities: ['Capital Location', 'Government Access', 'Startup Ecosystem'],
            nearbyBuilderCount: 52
          }
        ],
        transportation: {
          airports: ['Berlin Brandenburg'],
          publicTransport: ['S-Bahn', 'U-Bahn', 'Buses'],
          accessibility: 'Central location with excellent public transport'
        }
      },
      {
        name: 'Cologne',
        slug: 'cologne',
        population: 3600000,
        isCapital: false,
        builderCount: 95,
        upcomingShows: 160,
        averageStandCost: 430,
        majorVenues: [
          {
            name: 'Koelnmesse',
            totalSpace: 284000,
            hallCount: 16,
            facilities: ['Deutz Location', 'Cathedral Views', 'Media Hub'],
            nearbyBuilderCount: 42
          }
        ],
        transportation: {
          airports: ['Cologne Bonn Airport'],
          publicTransport: ['S-Bahn', 'U-Bahn', 'Buses'],
          accessibility: 'Deutz station provides direct access'
        }
      },
      {
        name: 'Düsseldorf',
        slug: 'dusseldorf',
        population: 1200000,
        isCapital: false,
        builderCount: 78,
        upcomingShows: 140,
        averageStandCost: 460,
        majorVenues: [
          {
            name: 'Messe Düsseldorf',
            totalSpace: 262000,
            hallCount: 19,
            facilities: ['Medical Excellence', 'Japanese Quarter', 'Rhine Access'],
            nearbyBuilderCount: 35
          }
        ],
        transportation: {
          airports: ['Düsseldorf Airport'],
          publicTransport: ['S-Bahn', 'U-Bahn', 'Buses'],
          accessibility: 'Airport and city center connections available'
        }
      },
      {
        name: 'Hannover',
        slug: 'hannover',
        population: 1200000,
        isCapital: false,
        builderCount: 85,
        upcomingShows: 120,
        averageStandCost: 440,
        majorVenues: [
          {
            name: 'Deutsche Messe AG',
            totalSpace: 496000,
            hallCount: 27,
            facilities: ['World\'s Largest Fairground', 'Industrial Focus', 'Technology Hub'],
            nearbyBuilderCount: 38
          }
        ],
        transportation: {
          airports: ['Hannover Airport'],
          publicTransport: ['S-Bahn', 'Buses', 'Tram'],
          accessibility: 'S-Bahn provides direct connection to Messe/Laatzen'
        }
      }
    ],
    builderCount: 719,
    annualTradeShows: 1140,
    tier: 1
  },
  
  // CHINA - EXPANDED
  {
    code: 'CN',
    name: 'China',
    continent: 'Asia',
    population: 1412000000,
    gdp: 17800,
    exhibitionMarketSize: 12500,
    languages: ['Mandarin', 'English'],
    currency: 'CNY',
    businessCulture: [
      'Relationship building (guanxi) is essential for business success',
      'Face-saving and respect are crucial in business interactions',
      'Group harmony and consensus are valued over individual opinions',
      'Business cards should be received with both hands and respect'
    ],
    majorCities: [
      {
        name: 'Shanghai',
        slug: 'shanghai',
        population: 26300000,
        isCapital: false,
        builderCount: 285,
        upcomingShows: 420,
        averageStandCost: 380,
        majorVenues: [
          {
            name: 'National Exhibition and Convention Center',
            totalSpace: 500000,
            hallCount: 32,
            facilities: ['World\'s Largest Building', 'CIIE Host', 'Global Hub'],
            nearbyBuilderCount: 125
          },
          {
            name: 'Shanghai New International Expo Centre',
            totalSpace: 200000,
            hallCount: 18,
            facilities: ['Pudong Location', 'Airport Access', 'Modern Design'],
            nearbyBuilderCount: 85
          }
        ],
        transportation: {
          airports: ['Pudong International', 'Hongqiao'],
          publicTransport: ['Metro', 'Maglev', 'Buses'],
          accessibility: 'Metro lines provide direct access to exhibition centers'
        }
      },
      {
        name: 'Beijing',
        slug: 'beijing',
        population: 21500000,
        isCapital: true,
        builderCount: 195,
        upcomingShows: 280,
        averageStandCost: 360,
        majorVenues: [
          {
            name: 'China National Convention Center',
            totalSpace: 270000,
            hallCount: 22,
            facilities: ['Olympic Legacy', 'Government Access', 'Cultural Integration'],
            nearbyBuilderCount: 88
          }
        ],
        transportation: {
          airports: ['Beijing Capital', 'Beijing Daxing'],
          publicTransport: ['Subway', 'Buses', 'High-speed Rail'],
          accessibility: 'Subway Line 8 and 15 provide venue access'
        }
      },
      {
        name: 'Guangzhou',
        slug: 'guangzhou',
        population: 15300000,
        isCapital: false,
        builderCount: 165,
        upcomingShows: 240,
        averageStandCost: 320,
        majorVenues: [
          {
            name: 'Canton Fair Complex',
            totalSpace: 390000,
            hallCount: 28,
            facilities: ['Canton Fair Host', 'Pearl River Access', 'Trading Hub'],
            nearbyBuilderCount: 72
          }
        ],
        transportation: {
          airports: ['Guangzhou Baiyun'],
          publicTransport: ['Metro', 'Buses', 'High-speed Rail'],
          accessibility: 'Metro and shuttle services to Canton Fair venue'
        }
      },
      {
        name: 'Shenzhen',
        slug: 'shenzhen',
        population: 12600000,
        isCapital: false,
        builderCount: 142,
        upcomingShows: 200,
        averageStandCost: 340,
        majorVenues: [
          {
            name: 'Shenzhen Convention and Exhibition Center',
            totalSpace: 220000,
            hallCount: 15,
            facilities: ['Tech Hub', 'Hong Kong Access', 'Innovation Focus'],
            nearbyBuilderCount: 58
          }
        ],
        transportation: {
          airports: ['Shenzhen Bao\'an'],
          publicTransport: ['Metro', 'Buses', 'Cross-border Transport'],
          accessibility: 'Metro Line 1 provides direct access to venue'
        }
      }
    ],
    builderCount: 787,
    annualTradeShows: 1140,
    tier: 1
  }
];

// Add comprehensive Tier 2 and Tier 3 countries for global coverage
export const tier2Countries: Country[] = [
  // FRANCE - Major exhibition market
  {
    code: 'FR',
    name: 'France',
    continent: 'Europe',
    population: 67800000,
    gdp: 2800,
    exhibitionMarketSize: 3800,
    languages: ['French', 'English'],
    currency: 'EUR',
    businessCulture: [
      'Formal business etiquette and protocol are important',
      'Punctuality and preparation are highly valued',
      'Business meals are common for relationship building',
      'Quality and craftsmanship are emphasized over speed'
    ],
    majorCities: [
      {
        name: 'Paris',
        slug: 'paris',
        population: 12300000,
        isCapital: true,
        builderCount: 145,
        upcomingShows: 280,
        averageStandCost: 520,
        majorVenues: [
          {
            name: 'Paris Expo Porte de Versailles',
            totalSpace: 230000,
            hallCount: 8,
            facilities: ['Metro Access', 'Historic Venue', 'Central Paris'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['Charles de Gaulle', 'Orly'],
          publicTransport: ['Metro', 'RER', 'Buses'],
          accessibility: 'Excellent metro connections to all venues'
        }
      },
      {
        name: 'Lyon',
        slug: 'lyon',
        population: 2300000,
        isCapital: false,
        builderCount: 58,
        upcomingShows: 120,
        averageStandCost: 420,
        majorVenues: [
          {
            name: 'Eurexpo Lyon',
            totalSpace: 130000,
            hallCount: 12,
            facilities: ['Airport Access', 'Modern Design', 'TGV Connection'],
            nearbyBuilderCount: 28
          }
        ],
        transportation: {
          airports: ['Lyon-Saint Exupéry'],
          publicTransport: ['Metro', 'Trams', 'Buses'],
          accessibility: 'Direct airport and TGV connections'
        }
      }
    ],
    builderCount: 203,
    annualTradeShows: 400,
    tier: 2
  },

  // ITALY - Strong exhibition presence
  {
    code: 'IT',
    name: 'Italy',
    continent: 'Europe',
    population: 59100000,
    gdp: 2100,
    exhibitionMarketSize: 2800,
    languages: ['Italian', 'English'],
    currency: 'EUR',
    businessCulture: [
      'Relationship building is essential for business success',
      'Style and presentation are highly valued',
      'Business lunches are important for networking',
      'Regional differences in business culture exist'
    ],
    majorCities: [
      {
        name: 'Milan',
        slug: 'milan',
        population: 3200000,
        isCapital: false,
        builderCount: 125,
        upcomingShows: 220,
        averageStandCost: 480,
        majorVenues: [
          {
            name: 'Fiera Milano',
            totalSpace: 345000,
            hallCount: 20,
            facilities: ['Design Capital', 'Fashion Hub', 'Business District'],
            nearbyBuilderCount: 58
          }
        ],
        transportation: {
          airports: ['Malpensa', 'Linate'],
          publicTransport: ['Metro', 'Buses', 'Trams'],
          accessibility: 'Metro and shuttle connections to Fiera Milano'
        }
      },
      {
        name: 'Rome',
        slug: 'rome',
        population: 4300000,
        isCapital: true,
        builderCount: 85,
        upcomingShows: 150,
        averageStandCost: 450,
        majorVenues: [
          {
            name: 'Fiera di Roma',
            totalSpace: 180000,
            hallCount: 10,
            facilities: ['Capital Location', 'Government Access', 'Historic City'],
            nearbyBuilderCount: 38
          }
        ],
        transportation: {
          airports: ['Fiumicino', 'Ciampino'],
          publicTransport: ['Metro', 'Buses', 'Trains'],
          accessibility: 'Train connections from airports to city center'
        }
      }
    ],
    builderCount: 210,
    annualTradeShows: 370,
    tier: 2
  },

  // SPAIN - Growing exhibition market
  {
    code: 'ES',
    name: 'Spain',
    continent: 'Europe',
    population: 47400000,
    gdp: 1400,
    exhibitionMarketSize: 2200,
    languages: ['Spanish', 'English'],
    currency: 'EUR',
    businessCulture: [
      'Personal relationships are crucial in business',
      'Business meals and social events are important',
      'Punctuality is appreciated but flexibility is common',
      'Regional pride and local customs are significant'
    ],
    majorCities: [
      {
        name: 'Madrid',
        slug: 'madrid',
        population: 6700000,
        isCapital: true,
        builderCount: 95,
        upcomingShows: 180,
        averageStandCost: 420,
        majorVenues: [
          {
            name: 'IFEMA Madrid',
            totalSpace: 200000,
            hallCount: 14,
            facilities: ['Capital Location', 'Government Hub', 'Business Center'],
            nearbyBuilderCount: 45
          }
        ],
        transportation: {
          airports: ['Barajas'],
          publicTransport: ['Metro', 'Buses', 'Trains'],
          accessibility: 'Metro Line 8 connects airport to IFEMA'
        }
      },
      {
        name: 'Barcelona',
        slug: 'barcelona',
        population: 5600000,
        isCapital: false,
        builderCount: 78,
        upcomingShows: 160,
        averageStandCost: 400,
        majorVenues: [
          {
            name: 'Fira Barcelona',
            totalSpace: 240000,
            hallCount: 16,
            facilities: ['Mediterranean Location', 'Design Hub', 'Tourism Center'],
            nearbyBuilderCount: 35
          }
        ],
        transportation: {
          airports: ['El Prat'],
          publicTransport: ['Metro', 'Buses', 'Trams'],
          accessibility: 'Metro and bus connections to Fira venues'
        }
      }
    ],
    builderCount: 173,
    annualTradeShows: 340,
    tier: 2
  },

  // NETHERLANDS - Strategic exhibition hub
  {
    code: 'NL',
    name: 'Netherlands',
    continent: 'Europe',
    population: 17400000,
    gdp: 900,
    exhibitionMarketSize: 1800,
    languages: ['Dutch', 'English'],
    currency: 'EUR',
    businessCulture: [
      'Direct communication and honesty are valued',
      'Punctuality and efficiency are essential',
      'Egalitarian approach to business relationships',
      'Environmental consciousness in business practices'
    ],
    majorCities: [
      {
        name: 'Amsterdam',
        slug: 'amsterdam',
        population: 2400000,
        isCapital: true,
        builderCount: 85,
        upcomingShows: 150,
        averageStandCost: 480,
        majorVenues: [
          {
            name: 'RAI Amsterdam',
            totalSpace: 87000,
            hallCount: 11,
            facilities: ['Central Location', 'Sustainable Venue', 'Innovation Hub'],
            nearbyBuilderCount: 42
          }
        ],
        transportation: {
          airports: ['Schiphol'],
          publicTransport: ['Trams', 'Metro', 'Buses'],
          accessibility: 'Direct train from Schiphol to RAI Station'
        }
      }
    ],
    builderCount: 85,
    annualTradeShows: 150,
    tier: 2
  },

  // UNITED ARAB EMIRATES - Major Middle East hub
  {
    code: 'AE',
    name: 'United Arab Emirates',
    continent: 'Asia',
    population: 9900000,
    gdp: 450,
    exhibitionMarketSize: 3200,
    languages: ['Arabic', 'English'],
    currency: 'AED',
    businessCulture: [
      'Relationship building and trust are fundamental',
      'Respect for hierarchy and seniority is important',
      'Business hospitality and generosity are valued',
      'International outlook with local customs'
    ],
    majorCities: [
      {
        name: 'Dubai',
        slug: 'dubai',
        population: 3400000,
        isCapital: false,
        builderCount: 125,
        upcomingShows: 280,
        averageStandCost: 450,
        majorVenues: [
          {
            name: 'Dubai World Trade Centre',
            totalSpace: 120000,
            hallCount: 8,
            facilities: ['Business Hub', 'Luxury Services', 'Global Connectivity'],
            nearbyBuilderCount: 65
          },
          {
            name: 'Expo City Dubai',
            totalSpace: 438000,
            hallCount: 15,
            facilities: ['Expo Legacy', 'Innovation District', 'Sustainability Focus'],
            nearbyBuilderCount: 45
          }
        ],
        transportation: {
          airports: ['Dubai International', 'Al Maktoum'],
          publicTransport: ['Metro', 'Buses', 'Taxis'],
          accessibility: 'Metro Red Line connects to DWTC'
        }
      },
      {
        name: 'Abu Dhabi',
        slug: 'abu-dhabi',
        population: 1500000,
        isCapital: true,
        builderCount: 45,
        upcomingShows: 80,
        averageStandCost: 420,
        majorVenues: [
          {
            name: 'ADNEC Centre Abu Dhabi',
            totalSpace: 73000,
            hallCount: 12,
            facilities: ['Capital Location', 'Government Access', 'Oil & Gas Hub'],
            nearbyBuilderCount: 25
          }
        ],
        transportation: {
          airports: ['Abu Dhabi International'],
          publicTransport: ['Buses', 'Taxis'],
          accessibility: 'Direct highway connections from airport'
        }
      }
    ],
    builderCount: 170,
    annualTradeShows: 360,
    tier: 2
  },

  // SINGAPORE - Asia-Pacific gateway
  {
    code: 'SG',
    name: 'Singapore',
    continent: 'Asia',
    population: 5900000,
    gdp: 400,
    exhibitionMarketSize: 2100,
    languages: ['English', 'Mandarin', 'Malay'],
    currency: 'SGD',
    businessCulture: [
      'Efficiency and professionalism are paramount',
      'Multicultural sensitivity is essential',
      'Innovation and technology focus is strong',
      'Government support for business is significant'
    ],
    majorCities: [
      {
        name: 'Singapore',
        slug: 'singapore',
        population: 5900000,
        isCapital: true,
        builderCount: 95,
        upcomingShows: 200,
        averageStandCost: 520,
        majorVenues: [
          {
            name: 'Singapore Expo',
            totalSpace: 100000,
            hallCount: 10,
            facilities: ['Airport Adjacent', 'Asia-Pacific Hub', 'Modern Technology'],
            nearbyBuilderCount: 55
          },
          {
            name: 'Sands Expo',
            totalSpace: 45000,
            hallCount: 6,
            facilities: ['Marina Bay Location', 'Luxury Venue', 'Integrated Resort'],
            nearbyBuilderCount: 35
          }
        ],
        transportation: {
          airports: ['Changi'],
          publicTransport: ['MRT', 'Buses', 'Taxis'],
          accessibility: 'MRT East West Line to Singapore Expo'
        }
      }
    ],
    builderCount: 95,
    annualTradeShows: 200,
    tier: 2
  },

  // JAPAN - Advanced exhibition market
  {
    code: 'JP',
    name: 'Japan',
    continent: 'Asia',
    population: 125800000,
    gdp: 4200,
    exhibitionMarketSize: 4500,
    languages: ['Japanese', 'English'],
    currency: 'JPY',
    businessCulture: [
      'Respect, hierarchy, and protocol are fundamental',
      'Consensus building and group harmony are important',
      'Attention to detail and quality is paramount',
      'Long-term relationships are highly valued'
    ],
    majorCities: [
      {
        name: 'Tokyo',
        slug: 'tokyo',
        population: 37400000,
        isCapital: true,
        builderCount: 185,
        upcomingShows: 320,
        averageStandCost: 580,
        majorVenues: [
          {
            name: 'Tokyo Big Sight',
            totalSpace: 230000,
            hallCount: 13,
            facilities: ['Waterfront Location', 'Modern Design', 'Technology Hub'],
            nearbyBuilderCount: 85
          },
          {
            name: 'Makuhari Messe',
            totalSpace: 210000,
            hallCount: 11,
            facilities: ['Chiba Location', 'International Events', 'Convention Center'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['Narita', 'Haneda'],
          publicTransport: ['JR', 'Metro', 'Buses'],
          accessibility: 'Yurikamome Line to Tokyo Big Sight'
        }
      },
      {
        name: 'Osaka',
        slug: 'osaka',
        population: 19300000,
        isCapital: false,
        builderCount: 125,
        upcomingShows: 180,
        averageStandCost: 520,
        majorVenues: [
          {
            name: 'Intex Osaka',
            totalSpace: 70000,
            hallCount: 6,
            facilities: ['Bay Area', 'Business District', 'Kansai Hub'],
            nearbyBuilderCount: 45
          }
        ],
        transportation: {
          airports: ['Kansai', 'Itami'],
          publicTransport: ['JR', 'Subway', 'Buses'],
          accessibility: 'Nanko Port Town Line to Intex Osaka'
        }
      }
    ],
    builderCount: 310,
    annualTradeShows: 500,
    tier: 2
  },

  // AUSTRALIA - Oceania hub
  {
    code: 'AU',
    name: 'Australia',
    continent: 'Oceania',
    population: 25700000,
    gdp: 1600,
    exhibitionMarketSize: 1200,
    languages: ['English'],
    currency: 'AUD',
    businessCulture: [
      'Informal and egalitarian business approach',
      'Direct communication and honesty are valued',
      'Work-life balance is important',
      'Environmental and social responsibility focus'
    ],
    majorCities: [
      {
        name: 'Sydney',
        slug: 'sydney',
        population: 5300000,
        isCapital: false,
        builderCount: 85,
        upcomingShows: 150,
        averageStandCost: 480,
        majorVenues: [
          {
            name: 'ICC Sydney',
            totalSpace: 35000,
            hallCount: 8,
            facilities: ['Darling Harbour', 'Modern Design', 'Waterfront Views'],
            nearbyBuilderCount: 45
          }
        ],
        transportation: {
          airports: ['Kingsford Smith'],
          publicTransport: ['Trains', 'Buses', 'Light Rail'],
          accessibility: 'Light Rail to ICC Sydney from Central Station'
        }
      },
      {
        name: 'Melbourne',
        slug: 'melbourne',
        population: 5100000,
        isCapital: false,
        builderCount: 78,
        upcomingShows: 140,
        averageStandCost: 460,
        majorVenues: [
          {
            name: 'Melbourne Convention Centre',
            totalSpace: 70000,
            hallCount: 9,
            facilities: ['Southbank Location', 'Sustainable Design', 'Arts Precinct'],
            nearbyBuilderCount: 38
          }
        ],
        transportation: {
          airports: ['Melbourne Airport'],
          publicTransport: ['Trains', 'Trams', 'Buses'],
          accessibility: 'Tram and train connections to Southbank'
        }
      }
    ],
    builderCount: 163,
    annualTradeShows: 290,
    tier: 2
  }
];

// Tier 3 Countries - Emerging and smaller exhibition markets
export const tier3Countries: Country[] = [
  // CANADA
  {
    code: 'CA',
    name: 'Canada',
    continent: 'North America',
    population: 38000000,
    gdp: 2100,
    exhibitionMarketSize: 1800,
    languages: ['English', 'French'],
    currency: 'CAD',
    businessCulture: [
      'Polite and respectful business interactions',
      'Punctuality and preparation are valued',
      'Multicultural sensitivity is important',
      'Environmental consciousness in business'
    ],
    majorCities: [
      {
        name: 'Toronto',
        slug: 'toronto',
        population: 6200000,
        isCapital: false,
        builderCount: 95,
        upcomingShows: 180,
        averageStandCost: 420,
        majorVenues: [
          {
            name: 'Metro Toronto Convention Centre',
            totalSpace: 55000,
            hallCount: 8,
            facilities: ['Downtown Location', 'CN Tower Views', 'Financial District'],
            nearbyBuilderCount: 45
          }
        ],
        transportation: {
          airports: ['Pearson'],
          publicTransport: ['Subway', 'Streetcars', 'Buses'],
          accessibility: 'Union Station connects to convention center'
        }
      },
      {
        name: 'Vancouver',
        slug: 'vancouver',
        population: 2600000,
        isCapital: false,
        builderCount: 58,
        upcomingShows: 120,
        averageStandCost: 400,
        majorVenues: [
          {
            name: 'Vancouver Convention Centre',
            totalSpace: 43000,
            hallCount: 6,
            facilities: ['Waterfront Location', 'Mountain Views', 'Sustainable Design'],
            nearbyBuilderCount: 28
          }
        ],
        transportation: {
          airports: ['Vancouver International'],
          publicTransport: ['SkyTrain', 'Buses', 'SeaBus'],
          accessibility: 'Canada Line SkyTrain to Waterfront Station'
        }
      }
    ],
    builderCount: 153,
    annualTradeShows: 300,
    tier: 3
  },

  // BRAZIL
  {
    code: 'BR',
    name: 'Brazil',
    continent: 'South America',
    population: 215000000,
    gdp: 2100,
    exhibitionMarketSize: 1500,
    languages: ['Portuguese', 'English'],
    currency: 'BRL',
    businessCulture: [
      'Personal relationships are crucial for business',
      'Social interaction and networking are important',
      'Flexibility with time and schedules is common',
      'Regional differences across the country exist'
    ],
    majorCities: [
      {
        name: 'São Paulo',
        slug: 'sao-paulo',
        population: 22400000,
        isCapital: false,
        builderCount: 125,
        upcomingShows: 220,
        averageStandCost: 280,
        majorVenues: [
          {
            name: 'Expo Center Norte',
            totalSpace: 90000,
            hallCount: 12,
            facilities: ['Business Hub', 'Industrial Center', 'South America Gateway'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['Guarulhos', 'Congonhas'],
          publicTransport: ['Metro', 'Buses', 'Trains'],
          accessibility: 'Metro Blue Line to Expo Center Norte'
        }
      },
      {
        name: 'Rio de Janeiro',
        slug: 'rio-de-janeiro',
        population: 13700000,
        isCapital: false,
        builderCount: 78,
        upcomingShows: 140,
        averageStandCost: 260,
        majorVenues: [
          {
            name: 'Riocentro',
            totalSpace: 70000,
            hallCount: 8,
            facilities: ['Olympic Legacy', 'Barra Location', 'Tourism Hub'],
            nearbyBuilderCount: 35
          }
        ],
        transportation: {
          airports: ['Galeão', 'Santos Dumont'],
          publicTransport: ['Metro', 'Buses', 'BRT'],
          accessibility: 'BRT TransOeste to Riocentro'
        }
      }
    ],
    builderCount: 203,
    annualTradeShows: 360,
    tier: 3
  },

  // INDIA
  {
    code: 'IN',
    name: 'India',
    continent: 'Asia',
    population: 1380000000,
    gdp: 3700,
    exhibitionMarketSize: 2800,
    languages: ['Hindi', 'English'],
    currency: 'INR',
    businessCulture: [
      'Hierarchy and respect for seniority are important',
      'Relationship building takes time and patience',
      'Family and personal connections influence business',
      'Regional and cultural diversity affects business practices'
    ],
    majorCities: [
      {
        name: 'Mumbai',
        slug: 'mumbai',
        population: 20400000,
        isCapital: false,
        builderCount: 145,
        upcomingShows: 280,
        averageStandCost: 180,
        majorVenues: [
          {
            name: 'Bombay Exhibition Centre',
            totalSpace: 40000,
            hallCount: 6,
            facilities: ['Financial Capital', 'Business Hub', 'Bollywood Center'],
            nearbyBuilderCount: 75
          }
        ],
        transportation: {
          airports: ['Chhatrapati Shivaji'],
          publicTransport: ['Local Trains', 'Metro', 'Buses'],
          accessibility: 'Western Railway to Goregaon for BEC'
        }
      },
      {
        name: 'Delhi',
        slug: 'delhi',
        population: 32900000,
        isCapital: true,
        builderCount: 125,
        upcomingShows: 240,
        averageStandCost: 160,
        majorVenues: [
          {
            name: 'India Expo Centre',
            totalSpace: 150000,
            hallCount: 16,
            facilities: ['Capital Region', 'Government Access', 'Modern Facilities'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['Indira Gandhi International'],
          publicTransport: ['Metro', 'Buses', 'Auto-rickshaws'],
          accessibility: 'Delhi Metro Blue Line to Dwarka for India Expo'
        }
      }
    ],
    builderCount: 270,
    annualTradeShows: 520,
    tier: 3
  },

  // SOUTH KOREA
  {
    code: 'KR',
    name: 'South Korea',
    continent: 'Asia',
    population: 51800000,
    gdp: 1800,
    exhibitionMarketSize: 1600,
    languages: ['Korean', 'English'],
    currency: 'KRW',
    businessCulture: [
      'Hierarchy and respect are fundamental in business',
      'Relationship building through social activities',
      'Technology and innovation are highly valued',
      'Attention to detail and quality is paramount'
    ],
    majorCities: [
      {
        name: 'Seoul',
        slug: 'seoul',
        population: 9700000,
        isCapital: true,
        builderCount: 125,
        upcomingShows: 220,
        averageStandCost: 380,
        majorVenues: [
          {
            name: 'COEX',
            totalSpace: 54000,
            hallCount: 4,
            facilities: ['Gangnam District', 'Underground Mall', 'Business Center'],
            nearbyBuilderCount: 65
          }
        ],
        transportation: {
          airports: ['Incheon', 'Gimpo'],
          publicTransport: ['Subway', 'Buses'],
          accessibility: 'Subway Line 2 to Samseong Station for COEX'
        }
      }
    ],
    builderCount: 125,
    annualTradeShows: 220,
    tier: 3
  },

  // MEXICO
  {
    code: 'MX',
    name: 'Mexico',
    continent: 'North America',
    population: 128900000,
    gdp: 1700,
    exhibitionMarketSize: 1200,
    languages: ['Spanish', 'English'],
    currency: 'MXN',
    businessCulture: [
      'Personal relationships are essential for business',
      'Family and social connections are important',
      'Respect for hierarchy and age is valued',
      'Business meals and social events are common'
    ],
    majorCities: [
      {
        name: 'Mexico City',
        slug: 'mexico-city',
        population: 21800000,
        isCapital: true,
        builderCount: 95,
        upcomingShows: 180,
        averageStandCost: 220,
        majorVenues: [
          {
            name: 'Centro Citibanamex',
            totalSpace: 65000,
            hallCount: 8,
            facilities: ['Capital Location', 'Business District', 'Modern Design'],
            nearbyBuilderCount: 45
          }
        ],
        transportation: {
          airports: ['Mexico City International'],
          publicTransport: ['Metro', 'Buses', 'Metrobus'],
          accessibility: 'Metro Line 5 to Terminal Aérea'
        }
      }
    ],
    builderCount: 95,
    annualTradeShows: 180,
    tier: 3
  },

  // SOUTH AFRICA
  {
    code: 'ZA',
    name: 'South Africa',
    continent: 'Africa',
    population: 60400000,
    gdp: 420,
    exhibitionMarketSize: 800,
    languages: ['English', 'Afrikaans'],
    currency: 'ZAR',
    businessCulture: [
      'Relationship building is important for business',
      'Diversity and inclusion are valued',
      'Punctuality and professionalism are expected',
      'Social responsibility is increasingly important'
    ],
    majorCities: [
      {
        name: 'Johannesburg',
        slug: 'johannesburg',
        population: 5600000,
        isCapital: false,
        builderCount: 65,
        upcomingShows: 120,
        averageStandCost: 180,
        majorVenues: [
          {
            name: 'Sandton Convention Centre',
            totalSpace: 25000,
            hallCount: 6,
            facilities: ['Business District', 'Financial Hub', 'Modern Facilities'],
            nearbyBuilderCount: 35
          }
        ],
        transportation: {
          airports: ['OR Tambo'],
          publicTransport: ['Gautrain', 'Buses', 'Taxis'],
          accessibility: 'Gautrain to Sandton Station'
        }
      },
      {
        name: 'Cape Town',
        slug: 'cape-town',
        population: 4600000,
        isCapital: true,
        builderCount: 45,
        upcomingShows: 80,
        averageStandCost: 160,
        majorVenues: [
          {
            name: 'Cape Town International Convention Centre',
            totalSpace: 15000,
            hallCount: 4,
            facilities: ['Waterfront Location', 'Tourism Hub', 'Mountain Views'],
            nearbyBuilderCount: 25
          }
        ],
        transportation: {
          airports: ['Cape Town International'],
          publicTransport: ['Buses', 'Taxis', 'MyCiTi'],
          accessibility: 'MyCiTi bus service to CTICC'
        }
      }
    ],
    builderCount: 110,
    annualTradeShows: 200,
    tier: 3
  }
];

// Combine all tiers for comprehensive global coverage
export const allCountriesWithCities = [...tier1Countries, ...tier2Countries, ...tier3Countries];

// Updated stats for complete global coverage
export const globalExhibitionStats = {
  totalCountries: allCountriesWithCities.length,
  totalCities: allCountriesWithCities.reduce((sum, country) => sum + country.majorCities.length, 0),
  totalBuilders: allCountriesWithCities.reduce((sum, country) => sum + country.builderCount, 0),
  totalTradeShows: allCountriesWithCities.reduce((sum, country) => sum + country.annualTradeShows, 0),
  totalMarketSize: allCountriesWithCities.reduce((sum, country) => sum + country.exhibitionMarketSize, 0),
  
  // Geographic Distribution
  continents: {
    'North America': { 
      countries: allCountriesWithCities.filter(c => c.continent === 'North America').length,
      cities: allCountriesWithCities.filter(c => c.continent === 'North America').reduce((sum, c) => sum + c.majorCities.length, 0),
      builders: allCountriesWithCities.filter(c => c.continent === 'North America').reduce((sum, c) => sum + c.builderCount, 0),
      shows: allCountriesWithCities.filter(c => c.continent === 'North America').reduce((sum, c) => sum + c.annualTradeShows, 0)
    },
    'Europe': { 
      countries: allCountriesWithCities.filter(c => c.continent === 'Europe').length,
      cities: allCountriesWithCities.filter(c => c.continent === 'Europe').reduce((sum, c) => sum + c.majorCities.length, 0),
      builders: allCountriesWithCities.filter(c => c.continent === 'Europe').reduce((sum, c) => sum + c.builderCount, 0),
      shows: allCountriesWithCities.filter(c => c.continent === 'Europe').reduce((sum, c) => sum + c.annualTradeShows, 0)
    },
    'Asia': { 
      countries: allCountriesWithCities.filter(c => c.continent === 'Asia').length,
      cities: allCountriesWithCities.filter(c => c.continent === 'Asia').reduce((sum, c) => sum + c.majorCities.length, 0),
      builders: allCountriesWithCities.filter(c => c.continent === 'Asia').reduce((sum, c) => sum + c.builderCount, 0),
      shows: allCountriesWithCities.filter(c => c.continent === 'Asia').reduce((sum, c) => sum + c.annualTradeShows, 0)
    },
    'South America': { 
      countries: allCountriesWithCities.filter(c => c.continent === 'South America').length,
      cities: allCountriesWithCities.filter(c => c.continent === 'South America').reduce((sum, c) => sum + c.majorCities.length, 0),
      builders: allCountriesWithCities.filter(c => c.continent === 'South America').reduce((sum, c) => sum + c.builderCount, 0),
      shows: allCountriesWithCities.filter(c => c.continent === 'South America').reduce((sum, c) => sum + c.annualTradeShows, 0)
    },
    'Africa': { 
      countries: allCountriesWithCities.filter(c => c.continent === 'Africa').length,
      cities: allCountriesWithCities.filter(c => c.continent === 'Africa').reduce((sum, c) => sum + c.majorCities.length, 0),
      builders: allCountriesWithCities.filter(c => c.continent === 'Africa').reduce((sum, c) => sum + c.builderCount, 0),
      shows: allCountriesWithCities.filter(c => c.continent === 'Africa').reduce((sum, c) => sum + c.annualTradeShows, 0)
    },
    'Oceania': { 
      countries: allCountriesWithCities.filter(c => c.continent === 'Oceania').length,
      cities: allCountriesWithCities.filter(c => c.continent === 'Oceania').reduce((sum, c) => sum + c.majorCities.length, 0),
      builders: allCountriesWithCities.filter(c => c.continent === 'Oceania').reduce((sum, c) => sum + c.builderCount, 0),
      shows: allCountriesWithCities.filter(c => c.continent === 'Oceania').reduce((sum, c) => sum + c.annualTradeShows, 0)
    }
  },
  
  // Top Exhibition Markets
  topMarkets: allCountriesWithCities
    .sort((a, b) => b.exhibitionMarketSize - a.exhibitionMarketSize)
    .slice(0, 10)
    .map(country => ({
      country: country.name,
      marketSize: country.exhibitionMarketSize,
      cities: country.majorCities.length,
      builders: country.builderCount
    }))
};

console.log('🌍 COMPREHENSIVE GLOBAL EXHIBITION DATABASE LOADED');
console.log(`📊 Coverage: ${globalExhibitionStats.totalCountries} countries, ${globalExhibitionStats.totalCities} cities`);
console.log(`🏗️ ${globalExhibitionStats.totalBuilders} builders, ${globalExhibitionStats.totalTradeShows} annual shows`);
console.log(`💰 $${globalExhibitionStats.totalMarketSize}B global market covered`);

// Add comprehensive list of all countries for forms and general use
export const allCountries = [
  // Asia
  { code: 'AF', name: 'Afghanistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BN', name: 'Brunei' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'JP', name: 'Japan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NP', name: 'Nepal' },
  { code: 'KP', name: 'North Korea' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PH', name: 'Philippines' },
  { code: 'SG', name: 'Singapore' },
  { code: 'KR', name: 'South Korea' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VN', name: 'Vietnam' },

  // Middle East
  { code: 'BH', name: 'Bahrain' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IL', name: 'Israel' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'OM', name: 'Oman' },
  { code: 'PS', name: 'Palestine' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SY', name: 'Syria' },
  { code: 'TR', name: 'Turkey' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'YE', name: 'Yemen' },

  // Europe
  { code: 'AL', name: 'Albania' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'SM', name: 'San Marino' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'VA', name: 'Vatican City' },

  // North America
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'US', name: 'United States' },

  // Central America & Caribbean
  { code: 'BZ', name: 'Belize' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panama' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BB', name: 'Barbados' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'GD', name: 'Grenada' },
  { code: 'HT', name: 'Haiti' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'TT', name: 'Trinidad and Tobago' },

  // South America
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'GY', name: 'Guyana' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'SR', name: 'Suriname' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },

  // Africa
  { code: 'DZ', name: 'Algeria' },
  { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Democratic Republic of the Congo' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SN', name: 'Senegal' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },

  // Oceania
  { code: 'AU', name: 'Australia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'PW', name: 'Palau' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'VU', name: 'Vanuatu' }
].sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
