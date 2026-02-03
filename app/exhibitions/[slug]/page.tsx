import { redirect } from 'next/navigation';
import { db } from '@/lib/supabase/database';

interface ExhibitionPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all trade shows from Supabase for proper redirects
export async function generateStaticParams() {
  const dbTradeShows = await db.getTradeShows();
  return dbTradeShows.map((show: any) => ({
    slug: show.slug
  }));
}

export default async function ExhibitionDetailPage({ params }: ExhibitionPageProps) {
  const resolvedParams = await params;

  console.log(`🔄 Redirecting /exhibitions/${resolvedParams.slug} to /trade-shows/${resolvedParams.slug}`);

  // 301 redirect all /exhibitions/[slug] to /trade-shows/[slug]
  redirect(`/trade-shows/${resolvedParams.slug}`);
}