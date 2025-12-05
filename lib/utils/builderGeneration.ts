// Phase 3 Builder Network Expansion - Automated Builder Generation
// This system generates 500+ builders according to Phase 3 specifications

import { ExhibitionBuilder, Certification, Award, PortfolioItem, PriceRange, Testimonial } from '../data/exhibitionBuilders';
import { GLOBAL_EXHIBITION_DATA } from '../data/globalCities';

interface BuilderTemplate {
  tier: 1 | 2 | 3;
  regions: string[];
  specializations: string[];
  averageTeamSize: number;
  averageProjectCount: number;
  averageRating: number;
  premiumPercentage: number;
  verifiedPercentage: number;
}

// Builder generation templates by tier
const builderTemplates: Record<string, BuilderTemplate> = {
  tier1: {
    tier: 1,
    regions: ['United States', 'Germany', 'United Kingdom', 'France', 'Japan', 'China', 'United Arab Emirates'],
    specializations: ['Technology', 'Healthcare', 'Automotive', 'Finance', 'Luxury'],
    averageTeamSize: 40,
    averageProjectCount: 200,
    averageRating: 4.7,
    premiumPercentage: 80,
    verifiedPercentage: 95
  },
  tier2: {
    tier: 2,
    regions: ['Italy', 'Spain', 'Netherlands', 'Sweden', 'Australia', 'Canada', 'Singapore', 'Brazil'],
    specializations: ['Manufacturing', 'Energy', 'Design', 'Food & Beverage', 'Agriculture', 'Tourism'],
    averageTeamSize: 25,
    averageProjectCount: 120,
    averageRating: 4.4,
    premiumPercentage: 50,
    verifiedPercentage: 80
  },
  tier3: {
    tier: 3,
    regions: ['Poland', 'Turkey', 'India', 'South Africa', 'Mexico', 'Thailand', 'Malaysia', 'Czech Republic'],
    specializations: ['Local Services', 'Regional Focus', 'Emerging Markets', 'Specialized Services'],
    averageTeamSize: 15,
    averageProjectCount: 60,
    averageRating: 4.1,
    premiumPercentage: 25,
    verifiedPercentage: 60
  }
};

// Company name generators by region
const companyNameTemplates = {
  'United States': ['Elite Exhibits', 'Premier Displays', 'Innovation Showcases', 'Corporate Exhibitions', 'Advanced Displays'],
  'Germany': ['Expo Design', 'Messe Technik', 'Exhibition Meister', 'Deutsche Displays', 'Präsentations GmbH'],
  'United Kingdom': ['Premium Stands', 'Elite Exhibitions', 'London Displays', 'Royal Exhibitions', 'British Showcases'],
  'France': ['Expositions Elite', 'Stands Parisiens', 'Créations Expo', 'Design Français', 'Luxe Exhibitions'],
  'Japan': ['Tokyo Exhibitions', 'Innovation Displays', 'Precision Stands', 'Modern Exhibitions', 'Tech Showcases'],
  'China': ['Shanghai Expo', 'Beijing Displays', 'Innovation Centers', 'Modern Exhibitions', 'Global Showcases'],
  'Italy': ['Design Milano', 'Expo Italiano', 'Luxury Displays', 'Arte Exhibitions', 'Premium Stands'],
  'Spain': ['Barcelona Expo', 'Madrid Displays', 'Español Exhibitions', 'Mediterranean Stands', 'Iberian Showcases'],
  'Netherlands': ['Amsterdam Displays', 'Dutch Exhibitions', 'Innovation Stands', 'Netherlands Expo', 'European Showcases'],
  'Sweden': ['Nordic Displays', 'Stockholm Exhibitions', 'Sustainable Stands', 'Scandinavian Expo', 'Swedish Design'],
  'Australia': ['Sydney Exhibitions', 'Aussie Displays', 'Pacific Showcases', 'Melbourne Stands', 'Southern Expo'],
  'United Arab Emirates': ['Dubai Elite', 'Emirates Exhibitions', 'Gulf Displays', 'Luxury Showcases', 'Middle East Expo'],
  'Singapore': ['Singapore Displays', 'Asian Exhibitions', 'Maritime Showcases', 'Tech Stands', 'Modern Expo'],
  'Brazil': ['São Paulo Expo', 'Brazilian Displays', 'Latin Exhibitions', 'Tropical Showcases', 'Brasil Stands']
};

