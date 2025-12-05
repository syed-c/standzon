// Real-time data storage system for exhibition platform
// This is a client-side storage implementation

import { ExhibitionBuilder } from './exhibitionBuilders';

// Global storage that simulates a real database
class PlatformDataStorage {
  private builders: ExhibitionBuilder[] = [];
  private quotes: any[] = [];
  private uploadedBuilders: ExhibitionBuilder[] = [];

  constructor() {
    // Initialize with some sample data
    this.loadSampleData();
    console.log('Platform storage initialized with sample data');
  }

  private loadSampleData() {
    // Load some initial builders for demonstration
    const sampleBuilders: ExhibitionBuilder[] = [
      {
        id: 'builder-001',
        companyName: 'Expo Design Germany',
        companyDescription: 'Leading exhibition stand builder in Germany with over 15 years of experience',
        headquarters: {
          city: 'Berlin',
          country: 'Germany',
          countryCode: 'DE',
          address: 'Messe-Allee 15, 14055 Berlin',
          latitude: 52.5200,
          longitude: 13.4050,
          isHeadquarters: true
        },
        contactInfo: {
          primaryEmail: 'info@expodesign.de',
          phone: '+49 30 123456',
          contactPerson: 'Klaus Mueller',
          website: 'https://expodesign.de',
          position: 'Contact Manager'
        },
        services: [
          { 
            id: 'custom-design', 
            name: 'Custom Design', 
            category: 'Design',
            description: 'Custom exhibition stand design',
            priceFrom: 5000,
            currency: 'EUR',
            unit: 'sqm',
            popular: true,
            turnoverTime: '4-6 weeks'
          },
          { 
            id: 'modular-systems', 
            name: 'Modular Systems', 
            category: 'Construction',
            description: 'Modular exhibition systems',
            priceFrom: 3000,
            currency: 'EUR',
            unit: 'sqm',
            popular: true,
            turnoverTime: '2-4 weeks'
          }
        ],
        serviceLocations: [
          { city: 'Berlin', country: 'Germany', countryCode: 'DE', address: '', latitude: 52.5200, longitude: 13.4050, isHeadquarters: false },
          { city: 'Munich', country: 'Germany', countryCode: 'DE', address: '', latitude: 48.1351, longitude: 11.5820, isHeadquarters: false },
          { city: 'Frankfurt', country: 'Germany', countryCode: 'DE', address: '', latitude: 50.1109, longitude: 8.6821, isHeadquarters: false }
        ],
        portfolio: [
          {
            id: 'project-001',
            projectName: 'CeBIT 2024 Tech Pavilion',
            tradeShow: 'CeBIT 2024',
            year: 2024,
            city: 'Hannover',
            country: 'Germany',
            standSize: 400,
            industry: 'Technology',
            description: 'Modern tech exhibition stand',
            images: ['https://example.com/project1.jpg'],
            budget: 'Premium',
            featured: true,
            projectType: 'Custom Build',
            technologies: ['LED Displays', 'Interactive Demos'],
            challenges: ['Complex setup', 'Time constraints'],
            results: ['Increased leads by 200%'],
            clientName: 'TechCorp Inc.'
          }
        ],
        verified: true,
        rating: 4.8,
        reviewCount: 127,
        projectsCompleted: 89,
        establishedYear: 2008,
        slug: 'expo-design-germany',
        logo: '/images/builders/expo-design-germany-logo.png',
        teamSize: 45,
        responseTime: 'Within 2 hours',
        premiumMember: true,
        tradeshowExperience: ['hannover-messe-2025', 'cebit-2025', 'ifa-berlin-2025'],
        priceRange: {
          basicStand: { min: 180, max: 280, currency: 'EUR', unit: 'per sqm' },
          customStand: { min: 450, max: 850, currency: 'EUR', unit: 'per sqm' },
          premiumStand: { min: 850, max: 1200, currency: 'EUR', unit: 'per sqm' },
          averageProject: 75000,
          currency: 'EUR'
        },
        whyChooseUs: ['Award-winning design team', 'Comprehensive project management'],
        clientTestimonials: [],
        businessLicense: 'DE-HRB-12345-Berlin',
        insurance: {
          liability: 2000000,
          currency: 'EUR',
          validUntil: '2025-12-31',
          insurer: 'Allianz Deutschland AG'
        },
        sustainability: {
          certifications: ['Green Building Council'],
          ecoFriendlyMaterials: true,
          wasteReduction: true,
          carbonNeutral: false,
          sustainabilityScore: 85
        },
        keyStrengths: ['Industry 4.0 Expertise', 'Sustainable Design'],
        recentProjects: [],
        awards: [],
        specializations: [
          { id: 'technology', name: 'Technology & Innovation', slug: 'technology', description: '', subcategories: [], color: '#3B82F6', icon: '💻', annualGrowthRate: 12.5, averageBoothCost: 450, popularCountries: [] }
        ],
        certifications: [
          { name: 'ISO 9001:2015', issuer: 'TÜV Rheinland', validUntil: '2026-03-15', certificateNumber: 'ISO-9001-2024-DE-001', verified: true }
        ],
        languages: ['German', 'English', 'French'],
        socialMedia: {
          linkedin: 'https://linkedin.com/company/expodesign'
        }
      }
    ];

    this.builders = sampleBuilders;
  }

  // Builder management
  addBuilder(builder: ExhibitionBuilder): void {
    console.log('Adding builder to storage:', builder.companyName);
    this.builders.push(builder);
    this.uploadedBuilders.push(builder);
  }

  getBuilders(): ExhibitionBuilder[] {
    return [...this.builders];
  }

  getUploadedBuilders(): ExhibitionBuilder[] {
    return [...this.uploadedBuilders];
  }

