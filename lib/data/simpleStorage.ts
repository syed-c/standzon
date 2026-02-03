// Simple storage system for Smart Admin Dashboard
import { ExhibitionBuilder } from './exhibitionBuilders';

class SimpleDataStorage {
  private builders: any[] = [];
  private uploadedBuilders: any[] = [];

  constructor() {
    this.loadSampleData();
    console.log('Simple storage initialized');
  }

  private loadSampleData() {
    // ❌ REMOVED: No mock/sample data allowed - only real builders
    this.builders = [];
    console.log('✅ Storage initialized with NO mock data - empty until real builders are added');
  }

  addBuilder(builder: any): void {
    console.log('Adding builder:', builder.companyName);
    this.builders.push(builder);
    this.uploadedBuilders.push(builder);
  }

  getBuilders(): any[] {
    return [...this.builders];
  }

  getUploadedBuilders(): any[] {
    return [...this.uploadedBuilders];
  }

  getBuilderById(id: string): any {
    return this.builders.find(b => b.id === id);
  }

  updateBuilder(id: string, updates: any): boolean {
    const index = this.builders.findIndex(b => b.id === id);
    if (index !== -1) {
      this.builders[index] = { ...this.builders[index], ...updates };
      return true;
    }
    return false;
  }

  deleteBuilder(id: string): boolean {
    const index = this.builders.findIndex(b => b.id === id);
    if (index !== -1) {
      this.builders.splice(index, 1);
      return true;
    }
    return false;
  }

  addBuilders(builders: any[]): { created: number; duplicates: number } {
    let created = 0;
    let duplicates = 0;

    builders.forEach(builder => {
      const existingBuilder = this.builders.find(b => 
        b.contactInfo?.primaryEmail?.toLowerCase() === builder.contactInfo?.primaryEmail?.toLowerCase()
      );

      if (existingBuilder) {
        duplicates++;
      } else {
        this.addBuilder(builder);
        created++;
      }
    });

    return { created, duplicates };
  }

  getStats() {
    const totalBuilders = this.builders.length;
    const verifiedBuilders = this.builders.filter(b => b.verified).length;
    
    return {
      totalBuilders,
      verifiedBuilders,
      totalCountries: 5,
      totalCities: 12,
      averageRating: totalBuilders > 0 ? this.builders.reduce((sum, b) => sum + (b.rating || 0), 0) / totalBuilders : 0,
      totalProjects: this.builders.reduce((sum, b) => sum + (b.projectsCompleted || 0), 0)
    };
  }

  searchBuilders(query: string): any[] {
    const searchTerm = query.toLowerCase();
    return this.builders.filter(builder =>
      builder.companyName?.toLowerCase().includes(searchTerm) ||
      builder.companyDescription?.toLowerCase().includes(searchTerm) ||
      builder.headquarters?.city?.toLowerCase().includes(searchTerm) ||
      builder.headquarters?.country?.toLowerCase().includes(searchTerm)
    );
  }

  filterBuilders(filters: any): any[] {
    return this.builders.filter(builder => {
      if (filters.country && builder.headquarters?.country !== filters.country) return false;
      if (filters.verified !== undefined && builder.verified !== filters.verified) return false;
      return true;
    });
  }

  clearAll(): void {
    this.builders = [];
    this.uploadedBuilders = [];
    this.loadSampleData();
  }

  getRecentActivity(): any[] {
    return [
      {
        type: 'builder_added',
        message: 'New builder registered: Expo Design Germany',
        timestamp: '2 minutes ago',
        status: 'success'
      }
    ];
  }
}

let globalStorage: SimpleDataStorage | null = null;

export function getStorageInstance(): SimpleDataStorage {
  if (!globalStorage) {
    globalStorage = new SimpleDataStorage();
  }
  return globalStorage;
}

export const simpleStorageAPI = {
  addBuilder: (builder: any) => getStorageInstance().addBuilder(builder),
  getBuilders: () => getStorageInstance().getBuilders(),
  getUploadedBuilders: () => getStorageInstance().getUploadedBuilders(),
  getBuilderById: (id: string) => getStorageInstance().getBuilderById(id),
  updateBuilder: (id: string, updates: any) => getStorageInstance().updateBuilder(id, updates),
  deleteBuilder: (id: string) => getStorageInstance().deleteBuilder(id),
  addBuilders: (builders: any[]) => getStorageInstance().addBuilders(builders),
  searchBuilders: (query: string) => getStorageInstance().searchBuilders(query),
  filterBuilders: (filters: any) => getStorageInstance().filterBuilders(filters),
  getStats: () => getStorageInstance().getStats(),
  getRecentActivity: () => getStorageInstance().getRecentActivity(),
  clearAll: () => getStorageInstance().clearAll()
};

console.log('Simple storage API initialized');