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

  // ✅ FIX #1: Return 404 metadata for invalid trade shows
  if (!dbTradeShow) {
    notFound();
  }

  // ✅ FIX #2: Validate critical data before generating metadata
  if (!dbTradeShow.location_city || !dbTradeShow.title) {
    console.warn(`⚠️ Soft 404 metadata: Trade show ${resolvedParams.slug} missing critical data.`);
    notFound();
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

  // ✅ FIX #3: Immediate 404 for non-existent trade shows
  if (!dbTradeShow) {
    console.warn(`⚠️ Trade show not found: ${resolvedParams.slug}`);
    notFound();
  }

  // ✅ FIX #4: Comprehensive data validation to prevent Soft 404
  const criticalFields = [
    'location_city',
    'title',
    'location_country',
    'start_date',
    'end_date'
  ];

  const missingFields = criticalFields.filter(field => !dbTradeShow[field as keyof typeof dbTradeShow]);
  
  if (missingFields.length > 0) {
    console.warn(`⚠️ Soft 404: Trade show ${resolvedParams.slug} missing critical fields:`, missingFields);
    notFound();
  }

  // ✅ FIX #5: Validate data quality - check for placeholder/minimal content
  const hasMeaningfulContent = 
    (dbTradeShow.description && dbTradeShow.description.length > 100) ||
    (dbTradeShow.seo_description && dbTradeShow.seo_description.length > 50) ||
    dbTradeShow.hero_image_url;

  if (!hasMeaningfulContent) {
    console.warn(`⚠️ Soft 404: Trade show ${resolvedParams.slug} has insufficient content.`);
    notFound();
  }

  const exhibition = mapTradeShowDBToExhibition(dbTradeShow);

  console.log(`🎪 Loading dynamic trade show page from Supabase for: ${resolvedParams.slug} - ${exhibition.name}`);

  // Construct JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ExhibitionEvent',
    name: exhibition.name,
    description: exhibition.description,
    startDate: exhibition.startDate,
    endDate: exhibition.endDate,
    location: {
      '@type': 'Place',
      name: exhibition.venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: exhibition.city,
        addressCountry: exhibition.country
      }
    },
    organizer: {
      '@type': 'Organization',
      name: exhibition.organizer.name,
      url: exhibition.organizer.website
    },
    image: exhibition.images,
    offers: {
      '@type': 'Offer',
      url: exhibition.website,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExhibitionPage exhibitionSlug={resolvedParams.slug} initialExhibition={exhibition} />
    </div>
  );
}