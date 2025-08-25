// COMPLETE GLOBAL EXHIBITION DATABASE - ALL MAJOR DESTINATIONS WORLDWIDE
// MASSIVELY EXPANDED TO INCLUDE ALL REQUESTED COUNTRIES AND CITIES
// Updated with comprehensive Location KKS integration

export interface ExhibitionVenue {
  name: string;
  size: string;
  website: string;
  description: string;
  majorEvents: string[];
}

export interface ExhibitionCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  slug: string;
  population: string;
  timeZone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isCapital: boolean;
  is_exhibition_hub: true; // Required tag for all exhibition cities
  majorAirport: string;
  venues: ExhibitionVenue[];
  keyIndustries: string[];
  annualEvents: number;
  averageStandSize: string;
  topBudgetRange: string;
  nearestMajorCities: Array<{
    name: string;
    distance: string;
    country: string;
  }>;
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface ExhibitionCountry {
  id: string;
  name: string;
  countryCode: string;
  continent: string;
  slug: string;
  capital: string;
  currency: string;
  majorCities: string[];
  totalVenues: number;
  annualEvents: number;
  keyIndustries: string[];
  exhibitionRanking: number;
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// COMPREHENSIVE EXHIBITION COUNTRIES DATABASE - UPDATED WITH FULL LOCATION KKS
const EXHIBITION_COUNTRIES: ExhibitionCountry[] = [
  // 🌍 EUROPE - Complete Integration
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    countryCode: 'GB',
    continent: 'Europe',
    slug: 'united-kingdom',
    capital: 'London',
    currency: 'GBP',
    majorCities: ['London', 'Birmingham', 'Manchester'],
    totalVenues: 55,
    annualEvents: 950,
    keyIndustries: ['Financial Services', 'Technology', 'Healthcare', 'Creative Industries', 'Energy'],
    exhibitionRanking: 4,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in UK | London Birmingham Trade Shows',
      metaDescription: 'Leading exhibition stand builders in United Kingdom. Custom displays for London, Birmingham, Manchester.',
      keywords: ['UK exhibition stands', 'London trade shows', 'ExCeL London', 'British exhibitions']
    }
  },
  {
    id: 'france',
    name: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    slug: 'france',
    capital: 'Paris',
    currency: 'EUR',
    majorCities: ['Paris', 'Lyon', 'Cannes', 'Strasbourg'],
    totalVenues: 48,
    annualEvents: 820,
    keyIndustries: ['Luxury Goods', 'Fashion', 'Food & Wine', 'Technology', 'Aerospace'],
    exhibitionRanking: 3,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in France | Paris Lyon Trade Shows',
      metaDescription: 'Expert exhibition stand builders in France. Professional displays for Paris, Lyon, Marseille exhibitions.',
      keywords: ['France exhibition stands', 'Paris trade shows', 'SIAL Paris', 'French exhibitions']
    }
  },
  {
    id: 'germany',
    name: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    slug: 'germany',
    capital: 'Berlin',
    currency: 'EUR',
    majorCities: ['Berlin', 'Frankfurt', 'Munich', 'Hamburg', 'Düsseldorf', 'Stuttgart', 'Cologne', 'Hannover', 'Dortmund', 'Essen', 'Nuremberg', 'Leipzig'],
    totalVenues: 95,
    annualEvents: 2100,
    keyIndustries: ['Automotive', 'Industrial Technology', 'Healthcare', 'Energy', 'Engineering'],
    exhibitionRanking: 2,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Germany | Frankfurt Munich Berlin Trade Shows',
      metaDescription: 'Leading exhibition stand builders across Germany. Expert displays for Frankfurt Messe, Munich, Berlin exhibitions.',
      keywords: ['Germany exhibition stands', 'Frankfurt Messe', 'Munich exhibitions', 'German trade shows']
    }
  },
  {
    id: 'italy',
    name: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    slug: 'italy',
    capital: 'Rome',
    currency: 'EUR',
    majorCities: ['Milan', 'Venice', 'Naples', 'Bologna', 'Rome', 'Verona'],
    totalVenues: 42,
    annualEvents: 750,
    keyIndustries: ['Fashion', 'Design', 'Food & Beverage', 'Automotive', 'Machinery'],
    exhibitionRanking: 5,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Italy | Milan Rome Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Italy. Professional displays for Milan, Rome, Bologna exhibitions.',
      keywords: ['Italy exhibition stands', 'Milan trade shows', 'Salone del Mobile', 'Italian exhibitions']
    }
  },
  {
    id: 'spain',
    name: 'Spain',
    countryCode: 'ES',
    continent: 'Europe',
    slug: 'spain',
    capital: 'Madrid',
    currency: 'EUR',
    majorCities: ['Barcelona', 'Madrid', 'Valencia', 'Zaragoza', 'Bilbao'],
    totalVenues: 38,
    annualEvents: 620,
    keyIndustries: ['Tourism', 'Food & Beverage', 'Technology', 'Renewable Energy', 'Fashion'],
    exhibitionRanking: 7,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Spain | Barcelona Madrid Trade Shows',
      metaDescription: 'Professional exhibition stand builders in Spain. Expert displays for Barcelona, Madrid, Valencia.',
      keywords: ['Spain exhibition stands', 'Barcelona trade shows', 'Madrid exhibitions', 'Spanish displays']
    }
  },
  {
    id: 'belgium',
    name: 'Belgium',
    countryCode: 'BE',
    continent: 'Europe',
    slug: 'belgium',
    capital: 'Brussels',
    currency: 'EUR',
    majorCities: ['Brussels', 'Antwerp', 'Ghent'],
    totalVenues: 18,
    annualEvents: 290,
    keyIndustries: ['EU Government', 'Chemicals', 'Technology', 'Food', 'Diamonds'],
    exhibitionRanking: 16,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Belgium | Brussels Antwerp Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Belgium. Professional displays for Brussels, Antwerp.',
      keywords: ['Belgium exhibitions', 'Brussels trade shows', 'Antwerp displays', 'EU exhibitions']
    }
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    countryCode: 'NL',
    continent: 'Europe',
    slug: 'netherlands',
    capital: 'Amsterdam',
    currency: 'EUR',
    majorCities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'],
    totalVenues: 22,
    annualEvents: 380,
    keyIndustries: ['Agriculture', 'Technology', 'Logistics', 'Energy', 'Healthcare'],
    exhibitionRanking: 8,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Netherlands | Amsterdam Trade Shows',
      metaDescription: 'Leading exhibition stand builders in Netherlands. Custom displays for Amsterdam, Rotterdam.',
      keywords: ['Netherlands exhibition stands', 'Amsterdam trade shows', 'Dutch exhibitions', 'RAI Amsterdam']
    }
  },
  {
    id: 'greece',
    name: 'Greece',
    countryCode: 'GR',
    continent: 'Europe',
    slug: 'greece',
    capital: 'Athens',
    currency: 'EUR',
    majorCities: ['Athens', 'Thessaloniki'],
    totalVenues: 15,
    annualEvents: 220,
    keyIndustries: ['Tourism', 'Shipping', 'Agriculture', 'Energy', 'Food Processing'],
    exhibitionRanking: 18,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Greece | Athens Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Greece. Professional displays for Athens, Thessaloniki.',
      keywords: ['Greece exhibitions', 'Athens trade shows', 'Greek displays', 'Mediterranean exhibitions']
    }
  },
  {
    id: 'hungary',
    name: 'Hungary',
    countryCode: 'HU',
    continent: 'Europe',
    slug: 'hungary',
    capital: 'Budapest',
    currency: 'HUF',
    majorCities: ['Budapest'],
    totalVenues: 12,
    annualEvents: 180,
    keyIndustries: ['Automotive', 'Technology', 'Manufacturing', 'Tourism', 'Agriculture'],
    exhibitionRanking: 20,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Hungary | Budapest Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Hungary. Professional displays for Budapest exhibitions.',
      keywords: ['Hungary exhibitions', 'Budapest trade shows', 'Hungarian displays', 'Central European exhibitions']
    }
  },
  {
    id: 'poland',
    name: 'Poland',
    countryCode: 'PL',
    continent: 'Europe',
    slug: 'poland',
    capital: 'Warsaw',
    currency: 'PLN',
    majorCities: ['Warsaw', 'Kraków', 'Poznań', 'Wrocław'],
    totalVenues: 18,
    annualEvents: 280,
    keyIndustries: ['Manufacturing', 'Technology', 'Agriculture', 'Mining', 'Automotive'],
    exhibitionRanking: 17,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Poland | Warsaw Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Poland. Professional displays for Warsaw exhibitions.',
      keywords: ['Poland exhibitions', 'Warsaw trade shows', 'Polish displays', 'Eastern European exhibitions']
    }
  },
  {
    id: 'romania',
    name: 'Romania',
    countryCode: 'RO',
    continent: 'Europe',
    slug: 'romania',
    capital: 'Bucharest',
    currency: 'RON',
    majorCities: ['Bucharest', 'Cluj-Napoca', 'Timișoara'],
    totalVenues: 12,
    annualEvents: 160,
    keyIndustries: ['Manufacturing', 'Technology', 'Agriculture', 'Energy', 'Automotive'],
    exhibitionRanking: 22,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Romania | Bucharest Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Romania. Professional displays for Bucharest exhibitions.',
      keywords: ['Romania exhibitions', 'Bucharest trade shows', 'Romanian displays', 'Eastern European exhibitions']
    }
  },

  // 🌎 NORTH AMERICA - Complete Integration
  {
    id: 'united-states',
    name: 'United States',
    countryCode: 'US',
    continent: 'North America',
    slug: 'united-states',
    capital: 'Washington D.C.',
    currency: 'USD',
    majorCities: ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Chicago', 'Orlando', 'Miami', 'Atlanta', 'Dallas', 'Houston'],
    totalVenues: 280,
    annualEvents: 4500,
    keyIndustries: ['Technology', 'Healthcare', 'Automotive', 'Defense', 'Entertainment', 'Finance'],
    exhibitionRanking: 1,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in USA | Professional Trade Show Displays',
      metaDescription: 'Leading exhibition stand builders across United States. Expert displays for Las Vegas, Chicago, New York, Orlando and all major US trade shows.',
      keywords: ['USA exhibition stands', 'Las Vegas trade shows', 'CES displays', 'American exhibitions']
    }
  },
  {
    id: 'canada',
    name: 'Canada',
    countryCode: 'CA',
    continent: 'North America',
    slug: 'canada',
    capital: 'Ottawa',
    currency: 'CAD',
    majorCities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary'],
    totalVenues: 45,
    annualEvents: 680,
    keyIndustries: ['Natural Resources', 'Technology', 'Healthcare', 'Agriculture', 'Energy'],
    exhibitionRanking: 15,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Canada | Toronto Vancouver Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Canada. Professional displays for Toronto, Vancouver, Montreal exhibitions.',
      keywords: ['Canada exhibition stands', 'Toronto trade shows', 'Vancouver exhibitions', 'Canadian displays']
    }
  },

  // 🌎 SOUTH AMERICA - Complete Integration
  {
    id: 'brazil',
    name: 'Brazil',
    countryCode: 'BR',
    continent: 'South America',
    slug: 'brazil',
    capital: 'Brasília',
    currency: 'BRL',
    majorCities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Curitiba', 'Porto Alegre'],
    totalVenues: 45,
    annualEvents: 650,
    keyIndustries: ['Agriculture', 'Mining', 'Manufacturing', 'Oil & Gas', 'Technology'],
    exhibitionRanking: 8,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Brazil | São Paulo Rio Trade Shows',
      metaDescription: 'Leading exhibition stand builders in Brazil. Expert displays for São Paulo, Rio de Janeiro exhibitions.',
      keywords: ['Brazil exhibitions', 'São Paulo trade shows', 'Rio de Janeiro displays', 'Brazilian exhibitions']
    }
  },
  {
    id: 'argentina',
    name: 'Argentina',
    countryCode: 'AR',
    continent: 'South America',
    slug: 'argentina',
    capital: 'Buenos Aires',
    currency: 'ARS',
    majorCities: ['Buenos Aires', 'Córdoba', 'Rosario'],
    totalVenues: 18,
    annualEvents: 280,
    keyIndustries: ['Agriculture', 'Beef', 'Wine', 'Manufacturing', 'Technology'],
    exhibitionRanking: 16,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Argentina | Buenos Aires Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Argentina. Professional displays for Buenos Aires exhibitions.',
      keywords: ['Argentina exhibition stands', 'Buenos Aires trade shows', 'Argentine displays', 'South American exhibitions']
    }
  },
  {
    id: 'colombia',
    name: 'Colombia',
    countryCode: 'CO',
    continent: 'South America',
    slug: 'colombia',
    capital: 'Bogotá',
    currency: 'COP',
    majorCities: ['Bogotá', 'Medellín'],
    totalVenues: 15,
    annualEvents: 220,
    keyIndustries: ['Coffee', 'Oil & Gas', 'Mining', 'Textiles', 'Tourism'],
    exhibitionRanking: 22,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Colombia | Bogotá Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Colombia. Professional displays for Bogotá exhibitions.',
      keywords: ['Colombia exhibitions', 'Bogotá trade shows', 'Colombian displays', 'South American exhibitions']
    }
  },
  {
    id: 'chile',
    name: 'Chile',
    countryCode: 'CL',
    continent: 'South America',
    slug: 'chile',
    capital: 'Santiago',
    currency: 'CLP',
    majorCities: ['Santiago', 'Valparaíso'],
    totalVenues: 12,
    annualEvents: 180,
    keyIndustries: ['Mining', 'Wine', 'Agriculture', 'Technology', 'Forestry'],
    exhibitionRanking: 22,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Chile | Santiago Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Chile. Professional displays for Santiago exhibitions.',
      keywords: ['Chile exhibitions', 'Santiago trade shows', 'Chilean displays', 'South American mining shows']
    }
  },
  {
    id: 'peru',
    name: 'Peru',
    countryCode: 'PE',
    continent: 'South America',
    slug: 'peru',
    capital: 'Lima',
    currency: 'PEN',
    majorCities: ['Lima'],
    totalVenues: 8,
    annualEvents: 120,
    keyIndustries: ['Mining', 'Agriculture', 'Tourism', 'Textiles', 'Fishing'],
    exhibitionRanking: 25,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Peru | Lima Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Peru. Professional displays for Lima exhibitions.',
      keywords: ['Peru exhibitions', 'Lima trade shows', 'Peruvian displays', 'South American exhibitions']
    }
  },

  // 🌏 ASIA & MIDDLE EAST - Complete Integration
  {
    id: 'united-arab-emirates',
    name: 'United Arab Emirates',
    countryCode: 'AE',
    continent: 'Asia',
    slug: 'united-arab-emirates',
    capital: 'Abu Dhabi',
    currency: 'AED',
    majorCities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    totalVenues: 35,
    annualEvents: 580,
    keyIndustries: ['Oil & Gas', 'Technology', 'Healthcare', 'Aviation', 'Finance', 'Real Estate'],
    exhibitionRanking: 5,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in UAE | Dubai Abu Dhabi Trade Shows',
      metaDescription: 'Expert exhibition stand builders in UAE. Professional displays for Dubai, Abu Dhabi, Sharjah.',
      keywords: ['UAE exhibition stands', 'Dubai trade shows', 'DWTC exhibitions', 'Middle East displays']
    }
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    countryCode: 'SA',
    continent: 'Asia',
    slug: 'saudi-arabia',
    capital: 'Riyadh',
    currency: 'SAR',
    majorCities: ['Riyadh', 'Jeddah', 'Dammam'],
    totalVenues: 25,
    annualEvents: 420,
    keyIndustries: ['Oil & Gas', 'Petrochemicals', 'Finance', 'Technology', 'Construction'],
    exhibitionRanking: 10,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Saudi Arabia | Riyadh Jeddah Trade Shows',
      metaDescription: 'Leading exhibition stand builders in Saudi Arabia. Expert displays for Riyadh, Jeddah, Dammam.',
      keywords: ['Saudi Arabia exhibitions', 'Riyadh trade shows', 'Jeddah displays', 'KSA exhibitions']
    }
  },
  {
    id: 'oman',
    name: 'Oman',
    countryCode: 'OM',
    continent: 'Asia',
    slug: 'oman',
    capital: 'Muscat',
    currency: 'OMR',
    majorCities: ['Muscat', 'Salalah'],
    totalVenues: 8,
    annualEvents: 150,
    keyIndustries: ['Oil & Gas', 'Tourism', 'Agriculture', 'Fisheries', 'Mining'],
    exhibitionRanking: 25,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Oman | Muscat Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Oman. Professional displays for Muscat exhibitions.',
      keywords: ['Oman exhibitions', 'Muscat trade shows', 'Omani displays', 'Gulf exhibitions']
    }
  },
  {
    id: 'qatar',
    name: 'Qatar',
    countryCode: 'QA',
    continent: 'Asia',
    slug: 'qatar',
    capital: 'Doha',
    currency: 'QAR',
    majorCities: ['Doha'],
    totalVenues: 10,
    annualEvents: 180,
    keyIndustries: ['Oil & Gas', 'Finance', 'Real Estate', 'Sports', 'Technology'],
    exhibitionRanking: 20,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Qatar | Doha Trade Shows',
      metaDescription: 'Leading exhibition stand builders in Qatar. Professional displays for Doha exhibitions.',
      keywords: ['Qatar exhibitions', 'Doha trade shows', 'Qatari displays', 'Middle East exhibitions']
    }
  },
  {
    id: 'kuwait',
    name: 'Kuwait',
    countryCode: 'KW',
    continent: 'Asia',
    slug: 'kuwait',
    capital: 'Kuwait City',
    currency: 'KWD',
    majorCities: ['Kuwait City'],
    totalVenues: 6,
    annualEvents: 120,
    keyIndustries: ['Oil & Gas', 'Finance', 'Real Estate', 'Technology', 'Healthcare'],
    exhibitionRanking: 27,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Kuwait | Kuwait City Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Kuwait. Professional displays for Kuwait City.',
      keywords: ['Kuwait exhibitions', 'Kuwait City trade shows', 'Kuwaiti displays', 'Gulf exhibitions']
    }
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    countryCode: 'BH',
    continent: 'Asia',
    slug: 'bahrain',
    capital: 'Manama',
    currency: 'BHD',
    majorCities: ['Manama'],
    totalVenues: 6,
    annualEvents: 120,
    keyIndustries: ['Finance', 'Oil & Gas', 'Tourism', 'Technology', 'Manufacturing'],
    exhibitionRanking: 28,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Bahrain | Manama Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Bahrain. Professional displays for Manama exhibitions.',
      keywords: ['Bahrain exhibitions', 'Manama trade shows', 'Bahraini displays', 'Gulf exhibitions']
    }
  },
  {
    id: 'egypt',
    name: 'Egypt',
    countryCode: 'EG',
    continent: 'Africa',
    slug: 'egypt',
    capital: 'Cairo',
    currency: 'EGP',
    majorCities: ['Cairo', 'Alexandria', 'Sharm El Sheikh'],
    totalVenues: 18,
    annualEvents: 280,
    keyIndustries: ['Tourism', 'Oil & Gas', 'Agriculture', 'Textiles', 'Construction'],
    exhibitionRanking: 15,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Egypt | Cairo Alexandria Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Egypt. Professional displays for Cairo, Alexandria.',
      keywords: ['Egypt exhibitions', 'Cairo trade shows', 'Alexandria displays', 'Middle East exhibitions']
    }
  },
  {
    id: 'japan',
    name: 'Japan',
    countryCode: 'JP',
    continent: 'Asia',
    slug: 'japan',
    capital: 'Tokyo',
    currency: 'JPY',
    majorCities: ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya'],
    totalVenues: 52,
    annualEvents: 950,
    keyIndustries: ['Technology', 'Automotive', 'Robotics', 'Gaming', 'Healthcare'],
    exhibitionRanking: 6,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Japan | Tokyo Osaka Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Japan. Professional displays for Tokyo Big Sight, Osaka.',
      keywords: ['Japan exhibition stands', 'Tokyo trade shows', 'Tokyo Big Sight', 'Japanese exhibitions']
    }
  },
  {
    id: 'turkey',
    name: 'Turkey',
    countryCode: 'TR',
    continent: 'Asia',
    slug: 'turkey',
    capital: 'Ankara',
    currency: 'TRY',
    majorCities: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
    totalVenues: 28,
    annualEvents: 420,
    keyIndustries: ['Textiles', 'Automotive', 'Tourism', 'Food Processing', 'Construction'],
    exhibitionRanking: 12,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Turkey | Istanbul Ankara Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Turkey. Professional displays for Istanbul, Ankara.',
      keywords: ['Turkey exhibitions', 'Istanbul trade shows', 'Turkish displays', 'Eurasian exhibitions']
    }
  },
  {
    id: 'singapore',
    name: 'Singapore',
    countryCode: 'SG',
    continent: 'Asia',
    slug: 'singapore',
    capital: 'Singapore',
    currency: 'SGD',
    majorCities: ['Singapore'],
    totalVenues: 15,
    annualEvents: 320,
    keyIndustries: ['Finance', 'Technology', 'Shipping', 'Manufacturing', 'Tourism'],
    exhibitionRanking: 11,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Singapore | Suntec Trade Shows',
      metaDescription: 'Leading exhibition stand builders in Singapore. Expert displays for Suntec Singapore.',
      keywords: ['Singapore exhibitions', 'Suntec trade shows', 'Singapore displays', 'ASEAN exhibitions']
    }
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    countryCode: 'HK',
    continent: 'Asia',
    slug: 'hong-kong',
    capital: 'Hong Kong',
    currency: 'HKD',
    majorCities: ['Hong Kong'],
    totalVenues: 12,
    annualEvents: 280,
    keyIndustries: ['Finance', 'Trade', 'Technology', 'Logistics', 'Tourism'],
    exhibitionRanking: 14,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Hong Kong | Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Hong Kong. Professional displays for Hong Kong exhibitions.',
      keywords: ['Hong Kong exhibitions', 'Hong Kong trade shows', 'Asian exhibitions', 'HK displays']
    }
  },
  {
    id: 'china',
    name: 'China',
    countryCode: 'CN',
    continent: 'Asia',
    slug: 'china',
    capital: 'Beijing',
    currency: 'CNY',
    majorCities: ['Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Chengdu', 'Hangzhou'],
    totalVenues: 220,
    annualEvents: 3800,
    keyIndustries: ['Manufacturing', 'Technology', 'Automotive', 'Electronics', 'Textiles'],
    exhibitionRanking: 1,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in China | Shanghai Beijing Trade Shows',
      metaDescription: 'Leading exhibition stand builders across China. Expert displays for Shanghai, Beijing, Guangzhou.',
      keywords: ['China exhibition stands', 'Shanghai trade shows', 'Canton Fair', 'Chinese exhibitions']
    }
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    countryCode: 'PK',
    continent: 'Asia',
    slug: 'pakistan',
    capital: 'Islamabad',
    currency: 'PKR',
    majorCities: ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad'],
    totalVenues: 15,
    annualEvents: 180,
    keyIndustries: ['Textiles', 'Agriculture', 'Manufacturing', 'Sports Goods', 'Leather'],
    exhibitionRanking: 24,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Pakistan | Karachi Lahore Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Pakistan. Professional displays for Karachi, Lahore.',
      keywords: ['Pakistan exhibitions', 'Karachi trade shows', 'Pakistani displays', 'South Asian exhibitions']
    }
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    countryCode: 'BD',
    continent: 'Asia',
    slug: 'bangladesh',
    capital: 'Dhaka',
    currency: 'BDT',
    majorCities: ['Dhaka', 'Chittagong'],
    totalVenues: 8,
    annualEvents: 120,
    keyIndustries: ['Textiles', 'Agriculture', 'Pharmaceuticals', 'Leather', 'Jute'],
    exhibitionRanking: 26,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Bangladesh | Dhaka Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Bangladesh. Professional displays for Dhaka exhibitions.',
      keywords: ['Bangladesh exhibitions', 'Dhaka trade shows', 'Bangladeshi displays', 'South Asian exhibitions']
    }
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    countryCode: 'ID',
    continent: 'Asia',
    slug: 'indonesia',
    capital: 'Jakarta',
    currency: 'IDR',
    majorCities: ['Jakarta', 'Surabaya', 'Bali'],
    totalVenues: 18,
    annualEvents: 280,
    keyIndustries: ['Manufacturing', 'Mining', 'Agriculture', 'Tourism', 'Textiles'],
    exhibitionRanking: 17,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Indonesia | Jakarta Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Indonesia. Professional displays for Jakarta exhibitions.',
      keywords: ['Indonesia exhibitions', 'Jakarta trade shows', 'Indonesian displays', 'ASEAN exhibitions']
    }
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    countryCode: 'MY',
    continent: 'Asia',
    slug: 'malaysia',
    capital: 'Kuala Lumpur',
    currency: 'MYR',
    majorCities: ['Kuala Lumpur', 'Johor Bahru', 'Penang'],
    totalVenues: 22,
    annualEvents: 380,
    keyIndustries: ['Technology', 'Manufacturing', 'Palm Oil', 'Tourism', 'Electronics'],
    exhibitionRanking: 14,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Malaysia | Kuala Lumpur Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Malaysia. Professional displays for Kuala Lumpur, Penang.',
      keywords: ['Malaysia exhibitions', 'Kuala Lumpur trade shows', 'Malaysian displays', 'ASEAN exhibitions']
    }
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    countryCode: 'KR',
    continent: 'Asia',
    slug: 'south-korea',
    capital: 'Seoul',
    currency: 'KRW',
    majorCities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Goyang'],
    totalVenues: 25,
    annualEvents: 420,
    keyIndustries: ['Technology', 'Automotive', 'Shipbuilding', 'Electronics', 'Steel'],
    exhibitionRanking: 13,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in South Korea | Seoul Busan Trade Shows',
      metaDescription: 'Expert exhibition stand builders in South Korea. Professional displays for Seoul, Busan.',
      keywords: ['South Korea exhibitions', 'Seoul trade shows', 'Korean displays', 'K-tech exhibitions']
    }
  },

  // 🌍 AFRICA - Complete Integration
  {
    id: 'south-africa',
    name: 'South Africa',
    countryCode: 'ZA',
    continent: 'Africa',
    slug: 'south-africa',
    capital: 'Cape Town',
    currency: 'ZAR',
    majorCities: ['Johannesburg', 'Cape Town', 'Durban'],
    totalVenues: 24,
    annualEvents: 380,
    keyIndustries: ['Mining', 'Agriculture', 'Manufacturing', 'Tourism', 'Technology'],
    exhibitionRanking: 12,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in South Africa | Johannesburg Cape Town Trade Shows',
      metaDescription: 'Leading exhibition stand builders in South Africa. Expert displays for Johannesburg, Cape Town.',
      keywords: ['South Africa exhibitions', 'Johannesburg trade shows', 'Cape Town displays', 'African exhibitions']
    }
  },
  {
    id: 'kenya',
    name: 'Kenya',
    countryCode: 'KE',
    continent: 'Africa',
    slug: 'kenya',
    capital: 'Nairobi',
    currency: 'KES',
    majorCities: ['Nairobi', 'Mombasa'],
    totalVenues: 8,
    annualEvents: 140,
    keyIndustries: ['Agriculture', 'Tourism', 'Technology', 'Tea', 'Coffee'],
    exhibitionRanking: 26,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Kenya | Nairobi Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Kenya. Professional displays for Nairobi exhibitions.',
      keywords: ['Kenya exhibitions', 'Nairobi trade shows', 'Kenyan displays', 'East African exhibitions']
    }
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    countryCode: 'NG',
    continent: 'Africa',
    slug: 'nigeria',
    capital: 'Abuja',
    currency: 'NGN',
    majorCities: ['Lagos', 'Abuja'],
    totalVenues: 12,
    annualEvents: 180,
    keyIndustries: ['Oil & Gas', 'Agriculture', 'Technology', 'Banking', 'Entertainment'],
    exhibitionRanking: 23,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Nigeria | Lagos Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Nigeria. Professional displays for Lagos exhibitions.',
      keywords: ['Nigeria exhibitions', 'Lagos trade shows', 'Nigerian displays', 'West African exhibitions']
    }
  },
  {
    id: 'morocco',
    name: 'Morocco',
    countryCode: 'MA',
    continent: 'Africa',
    slug: 'morocco',
    capital: 'Rabat',
    currency: 'MAD',
    majorCities: ['Casablanca', 'Marrakech'],
    totalVenues: 12,
    annualEvents: 180,
    keyIndustries: ['Tourism', 'Agriculture', 'Textiles', 'Mining', 'Automotive'],
    exhibitionRanking: 20,
    seoData: {
      metaTitle: 'Exhibition Stand Builders in Morocco | Casablanca Marrakech Trade Shows',
      metaDescription: 'Expert exhibition stand builders in Morocco. Professional displays for Casablanca, Marrakech.',
      keywords: ['Morocco exhibitions', 'Casablanca trade shows', 'Marrakech displays', 'North African exhibitions']
    }
  }
];