// Service categories by specialization
const serviceTemplates = {
  'Technology': ['Custom Tech Displays', 'Interactive Demonstrations', 'Virtual Reality Experiences', 'AI Showcases'],
  'Healthcare': ['Medical Device Displays', 'Healthcare Exhibitions', 'Pharmaceutical Showcases', 'Medical Conferences'],
  'Automotive': ['Vehicle Displays', 'Automotive Showcases', 'Mobility Exhibitions', 'Transportation Stands'],
  'Finance': ['Banking Exhibitions', 'Financial Showcases', 'Investment Displays', 'Corporate Finance'],
  'Luxury': ['Luxury Brand Displays', 'Premium Exhibitions', 'High-End Showcases', 'Exclusive Events'],
  'Manufacturing': ['Industrial Displays', 'Manufacturing Showcases', 'Production Exhibitions', 'Engineering Stands'],
  'Energy': ['Energy Exhibitions', 'Renewable Displays', 'Oil & Gas Showcases', 'Power Industry'],
  'Design': ['Design Exhibitions', 'Creative Showcases', 'Architectural Displays', 'Interior Design'],
  'Food & Beverage': ['Food Exhibitions', 'Beverage Showcases', 'Culinary Displays', 'Restaurant Trade Shows'],
  'Agriculture': ['Agricultural Displays', 'Farming Exhibitions', 'AgTech Showcases', 'Rural Industry']
};

// Generate realistic pricing by region and tier
const generatePricing = (country: string, tier: number): PriceRange => {
  const basePrices = {
    'United States': { basic: [25, 35], custom: [50, 75], premium: [75, 120], currency: 'USD', unit: 'per sqft' },
    'Germany': { basic: [200, 300], custom: [400, 600], premium: [600, 900], currency: 'EUR', unit: 'per sqm' },
    'United Kingdom': { basic: [180, 280], custom: [350, 550], premium: [550, 850], currency: 'GBP', unit: 'per sqm' },
    'France': { basic: [220, 320], custom: [380, 580], premium: [580, 850], currency: 'EUR', unit: 'per sqm' },
    'Japan': { basic: [25000, 35000], custom: [45000, 65000], premium: [65000, 95000], currency: 'JPY', unit: 'per sqm' },
    'China': { basic: [150, 250], custom: [300, 450], premium: [450, 680], currency: 'USD', unit: 'per sqm' },
    'United Arab Emirates': { basic: [200, 300], custom: [400, 600], premium: [600, 900], currency: 'USD', unit: 'per sqm' }
  };

  const defaultPricing = { basic: [100, 150], custom: [200, 300], premium: [300, 450], currency: 'USD', unit: 'per sqm' };
  const pricing = basePrices[country] || defaultPricing;
  
  const tierMultiplier = tier === 1 ? 1.2 : tier === 2 ? 1.0 : 0.8;
  
  return {
    basicStand: { 
      min: Math.round(pricing.basic[0] * tierMultiplier), 
      max: Math.round(pricing.basic[1] * tierMultiplier), 
      currency: pricing.currency, 
      unit: pricing.unit 
    },
    customStand: { 
      min: Math.round(pricing.custom[0] * tierMultiplier), 
      max: Math.round(pricing.custom[1] * tierMultiplier), 
      currency: pricing.currency, 
      unit: pricing.unit 
    },
    premiumStand: { 
      min: Math.round(pricing.premium[0] * tierMultiplier), 
      max: Math.round(pricing.premium[1] * tierMultiplier), 
      currency: pricing.currency, 
      unit: pricing.unit 
    },
    averageProject: Math.round((pricing.custom[0] + pricing.custom[1]) / 2 * tierMultiplier * 100),
    currency: pricing.currency
  };
};

