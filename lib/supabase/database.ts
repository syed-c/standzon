/**
 * Supabase Database Client - Primary Database Interface
 * 
 * This replaces all other database connections (Convex, Prisma, file storage)
 * and provides a unified interface to Supabase as the single source of truth.
 */

import { createClient } from '@supabase/supabase-js';

// Types for our database schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          email_verified: string | null;
          image: string | null;
          role: 'ADMIN' | 'BUILDER' | 'CLIENT';
          status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          email_verified?: string | null;
          image?: string | null;
          role?: 'ADMIN' | 'BUILDER' | 'CLIENT';
          status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          email_verified?: string | null;
          image?: string | null;
          role?: 'ADMIN' | 'BUILDER' | 'CLIENT';
          status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      builder_profiles: {
        Row: {
          id: string;
          user_id: string | null;
          company_name: string;
          slug: string;
          logo: string | null;
          established_year: number | null;
          headquarters_city: string | null;
          headquarters_country: string | null;
          headquarters_country_code: string | null;
          headquarters_address: string | null;
          headquarters_latitude: number | null;
          headquarters_longitude: number | null;
          primary_email: string;
          phone: string | null;
          website: string | null;
          contact_person: string | null;
          position: string | null;
          emergency_contact: string | null;
          support_email: string | null;
          team_size: number | null;
          projects_completed: number | null;
          rating: number | null;
          review_count: number | null;
          response_time: string | null;
          languages: string[] | null;
          verified: boolean | null;
          premium_member: boolean | null;
          claimed: boolean | null;
          claim_status: string | null;
          claimed_at: string | null;
          claimed_by: string | null;
          company_description: string | null;
          business_license: string | null;
          basic_stand_min: number | null;
          basic_stand_max: number | null;
          custom_stand_min: number | null;
          custom_stand_max: number | null;
          premium_stand_min: number | null;
          premium_stand_max: number | null;
          average_project: number | null;
          currency: string | null;
          gmb_imported: boolean | null;
          imported_from_gmb: boolean | null;
          gmb_place_id: string | null;
          source: string | null;
          imported_at: string | null;
          last_updated: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_name: string;
          slug: string;
          logo?: string | null;
          established_year?: number | null;
          headquarters_city?: string | null;
          headquarters_country?: string | null;
          headquarters_country_code?: string | null;
          headquarters_address?: string | null;
          headquarters_latitude?: number | null;
          headquarters_longitude?: number | null;
          primary_email: string;
          phone?: string | null;
          website?: string | null;
          contact_person?: string | null;
          position?: string | null;
          emergency_contact?: string | null;
          support_email?: string | null;
          team_size?: number | null;
          projects_completed?: number | null;
          rating?: number | null;
          review_count?: number | null;
          response_time?: string | null;
          languages?: string[] | null;
          verified?: boolean | null;
          premium_member?: boolean | null;
          claimed?: boolean | null;
          claim_status?: string | null;
          claimed_at?: string | null;
          claimed_by?: string | null;
          company_description?: string | null;
          business_license?: string | null;
          basic_stand_min?: number | null;
          basic_stand_max?: number | null;
          custom_stand_min?: number | null;
          custom_stand_max?: number | null;
          premium_stand_min?: number | null;
          premium_stand_max?: number | null;
          average_project?: number | null;
          currency?: string | null;
          gmb_imported?: boolean | null;
          imported_from_gmb?: boolean | null;
          gmb_place_id?: string | null;
          source?: string | null;
          imported_at?: string | null;
          last_updated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          company_name?: string;
          slug?: string;
          logo?: string | null;
          established_year?: number | null;
          headquarters_city?: string | null;
          headquarters_country?: string | null;
          headquarters_country_code?: string | null;
          headquarters_address?: string | null;
          headquarters_latitude?: number | null;
          headquarters_longitude?: number | null;
          primary_email?: string;
          phone?: string | null;
          website?: string | null;
          contact_person?: string | null;
          position?: string | null;
          emergency_contact?: string | null;
          support_email?: string | null;
          team_size?: number | null;
          projects_completed?: number | null;
          rating?: number | null;
          review_count?: number | null;
          response_time?: string | null;
          languages?: string[] | null;
          verified?: boolean | null;
          premium_member?: boolean | null;
          claimed?: boolean | null;
          claim_status?: string | null;
          claimed_at?: string | null;
          claimed_by?: string | null;
          company_description?: string | null;
          business_license?: string | null;
          basic_stand_min?: number | null;
          basic_stand_max?: number | null;
          custom_stand_min?: number | null;
          custom_stand_max?: number | null;
          premium_stand_min?: number | null;
          premium_stand_max?: number | null;
          average_project?: number | null;
          currency?: string | null;
          gmb_imported?: boolean | null;
          imported_from_gmb?: boolean | null;
          gmb_place_id?: string | null;
          source?: string | null;
          imported_at?: string | null;
          last_updated?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      countries: {
        Row: {
          id: string;
          country_name: string;
          country_code: string;
          country_slug: string;
          continent: string | null;
          currency: string | null;
          timezone: string | null;
          language: string | null;
          active: boolean | null;
          builder_count: number | null;
          exhibition_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          country_name: string;
          country_code: string;
          country_slug: string;
          continent?: string | null;
          currency?: string | null;
          timezone?: string | null;
          language?: string | null;
          active?: boolean | null;
          builder_count?: number | null;
          exhibition_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          country_name?: string;
          country_code?: string;
          country_slug?: string;
          continent?: string | null;
          currency?: string | null;
          timezone?: string | null;
          language?: string | null;
          active?: boolean | null;
          builder_count?: number | null;
          exhibition_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          city_name: string;
          city_slug: string;
          country_id: string;
          country_name: string;
          country_code: string;
          state: string | null;
          timezone: string | null;
          latitude: number | null;
          longitude: number | null;
          population: number | null;
          active: boolean | null;
          builder_count: number | null;
          exhibition_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          city_name: string;
          city_slug: string;
          country_id: string;
          country_name: string;
          country_code: string;
          state?: string | null;
          timezone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          population?: number | null;
          active?: boolean | null;
          builder_count?: number | null;
          exhibition_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          city_name?: string;
          city_slug?: string;
          country_id?: string;
          country_name?: string;
          country_code?: string;
          state?: string | null;
          timezone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          population?: number | null;
          active?: boolean | null;
          builder_count?: number | null;
          exhibition_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          client_id: string | null;
          company_name: string;
          contact_name: string;
          contact_email: string;
          contact_phone: string | null;
          trade_show_name: string;
          event_date: string | null;
          venue: string | null;
          city: string;
          country: string;
          stand_size: number;
          budget: string;
          timeline: string;
          stand_type: string[] | null;
          special_requests: string | null;
          needs_installation: boolean | null;
          needs_transportation: boolean | null;
          needs_storage: boolean | null;
          needs_av_equipment: boolean | null;
          needs_lighting: boolean | null;
          needs_furniture: boolean | null;
          needs_graphics: boolean | null;
          lead_score: number | null;
          estimated_value: number | null;
          status: 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'LOST' | 'CANCELLED';
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          source: string | null;
          source_details: string | null;
          referrer: string | null;
          utm_campaign: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          attachments: string[] | null;
          created_at: string;
          updated_at: string;
          converted_at: string | null;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          company_name: string;
          contact_name: string;
          contact_email: string;
          contact_phone?: string | null;
          trade_show_name: string;
          event_date?: string | null;
          venue?: string | null;
          city: string;
          country: string;
          stand_size: number;
          budget: string;
          timeline: string;
          stand_type?: string[] | null;
          special_requests?: string | null;
          needs_installation?: boolean | null;
          needs_transportation?: boolean | null;
          needs_storage?: boolean | null;
          needs_av_equipment?: boolean | null;
          needs_lighting?: boolean | null;
          needs_furniture?: boolean | null;
          needs_graphics?: boolean | null;
          lead_score?: number | null;
          estimated_value?: number | null;
          status?: 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'LOST' | 'CANCELLED';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          source?: string | null;
          source_details?: string | null;
          referrer?: string | null;
          utm_campaign?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          attachments?: string[] | null;
          created_at?: string;
          updated_at?: string;
          converted_at?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string | null;
          company_name?: string;
          contact_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          trade_show_name?: string;
          event_date?: string | null;
          venue?: string | null;
          city?: string;
          country?: string;
          stand_size?: number;
          budget?: string;
          timeline?: string;
          stand_type?: string[] | null;
          special_requests?: string | null;
          needs_installation?: boolean | null;
          needs_transportation?: boolean | null;
          needs_storage?: boolean | null;
          needs_av_equipment?: boolean | null;
          needs_lighting?: boolean | null;
          needs_furniture?: boolean | null;
          needs_graphics?: boolean | null;
          lead_score?: number | null;
          estimated_value?: number | null;
          status?: 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'LOST' | 'CANCELLED';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          source?: string | null;
          source_details?: string | null;
          referrer?: string | null;
          utm_campaign?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          attachments?: string[] | null;
          created_at?: string;
          updated_at?: string;
          converted_at?: string | null;
        };
      };
      exhibitions: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          city_id: string | null;
          country_id: string | null;
          city_name: string;
          country_name: string;
          country_code: string;
          venue: string | null;
          venue_address: string | null;
          start_date: string | null;
          end_date: string | null;
          year: number | null;
          month: number | null;
          frequency: string | null;
          industry: string | null;
          category: string | null;
          expected_attendees: number | null;
          expected_exhibitors: number | null;
          booth_sizes: string[] | null;
          website: string | null;
          organizer_name: string | null;
          organizer_email: string | null;
          organizer_phone: string | null;
          active: boolean | null;
          featured: boolean | null;
          verified: boolean | null;
          tags: string[] | null;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          city_id?: string | null;
          country_id?: string | null;
          city_name: string;
          country_name: string;
          country_code: string;
          venue?: string | null;
          venue_address?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          year?: number | null;
          month?: number | null;
          frequency?: string | null;
          industry?: string | null;
          category?: string | null;
          expected_attendees?: number | null;
          expected_exhibitors?: number | null;
          booth_sizes?: string[] | null;
          website?: string | null;
          organizer_name?: string | null;
          organizer_email?: string | null;
          organizer_phone?: string | null;
          active?: boolean | null;
          featured?: boolean | null;
          verified?: boolean | null;
          tags?: string[] | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          city_id?: string | null;
          country_id?: string | null;
          city_name?: string;
          country_name?: string;
          country_code?: string;
          venue?: string | null;
          venue_address?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          year?: number | null;
          month?: number | null;
          frequency?: string | null;
          industry?: string | null;
          category?: string | null;
          expected_attendees?: number | null;
          expected_exhibitors?: number | null;
          booth_sizes?: string[] | null;
          website?: string | null;
          organizer_name?: string | null;
          organizer_email?: string | null;
          organizer_phone?: string | null;
          active?: boolean | null;
          featured?: boolean | null;
          verified?: boolean | null;
          tags?: string[] | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: any;
          description: string | null;
          category: string | null;
          is_public: boolean | null;
          last_modified: string | null;
          modified_by: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value: any;
          description?: string | null;
          category?: string | null;
          is_public?: boolean | null;
          last_modified?: string | null;
          modified_by?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: any;
          description?: string | null;
          category?: string | null;
          is_public?: boolean | null;
          last_modified?: string | null;
          modified_by?: string | null;
        };
      };
    };
  };
}

