import { useState, useEffect } from 'react';
import { getBuilders } from '@/lib/supabase';

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
        const data = await getBuilders();
        setBuilders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch builders');
      } finally {
        setLoading(false);
      }
    }

    fetchBuilders();
  }, []);

  const addBuilder = async (builderData: Partial<Builder>) => {
    try {
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

  const updateBuilder = async (id: string, updates: Partial<Builder>) => {
    try {
      const response = await fetch(`/api/builders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update builder');
      }

      const { data } = await response.json();
      setBuilders(prev => prev.map(builder => builder.id === id ? data : builder));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update builder');
      throw err;
    }
  };

  const deleteBuilder = async (id: string) => {
    try {
      const response = await fetch(`/api/builders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete builder');
      }

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
      const data = await getBuilders();
      setBuilders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh builders');
    } finally {
      setLoading(false);
    }
  };

  return {
    builders,
    loading,
    error,
    addBuilder,
    updateBuilder,
    deleteBuilder,
    refreshBuilders,
  };
}