// Generate builder data
export const generateBuilder = (id: string, template: BuilderTemplate, index: number): ExhibitionBuilder => {
  const region = template.regions[index % template.regions.length];
  const cities = GLOBAL_EXHIBITION_DATA.cities.filter(city => city.country === region);
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  const companyNames = companyNameTemplates[region] || ['Global Exhibitions', 'International Displays'];
  const baseName = companyNames[index % companyNames.length];
  const companyName = `${baseName} ${city?.name || region}`;
  
  const specialization = template.specializations[index % template.specializations.length];
  const services = serviceTemplates[specialization] || ['Custom Exhibitions', 'Display Solutions'];
  
  const isVerified = Math.random() < (template.verifiedPercentage / 100);
  const isPremium = Math.random() < (template.premiumPercentage / 100);
  const teamSize = template.averageTeamSize + Math.floor(Math.random() * 20) - 10;
  const projectCount = template.averageProjectCount + Math.floor(Math.random() * 50) - 25;
  const rating = template.averageRating + (Math.random() * 0.6) - 0.3;
  
  return {
    id,
    companyName,
    slug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    logo: `/images/builders/${id}-logo.png`,
    establishedYear: 2024 - Math.floor(Math.random() * 15) - template.tier * 2,
    headquarters: {
      city: city?.name || 'Unknown',
      country: region,
      countryCode: city?.countryCode || 'XX',
      address: `${Math.floor(Math.random() * 999) + 1} Business Street, ${city?.name || 'Unknown'}`,
      latitude: city?.coordinates?.lat || 0,
      longitude: city?.coordinates?.lng || 0,
      isHeadquarters: true
    },
    serviceLocations: [
      {
        city: city?.name || 'Unknown',
        country: region,
        countryCode: city?.countryCode || 'XX',
        address: '',
        latitude: city?.coordinates?.lat || 0,
        longitude: city?.coordinates?.lng || 0,
        isHeadquarters: false
      }
    ],
    contactInfo: {
      primaryEmail: `info@${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      phone: `+${Math.floor(Math.random() * 99) + 1} ${Math.floor(Math.random() * 999) + 100} ${Math.floor(Math.random() * 999999) + 100000}`,
      website: `https://${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      contactPerson: 'Exhibition Manager',
      position: 'Managing Director'
    },
    services: services.slice(0, 2).map((service, idx) => ({
      id: `service-${idx}`,
      name: service,
      description: `Professional ${service.toLowerCase()} for your exhibition needs`,
      category: 'Design' as const,
      priceFrom: Math.floor(Math.random() * 500) + 200,
      currency: 'USD',
      unit: 'per project',
      popular: idx === 0,
      turnoverTime: `${Math.floor(Math.random() * 4) + 3}-${Math.floor(Math.random() * 4) + 6} weeks`
    })),
    specializations: [
      {
        id: specialization.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: specialization,
        slug: specialization.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: '',
        subcategories: [],
        color: '#3B82F6',
        icon: '🏗️',
        annualGrowthRate: Math.round((Math.random() * 20 + 5) * 10) / 10,
        averageBoothCost: Math.floor(Math.random() * 300) + 300,
        popularCountries: []
      }
    ],
    certifications: isVerified ? [
      {
        name: 'ISO 9001:2015',
        issuer: 'International Standards',
        validUntil: '2026-12-31',
        certificateNumber: `ISO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        verified: true
      }
    ] : [],
    awards: template.tier === 1 ? [
      {
        title: 'Excellence in Exhibition Design',
        year: 2024,
        issuer: 'International Exhibition Awards',
        description: 'Outstanding achievement in exhibition design and execution',
        category: 'Design Excellence'
      }
    ] : [],
    portfolio: [],
    teamSize,
    projectsCompleted: projectCount,
    rating: Math.round(rating * 10) / 10,
    reviewCount: Math.floor(projectCount * 0.3),
    responseTime: `Within ${Math.floor(Math.random() * 12) + 2} hours`,
    languages: ['English'],
    verified: isVerified,
    premiumMember: isPremium,
    tradeshowExperience: [],
    priceRange: generatePricing(region, template.tier),
    companyDescription: `Professional exhibition stand builders specializing in ${specialization.toLowerCase()} exhibitions. Serving the ${region} market with comprehensive exhibition solutions.`,
    whyChooseUs: [
      `${specialization} industry expertise`,
      `${region} market knowledge`,
      'Professional project management',
      'Quality construction standards',
      'Competitive pricing'
    ],
    clientTestimonials: [],
    socialMedia: {
      linkedin: `https://linkedin.com/company/${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    },
    businessLicense: `${city?.countryCode || 'XX'}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    insurance: {
      liability: Math.floor(Math.random() * 5000000) + 1000000,
      currency: 'USD',
      validUntil: '2025-12-31',
      insurer: 'Professional Insurance Group'
    },
    sustainability: {
      certifications: Math.random() > 0.7 ? ['Green Building Certified'] : [],
      ecoFriendlyMaterials: Math.random() > 0.4,
      wasteReduction: Math.random() > 0.3,
      carbonNeutral: Math.random() > 0.8,
      sustainabilityScore: Math.floor(Math.random() * 40) + 40
    },
    keyStrengths: [
      `${specialization} Focus`,
      'Quality Service',
      'Timely Delivery',
      'Professional Team',
      'Market Experience'
    ],
    recentProjects: []
  };
};

// Generate the complete Phase 3 builder network - DISABLED FOR ANTI-MOCK POLICY
// ⚠️ SYSTEM POLICY: NO MOCK DATA GENERATION ALLOWED
// Only real data from: GMB imports, admin entries, user registrations
export const generatePhase3Builders = (): ExhibitionBuilder[] => {
  console.log('🚫 Mock data generation DISABLED - System only accepts real data');
  console.log('✅ Real data sources: GMB imports, admin entries, user registrations');
  return []; // NO MOCK DATA GENERATED
};

// Builder statistics - calculated from real data only
export const getPhase3Statistics = (builders: ExhibitionBuilder[]) => {
  const stats = {
    totalBuilders: builders.length,
    tier1Count: 0, // No more tier system for mock data
    tier2Count: 0,
    tier3Count: 0,
    verifiedBuilders: builders.filter(b => b.verified).length,
    premiumMembers: builders.filter(b => b.premiumMember).length,
    totalCountries: Array.from(new Set(builders.map(b => b.headquarters.country))).length,
    totalCities: Array.from(new Set(builders.map(b => b.headquarters.city))).length,
    averageRating: builders.length > 0 ? Math.round((builders.reduce((sum, b) => sum + b.rating, 0) / builders.length) * 10) / 10 : 0,
    totalProjects: builders.reduce((sum, b) => sum + b.projectsCompleted, 0),
    totalTeamMembers: builders.reduce((sum, b) => sum + b.teamSize, 0)
  };

  console.log('📊 Real Data Statistics (NO MOCK DATA):', stats);
  return stats;
};

export default generatePhase3Builders;