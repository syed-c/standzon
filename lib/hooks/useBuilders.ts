import { useState, useEffect } from 'react';
import { getAllBuilders, updateBuilder, getBuilderById } from '@/lib/supabase/builders';
import { db } from '@/lib/supabase/database';

export interface Builder {
  id: string;
  company_name: string;
  slug: string;
  primary_email: string;
  phone?: string;
  website?: string;
  headquarters_city?: string;
  headquarters_country?: string;
  headquarters_country_code?: string;
  headquarters_address?: string;
  contact_person?: string;
  position?: string;
  company_description?: string;
  team_size?: number;
  projects_completed?: number;
  rating?: number;
  response_time?: string;
  languages?: string[];
  verified?: boolean;
  premium_member?: boolean;
  claimed?: boolean;
  claim_status?: string;
  basic_stand_min?: number;
  basic_stand_max?: number;
  custom_stand_min?: number;
  custom_stand_max?: number;
  premium_stand_min?: number;
  premium_stand_max?: number;
  average_project?: number;
  currency?: string;
  created_at: string;
  updated_at: string;
}

export function useBuilders() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBuilders() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching builders from Supabase...');
        const data = await getAllBuilders();
        console.log('Fetched builders:', data?.length || 0);
        setBuilders(data);
      } catch (err) {
        console.error('Error fetching builders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch builders');
      } finally {
        setLoading(false);
      }
    }

    fetchBuilders();
  }, []);

  const addBuilder = async (builderData: Partial<Builder>) => {
    try {
      // This would need to be implemented in the builders API
      const response = await fetch('/api/builders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(builderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add builder');
      }

      const { data } = await response.json();
      setBuilders(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add builder');
      throw err;
    }
  };

  const updateBuilderHook = async (id: string, updates: Partial<Builder>) => {
    try {
      // Remove fields that shouldn't be updated directly
      const { id: _, created_at, ...updateData } = updates;
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      const data = await updateBuilder(id, dataWithTimestamp);
      setBuilders(prev => prev.map(builder => builder.id === id ? { ...builder, ...data } : builder));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update builder');
      throw err;
    }
  };

  const deleteBuilderHook = async (id: string) => {
    try {
      await db.deleteBuilder(id);
      setBuilders(prev => prev.filter(builder => builder.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete builder');
      throw err;
    }
  };

  const refreshBuilders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Refreshing builders from Supabase...');
      const data = await getAllBuilders();
      console.log('Refreshed builders:', data?.length || 0);
      setBuilders(data);
    } catch (err) {
      console.error('Error refreshing builders:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh builders');
    } finally {
      setLoading(false);
    }
  };

  const getBuilder = async (id: string) => {
    try {
      return await getBuilderById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch builder');
      throw err;
    }
  };

  return {
    builders,
    loading,
    error,
    addBuilder,
    updateBuilder: updateBuilderHook,
    deleteBuilder: deleteBuilderHook,
    refreshBuilders,
    getBuilder,
  };
}