  getBuilderById(id: string): ExhibitionBuilder | undefined {
    return this.builders.find(b => b.id === id);
  }

  updateBuilder(id: string, updates: Partial<ExhibitionBuilder>): boolean {
    const index = this.builders.findIndex(b => b.id === id);
    if (index !== -1) {
      this.builders[index] = { ...this.builders[index], ...updates };
      console.log('Builder updated:', this.builders[index].companyName);
      return true;
    }
    return false;
  }

  deleteBuilder(id: string): boolean {
    const index = this.builders.findIndex(b => b.id === id);
    if (index !== -1) {
      const deleted = this.builders.splice(index, 1)[0];
      console.log('Builder deleted:', deleted.companyName);
      return true;
    }
    return false;
  }

  // Bulk operations
  addBuilders(builders: ExhibitionBuilder[]): { created: number; duplicates: number } {
    let created = 0;
    let duplicates = 0;

    builders.forEach(builder => {
      // Check for duplicates by email
      const existingBuilder = this.builders.find(b => 
        b.contactInfo.primaryEmail.toLowerCase() === builder.contactInfo.primaryEmail.toLowerCase()
      );

      if (existingBuilder) {
        duplicates++;
        console.log('Duplicate builder found:', builder.companyName);
      } else {
        this.addBuilder(builder);
        created++;
      }
    });

    console.log(`Bulk operation completed: ${created} created, ${duplicates} duplicates`);
    return { created, duplicates };
  }

  // Statistics
  getStats() {
    const totalBuilders = this.builders.length;
    const verifiedBuilders = this.builders.filter(b => b.verified).length;
    const countries = Array.from(new Set(this.builders.map(b => b.headquarters.country))).length;
    const cities = Array.from(new Set(this.builders.flatMap(b => b.serviceLocations.map(loc => loc.city)))).length;

    return {
      totalBuilders,
      verifiedBuilders,
      totalCountries: countries,
      totalCities: cities,
      averageRating: totalBuilders > 0 ? this.builders.reduce((sum, b) => sum + b.rating, 0) / totalBuilders : 0,
      totalProjects: this.builders.reduce((sum, b) => sum + b.projectsCompleted, 0)
    };
  }

  // Search functionality
  searchBuilders(query: string): ExhibitionBuilder[] {
    const searchTerm = query.toLowerCase();
    return this.builders.filter(builder =>
      builder.companyName.toLowerCase().includes(searchTerm) ||
      builder.headquarters.city.toLowerCase().includes(searchTerm) ||
      builder.headquarters.country.toLowerCase().includes(searchTerm) ||
      builder.services.some(service => service.name.toLowerCase().includes(searchTerm))
    );
  }

  // Filter functionality
  filterBuilders(filters: {
    country?: string;
    city?: string;
    verified?: boolean;
    serviceType?: string;
  }): ExhibitionBuilder[] {
    return this.builders.filter(builder => {
      if (filters.country && builder.headquarters.country !== filters.country) return false;
      if (filters.city && !builder.serviceLocations.some(loc => loc.city === filters.city)) return false;
      if (filters.verified !== undefined && builder.verified !== filters.verified) return false;
      if (filters.serviceType && !builder.services.some(service => 
        service.name.toLowerCase().includes(filters.serviceType!.toLowerCase())
      )) return false;
      return true;
    });
  }

  // Clear all data (for testing)
  clearAll(): void {
    this.builders = [];
    this.uploadedBuilders = [];
    this.quotes = [];
    console.log('All data cleared');
    this.loadSampleData(); // Reload sample data
  }

  // Get platform activity
  getRecentActivity(): Array<{
    type: string;
    message: string;
    timestamp: string;
    status: 'success' | 'info' | 'warning';
  }> {
    const activities: Array<{
      type: string;
      message: string;
      timestamp: string;
      status: 'success' | 'info' | 'warning';
    }> = [];
    
    // Recent builder additions
    const recentBuilders = this.builders.slice(-3);
    recentBuilders.forEach(builder => {
      activities.push({
        type: 'builder_added',
        message: `New builder registered: ${builder.companyName}`,
        timestamp: '2 minutes ago',
        status: 'success' as const
      });
    });

    return activities;
  }
}

// Global storage instance
let globalStorage: PlatformDataStorage | null = null;

export function getStorageInstance(): PlatformDataStorage {
  if (!globalStorage) {
    globalStorage = new PlatformDataStorage();
  }
  return globalStorage;
}

// Storage API functions
export const realStorageAPI = {
  // Builders
  addBuilder: (builder: ExhibitionBuilder) => getStorageInstance().addBuilder(builder),
  getBuilders: () => getStorageInstance().getBuilders(),
  getUploadedBuilders: () => getStorageInstance().getUploadedBuilders(),
  getBuilderById: (id: string) => getStorageInstance().getBuilderById(id),
  updateBuilder: (id: string, updates: Partial<ExhibitionBuilder>) => getStorageInstance().updateBuilder(id, updates),
  deleteBuilder: (id: string) => getStorageInstance().deleteBuilder(id),
  
  // Bulk operations
  addBuilders: (builders: ExhibitionBuilder[]) => getStorageInstance().addBuilders(builders),
  
  // Search and filter
  searchBuilders: (query: string) => getStorageInstance().searchBuilders(query),
  filterBuilders: (filters: any) => getStorageInstance().filterBuilders(filters),
  
  // Statistics
  getStats: () => getStorageInstance().getStats(),
  getRecentActivity: () => getStorageInstance().getRecentActivity(),
  
  // Utility
  clearAll: () => getStorageInstance().clearAll()
};

console.log('Real storage API initialized and ready');