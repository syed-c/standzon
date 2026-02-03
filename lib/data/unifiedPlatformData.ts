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

  // Public getter for initialization status
  get isInitialized(): boolean {
    return this.initialized;
  }

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

    // If already initializing, wait for the existing promise
    if (isInitializing && initializationPromise) {
      console.log('🔄 Waiting for existing initialization to complete...');
      await initializationPromise;
      return;
    }

    console.log('🔄 Performing one-time initialization...');
    isInitializing = true;
    initializationPromise = this.initialize();

    try {
      await initializationPromise;
      this.initialized = true;
      console.log('✅ Initialization completed successfully');
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      // Reset initialization state so it can be retried
      isInitializing = false;
      initializationPromise = null;
      throw error;
    }

    isInitializing = false;
    initializationPromise = null;
  }

  // ✅ SIMPLIFIED: Basic initialization
  private async initialize(): Promise<void> {
    console.log('🏗️ Initializing unified data management system...');

    try {
      // Load initial data
      await this.loadInitialData();

      // Initialize stats
      this.data.stats = {
        totalBuilders: this.data.builders.length,
        totalLeads: 0,
        verifiedBuilders: this.data.builders.filter(b => b.verified).length,
        lastUpdate: new Date().toISOString()
      };

      console.log('✅ Unified data management system initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize unified data system:', error);
      // Continue with empty data - don't block the app
    }
  }

  private async loadInitialData() {
    console.log('📂 Loading initial data from static files and Supabase...');

    try {
      // Check if Supabase is configured
      // Use NEXT_PUBLIC_* variables as primary since they're available in both server and client
      // Only access process.env on server side to avoid client-side errors
      let supabaseUrl, supabaseServiceKey;

      // Server-side environment variable access
      if (typeof process !== 'undefined' && process.env) {
        supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log('🔐 Server-side environment variables:');
        console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Present' : '✗ Missing');
        console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Present' : '✗ Missing');
        console.log('   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing');
        console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing');
      }

      // Also check window for client-side (in case of browser environment)
      if (typeof window !== 'undefined' && window.location) {
        // In browser environment, we can only access NEXT_PUBLIC_* variables
        // But they won't be available directly in window.env, we need to check differently
        console.log('🌐 Browser environment detected');
        console.log('   Window location:', window.location.origin);
      }

      // ✅ PRODUCTION FIX: Check if we're in a browser environment and try to determine base URL
      let baseUrl = '';
      if (typeof window !== 'undefined' && window.location) {
        baseUrl = window.location.origin;
        console.log('🌍 Detected browser base URL:', baseUrl);
      } else if (typeof process !== 'undefined' && process.env) {
        let rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000';

        // Ensure the base URL has a protocol (http:// or https://)
        if (!rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://')) {
          rawBaseUrl = `https://${rawBaseUrl}`;
        }

        baseUrl = rawBaseUrl;
        console.log('🖥️ Detected server base URL:', baseUrl);
      }

      console.log('🔗 Base URL for API calls:', baseUrl);

      // ✅ PRODUCTION FIX: Always attempt to fetch builders via API as primary method
      // This ensures data is loaded even if Supabase env vars are not available at build time
      try {
        console.log('🔄 Trying to fetch builders via API as primary method...');
        const apiEndpoint = `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`;
        console.log('📡 API Endpoint:', apiEndpoint);

        // Use fetch with proper error handling
        const response = await fetch(apiEndpoint, {
          next: { revalidate: 60 },
          headers: {
            'Content-Type': 'application/json',
            // Add authorization if needed
            ...(typeof window !== 'undefined' ? {} : { 'x-api-source': 'unified-platform' })
          }
        });

        if (response.ok) {
          const buildersData = await response.json();
          console.log('✅ API fetch successful. Data structure:', {
            success: buildersData.success,
            hasData: !!buildersData.data,
            buildersCount: buildersData.data?.builders?.length || 0
          });

          if (buildersData.success && buildersData.data && Array.isArray(buildersData.data.builders)) {
            const apiBuilders = buildersData.data.builders;
            console.log(`📊 Loaded ${apiBuilders.length} builders from API`);

            // Transform builders to ExhibitionBuilder format
            const transformedBuilders = apiBuilders.map((builder: any) => {
              // Ensure all required fields are present for ExhibitionBuilder interface
              return {
                // Basic fields
                id: builder.id || uuidv4(),
                companyName: builder.company_name || builder.name || 'Unknown Builder',
                slug: builder.slug || builder.id || '',
                logo: builder.logo || '/images/builders/default-logo.png',
                establishedYear: builder.established_year || new Date().getFullYear(),

                // Headquarters
                headquarters: {
                  city: builder.headquarters_city || builder.city || 'Unknown',
                  country: builder.headquarters_country || builder.country || 'Unknown',
                  countryCode: builder.headquarters_country_code || builder.country_code || 'XX',
                  address: builder.headquarters_address || builder.address || '',
                  latitude: builder.headquarters_latitude || builder.latitude || 0,
                  longitude: builder.headquarters_longitude || builder.longitude || 0,
                  isHeadquarters: true
                },

                // Service locations
                serviceLocations: builder.service_locations || [
                  {
                    city: builder.headquarters_city || builder.city || 'Unknown',
                    country: builder.headquarters_country || builder.country || 'Unknown',
                    countryCode: builder.headquarters_country_code || builder.country_code || 'XX',
                    address: builder.headquarters_address || builder.address || '',
                    latitude: builder.headquarters_latitude || builder.latitude || 0,
                    longitude: builder.headquarters_longitude || builder.longitude || 0,
                    isHeadquarters: false
                  }
                ],

                // Contact info
                contactInfo: {
                  primaryEmail: builder.primary_email || builder.email || '',
                  phone: builder.phone || '',
                  website: builder.website || '',
                  contactPerson: builder.contact_person || builder.contact_name || '',
                  position: builder.position || ''
                },

                // Services and specializations (empty arrays as defaults)
                services: builder.services || [],
                specializations: builder.specializations || [],
                certifications: builder.certifications || [],
                awards: builder.awards || [],
                portfolio: builder.portfolio || [],

                // Stats
                teamSize: builder.team_size || 0,
                projectsCompleted: builder.projects_completed || builder.completed_projects || 0,
                rating: builder.rating || 0,
                reviewCount: builder.review_count || 0,

                // Response info
                responseTime: builder.response_time || '24 hours',
                languages: builder.languages || ['English'],

                // Status flags
                verified: builder.verified || false,
                premiumMember: builder.premium_member || builder.premiumMember || false,

                // Additional fields
                tradeshowExperience: builder.tradeshow_experience || [],
                priceRange: builder.price_range || { min: 0, max: 0, currency: 'USD' },
                companyDescription: builder.description || builder.company_description || '',
                whyChooseUs: builder.why_choose_us || [],
                clientTestimonials: builder.client_testimonials || [],
                socialMedia: builder.social_media || {},
                businessLicense: builder.business_license || '',
                insurance: builder.insurance || {},
                sustainability: builder.sustainability || {},
                keyStrengths: builder.key_strengths || [],
                recentProjects: builder.recent_projects || [],

                // Claim system
                claimed: builder.claimed || false,
                claimStatus: builder.claim_status || "unclaimed",
                planType: builder.plan_type || "free",
                gmbImported: builder.gmb_imported || builder.gmbImported || false,
                importedFromGMB: builder.imported_from_gmb || false,
                source: builder.source || '',
                importedAt: builder.imported_at || '',
                lastUpdated: builder.last_updated || builder.updated_at || new Date().toISOString(),

                // Lead routing
                status: builder.status || "active",
                plan: builder.plan || "free",
                contactEmail: builder.contact_email || builder.primary_email || builder.email || ''
              };
            });

            console.log(`📦 Transformed ${transformedBuilders.length} builders to ExhibitionBuilder format`);

            // Update data
            this.data.builders = transformedBuilders;
            console.log(`💾 Updated platform data with ${this.data.builders.length} builders from API`);

            // Early return to skip Supabase loading if API data was successfully loaded
            return;
          } else {
            console.warn('⚠️ API response structure unexpected:', buildersData);
          }
        } else {
          console.warn('⚠️ API fetch failed with status:', response.status, response.statusText);
          console.log('⚠️ Trying Supabase as fallback...');
        }
      } catch (apiError) {
        console.error('❌ API fetch failed:', apiError);
        console.log('⚠️ Trying Supabase as fallback...');
      }

      if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('⚠️ Supabase not configured. Skipping Supabase data loading.');
        // Only log detailed environment variable info on server side
        if (typeof process !== 'undefined' && process.env) {
          console.log('Environment variables check:');
          console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Present' : '✗ Missing');
          console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Present' : '✗ Missing');
          console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing');
          console.log('- NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing');
        }
      } else {
        console.log('✅ Supabase is configured. Proceeding with data loading...');
        console.log('🔗 Supabase URL:', supabaseUrl);

        // Load builders from Supabase
        console.log('🔄 Loading builders from Supabase...');
        const { getAllBuilders } = await import('@/lib/supabase/builders');

        const supabaseBuilders = await getAllBuilders();
        console.log(`📊 Loaded ${supabaseBuilders.length} builders from Supabase`);

        // Log if no builders were found
        if (supabaseBuilders.length === 0) {
          console.warn('⚠️ No builders found in Supabase. Check Supabase connection and data.');
          console.log('This might be due to:');
          console.log('1. No data in the database tables');
          console.log('2. Incorrect Supabase configuration');
          console.log('3. Database connection issues');
          console.log('4. Row Level Security (RLS) restrictions');

          // Try to diagnose the issue
          try {
            console.log('🔍 Attempting to diagnose Supabase connection...');
            const { getServerSupabase } = await import('@/lib/supabase');
            const sb = getServerSupabase();

            if (sb) {
              console.log('✅ Supabase client initialized successfully');

              // Try a simple query to test connection
              console.log('🔍 Testing connection with a simple query...');
              const { data: testData, error: testError } = await sb
                .from('page_contents')
                .select('id')
                .limit(1);

              if (testError) {
                console.error('❌ Supabase connection test failed:', testError.message);
              } else {
                console.log('✅ Supabase connection test successful. Found records:', testData?.length || 0);
              }
            } else {
              console.log('⚠️ Could not initialize Supabase client for diagnostics');
            }
          } catch (diagnosticError) {
            console.error('❌ Error during Supabase diagnostics:', diagnosticError);
          }
        }

        // Transform builders to ExhibitionBuilder format
        const transformedBuilders = supabaseBuilders.map((builder: any) => {
          // Ensure all required fields are present for ExhibitionBuilder interface
          return {
            // Basic fields
            id: builder.id || uuidv4(),
            companyName: builder.company_name || builder.name || 'Unknown Builder',
            slug: builder.slug || builder.id || '',
            logo: builder.logo || '/images/builders/default-logo.png',
            establishedYear: builder.established_year || new Date().getFullYear(),

            // Headquarters
            headquarters: {
              city: builder.headquarters_city || builder.city || 'Unknown',
              country: builder.headquarters_country || builder.country || 'Unknown',
              countryCode: builder.headquarters_country_code || builder.country_code || 'XX',
              address: builder.headquarters_address || builder.address || '',
              latitude: builder.headquarters_latitude || builder.latitude || 0,
              longitude: builder.headquarters_longitude || builder.longitude || 0,
              isHeadquarters: true
            },

            // Service locations
            serviceLocations: builder.service_locations || [
              {
                city: builder.headquarters_city || builder.city || 'Unknown',
                country: builder.headquarters_country || builder.country || 'Unknown',
                countryCode: builder.headquarters_country_code || builder.country_code || 'XX',
                address: builder.headquarters_address || builder.address || '',
                latitude: builder.headquarters_latitude || builder.latitude || 0,
                longitude: builder.headquarters_longitude || builder.longitude || 0,
                isHeadquarters: false
              }
            ],

            // Contact info
            contactInfo: {
              primaryEmail: builder.primary_email || builder.email || '',
              phone: builder.phone || '',
              website: builder.website || '',
              contactPerson: builder.contact_person || builder.contact_name || '',
              position: builder.position || ''
            },

            // Services and specializations (empty arrays as defaults)
            services: builder.services || [],
            specializations: builder.specializations || [],
            certifications: builder.certifications || [],
            awards: builder.awards || [],
            portfolio: builder.portfolio || [],

            // Stats
            teamSize: builder.team_size || 0,
            projectsCompleted: builder.projects_completed || builder.completed_projects || 0,
            rating: builder.rating || 0,
            reviewCount: builder.review_count || 0,

            // Response info
            responseTime: builder.response_time || '24 hours',
            languages: builder.languages || ['English'],

            // Status flags
            verified: builder.verified || false,
            premiumMember: builder.premium_member || builder.premiumMember || false,

            // Additional fields
            tradeshowExperience: builder.tradeshow_experience || [],
            priceRange: builder.price_range || { min: 0, max: 0, currency: 'USD' },
            companyDescription: builder.description || builder.company_description || '',
            whyChooseUs: builder.why_choose_us || [],
            clientTestimonials: builder.client_testimonials || [],
            socialMedia: builder.social_media || {},
            businessLicense: builder.business_license || '',
            insurance: builder.insurance || {},
            sustainability: builder.sustainability || {},
            keyStrengths: builder.key_strengths || [],
            recentProjects: builder.recent_projects || [],

            // Claim system
            claimed: builder.claimed || false,
            claimStatus: builder.claim_status || "unclaimed",
            planType: builder.plan_type || "free",
            gmbImported: builder.gmb_imported || builder.gmbImported || false,
            importedFromGMB: builder.imported_from_gmb || false,
            source: builder.source || '',
            importedAt: builder.imported_at || '',
            lastUpdated: builder.last_updated || builder.updated_at || new Date().toISOString(),

            // Lead routing
            status: builder.status || "active",
            plan: builder.plan || "free",
            contactEmail: builder.contact_email || builder.primary_email || builder.email || ''
          };
        });

        console.log(`📦 Transformed ${transformedBuilders.length} builders to ExhibitionBuilder format`);

        // Update data
        this.data.builders = transformedBuilders;
        console.log(`💾 Updated platform data with ${this.data.builders.length} builders`);
      }
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      // Don't throw - continue with empty data
    }
  }

  // Get all data
  getData(): PlatformData {
    return { ...this.data };
  }

  // ✅ NEW: Get all data (alias for getData)
  getAllData(): PlatformData {
    return this.getData();
  }

  // Get builders
  getBuilders(): ExhibitionBuilder[] {
    return [...this.data.builders];
  }

  // ✅ NEW: Get builder by ID
  getBuilderById(id: string): ExhibitionBuilder | null {
    return this.data.builders.find(b => b.id === id) || null;
  }

  // ✅ NEW: Subscribe to data changes
  subscribe(callback: (event: DataEvent) => void): () => void {
    this.subscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // ✅ NEW: Notify all subscribers
  private notifySubscribers(event: DataEvent) {
    // Create a copy of subscribers to avoid issues if callbacks modify the array
    const subscribersCopy = [...this.subscribers];
    subscribersCopy.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ Error in subscriber callback:', error);
      }
    });
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
            phone: normalized.contactInfo.phone || '',
            contact_person: normalized.contactInfo.contactPerson || 'Contact Person',
            company_description: normalized.companyDescription || 'Professional exhibition services',
            headquarters_city: normalized.headquarters.city || 'Unknown',
            headquarters_country: normalized.headquarters.country || 'Unknown',
            headquarters_country_code: (normalized.headquarters as any).countryCode || 'XX',
            headquarters_address: normalized.headquarters.address || '',
            verified: normalized.verified || false,
            claimed: normalized.claimed || false,
            claim_status: normalized.claimStatus || 'unclaimed',
            premium_member: normalized.premiumMember || false,
            gmb_imported: normalized.gmbImported || false,
            imported_from_gmb: normalized.importedFromGMB || false,
            source: normalized.source || 'unified_platform',
            imported_at: normalized.importedAt || new Date().toISOString()
          });

          // Timeout for Supabase operation
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Supabase insert operation timeout')), 30000);
          });

          const { data: insertData, error: builderInsertError } = await Promise.race([insertPromise, timeoutPromise]) as any;

          if (builderInsertError) {
            console.error('❌ Failed to insert builder profile:', builderInsertError);
            console.error('❌ Error details:', {
              id: normalized.id,
              company_name: normalized.companyName,
              primary_email: fallbackEmail,
              error: builderInsertError
            });
          } else {
            console.log('✅ Builder profile inserted successfully:', insertData?.[0]?.id);
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

                const { data: locationData, error: locationsError } = await Promise.race([locationsInsertPromise, locationsTimeoutPromise]) as any;

                if (locationsError) {
                  console.error('❌ Failed to insert service locations:', locationsError);
                  console.error('❌ Location error details:', {
                    builder_id: normalized.id,
                    locations_count: serviceLocationRecords.length,
                    error: locationsError
                  });
                } else {
                  console.log(`✅ Inserted ${locationData?.length || serviceLocationRecords.length} service locations`);
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

// ✅ NEW: Force initialization on first access if not already initialized
let forceInitializationAttempted = false;

// ✅ NEW: Country-specific builder filtering
function getBuildersByCountry(country: string): ExhibitionBuilder[] {
  console.log("📍 getBuildersByCountry called with:", country);

  try {
    const normalized = country.toLowerCase().replace(/-/g, " ").trim();

    // Handle country variations (UAE vs United Arab Emirates)
    const countryVariations = [normalized];
    if (normalized.includes("united arab emirates")) {
      countryVariations.push("uae");
    } else if (normalized === "uae") {
      countryVariations.push("united arab emirates");
    }

    console.log("📍 Country variations for filtering:", countryVariations);

    const manager = getUnifiedDataManager();
    const allBuilders = manager.getBuilders();

    console.log("📍 Total builders in system:", allBuilders.length);

    const filtered = allBuilders.filter(builder => {
      try {
        // Normalize builder country for comparison
        const builderCountry = (builder.headquarters?.country || '').toLowerCase().trim();

        // Check if any country variation matches
        const match = countryVariations.some(variation =>
          builderCountry.includes(variation)
        );

        // Log first few builders for debugging
        if (allBuilders.indexOf(builder) < 3) {
          console.log("📍 Builder " + builder.companyName + ": country=\"" + builderCountry + "\", match=" + match);
        }

        return match;
      } catch (filterError) {
        console.error("❌ Error filtering builder:", builder.companyName, filterError);
        return false;
      }
    });

    console.log("📍 Filtered builders for country:", country, " -> ", filtered.length);
    return filtered;
  } catch (error) {
    console.error("❌ Error in getBuildersByCountry:", error);
    return [];
  }
}

// ✅ SIMPLIFIED: Lightweight API
export const unifiedPlatformAPI = {
  // Data access with lazy loading
  getAllData: async () => {
    try {
      const manager = getUnifiedDataManager();
      await manager.ensureInitialized();
      return manager.getAllData();
    } catch (error) {
      console.error('❌ Error in getAllData:', error);
      return { builders: [], eventPlanners: [], events: [], leads: [], quotes: [], users: [], stats: {} };
    }
  },

  // ✅ FIXED: Provide both sync and async versions with location filtering
  getBuilders: (location?: string) => {
    try {
      const manager = getUnifiedDataManager();

      // ✅ PRODUCTION FIX: Force initialization if not already done
      if (!manager.isInitialized && !forceInitializationAttempted) {
        console.log('⚠️ Unified platform not initialized, forcing initialization...');
        forceInitializationAttempted = true;

        // Try to initialize synchronously first
        try {
          // This might not work in all cases, but worth trying
          manager.ensureInitialized().catch(err => {
            console.error('❌ Error in forced sync initialization:', err);
          });
        } catch (syncInitError) {
          console.log('⚠️ Sync initialization failed, will try async');
        }
      }

      // If location is provided, filter by country
      if (location) {
        const filteredBuilders = getBuildersByCountry(location);
        console.log("📊 getBuilders(" + location + ") returning " + filteredBuilders.length + " builders synchronously");
        return filteredBuilders;
      }

      // Otherwise return all builders
      const builders = manager.getBuilders();
      console.log("📊 getBuilders() returning " + builders.length + " builders synchronously");
      return builders;
    } catch (error) {
      console.error('❌ Error in getBuilders:', error);
      return [];
    }
  },

  getBuildersAsync: async (location?: string) => {
    try {
      const manager = getUnifiedDataManager();
      await manager.ensureInitialized();

      // If location is provided, filter by country
      if (location) {
        const filteredBuilders = getBuildersByCountry(location);
        console.log("📊 getBuildersAsync(" + location + ") returning " + filteredBuilders.length + " builders after initialization");
        return filteredBuilders;
      }

      // Otherwise return all builders
      const builders = manager.getBuilders();
      console.log("📊 getBuildersAsync() returning " + builders.length + " builders after initialization");
      return builders;
    } catch (error) {
      console.error('❌ Error in getBuildersAsync:', error);
      return [];
    }
  },

  isInitialized: () => {
    try {
      const manager = getUnifiedDataManager();
      return manager.isInitialized;
    } catch (error) {
      console.error('❌ Error in isInitialized:', error);
      return false;
    }
  },

  // Data access
  getBuilderById: (id: string) => {
    try {
      return getUnifiedDataManager().getBuilderById(id);
    } catch (error) {
      console.error('❌ Error in getBuilderById:', error);
      return null;
    }
  },
  getLeads: () => {
    try {
      return getUnifiedDataManager().getLeads();
    } catch (error) {
      console.error('❌ Error in getLeads:', error);
      return [];
    }
  },
  getStats: () => {
    try {
      return getUnifiedDataManager().getStats();
    } catch (error) {
      console.error('❌ Error in getStats:', error);
      return {};
    }
  },
  subscribe: (callback: (event: DataEvent) => void) => {
    try {
      return getUnifiedDataManager().subscribe(callback);
    } catch (error) {
      console.error('❌ Error in subscribe:', error);
      // Return a no-op unsubscribe function
      return () => { };
    }
  },

  // Builder operations
  addBuilder: (builder: ExhibitionBuilder, source?: 'admin' | 'website') => {
    try {
      return getUnifiedDataManager().addBuilder(builder, source);
    } catch (error) {
      console.error('❌ Error in addBuilder:', error);
      return { success: false, error: 'Failed to add builder' };
    }
  },
  updateBuilder: (id: string, updates: Partial<ExhibitionBuilder>, source?: 'admin' | 'website') => {
    try {
      return getUnifiedDataManager().updateBuilder(id, updates, source);
    } catch (error) {
      console.error('❌ Error in updateBuilder:', error);
      return { success: false, error: 'Failed to update builder' };
    }
  },
  deleteBuilder: (id: string, source?: 'admin' | 'website') => {
    try {
      return getUnifiedDataManager().deleteBuilder(id, source);
    } catch (error) {
      console.error('❌ Error in deleteBuilder:', error);
      return { success: false, error: 'Failed to delete builder' };
    }
  },
  searchBuilders: (query: string) => {
    try {
      return getUnifiedDataManager().searchBuilders(query);
    } catch (error) {
      console.error('❌ Error in searchBuilders:', error);
      return [];
    }
  },
  filterBuilders: (filters: any) => {
    try {
      return getUnifiedDataManager().filterBuilders(filters);
    } catch (error) {
      console.error('❌ Error in filterBuilders:', error);
      return [];
    }
  },

  // ✅ NEW: Lead operations
  addLead: (lead: any) => {
    try {
      return getUnifiedDataManager().addLead(lead);
    } catch (error) {
      console.error('❌ Error in addLead:', error);
      return { success: false, error: 'Failed to add lead' };
    }
  },
  updateLead: (id: string, updates: any) => {
    try {
      return getUnifiedDataManager().updateLead(id, updates);
    } catch (error) {
      console.error('❌ Error in updateLead:', error);
      return { success: false, error: 'Failed to update lead' };
    }
  },

  // Utility
  clearAll: () => {
    try {
      return getUnifiedDataManager().clearAll();
    } catch (error) {
      console.error('❌ Error in clearAll:', error);
    }
  },
  clearBuilders: () => {
    try {
      return getUnifiedDataManager().clearBuilders();
    } catch (error) {
      console.error('❌ Error in clearBuilders:', error);
    }
  }
};

console.log('✅ Simplified Unified Platform Data System initialized')