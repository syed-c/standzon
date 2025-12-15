/**
 * Supabase Database Client - Primary Database Interface
 * 
 * This replaces all other database connections (Convex, Prisma, file storage)
 * and provides a unified interface to Supabase as the single source of truth.
 */

import { supabase, supabaseAdmin } from '@/lib/supabase/client';

// Database service class
export class DatabaseService {
  private client: any = null;

  constructor() {
    // Use admin client if available (bypasses RLS), otherwise use regular client
    this.client = supabaseAdmin || supabase;
    if (!this.client) {
      console.warn('Supabase admin client not available, some admin features may not work properly.');
    }
  }

  // Getter for accessing the underlying Supabase client
  getClient() {
    return this.client;
  }

  // Proxy methods for common Supabase operations
  from(table: string) {
    return this.client.from(table);
  }

  rpc(functionName: string, params?: any) {
    return this.client.rpc(functionName, params);
  }

  // Users
  async getUsers() {
    if (!this.client) {
      console.warn('Supabase client not initialized');
      return [];
    }
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data;
  }

  async getUserById(id: string) {
    if (!this.client) {
      console.warn('Supabase client not initialized');
      return null;
    }
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
    return data;
  }

  async createUser(user: any) {
    if (!this.client) {
      console.warn('Supabase client not initialized');
      return null;
    }
    const { data, error } = await this.client
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    return data;
  }

  async updateUser(id: string, updates: any) {
    if (!this.client) throw new Error('Supabase client not initialized');
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
    if (!this.client) throw new Error('Supabase client not initialized');
    
    // Try 'builder_profiles' table first
    const { data: data1, error: error1 } = await this.client
      .from('builder_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error1 && data1 && data1.length > 0) {
      console.log('Found builders in builder_profiles:', data1.length);
      return data1;
    }
    
    console.log('No data in builder_profiles table or error occurred, trying builders table...');
    if (error1) console.log('builder_profiles error:', error1.message);
    
    // Fallback to 'builders' table
    const { data: data2, error: error2 } = await this.client
      .from('builders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error2 && data2) {
      console.log('Found builders in builders:', data2.length);
      return data2;
    }
    
    console.log('No builders found in either table');
    if (error1) console.error('Error from builder_profiles:', error1.message);
    if (error2) console.error('Error from builders:', error2.message);
    
    // Return empty array if no data found in either table
    return [];
  }

  async getBuilderBySlug(slug: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    // Try 'builder_profiles' table first
    const { data: data1, error: error1 } = await this.client
      .from('builder_profiles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (!error1 && data1) {
      return data1;
    }
    
    // Fallback to 'builders' table
    const { data: data2, error: error2 } = await this.client
      .from('builders')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error2) throw error1 || error2;
    return data2;
  }

  async createBuilder(builder: any) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    // Try 'builder_profiles' table first
    const { data: data1, error: error1 } = await this.client
      .from('builder_profiles')
      .insert(builder)
      .select()
      .single();
    
    if (!error1) {
      return data1;
    }
    
    // Fallback to 'builders' table
    const { data: data2, error: error2 } = await this.client
      .from('builders')
      .insert(builder)
      .select()
      .single();
    
    if (error2) throw error1 || error2;
    return data2;
  }

  async updateBuilder(id: string, updates: any) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    // Try 'builder_profiles' table first
    const { data: data1, error: error1 } = await this.client
      .from('builder_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (!error1) {
      return data1;
    }
    
    // Fallback to 'builders' table
    const { data: data2, error: error2 } = await this.client
      .from('builders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error2) throw error1 || error2;
    return data2;
  }

  async deleteBuilder(id: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
    
    console.log('Deleting builder from DatabaseService:', id);
    
    // Try 'builder_profiles' table first
    const { error: error1 } = await this.client
      .from('builder_profiles')
      .delete()
      .eq('id', id);
    
    if (!error1) {
      console.log('Deleted builder from builder_profiles via DatabaseService');
      return true;
    }
    
    // Fallback to 'builders' table
    const { error: error2 } = await this.client
      .from('builders')
      .delete()
      .eq('id', id);
    
    if (!error2) {
      console.log('Deleted builder from builders via DatabaseService');
      return true;
    }
    
    console.error('Failed to delete builder from both tables via DatabaseService');
    if (error1) console.error('Error from builder_profiles:', error1.message);
    if (error2) console.error('Error from builders:', error2.message);
    
    throw error1 || error2;
  }

  // Countries
  async getCountries() {
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('countries')
      .select('*')
      .eq('active', true)
      .order('country_name');
    
    if (error) throw error;
    return data;
  }

  async getCountryByCode(code: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
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
    if (!this.client) throw new Error('Supabase client not initialized');
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
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('exhibitions')
      .select('*')
      .eq('active', true)
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getExhibitionBySlug(slug: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
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
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createLead(lead: any) {
    if (!this.client) {
      const errorMsg = 'Supabase client not initialized. Please check environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('💾 Inserting lead into Supabase:', {
      company: lead.company_name,
      email: lead.contact_email,
      city: lead.city,
      country: lead.country
    });
    
    const { data, error } = await this.client
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }
    
    console.log('✅ Lead inserted successfully with ID:', data.id);
    return data;
  }

  // Site Settings
  async getSiteSettings() {
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('site_settings')
      .select('*')
      .order('key');
    
    if (error) throw error;
    return data;
  }

  async getSiteSetting(key: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
    const { data, error } = await this.client
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) throw error;
    return data;
  }

  async setSiteSetting(key: string, value: any, description?: string, category?: string) {
    if (!this.client) throw new Error('Supabase client not initialized');
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