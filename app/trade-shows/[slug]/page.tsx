import React from 'react';
import { Metadata } from 'next';
import ExhibitionPage from '@/components/ExhibitionPage';
import { notFound } from 'next/navigation';
import { db } from '@/lib/supabase/database';
import { mapTradeShowDBToExhibition } from '@/lib/utils/tradeShowMapping';
import { handleSSRError, withSSRGuard } from '@/lib/ssr-error-handler';
import { getFallbackTradeShowData } from '@/lib/fallback-data';

interface TradeShowPageProps {
  params: {
    slug: string;
  };
}

// ISR: Revalidate every hour
export const revalidate = 3600;

// Safe static params generation
export async function generateStaticParams() {
  try {
    const dbTradeShows = await db.getTradeShows();
    return (dbTradeShows || []).map((show: any) => ({
      slug: show.slug,
    }));
  } catch (error) {
    console.error('❌ generateStaticParams error:', error);
    return []; // Safe fallback
  }
}

// Crash-proof metadata generation
export async function generateMetadata({ params }: TradeShowPageProps): Promise<Metadata> {
  return withSSRGuard(async () => {
    const resolvedParams = await params;
    
    // Validate params first
    if (!resolvedParams?.slug || typeof resolvedParams.slug !== 'string') {
      console.warn('⚠️ Invalid slug parameter');
      notFound();
    }

    // Safe Supabase fetch with timeout
    const dbTradeShow = await handleSSRError(
      () => db.getTradeShowBySlug(resolvedParams.slug),
      `Trade show fetch failed for slug: ${resolvedParams.slug}`
    );

    // Immediate 404 for non-existent trade shows
    if (!dbTradeShow) {
      console.warn(`⚠️ Trade show not found: ${resolvedParams.slug}`);
      notFound();
    }

    // Validate critical data before generating metadata
    const criticalFields = ['location_city', 'title', 'location_country', 'start_date', 'end_date'];
    const missingFields = criticalFields.filter(field => !dbTradeShow[field as keyof typeof dbTradeShow]);
    
    if (missingFields.length > 0) {
      console.warn(`⚠️ Soft 404 metadata: Trade show ${resolvedParams.slug} missing critical fields:`, missingFields);
      notFound();
    }

    // Validate data quality
    const hasMeaningfulContent = 
      (dbTradeShow.description && dbTradeShow.description.length > 100) ||
      (dbTradeShow.seo_description && dbTradeShow.seo_description.length > 50) ||
      dbTradeShow.hero_image_url;

    if (!hasMeaningfulContent) {
      console.warn(`⚠️ Soft 404: Trade show ${resolvedParams.slug} has insufficient content.`);
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
  }, {
    fallbackMetadata: {
      title: 'Trade Show - StandZone',
      description: 'Find verified exhibition stand builders for trade shows worldwide.',
    }
  });
}

// Crash-proof page component
export default async function TradeShowPage({ params }: TradeShowPageProps) {
  return withSSRGuard(async () => {
    const resolvedParams = await params;
    
    // Validate params
    if (!resolvedParams?.slug || typeof resolvedParams.slug !== 'string') {
      console.warn('⚠️ Invalid slug parameter in page component');
      notFound();
    }

    // Safe Supabase fetch
    const dbTradeShow = await handleSSRError(
      () => db.getTradeShowBySlug(resolvedParams.slug),
      `Trade show page fetch failed for slug: ${resolvedParams.slug}`
    );

    // Immediate 404 for non-existent trade shows
    if (!dbTradeShow) {
      console.warn(`⚠️ Trade show not found in page component: ${resolvedParams.slug}`);
      notFound();
    }

    // Comprehensive data validation
    const criticalFields = [
      'location_city',
      'title',
      'location_country',
      'start_date',
      'end_date'
    ];

    const missingFields = criticalFields.filter(field => !dbTradeShow[field as keyof typeof dbTradeShow]);
    
    if (missingFields.length > 0) {
      console.warn(`⚠️ Soft 404: Trade show ${resolvedParams.slug} missing critical fields in page:`, missingFields);
      notFound();
    }

    // Validate data quality
    const hasMeaningfulContent = 
      (dbTradeShow.description && dbTradeShow.description.length > 100) ||
      (dbTradeShow.seo_description && dbTradeShow.seo_description.length > 50) ||
      dbTradeShow.hero_image_url;

    if (!hasMeaningfulContent) {
      console.warn(`⚠️ Soft 404: Trade show ${resolvedParams.slug} has insufficient content in page.`);
      notFound();
    }

    const exhibition = mapTradeShowDBToExhibition(dbTradeShow);

    console.log(`🎪 Loading dynamic trade show page from Supabase for: ${resolvedParams.slug} - ${exhibition.name}`);

    // Safe JSON-LD construction
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ExhibitionEvent',
      name: exhibition.name || 'Trade Show',
      description: exhibition.description || exhibition.shortDescription || '',
      startDate: exhibition.startDate || '',
      endDate: exhibition.endDate || '',
      location: {
        '@type': 'Place',
        name: exhibition.venue?.name || 'Exhibition Venue',
        address: {
          '@type': 'PostalAddress',
          addressLocality: exhibition.city || 'Unknown City',
          addressCountry: exhibition.country || 'Unknown Country'
        }
      },
      organizer: {
        '@type': 'Organization',
        name: exhibition.organizer?.name || 'Event Organizer',
        url: exhibition.organizer?.website || ''
      },
      image: exhibition.images || [],
      offers: {
        '@type': 'Offer',
        url: exhibition.website || '',
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
  }, {
    fallbackComponent: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trade Show Information</h1>
          <p className="text-gray-600">This trade show page is temporarily unavailable.</p>
        </div>
      </div>
    )
  });
}