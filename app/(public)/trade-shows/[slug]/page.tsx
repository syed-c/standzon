import React from 'react';
import { Metadata } from 'next';
import ExhibitionPage from '@/components/client/ExhibitionPage';
import { notFound } from 'next/navigation';
import { exhibitions } from '@/lib/data/exhibitions';
import { tradeShows } from '@/lib/data/tradeShows';

interface TradeShowPageProps {
  params: {
    slug: string;
  };
}

// Unified function to get exhibition/trade show data
const getExhibitionData = (slug: string) => {
  // First check in comprehensive exhibitions database
  const exhibition = exhibitions.find(ex => ex.slug === slug);
  if (exhibition) {
    return exhibition;
  }

  // If not found, check in tradeShows and convert to exhibition format
  const tradeShow = tradeShows.find(show => show.slug === slug);
  if (tradeShow) {
    // Convert tradeShow to exhibition format for consistency
    return {
      id: tradeShow.id,
      name: tradeShow.name,
      slug: tradeShow.slug,
      description: tradeShow.description,
      shortDescription: tradeShow.description,
      startDate: tradeShow.startDate,
      endDate: tradeShow.endDate,
      city: tradeShow.city,
      country: tradeShow.country,
      countryCode: tradeShow.countryCode,
      venue: {
        name: tradeShow.venue.name,
        address: tradeShow.venue.address,
        totalSpace: tradeShow.venue.totalSpace,
        totalHalls: tradeShow.venue.hallCount,
        facilities: tradeShow.venue.facilities,
        publicTransport: tradeShow.venue.transportAccess ? [tradeShow.venue.transportAccess] : [],
        parkingSpaces: tradeShow.venue.parkingSpaces,
        rating: 4.5,
        nearestAirport: 'International Airport',
        distanceFromAirport: '15km'
      },
      organizer: {
        name: tradeShow.organizerName,
        email: tradeShow.organizerContact,
        website: tradeShow.website,
        headquarters: tradeShow.city,
        establishedYear: 2000,
        rating: tradeShow.previousEditionStats?.feedback || 4.2
      },
      industry: tradeShow.industries[0] || { name: 'General', slug: 'general' },
      expectedAttendees: tradeShow.expectedVisitors,
      expectedExhibitors: tradeShow.expectedExhibitors,
      totalSpace: tradeShow.standSpace,
      year: tradeShow.year,
      status: new Date(tradeShow.startDate) > new Date() ? 'Upcoming' : 'Completed',
      featured: tradeShow.significance === 'Major',
      trending: false,
      tags: [tradeShow.industries[0]?.name || 'Trade Show'],
      keyFeatures: tradeShow.keyFeatures || [],
      targetAudience: tradeShow.targetAudience || [],
      website: tradeShow.website,
      pricing: {
        standardBooth: {
          min: tradeShow.costs.standRental.min,
          max: tradeShow.costs.standRental.max,
          currency: tradeShow.costs.standRental.currency,
          unit: tradeShow.costs.standRental.unit
        },
        premiumBooth: {
          min: tradeShow.costs.standRental.max * 1.5,
          max: tradeShow.costs.standRental.max * 2,
          currency: tradeShow.costs.standRental.currency,
          unit: tradeShow.costs.standRental.unit
        },
        cornerBooth: {
          min: tradeShow.costs.standRental.max * 1.2,
          max: tradeShow.costs.standRental.max * 1.8,
          currency: tradeShow.costs.standRental.currency,
          unit: tradeShow.costs.standRental.unit
        },
        earlyBirdDiscount: 10
      },
      registrationInfo: {
        visitorRegistration: {
          fee: 0,
          currency: 'USD',
          opens: tradeShow.startDate
        },
        exhibitorRegistration: {
          fee: 500,
          currency: tradeShow.costs.standRental.currency,
          closes: tradeShow.startDate
        }
      },
      sustainability: {
        carbonNeutral: true,
        wasteReduction: true,
        digitalFirst: true,
        sustainableCatering: true,
        publicTransportIncentives: true,
        environmentalGoals: ['Carbon Neutral', 'Zero Waste']
      },
      networkingOpportunities: tradeShow.networkingOpportunities || [],
      specialEvents: []
    };
  }

  return null;
};

export async function generateStaticParams() {
  // Generate params for both exhibitions and trade shows
  const exhibitionParams = exhibitions.map((exhibition) => ({
    slug: exhibition.slug
  }));
  
  const tradeShowParams = tradeShows.map((show) => ({
    slug: show.slug
  }));

  return [...exhibitionParams, ...tradeShowParams];
}

export async function generateMetadata({ params }: TradeShowPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const exhibition = getExhibitionData(resolvedParams.slug);

  if (!exhibition) {
    return {
      title: 'Exhibition Not Found - ExhibitBay',
      description: 'The exhibition you are looking for could not be found.'
    };
  }

  return {
    title: `${exhibition.name} | ExhibitBay - Find Exhibition Booth Builders`,
    description: `${exhibition.description}. Find verified booth builders and event planners for ${exhibition.name} in ${exhibition.city}, ${exhibition.country}. Get quotes from top exhibition stand contractors.`,
    keywords: [
      exhibition.name,
      exhibition.city,
      exhibition.country,
      exhibition.industry?.name || 'General Exhibition',
      ...exhibition.tags,
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
      siteName: 'StandsZone'
    },
    twitter: {
      card: 'summary_large_image',
      title: exhibition.name,
      description: exhibition.shortDescription
    },
    alternates: {
      canonical: `https://standszone.com/trade-shows/${resolvedParams.slug}`
    }
  };
}

export default async function TradeShowPage({ params }: TradeShowPageProps) {
  const resolvedParams = await params;
  const exhibition = getExhibitionData(resolvedParams.slug);

  // If exhibition doesn't exist, show 404
  if (!exhibition) {
    notFound();
  }

  console.log(`🎪 Loading unified exhibition page for: ${resolvedParams.slug} - ${exhibition.name}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <ExhibitionPage exhibitionSlug={resolvedParams.slug} />
    </div>
  );
}