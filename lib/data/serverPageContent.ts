import { PageContent } from './storage';

// Server-side function to fetch page content using only Supabase (no fs dependencies)
import { cache } from 'react';

export const getServerPageContent = cache(async (pageId: string): Promise<PageContent | null> => {
  const fetchFn = async () => {
    try {
      // This is a server-side function that can access Supabase directly
      const { getServerSupabase } = await import('@/lib/supabase');
      const sb = getServerSupabase();

      if (sb) {
        const result = await sb
          .from('page_contents')
          .select('content')
          .eq('id', pageId)
          .maybeSingle();

        if (result.data?.content) {
          return result.data.content;
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching page content on server:', error);
      return null;
    }
  };

  const { unstable_cache } = await import('next/cache');

  return unstable_cache(
    fetchFn,
    [`page-content-${pageId}`],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [`page-content-${pageId}`]
    }
  )();
});