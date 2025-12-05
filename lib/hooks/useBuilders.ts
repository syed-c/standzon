import { useState, useEffect } from 'react';

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
  gmb_place_id?: string;
  source?: string;
  imported_from_gmb?: boolean;
  imported_at?: string;
  last_updated?: string;
  created_at: string;
  updated_at: string;
}

export function useBuilders() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [totalBuilders, setTotalBuilders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Remove the useEffect that was causing the infinite loop
  // The page component will be responsible for calling fetchBuilders when needed

  const fetchBuilders = async (limit: number = 10, offset: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching builders from API...', { limit, offset });
      
      const response = await fetch(`/api/admin/builders?limit=${limit}&offset=${offset}`);
      const result = await response.json();
      
      if (result.success) {
        console.log('Fetched builders:', result.data.builders.length);
        setBuilders(result.data.builders);
        setTotalBuilders(result.data.total);
      } else {
        throw new Error(result.error || 'Failed to fetch builders');
      }
    } catch (err) {
      console.error('Error fetching builders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch builders');
    } finally {
      setLoading(false);
    }
  };

  const addBuilder = async (builderData: Partial<Builder>) => {
    try {
      const response = await fetch('/api/admin/builders', {
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
      setTotalBuilders(prev => prev + 1);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add builder');
      throw err;
    }
  };

  const updateBuilder = async (id: string, updates: Partial<Builder>) => {
    try {
      const response = await fetch(`/api/admin/builders?id=${id}`, {
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
      setBuilders(prev => prev.map(builder => builder.id === id ? { ...builder, ...data } : builder));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update builder');
      throw err;
    }
  };

  const deleteBuilder = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/builders?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete builder');
      }

      setBuilders(prev => prev.filter(builder => builder.id !== id));
      setTotalBuilders(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete builder');
      throw err;
    }
  };

  const refreshBuilders = async () => {
    // This will be handled by the page component
    // We'll expose the fetchBuilders function for the page to use
  };

  const getBuilder = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/builders?id=${id}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch builder');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch builder');
      throw err;
    }
  };

  return {
    builders,
    totalBuilders,
    loading,
    error,
    addBuilder,
    updateBuilder,
    deleteBuilder,
    refreshBuilders,
    getBuilder,
    fetchBuilders, // Expose fetchBuilders for the page component to use
  };
}