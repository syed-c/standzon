import { redirect } from 'next/navigation';
import { exhibitions } from '@/lib/data/exhibitions';
import { tradeShows } from '@/lib/data/tradeShows';

interface ExhibitionPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all exhibitions and trade shows for proper redirects
export async function generateStaticParams() {
  const exhibitionParams = exhibitions.map((exhibition) => ({
    slug: exhibition.slug
  }));
  
  const tradeShowParams = tradeShows.map((show) => ({
    slug: show.slug
  }));

  return [...exhibitionParams, ...tradeShowParams];
}

export default async function ExhibitionDetailPage({ params }: ExhibitionPageProps) {
  const resolvedParams = await params;
  
  console.log(`🔄 Redirecting /exhibitions/${resolvedParams.slug} to /trade-shows/${resolvedParams.slug}`);
  
  // 301 redirect all /exhibitions/[slug] to /trade-shows/[slug]
  redirect(`/trade-shows/${resolvedParams.slug}`);
}