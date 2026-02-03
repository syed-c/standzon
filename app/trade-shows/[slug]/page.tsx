import React from 'react';
import { Metadata } from 'next';
import ExhibitionPage from '@/components/ExhibitionPage';
import { notFound } from 'next/navigation';
import { db } from '@/lib/supabase/database';
import { mapTradeShowDBToExhibition } from '@/lib/utils/tradeShowMapping';

interface TradeShowPageProps {
  params: {
    slug: string;
  };
}

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const dbTradeShows = await db.getTradeShows();
  return dbTradeShows.map((show: any) => ({
    slug: show.slug,
  }));
}

export async function generateMetadata({ params }: TradeShowPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const dbTradeShow = await db.getTradeShowBySlug(resolvedParams.slug);

  if (!dbTradeShow) {
    return {
      title: 'Trade Show Not Found | StandZone',
      description: 'The trade show you are looking for could not be found.'
    };
  }

  const exhibition = mapTradeShowDBToExhibition(dbTradeShow);

  return {
    title: `${exhibition.name} (${exhibition.year}) - Verified Booth Builders in ${exhibition.city} | StandZone`,
    description: dbTradeShow.seo_description || `Find verified exhibition stand builders for ${exhibition.name} in ${exhibition.city}, ${exhibition.country}. Get matched with top-rated contractors and receive free quotes for your booth design. ${exhibition.shortDescription}`,
    keywords: [
      exhibition.name,
      exhibition.city,
      exhibition.country,
      exhibition.industry?.name || 'General Exhibition',
      ...(dbTradeShow.seo_keywords || exhibition.tags),
      'exhibition booth builders',
      'trade show stands',
      'booth construction',
      'exhibition stands',
      'event planners',
      'booth design'
    ],
    openGraph: {
      title: exhibition.name,
      description: exhibition.shortDescription,
      type: 'website',
      locale: 'en_US',
      url: `https://standszone.com/trade-shows/${resolvedParams.slug}`,
      siteName: 'StandZone',
      images: dbTradeShow.hero_image_url ? [{ url: dbTradeShow.hero_image_url }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: exhibition.name,
      description: exhibition.shortDescription,
      images: dbTradeShow.hero_image_url ? [dbTradeShow.hero_image_url] : []
    },
    alternates: {
      canonical: dbTradeShow.canonical_url || `https://standszone.com/trade-shows/${resolvedParams.slug}`
    }
  };
}

export default async function TradeShowPage({ params }: TradeShowPageProps) {
  const resolvedParams = await params;
  const dbTradeShow = await db.getTradeShowBySlug(resolvedParams.slug);

  if (!dbTradeShow) {
    notFound();
  }

  // ✅ FIX: Soft 404 protection - Ensure trade show has critical data
  if (!dbTradeShow.city || !dbTradeShow.name) {
    console.warn(`⚠️ Soft 404: Trade show ${resolvedParams.slug} missing critical data.`);
    notFound();
  }

  const exhibition = mapTradeShowDBToExhibition(dbTradeShow);

  console.log(`🎪 Loading dynamic trade show page from Supabase for: ${resolvedParams.slug} - ${exhibition.name}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <ExhibitionPage exhibitionSlug={resolvedParams.slug} initialExhibition={exhibition} />
    </div>
  );
}