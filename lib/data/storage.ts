// Real-time data storage system for exhibition platform

import { ExhibitionBuilder } from './exhibitionBuilders';

// Page content interface
export interface PageContent {
  id: string;
  type: 'country' | 'city';
  location: {
    name: string;
    country?: string;
    slug: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: string;
    ctaText: string;
  };
  content: {
    introduction: string;
    whyChooseSection: string;
    industryOverview: string;
    venueInformation: string;
    builderAdvantages: string;
    conclusion: string;
  };
  design: {
    primaryColor: string;
    accentColor: string;
    layout: 'modern' | 'classic' | 'minimal';
    showStats: boolean;
    showMap: boolean;
  };
  lastModified: string;
}

// In-memory storage that simulates a real database
class PlatformStorage {
  private builders: ExhibitionBuilder[] = [];
  private quotes: any[] = [];
  private uploadedBuilders: ExhibitionBuilder[] = [];
  private pageContents: Map<string, PageContent> = new Map();

  constructor() {
    // Initialize with some sample data
    console.log('Platform storage initialized');
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
      // Also remove from uploaded builders if exists
      const uploadedIndex = this.uploadedBuilders.findIndex(b => b.id === id);
      if (uploadedIndex !== -1) {
        this.uploadedBuilders.splice(uploadedIndex, 1);
      }
      console.log('Builder deleted permanently:', deleted.companyName);
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

  // Bulk delete builders
  deleteBuilders(ids: string[]): { deleted: number; notFound: number } {
    let deleted = 0;
    let notFound = 0;

    ids.forEach(id => {
      const success = this.deleteBuilder(id);
      if (success) {
        deleted++;
      } else {
        notFound++;
      }
    });

    console.log(`Bulk deletion completed: ${deleted} deleted, ${notFound} not found`);
    return { deleted, notFound };
  }

  // Delete all builders
  deleteAllBuilders(): number {
    const count = this.builders.length;
    this.builders = [];
    this.uploadedBuilders = [];
    console.log(`All builders deleted: ${count} removed`);
    return count;
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

  // Page content management
  savePageContent(pageId: string, content: PageContent): void {
    console.log('Saving page content:', pageId, content.location.name);
    content.lastModified = new Date().toISOString();
    this.pageContents.set(pageId, content);
  }

  getPageContent(pageId: string): PageContent | undefined {
    return this.pageContents.get(pageId);
  }

  getAllPageContents(): PageContent[] {
    return Array.from(this.pageContents.values());
  }

  deletePageContent(pageId: string): boolean {
    console.log('Deleting page content:', pageId);
    return this.pageContents.delete(pageId);
  }

  hasPageContent(pageId: string): boolean {
    return this.pageContents.has(pageId);
  }

  // Clear all data (for testing)
  clearAll(): void {
    this.builders = [];
    this.uploadedBuilders = [];
    this.quotes = [];
    console.log('All data cleared');
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
export const platformStorage = new PlatformStorage();

// Storage API functions
export const storageAPI = {
  // Builders
  addBuilder: (builder: ExhibitionBuilder) => platformStorage.addBuilder(builder),
  getBuilders: () => platformStorage.getBuilders(),
  getUploadedBuilders: () => platformStorage.getUploadedBuilders(),
  getBuilderById: (id: string) => platformStorage.getBuilderById(id),
  updateBuilder: (id: string, updates: Partial<ExhibitionBuilder>) => platformStorage.updateBuilder(id, updates),
  deleteBuilder: (id: string) => platformStorage.deleteBuilder(id),
  deleteBuilders: (ids: string[]) => platformStorage.deleteBuilders(ids),
  deleteAllBuilders: () => platformStorage.deleteAllBuilders(),
  
  // Bulk operations
  addBuilders: (builders: ExhibitionBuilder[]) => platformStorage.addBuilders(builders),
  
  // Search and filter
  searchBuilders: (query: string) => platformStorage.searchBuilders(query),
  filterBuilders: (filters: any) => platformStorage.filterBuilders(filters),
  
  // Statistics
  getStats: () => platformStorage.getStats(),
  getRecentActivity: () => platformStorage.getRecentActivity(),
  
  // Page content management
  savePageContent: (pageId: string, content: PageContent) => platformStorage.savePageContent(pageId, content),
  getPageContent: (pageId: string) => platformStorage.getPageContent(pageId),
  getAllPageContents: () => platformStorage.getAllPageContents(),
  deletePageContent: (pageId: string) => platformStorage.deletePageContent(pageId),
  hasPageContent: (pageId: string) => platformStorage.hasPageContent(pageId),
  
  // Utility
  clearAll: () => platformStorage.clearAll()
};

console.log('Storage API initialized and ready');