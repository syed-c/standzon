import { redirect } from 'next/navigation';
import { db } from '@/lib/supabase/database';

interface ExhibitionPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all trade shows from Supabase for proper redirects
export async function generateStaticParams() {
  try {
    // During build time, environment variables might not be available or database might be unreachable
    // Only attempt to fetch data if we're not in build phase or if database is properly configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('⚠️ Supabase not configured, skipping static generation');
      return [];
    }
    
    const dbTradeShows = await db.getTradeShows();
    if (!dbTradeShows || dbTradeShows.length === 0) {
      console.warn('⚠️ No trade shows found, returning empty params');
      return [];
    }
    return dbTradeShows.map((show: any) => ({
      slug: show.slug
    }));
  } catch (error) {
    console.error('❌ generateStaticParams error:', error);
    return []; // Safe fallback
  }
}

export default async function ExhibitionDetailPage({ params }: ExhibitionPageProps) {
  const resolvedParams = await params;

  console.log(`🔄 Redirecting /exhibitions/${resolvedParams.slug} to /trade-shows/${resolvedParams.slug}`);

  // 301 redirect all /exhibitions/[slug] to /trade-shows/[slug]
  redirect(`/trade-shows/${resolvedParams.slug}`);
}