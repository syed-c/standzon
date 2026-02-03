import { v4 as uuidv4 } from 'uuid';

// Comprehensive city data for bulk import
interface CityData {
  name: string;
  latitude: number;
  longitude: number;
}

interface CountryData {
  cities: CityData[];
  builders: string[];
}

const COUNTRY_CITY_DATA: Record<string, CountryData> = {
  'United States': {
    cities: [
      { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
      { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
      { name: 'Chicago', latitude: 41.8781, longitude: -87.6298 },
      { name: 'Houston', latitude: 29.7604, longitude: -95.3698 },
      { name: 'Phoenix', latitude: 33.4484, longitude: -112.0740 },
      { name: 'Philadelphia', latitude: 39.9526, longitude: -75.1652 },
      { name: 'San Antonio', latitude: 29.4241, longitude: -98.4936 },
      { name: 'San Diego', latitude: 32.7157, longitude: -117.1611 },
      { name: 'Dallas', latitude: 32.7767, longitude: -96.7970 },
      { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
      { name: 'San Jose', latitude: 37.3382, longitude: -121.8863 },
      { name: 'Fort Worth', latitude: 32.7555, longitude: -97.3308 },
      { name: 'Columbus', latitude: 39.9612, longitude: -82.9988 },
      { name: 'Charlotte', latitude: 35.2271, longitude: -80.8431 },
      { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
      { name: 'Indianapolis', latitude: 39.7684, longitude: -86.1581 },
      { name: 'Seattle', latitude: 47.6062, longitude: -122.3321 },
      { name: 'Denver', latitude: 39.7392, longitude: -104.9903 },
      { name: 'Nashville', latitude: 36.1627, longitude: -86.7816 },
      { name: 'Miami', latitude: 25.7617, longitude: -80.1918 },
      { name: 'Orlando', latitude: 28.5383, longitude: -81.3792 },
      { name: 'Atlanta', latitude: 33.7490, longitude: -84.3880 },
      { name: 'Boston', latitude: 42.3601, longitude: -71.0589 },
      { name: 'Portland', latitude: 45.5152, longitude: -122.6784 },
      { name: 'Las Vegas', latitude: 36.1699, longitude: -115.1398 }
    ],
    builders: [
      'Elite Exhibitions', 'Professional Displays', 'Premium Stands', 'Creative Booths', 'Modern Exhibits',
      'Dynamic Displays', 'Signature Stands', 'Innovative Booths', 'Custom Exhibitions', 'Expert Displays',
      'Metro Exhibitions', 'Superior Stands', 'Advanced Displays', 'Quality Booths', 'Premier Exhibits',
      'First Class Displays', 'Top Tier Stands', 'Excellence Exhibitions', 'Professional Booths', 'Elite Stands'
    ]
  },
  'United Arab Emirates': {
    cities: [
      { name: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
      { name: 'Abu Dhabi', latitude: 24.4539, longitude: 54.3773 },
      { name: 'Sharjah', latitude: 25.3463, longitude: 55.4209 },
      { name: 'Al Ain', latitude: 24.2075, longitude: 55.7447 },
      { name: 'Ajman', latitude: 25.4052, longitude: 55.5136 },
      { name: 'Ras Al Khaimah', latitude: 25.7889, longitude: 55.9758 },
      { name: 'Fujairah', latitude: 25.1288, longitude: 56.3264 },
      { name: 'Umm Al Quwain', latitude: 25.5208, longitude: 55.5555 }
    ],
    builders: [
      'Gulf Exhibitions', 'Emirates Displays', 'Arabian Stands', 'Desert Booths', 'Luxury Exhibits',
      'Pearl Displays', 'Golden Stands', 'Royal Exhibitions', 'Summit Booths', 'Oasis Displays',
      'Crown Exhibitions', 'Prestige Stands', 'Platinum Displays', 'Diamond Booths', 'Elite UAE Stands',
      'Middle East Exhibitions', 'UAE Premium Displays', 'Gulf Elite Stands', 'Emirates Premier Booths'
    ]
  },
  'United Kingdom': {
    cities: [
      { name: 'London', latitude: 51.5074, longitude: -0.1278 },
      { name: 'Birmingham', latitude: 52.4862, longitude: -1.8904 },
      { name: 'Manchester', latitude: 53.4808, longitude: -2.2426 },
      { name: 'Glasgow', latitude: 55.8642, longitude: -4.2518 },
      { name: 'Liverpool', latitude: 53.4084, longitude: -2.9916 },
      { name: 'Edinburgh', latitude: 55.9533, longitude: -3.1883 },
      { name: 'Leeds', latitude: 53.8008, longitude: -1.5491 },
      { name: 'Sheffield', latitude: 53.3811, longitude: -1.4701 },
      { name: 'Bristol', latitude: 51.4545, longitude: -2.5879 },
      { name: 'Cardiff', latitude: 51.4816, longitude: -3.1791 },
      { name: 'Coventry', latitude: 52.4068, longitude: -1.5197 },
      { name: 'Leicester', latitude: 52.6369, longitude: -1.1398 },
      { name: 'Nottingham', latitude: 52.9548, longitude: -1.1581 },
      { name: 'Newcastle', latitude: 54.9783, longitude: -1.6178 },
      { name: 'Belfast', latitude: 54.5973, longitude: -5.9301 }
    ],
    builders: [
      'British Exhibitions', 'UK Premier Displays', 'London Elite Stands', 'Royal Exhibition Services',
      'Professional UK Displays', 'Crown Exhibition Builders', 'Premier British Stands', 'Elite UK Booths',
      'Britannia Displays', 'UK Superior Stands', 'Royal Display Services', 'British Elite Exhibitions',
      'UK Professional Booths', 'Crown Displays Ltd', 'Premier UK Stands', 'Excellence UK Displays'
    ]
  },
  'Australia': {
    cities: [
      { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
      { name: 'Melbourne', latitude: -37.8136, longitude: 144.9631 },
      { name: 'Brisbane', latitude: -27.4698, longitude: 153.0251 },
      { name: 'Perth', latitude: -31.9505, longitude: 115.8605 },
      { name: 'Adelaide', latitude: -34.9285, longitude: 138.6007 },
      { name: 'Gold Coast', latitude: -28.0167, longitude: 153.4000 },
      { name: 'Canberra', latitude: -35.2809, longitude: 149.1300 },
      { name: 'Newcastle', latitude: -32.9283, longitude: 151.7817 },
      { name: 'Wollongong', latitude: -34.4278, longitude: 150.8931 },
      { name: 'Geelong', latitude: -38.1499, longitude: 144.3617 }
    ],
    builders: [
      'Aussie Exhibitions', 'Sydney Premier Displays', 'Melbourne Elite Stands', 'Australian Exhibition Co',
      'Professional Aussie Displays', 'Down Under Exhibitions', 'Oz Premium Stands', 'Australian Elite Booths',
      'Southern Cross Displays', 'Aussie Superior Stands', 'Pacific Display Services', 'Australian Excellence',
      'Oz Professional Booths', 'Southern Displays Ltd', 'Australian Premier Stands', 'Excellence Oz Displays'
    ]
  }
};

const SPECIALIZATIONS = [
  { id: 'technology', name: 'Technology', icon: '💻', color: '#3B82F6' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#10B981' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', color: '#F59E0B' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: '#EC4899' },
  { id: 'food', name: 'Food & Beverage', icon: '🍽️', color: '#EF4444' },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#8B5CF6' },
  { id: 'education', name: 'Education', icon: '📚', color: '#06B6D4' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', color: '#F59E0B' }
];

const currencyMap: Record<string, string> = {
  'United States': 'USD',
  'United Arab Emirates': 'USD',
  'United Kingdom': 'GBP',
  'Australia': 'AUD'
};

const countryCodeMap: Record<string, string> = {
  'United States': 'US',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'Australia': 'AU'
};

const phoneFormats: Record<string, string> = {
  'United States': '+1-XXX-XXX-XXXX',
  'United Arab Emirates': '+971-X-XXX-XXXX',
  'United Kingdom': '+44-XXX-XXX-XXXX',
  'Australia': '+61-X-XXXX-XXXX'
};

export function generateBulkBuilders(country: string, count: number = 20) {
  const countryData = COUNTRY_CITY_DATA[country];
  if (!countryData) {
    throw new Error(`Country ${country} not supported for bulk generation`);
  }

  const builders = [];
  const currency = currencyMap[country];
  const countryCode = countryCodeMap[country];
  
  // Generate phone number
  const phoneFormat = phoneFormats[country];
  const phone = phoneFormat.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
  
  // Generate email and website
  const companySlug = `${countryData.builders[0].toLowerCase().replace(/\s+/g, '')}-${countryData.cities[0].name.toLowerCase().replace(/\s+/g, '')}`;
  const email = `info@${companySlug}.com`;
  const website = `https://${companySlug}.com`;
  
  for (let i = 0; i < count; i++) {
    const city = countryData.cities[i % countryData.cities.length];
    const builderName = countryData.builders[i % countryData.builders.length];
    const specialization = SPECIALIZATIONS[i % SPECIALIZATIONS.length];
    
    // Generate phone number
    const phoneFormat = phoneFormats[country];
    const phone = phoneFormat.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
    
    // Generate email and website
    const companySlug = `${builderName.toLowerCase().replace(/\s+/g, '')}-${city.name.toLowerCase().replace(/\s+/g, '')}`;
    const email = `info@${companySlug}.com`;
    const website = `https://${companySlug}.com`;
    
    const builder = {
      id: uuidv4(), // Generate proper UUID instead of string-based ID
      companyName: `${builderName} ${city.name}`,
      slug: companySlug,
      logo: '/images/builders/default-logo.png',
      establishedYear: 2015 + Math.floor(Math.random() * 8),
      headquarters: {
        city: city.name,
        country: country,
        countryCode: countryCode,
        address: `Exhibition District, ${city.name}`,
        latitude: city.latitude + (Math.random() - 0.5) * 0.01,
        longitude: city.longitude + (Math.random() - 0.5) * 0.01,
        isHeadquarters: true
      },
      serviceLocations: [
        {
          city: city.name,
          country: country,
          countryCode: countryCode,
          address: '',
          latitude: city.latitude,
          longitude: city.longitude,
          isHeadquarters: false
        }
      ],
      contactInfo: {
        primaryEmail: email,
        phone: phone,
        website: website,
        contactPerson: `Contact Person ${i + 1}`,
        position: 'Business Development Manager'
      },
      services: [
        {
          id: 'main-service',
          name: 'Exhibition Services',
          description: `Professional exhibition stand design and construction in ${city.name}`,
          category: 'Design',
          priceFrom: 300 + Math.floor(Math.random() * 200),
          currency: currency,
          unit: 'per sqm',
          popular: true,
          turnoverTime: '3-5 weeks'
        }
      ],
      specializations: [
        {
          id: specialization.id,
          name: specialization.name,
          slug: specialization.id,
          description: `Professional ${specialization.name.toLowerCase()} exhibition services`,
          subcategories: [],
          color: specialization.color,
          icon: specialization.icon,
          annualGrowthRate: 8.5,
          averageBoothCost: 450,
          popularCountries: [country]
        }
      ],
      certifications: [],
      awards: [],
      portfolio: [],
      teamSize: 10 + Math.floor(Math.random() * 30),
      projectsCompleted: 50 + Math.floor(Math.random() * 200),
      rating: 4.0 + Math.random() * 1.0,
      reviewCount: 25 + Math.floor(Math.random() * 150),
      responseTime: 'Within 2 hours',
      languages: ['English'],
      verified: Math.random() > 0.3,
      premiumMember: Math.random() > 0.7,
      tradeshowExperience: [],
      priceRange: {
        basicStand: { min: 200, max: 350, currency, unit: 'per sqm' },
        customStand: { min: 400, max: 650, currency, unit: 'per sqm' },
        premiumStand: { min: 700, max: 1100, currency, unit: 'per sqm' },
        averageProject: 35000 + Math.floor(Math.random() * 20000),
        currency
      },
      companyDescription: `Leading exhibition stand builder in ${city.name} specializing in ${specialization.name.toLowerCase()} industry displays.`,
      whyChooseUs: [
        `Local ${city.name} expertise`,
        `${specialization.name} industry focus`,
        'Professional service delivery'
      ],
      clientTestimonials: [],
      socialMedia: {},
      businessLicense: `${countryCode}-EXH-${2015 + i}-${String(i).padStart(3, '0')}`,
      insurance: {
        liability: 1000000 + Math.floor(Math.random() * 2000000),
        currency,
        validUntil: '2025-12-31',
        insurer: `${country} Exhibition Insurance`
      },
      sustainability: {
        certifications: Math.random() > 0.5 ? ['Green Building'] : [],
        ecoFriendlyMaterials: Math.random() > 0.5,
        wasteReduction: Math.random() > 0.3,
        carbonNeutral: Math.random() > 0.7,
        sustainabilityScore: 50 + Math.floor(Math.random() * 50)
      },
      keyStrengths: [
        'Professional Service',
        'Quality Workmanship',
        'Local Market Knowledge'
      ],
      recentProjects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _persistenceVersion: '1.0'
    };

    builders.push(builder);
  }

  return builders;
}

const builderCounts: Record<string, number> = {
  'United States': 25,
  'United Arab Emirates': 15,
  'United Kingdom': 20,
  'Australia': 25
};

export function generateAllCountryBuilders() {
  console.log('🏗️ Generating bulk builders for all countries...');
  
  const allBuilders: any[] = [];
  const countries = ['United States', 'United Arab Emirates', 'United Kingdom', 'Australia'];

  countries.forEach(country => {
    const count = builderCounts[country];
    console.log(`📊 Generating ${count} builders for ${country}...`);
    const countryBuilders = generateBulkBuilders(country, count);
    allBuilders.push(...countryBuilders);
  });

  console.log(`✅ Generated ${allBuilders.length} total builders across ${countries.length} countries`);
  return allBuilders;
}