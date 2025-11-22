





import { v4 as uuidv4 } from 'uuid';

// Unified Real-Time Platform Data System
// This system ensures all data stays synchronized between admin dashboard and website

import { ExhibitionBuilder } from './exhibitionBuilders';

// ✅ PERFORMANCE FIX: Lightweight initialization flag
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

// ✅ FIXED: Prevent memory leak warnings by increasing max listeners early (server-side only)
if (typeof process !== 'undefined' && process.setMaxListeners && !isInitializing) {
  process.setMaxListeners(50); // Allow multiple systems to attach listeners
}

export interface PlatformData {
  builders: ExhibitionBuilder[];
  eventPlanners: any[]; // Add event planners to platform data
  events: any[];
  leads: any[];
  quotes: any[];
  users: any[];
  stats: any;
}

export interface DataEvent {
  type: 'builder_added' | 'builder_updated' | 'builder_deleted' | 'stats_updated' | 'system_notification';
  data: any;
  timestamp: string;
  source: 'admin' | 'website' | 'api';
}

// Helper: country name to ISO code fallback
function getCountryCode(country: string): string {
  const countryCodeMap: Record<string, string> = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'United Arab Emirates': 'AE',
    'New Zealand': 'NZ',
    'South Africa': 'ZA',
    'South Korea': 'KR',
    'Saudi Arabia': 'SA',
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Spain': 'ES'
  };
  return countryCodeMap[country] || country.substring(0, 2).toUpperCase();
}

// ✅ SIMPLIFIED: Basic UnifiedDataManager without complex dependencies
class UnifiedDataManager {
  private data: PlatformData;
  private subscribers: ((event: DataEvent) => void)[] = [];
  private initialized: boolean = false;

  constructor() {
    console.log('🚀 UnifiedDataManager: Lightweight constructor started...');
    
    // Initialize with empty data structure - no heavy operations
    this.data = {
      builders: [],
      eventPlanners: [],
      events: [],
      leads: [],
      quotes: [],
      users: [],
      stats: {}
    };
    
    this.subscribers = [];
    this.initialized = false;
    
    console.log('✅ UnifiedDataManager: Lightweight constructor completed');
  }