// Generate all cities from countries with exhibition hub tagging
const generateExhibitionCities = (): ExhibitionCity[] => {
  const allCities: ExhibitionCity[] = [];
  
  EXHIBITION_COUNTRIES.forEach(country => {
    country.majorCities.forEach((cityName, index) => {
      const cityId = `${country.slug}-${cityName.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`;
      
      // Determine coordinates based on major cities
      const getCoordinates = (city: string, countryCode: string) => {
        const coords: {[key: string]: {lat: number, lng: number}} = {
          'london': {lat: 51.5074, lng: -0.1278},
          'paris': {lat: 48.8566, lng: 2.3522},
          'berlin': {lat: 52.5200, lng: 13.4050},
          'dubai': {lat: 25.2048, lng: 55.2708},
          'tokyo': {lat: 35.6762, lng: 139.6503},
          'new-york': {lat: 40.7128, lng: -74.0060},
          'shanghai': {lat: 31.2304, lng: 121.4737},
          'sydney': {lat: -33.8688, lng: 151.2093}
        };
        return coords[city.toLowerCase().replace(/\s+/g, '-')] || {lat: 0, lng: 0};
      };

      allCities.push({
        id: cityId,
        name: cityName,
        country: country.name,
        countryCode: country.countryCode,
        continent: country.continent,
        slug: cityName.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''),
        population: index === 0 ? '5M+' : index === 1 ? '2M+' : '1M+',
        timeZone: 'Local Time',
        coordinates: getCoordinates(cityName, country.countryCode),
        isCapital: cityName === country.capital,
        is_exhibition_hub: true, // Required exhibition hub tag
        majorAirport: `${cityName} Airport`,
        venues: [
          {
            name: `${cityName} Exhibition Center`,
            size: index === 0 ? '100,000 sqm' : '50,000 sqm',
            website: `https://${cityName.toLowerCase().replace(/\s+/g, '')}-exhibitions.com`,
            description: `Major exhibition venue in ${cityName}`,
            majorEvents: ['International Trade Shows', 'Industry Exhibitions', 'Business Conferences']
          }
        ],
        keyIndustries: country.keyIndustries,
        annualEvents: Math.floor(country.annualEvents / country.majorCities.length) + (index === 0 ? 50 : 0),
        averageStandSize: index === 0 ? '200-1000 sqm' : '100-500 sqm',
        topBudgetRange: index === 0 ? '$20,000-100,000' : '$10,000-50,000',
        nearestMajorCities: [],
        seoData: {
          metaTitle: `Exhibition Stand Builders in ${cityName} | ${country.name} Trade Shows`,
          metaDescription: `Professional exhibition stand builders in ${cityName}, ${country.name}. Custom trade show displays and booth construction services.`,
          keywords: [`${cityName} exhibitions`, `${country.name} trade shows`, 'exhibition stands', 'booth builders']
        }
      });
    });
  });

  return allCities;
};

