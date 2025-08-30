// Real-time data storage system for exhibition platform

import { ExhibitionBuilder } from './exhibitionBuilders';
import fs from 'fs';
import path from 'path';

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
    extra?: {
      sectionHeading?: string;
      personalizedHtml?: string;
      rawHtml?: string;
      structured?: any;
    };
  };
  // Section-aware structured content for precise editing
  sections?: {
    hero?: { heading?: string; description?: string };
    heroButtons?: Array<{ text?: string; href?: string }>;
    mission?: { heading?: string; paragraph?: string };
    vision?: { heading?: string; paragraph?: string };
    coreValues?: Array<{ heading?: string; paragraph?: string }>;
    howItWorks?: Array<{ heading?: string; paragraph?: string }>;
    team?: Array<{ name?: string; role?: string; bio?: string }>;
    cta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    // Home specific sections
    readyLeads?: { heading?: string; paragraph?: string };
    globalPresence?: { heading?: string; paragraph?: string };
    moreCountries?: { heading?: string; paragraph?: string };
    expandingMarkets?: { heading?: string; paragraph?: string };
    readyStart?: { heading?: string; paragraph?: string };
    clientSay?: { heading?: string; paragraph?: string };
    finalCta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    reviews?: Array<{ name?: string; role?: string; rating?: number; text?: string; image?: string }>;
    // Custom Booth specific sections
    whyChooseCustom?: { heading?: string; paragraph?: string; features?: Array<{ heading?: string; paragraph?: string }> };
    designProcess?: { heading?: string; paragraph?: string; steps?: Array<{ heading?: string; paragraph?: string }> };
    customDesignServices?: { 
      heading?: string; 
      paragraph?: string; 
      serviceCards?: Array<{
        title?: string;
        description?: string;
        startingFrom?: string;
        price?: string;
        features?: string[];
        buttonText?: string;
        buttonLink?: string;
        badge?: string;
      }>;
    };
    customBoothCta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    
    // Service Pages specific sections (cloned from custom-booth structure)
    boothRental?: { 
      hero?: { heading?: string; description?: string };
      whyChoose?: { heading?: string; paragraph?: string; features?: Array<{ heading?: string; paragraph?: string }> };
      process?: { heading?: string; paragraph?: string; steps?: Array<{ heading?: string; paragraph?: string }> };
      services?: { 
        heading?: string; 
        paragraph?: string; 
        serviceCards?: Array<{
          title?: string;
          description?: string;
          startingFrom?: string;
          price?: string;
          features?: string[];
          buttonText?: string;
          buttonLink?: string;
          badge?: string;
        }>;
      };
      cta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    };
    
    renderingConcept?: { 
      hero?: { heading?: string; description?: string };
      whyChoose?: { heading?: string; paragraph?: string; features?: Array<{ heading?: string; paragraph?: string }> };
      process?: { heading?: string; paragraph?: string; steps?: Array<{ heading?: string; paragraph?: string }> };
      services?: { 
        heading?: string; 
        paragraph?: string; 
        serviceCards?: Array<{
          title?: string;
          description?: string;
          startingFrom?: string;
          price?: string;
          features?: string[];
          buttonText?: string;
          buttonLink?: string;
          badge?: string;
        }>;
      };
      cta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    };
    
    installationDismantle?: { 
      hero?: { heading?: string; description?: string };
      whyChoose?: { heading?: string; paragraph?: string; features?: Array<{ heading?: string; paragraph?: string }> };
      process?: { heading?: string; paragraph?: string; steps?: Array<{ heading?: string; paragraph?: string }> };
      services?: { 
        heading?: string; 
        paragraph?: string; 
        serviceCards?: Array<{
          title?: string;
          description?: string;
          startingFrom?: string;
          price?: string;
          features?: string[];
          buttonText?: string;
          buttonLink?: string;
          badge?: string;
        }>;
      };
      cta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    };
    
    projectManagement?: { 
      hero?: { heading?: string; description?: string };
      whyChoose?: { heading?: string; paragraph?: string; features?: Array<{ heading?: string; paragraph?: string }> };
      process?: { heading?: string; paragraph?: string; steps?: Array<{ heading?: string; paragraph?: string }> };
      services?: { 
        heading?: string; 
        paragraph?: string; 
        serviceCards?: Array<{
          title?: string;
          description?: string;
          startingFrom?: string;
          price?: string;
          features?: string[];
          buttonText?: string;
          buttonLink?: string;
          badge?: string;
        }>;
      };
      cta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    };
    
    graphicsPrinting?: { 
      hero?: { heading?: string; description?: string };
      whyChoose?: { heading?: string; paragraph?: string; features?: Array<{ heading?: string; paragraph?: string }> };
      process?: { heading?: string; paragraph?: string; steps?: Array<{ heading?: string; paragraph?: string }> };
      services?: { 
        heading?: string; 
        paragraph?: string; 
        serviceCards?: Array<{
          title?: string;
          description?: string;
          startingFrom?: string;
          price?: string;
          features?: string[];
          buttonText?: string;
          buttonLink?: string;
          badge?: string;
        }>;
      };
      cta?: { heading?: string; paragraph?: string; buttons?: Array<{ text?: string; href?: string }> };
    };
    // Country pages specific sections
    countryPages?: {
      [country: string]: {
        whyChooseHeading?: string;
        whyChooseParagraph?: string;
        infoCards?: Array<{
          title?: string;
          text?: string;
        }>;
        quotesParagraph?: string;
        servicesHeading?: string;
        servicesParagraph?: string;
        // Final CTA section
        finalCtaHeading?: string;
        finalCtaParagraph?: string;
        finalCtaButtonText?: string;
        backToTopButtonText?: string;
      };
    };
    [key: string]: any;
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

  private getDataFilePath(): string {
    try {
      return path.join(process.cwd(), 'data', 'page-contents.json');
    } catch {
      return 'page-contents.json';
    }
  }

  private ensureDataDir(): void {
    const filePath = this.getDataFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  private readAllFromFile(): Record<string, PageContent> {
    try {
      const filePath = this.getDataFilePath();
      this.ensureDataDir();
      if (!fs.existsSync(filePath)) return {};
      const raw = fs.readFileSync(filePath, 'utf-8');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private writeAllToFile(map: Record<string, PageContent>): void {
    try {
      const filePath = this.getDataFilePath();
      this.ensureDataDir();
      fs.writeFileSync(filePath, JSON.stringify(map, null, 2), 'utf-8');
    } catch {}
  }

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
    // Defensive defaults to avoid runtime errors from partial payloads
    if (!content) {
      throw new Error('Invalid content payload: content is required');
    }

    // Normalize pageId to lowercase for case-insensitive storage
    const normalizedPageId = pageId.toLowerCase().trim();

    if (!content.location) {
      // Infer minimal location from pageId
      const inferredName = pageId
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      (content as any).location = {
        name: inferredName,
        slug: pageId,
      } as PageContent["location"];
    }

    console.log('Saving page content:', normalizedPageId, content.location?.name || '(unknown)');
    content.lastModified = new Date().toISOString();
    this.pageContents.set(normalizedPageId, content);
    const current = this.readAllFromFile();
    current[normalizedPageId] = content;
    this.writeAllToFile(current);
  }

  getPageContent(pageId: string): PageContent | undefined {
    // Normalize pageId to lowercase for case-insensitive lookup
    const normalizedPageId = pageId.toLowerCase().trim();
    
    // Always prefer on-disk content in production/serverless
    const all = this.readAllFromFile();
    if (all[normalizedPageId]) return all[normalizedPageId];
    return this.pageContents.get(normalizedPageId);
  }

  getAllPageContents(): PageContent[] {
    const all = this.readAllFromFile();
    const values = Object.values(all);
    if (values.length > 0) return values;
    return Array.from(this.pageContents.values());
  }

  deletePageContent(pageId: string): boolean {
    const normalizedPageId = pageId.toLowerCase().trim();
    console.log('Deleting page content:', normalizedPageId);
    const ok = this.pageContents.delete(normalizedPageId);
    const all = this.readAllFromFile();
    if (all[normalizedPageId]) {
      delete all[normalizedPageId];
      this.writeAllToFile(all);
    }
    return ok;
  }

  hasPageContent(pageId: string): boolean {
    const normalizedPageId = pageId.toLowerCase().trim();
    return this.pageContents.has(normalizedPageId);
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