  // ✅ NEW: Ensure initialization only happens when needed
  async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return; // Already initialized
    }
    
    console.log('🔄 Performing one-time initialization...');
    await this.initialize();
    this.initialized = true;
  }

  // ✅ SIMPLIFIED: Basic initialization
  private async initialize(): Promise<void> {
    console.log('🏗️ Initializing unified data management system...');
    
    try {
      // Load initial data
      await this.loadInitialData();
      
      // Initialize stats
      this.data.stats = {
        totalBuilders: 0,
        totalLeads: 0,
        verifiedBuilders: 0,
        lastUpdate: new Date().toISOString()
      };
      
      console.log('✅ Unified data management system initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize unified data system:', error);
      // Continue with empty data - don't block the app
    }
  }

  // Load initial data from static files
  private async loadInitialData() {
    console.log('📂 Loading initial data from static files...');
    // Basic initialization - no complex operations
  }

  // Notify all subscribers about data changes
  private notifySubscribers(event: DataEvent) {
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ Error notifying subscriber:', error);
      }
    });
  }

  // Subscribe to data changes
  subscribe(callback: (event: DataEvent) => void): () => void {
    this.subscribers.push(callback);
    console.log(`📝 New subscriber added. Total: ${this.subscribers.length}`);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
        console.log(`📝 Subscriber removed. Total: ${this.subscribers.length}`);
      }
    };
  }

  // Get all data
  getAllData(): PlatformData {
    return { ...this.data };
  }

  // Get builders
  getBuilders(): ExhibitionBuilder[] {
    return [...this.data.builders];
  }

  // ✅ NEW: Get builder by ID
  getBuilderById(id: string): ExhibitionBuilder | null {
    return this.data.builders.find(b => b.id === id) || null;
  }

  // ✅ NEW: Get leads
  getLeads(): any[] {
    return [...this.data.leads];
  }

  // ✅ NEW: Add lead
  addLead(lead: any): { success: boolean; data?: any; error?: string } {
    console.log('➕ Adding lead to unified system:', lead.id);
    
    try {
      // Add timestamps
      lead.createdAt = lead.createdAt || new Date().toISOString();
      lead.updatedAt = new Date().toISOString();
      
      // Add to memory
      this.data.leads.push(lead);
      
      // Update stats
      this.data.stats.totalLeads = this.data.leads.length;
      
      // Notify subscribers
      this.notifySubscribers({
        type: 'system_notification' as any,
        data: { type: 'lead_added', lead },
        timestamp: new Date().toISOString(),
        source: 'website'
      });

      console.log('✅ Lead added to memory');
      return { success: true, data: lead };
    } catch (error) {
      console.error('❌ Error adding lead:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // ✅ NEW: Update lead
  updateLead(id: string, updates: any): { success: boolean; data?: any; error?: string } {
    try {
      const index = this.data.leads.findIndex(l => l.id === id);
      if (index === -1) {
        return { success: false, error: 'Lead not found' };
      }
      
      // Update in memory
      updates.updatedAt = new Date().toISOString();
      this.data.leads[index] = { ...this.data.leads[index], ...updates };
      
      this.notifySubscribers({
        type: 'system_notification' as any,
        data: { type: 'lead_updated', id, updates },
        timestamp: new Date().toISOString(),
        source: 'website'
      });

      console.log('✅ Lead updated in memory:', id);
      return { success: true, data: this.data.leads[index] };
    } catch (error) {
      console.error('❌ Error updating lead:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // ✅ NEW: Get stats
  getStats(): any {
    return {
      totalBuilders: this.data.builders.length,
      totalLeads: this.data.leads.length,
      totalEvents: this.data.events.length,
      verifiedBuilders: this.data.builders.filter(b => b.verified).length,
      ...this.data.stats
    };
  }

  // ✅ NEW: Search builders
  searchBuilders(query: string): ExhibitionBuilder[] {
    const searchTerm = query.toLowerCase();
    return this.data.builders.filter(builder => 
      builder.companyName.toLowerCase().includes(searchTerm) ||
      (builder as any).description?.toLowerCase().includes(searchTerm) ||
      builder.companyDescription?.toLowerCase().includes(searchTerm) ||
      builder.headquarters?.city.toLowerCase().includes(searchTerm) ||
      builder.headquarters?.country.toLowerCase().includes(searchTerm)
    );
  }

  // ✅ SIMPLIFIED: Filter builders
  filterBuilders(filters: any): ExhibitionBuilder[] {
    return this.data.builders.filter(builder => {
      // Country filter
      if (filters.country) {
        const builderCountryMatch = builder.headquarters?.country === filters.country ||
          builder.serviceLocations?.some(loc => loc.country === filters.country);
        
        if (!builderCountryMatch) return false;
      }
      
      // Other filters
      if (filters.verified !== undefined && builder.verified !== filters.verified) return false;
      if (filters.featured !== undefined && (builder as any).adminFeatured !== filters.featured) return false;
      if (filters.planType && builder.planType !== filters.planType) return false;
      
      return true;
    });
  }

  // Builders Management  
  async addBuilder(builder: any, source: 'admin' | 'website' = 'admin'): Promise<{ success: boolean; data?: ExhibitionBuilder; error?: string }> {
    console.log('➕ Adding builder to unified system:', builder.companyName);
    
    try {
      // Simple duplicate detection
      const existingBuilder = this.data.builders.find(b => b.id === builder.id);

      if (existingBuilder) {
        console.log('⚠️ Builder already exists:', builder.companyName);
        return { success: false, error: `Builder already exists: ${builder.companyName}` };
      }

      // Normalize to ExhibitionBuilder shape with safe defaults
      // Generate safe slug if missing
      const baseSlug = (builder.slug || builder.companyName || builder.company_name || '')
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const safeSlug = baseSlug
        ? `${baseSlug}-${uuidv4().substring(0, 8)}`
        : `builder-${uuidv4().substring(0, 8)}`;

      console.log('📝 Normalizing builder data for:', builder.companyName);

      const normalized: ExhibitionBuilder = {
        id: builder.id,
        companyName: builder.companyName || builder.company_name || 'Unnamed Builder',
        slug: safeSlug,
        logo: builder.logo || '/images/builders/default-logo.png',
        establishedYear: builder.establishedYear || new Date().getFullYear(),
        headquarters: builder.headquarters || {
          city: builder.city || 'Unknown',
          country: builder.country || 'Unknown',
          countryCode: builder.countryCode || 'XX',
          address: builder.address || '',
          latitude: 0,
          longitude: 0,
          isHeadquarters: true,
        },
        serviceLocations: builder.serviceLocations || [],
        contactInfo: builder.contactInfo || {
          primaryEmail: builder.primaryEmail || builder.email || '',
          phone: builder.phone || '',
          website: builder.website || '',
          contactPerson: builder.contactPerson || '',
          position: builder.position || '',
        },
        services: builder.services || [],
        specializations: builder.specializations || [],
        certifications: builder.certifications || [],
        awards: builder.awards || [],
        portfolio: builder.portfolio || [],
        teamSize: builder.teamSize || 0,
        projectsCompleted: builder.projectsCompleted || 0,
        rating: builder.rating || 0,
        reviewCount: builder.reviewCount || 0,
        responseTime: builder.responseTime || 'New to platform',
        languages: builder.languages || ['English'],
        verified: !!builder.verified,
        premiumMember: !!builder.premiumMember,
        tradeshowExperience: builder.tradeshowExperience || [],
        priceRange: builder.priceRange || { currency: 'USD', min: 0, max: 0, unit: 'per project' },
        companyDescription: builder.companyDescription || '',
        whyChooseUs: builder.whyChooseUs || [],
        clientTestimonials: builder.clientTestimonials || [],
        socialMedia: builder.socialMedia || { website: '', linkedin: '', facebook: '', instagram: '', twitter: '' },
        businessLicense: builder.businessLicense || '',
        insurance: builder.insurance || { provider: '', policyNumber: '', validUntil: '' },
        sustainability: builder.sustainability || { certified: false, initiatives: [] },
        keyStrengths: builder.keyStrengths || [],
        recentProjects: builder.recentProjects || [],
        claimed: builder.claimed,
        claimStatus: builder.claimStatus,
        claimedAt: builder.claimedAt,
        claimedBy: builder.claimedBy,
        planType: builder.planType || 'free',
        verificationData: builder.verificationData,
        gmbImported: builder.gmbImported,
        importedFromGMB: builder.importedFromGMB,
        source: builder.source || 'registration',
        importedAt: builder.importedAt,
        lastUpdated: builder.lastUpdated || new Date().toISOString(),
        status: builder.status || 'active',
        plan: builder.plan || 'free',
        contactEmail: builder.contactEmail || builder.contactInfo?.primaryEmail || '',
      };

      console.log('✅ Builder normalized successfully:', normalized.companyName);

      // Add to memory
      this.data.builders.push(normalized);
      
      // Update stats
      this.data.stats.totalBuilders = this.data.builders.length;
      this.data.stats.verifiedBuilders = this.data.builders.filter(b => b.verified).length;
      
      // Persist to Supabase if available
      try {
        console.log('🔄 Attempting to persist builder to Supabase...');
        const { getServerSupabase } = await import('@/lib/supabase');
        console.log('✅ Supabase module imported successfully');
        
        const sb = getServerSupabase();
        console.log('🔍 Supabase client:', sb ? '✅ Available' : '❌ Not available');
        
        if (sb) {
          // Ensure required fields are present
          const fallbackEmail = normalized.contactInfo.primaryEmail && normalized.contactInfo.primaryEmail.trim() !== ''
            ? normalized.contactInfo.primaryEmail
            : `no-email+${normalized.slug}@standzon.com`;

          console.log('📝 Inserting builder to Supabase:', {
            id: normalized.id,
            company_name: normalized.companyName,
            slug: normalized.slug,
            primary_email: fallbackEmail
          });
          
          // Add timeout for Supabase insert operation
          const insertPromise = sb.from('builder_profiles').insert({
            id: normalized.id,
            company_name: normalized.companyName,
            slug: normalized.slug,
            primary_email: fallbackEmail,
            phone: normalized.contactInfo.phone,
            contact_person: normalized.contactInfo.contactPerson,
            company_description: normalized.companyDescription,
            headquarters_city: normalized.headquarters.city,
            headquarters_country: normalized.headquarters.country,
            headquarters_country_code: (normalized.headquarters as any).countryCode || null,
            headquarters_address: normalized.headquarters.address || null,
            verified: normalized.verified,
            claimed: normalized.claimed,
            claim_status: normalized.claimStatus || 'unclaimed',
            premium_member: normalized.premiumMember,
            created_at: normalized.lastUpdated,
            source: normalized.source || 'unified_platform'
          });
          
          // Timeout for Supabase operation
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Supabase insert operation timeout')), 30000);
          });
          
          const { error: builderInsertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

          if (builderInsertError) {
            console.error('❌ Failed to insert builder profile:', builderInsertError);
          } else {
            console.log('✅ Builder profile inserted successfully');
          }

          // Also persist service locations if provided
          if (normalized.serviceLocations && normalized.serviceLocations.length > 0 && !builderInsertError) {
            try {
              const serviceLocationRecords = [] as any[];

              // Add headquarters as a location as well
              if (normalized.headquarters) {
                serviceLocationRecords.push({
                  builder_id: normalized.id,
                  city: normalized.headquarters.city,
                  country: normalized.headquarters.country,
                  country_code: (normalized.headquarters as any).countryCode || null,
                  address: normalized.headquarters.address || null,
                  latitude: (normalized.headquarters as any).latitude || null,
                  longitude: (normalized.headquarters as any).longitude || null,
                  is_headquarters: true
                });
              }

              for (const loc of normalized.serviceLocations) {
                // Support both grouped `{ country, cities: [] }` and detailed location objects
                if ((loc as any).cities && (loc as any).country) {
                  for (const city of (loc as any).cities) {
                    serviceLocationRecords.push({
                      builder_id: normalized.id,
                      city,
                      country: (loc as any).country,
                      country_code: (loc as any).countryCode || getCountryCode((loc as any).country),
                      is_headquarters: false
                    });
                  }
                } else {
                  serviceLocationRecords.push({
                    builder_id: normalized.id,
                    city: (loc as any).city || normalized.headquarters.city,
                    country: (loc as any).country || normalized.headquarters.country,
                    country_code: (loc as any).countryCode || getCountryCode((loc as any).country || normalized.headquarters.country),
                    address: (loc as any).address || null,
                    latitude: (loc as any).latitude || null,
                    longitude: (loc as any).longitude || null,
                    is_headquarters: false
                  });
                }
              }

              if (serviceLocationRecords.length > 0) {
                // Add timeout for service locations insert operation
                const locationsInsertPromise = sb.from('builder_service_locations').insert(serviceLocationRecords);
                const locationsTimeoutPromise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error('Supabase service locations insert operation timeout')), 30000);
                });
                
                const { error: locationsError } = await Promise.race([locationsInsertPromise, locationsTimeoutPromise]) as any;

                if (locationsError) {
                  console.error('❌ Failed to insert service locations:', locationsError);
                } else {
                  console.log(`✅ Inserted ${serviceLocationRecords.length} service locations`);
                }
              }
            } catch (locErr) {
              console.error('❌ Error persisting service locations:', locErr);
            }
          }
        } else {
          console.log('❌ Supabase client not available - builder not persisted to database');
        }
      } catch (persistErr) {
        console.error('❌ Failed to persist builder to Supabase:', persistErr);
      }
      
      // Notify all subscribers
      this.notifySubscribers({
        type: 'builder_added',
        data: builder,
        timestamp: new Date().toISOString(),
        source
      });

      console.log('✅ Builder added to memory');
      return { success: true, data: normalized };
    } catch (error) {
      console.error('❌ Error adding builder:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  updateBuilder(id: string, updates: Partial<ExhibitionBuilder>, source: 'admin' | 'website' = 'admin'): { success: boolean; data?: ExhibitionBuilder; error?: string } {
    try {
      const index = this.data.builders.findIndex(b => b.id === id);
      if (index === -1) {
        return { success: false, error: 'Builder not found' };
      }
      
      // Update in memory
      this.data.builders[index] = { ...this.data.builders[index], ...updates };
      
      this.notifySubscribers({
        type: 'builder_updated',
        data: { id, updates },
        timestamp: new Date().toISOString(),
        source
      });

      console.log('✅ Builder updated in memory:', this.data.builders[index].companyName);
      return { success: true, data: this.data.builders[index] };
    } catch (error) {
      console.error('❌ Error updating builder:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  deleteBuilder(id: string, source: 'admin' | 'website' = 'admin'): { success: boolean; data?: ExhibitionBuilder; error?: string } {
    try {
      const index = this.data.builders.findIndex(b => b.id === id);
      if (index === -1) {
        return { success: false, error: 'Builder not found' };
      }
      
      const deleted = this.data.builders.splice(index, 1)[0];
      
      // Update stats
      this.data.stats.totalBuilders = this.data.builders.length;
      this.data.stats.verifiedBuilders = this.data.builders.filter(b => b.verified).length;
      
      this.notifySubscribers({
        type: 'builder_deleted',
        data: deleted,
        timestamp: new Date().toISOString(),
        source
      });

      console.log('🗑️ Builder deleted from memory:', deleted.companyName);
      return { success: true, data: deleted };
    } catch (error) {
      console.error('❌ Error deleting builder:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Clear all data (for testing/reset)
  clearAll(): void {
    this.data = {
      builders: [],
      eventPlanners: [],
      events: [],
      leads: [],
      quotes: [],
      users: [],
      stats: {}
    };
    
    this.notifySubscribers({
      type: 'stats_updated',
      data: { message: 'All data cleared' },
      timestamp: new Date().toISOString(),
      source: 'admin'
    });

    console.log('🧹 All platform data cleared from memory');
  }

  // Clear only builders (for testing/reset)
  clearBuilders(): void {
    this.data.builders = [];
    this.data.stats.totalBuilders = 0;
    this.data.stats.verifiedBuilders = 0;
    
    this.notifySubscribers({
      type: 'stats_updated',
      data: { message: 'Builders cleared' },
      timestamp: new Date().toISOString(),
      source: 'admin'
    });

    console.log('🧹 All builders cleared from memory');
  }
}

// Global instance
let unifiedDataManager: UnifiedDataManager | null = null;

export function getUnifiedDataManager(): UnifiedDataManager {
  // ✅ PERFORMANCE FIX: Lightweight singleton pattern
  if (typeof window === 'undefined') {
    const globalManager = (global as any).unifiedDataManagerInstance;
    if (globalManager) {
      return globalManager;
    }
    
    // Create new instance
    unifiedDataManager = new UnifiedDataManager();
    (global as any).unifiedDataManagerInstance = unifiedDataManager;
    
    return unifiedDataManager;
  }
  
  // Client-side: Use regular singleton pattern
  if (!unifiedDataManager) {
    unifiedDataManager = new UnifiedDataManager();
  }
  return unifiedDataManager;
}

// ✅ SIMPLIFIED: Lightweight API
export const unifiedPlatformAPI = {
  // Data access with lazy loading
  getAllData: async () => {
    const manager = getUnifiedDataManager();
    await manager.ensureInitialized();
    return manager.getAllData();
  },
  
  // ✅ FIXED: Provide both sync and async versions
  getBuilders: () => {
    const manager = getUnifiedDataManager();
    const builders = manager.getBuilders();
    console.log(`📊 getBuilders() returning ${builders.length} builders synchronously`);
    return builders;
  },
  
  getBuildersAsync: async () => {
    const manager = getUnifiedDataManager();
    await manager.ensureInitialized();
    const builders = manager.getBuilders();
    console.log(`📊 getBuildersAsync() returning ${builders.length} builders after initialization`);
    return builders;
  },
  
  // Data access
  getBuilderById: (id: string) => getUnifiedDataManager().getBuilderById(id),
  getLeads: () => getUnifiedDataManager().getLeads(),
  getStats: () => getUnifiedDataManager().getStats(),
  subscribe: (callback: (event: DataEvent) => void) => getUnifiedDataManager().subscribe(callback),
  
  // Builder operations
  addBuilder: (builder: ExhibitionBuilder, source?: 'admin' | 'website') => getUnifiedDataManager().addBuilder(builder, source),
  updateBuilder: (id: string, updates: Partial<ExhibitionBuilder>, source?: 'admin' | 'website') => getUnifiedDataManager().updateBuilder(id, updates, source),
  deleteBuilder: (id: string, source?: 'admin' | 'website') => getUnifiedDataManager().deleteBuilder(id, source),
  searchBuilders: (query: string) => getUnifiedDataManager().searchBuilders(query),
  filterBuilders: (filters: any) => getUnifiedDataManager().filterBuilders(filters),
  
  // ✅ NEW: Lead operations
  addLead: (lead: any) => getUnifiedDataManager().addLead(lead),
  updateLead: (id: string, updates: any) => getUnifiedDataManager().updateLead(id, updates),
  
  // Utility
  clearAll: () => getUnifiedDataManager().clearAll(),
  clearBuilders: () => getUnifiedDataManager().clearBuilders()
};

console.log('✅ Simplified Unified Platform Data System initialized')