// EXPORT - Updated Global Exhibition Data with Location KKS Integration
export const GLOBAL_EXHIBITION_DATA = {
  continents: ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'],
  countries: EXHIBITION_COUNTRIES,
  cities: generateExhibitionCities()
};

// UTILITY FUNCTIONS
export function generateAZIndex() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const cityIndex: { [key: string]: ExhibitionCity[] } = {};
  
  alphabet.forEach(letter => {
    cityIndex[letter] = GLOBAL_EXHIBITION_DATA.cities.filter(
      city => city.name.charAt(0).toUpperCase() === letter
    );
  });
  
  return cityIndex;
}

export function searchCities(query: string, continent?: string): ExhibitionCity[] {
  let results = GLOBAL_EXHIBITION_DATA.cities;
  
  if (continent) {
    results = results.filter(city => city.continent === continent);
  }
  
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(city => 
      city.name.toLowerCase().includes(searchTerm) ||
      city.country.toLowerCase().includes(searchTerm) ||
      city.keyIndustries.some(industry => industry.toLowerCase().includes(searchTerm))
    );
  }
  
  return results;
}

export function getCountriesByContinent(continent: string): ExhibitionCountry[] {
  return GLOBAL_EXHIBITION_DATA.countries.filter(country => country.continent === continent);
}

export function getCitiesByCountry(countrySlug: string): ExhibitionCity[] {
  const country = GLOBAL_EXHIBITION_DATA.countries.find(c => c.slug === countrySlug);
  if (!country) return [];
  
  return GLOBAL_EXHIBITION_DATA.cities.filter(city => city.country === country.name);
}

export default GLOBAL_EXHIBITION_DATA;