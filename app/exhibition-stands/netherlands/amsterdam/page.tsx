import React from 'react';
import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EnhancedCityPageClient from '@/components/EnhancedCityPageClient';

interface CityPageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; city: string }> }): Promise<Metadata> {
  const { country, city } = await params;
  
  try {
    console.log(`🔍 Generating metadata for: ${city}, ${country}`);
    
    // Simple metadata without preloadQuery to avoid issues
    const cityName = 'Amsterdam';
    const countryName = 'Netherlands';
    
    console.log(`✅ Metadata generated for: ${cityName}, ${countryName}`);

    return {
      title: `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`,
      description: `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services. Get quotes from verified contractors.`,
      keywords: `exhibition stands, ${cityName}, ${countryName}, builders, contractors, trade show displays, booth design`,
      openGraph: {
        title: `Exhibition Stand Builders in ${cityName}, ${countryName}`,
        description: `Professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays and booth design services.`,
        type: 'website',
      },
      alternates: {
        canonical: `/exhibition-stands/${country}/${city}`,
      },
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    return {
      title: 'Exhibition Stand Builders',
      description: 'Find professional exhibition stand builders worldwide.'
    };
  }
}

export default async function CityPage({ params }: CityPageProps) {
  const { country, city } = await params;
  console.log('🏙️ Loading city page:', { country, city });
  
  return (
    <div className="font-inter">
      <Navigation />
      <EnhancedCityPageClient 
        countrySlug={country}
        citySlug={city}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export async function generateStaticParams() {
  console.log('🚀 Generating static params for Amsterdam...');
  
  // Return static params for this specific city
  return [
    {
      country: 'netherlands',
      city: 'amsterdam'
    }
  ];
}