// Create Supabase clients
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    console.error('Missing Supabase environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.error('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.error('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient<Database>(url, anonKey);
}

export function createSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    console.error('Missing Supabase service role environment variables:');
    console.error('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
    throw new Error('Missing Supabase service role environment variables');
  }
  
  return createClient<Database>(url, serviceKey);
}

// Export default client (only create if environment variables are available)
let supabase: ReturnType<typeof createClient<Database>> | null = null;
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

try {
  supabase = createSupabaseClient();
} catch (error) {
  console.warn('Supabase client not initialized:', error);
}

try {
  supabaseAdmin = createSupabaseServiceClient();
} catch (error) {
  console.warn('Supabase admin client not initialized:', error);
}

export { supabase, supabaseAdmin };

// Database service class
export class DatabaseService {
  private client = supabaseAdmin;

  constructor() {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
    }
  }

  // Users
  async getUsers() {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getUserById(id: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createUser(user: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await this.client
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Builder Profiles
  async getBuilders() {
    const { data, error } = await this.client
      .from('builder_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getBuilderBySlug(slug: string) {
    const { data, error } = await this.client
      .from('builder_profiles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createBuilder(builder: Database['public']['Tables']['builder_profiles']['Insert']) {
    const { data, error } = await this.client
      .from('builder_profiles')
      .insert(builder)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateBuilder(id: string, updates: Database['public']['Tables']['builder_profiles']['Update']) {
    const { data, error } = await this.client
      .from('builder_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Countries
  async getCountries() {
    const { data, error } = await this.client
      .from('countries')
      .select('*')
      .eq('active', true)
      .order('country_name');
    
    if (error) throw error;
    return data;
  }

  async getCountryByCode(code: string) {
    const { data, error } = await this.client
      .from('countries')
      .select('*')
      .eq('country_code', code)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Cities
  async getCitiesByCountry(countryCode: string) {
    const { data, error } = await this.client
      .from('cities')
      .select('*')
      .eq('country_code', countryCode)
      .eq('active', true)
      .order('city_name');
    
    if (error) throw error;
    return data;
  }

  // Exhibitions
  async getExhibitions() {
    const { data, error } = await this.client
      .from('exhibitions')
      .select('*')
      .eq('active', true)
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getExhibitionBySlug(slug: string) {
    const { data, error } = await this.client
      .from('exhibitions')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Leads
  async getLeads() {
    const { data, error } = await this.client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createLead(lead: Database['public']['Tables']['leads']['Insert']) {
    const { data, error } = await this.client
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Site Settings
  async getSiteSettings() {
    const { data, error } = await this.client
      .from('site_settings')
      .select('*')
      .order('key');
    
    if (error) throw error;
    return data;
  }

  async getSiteSetting(key: string) {
    const { data, error } = await this.client
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data;
  }

  async setSiteSetting(key: string, value: any, description?: string, category?: string) {
    const { data, error } = await this.client
      .from('site_settings')
      .upsert({
        key,
        value,
        description,
        category,
        last_modified: new Date().toISOString()
      }, { onConflict: 'key' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Export singleton instance
export const db = new DatabaseService();
