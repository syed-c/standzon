import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EnhancedCountryPageClient from '../[country]/EnhancedCountryPageClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Italy | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Italy. Custom trade show displays, booth design, and comprehensive exhibition services in Milan, Rome, Bologna, Venice, and more.`,
    keywords: [`exhibition stands Italy`, `booth builders Italy`, `trade show displays Italy`, `Milan exhibition builders`, `Rome booth design`, `Italian exhibitions`],
    openGraph: {
      title: `Exhibition Stand Builders in Italy`,
      description: `Professional exhibition stand builders across Italy. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Italy`,
      description: `Professional exhibition stand builders across Italy. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/italy`,
    },
  };
}

export default async function ItalyPage() {
  console.log('🇮🇹 Loading Italy page...');
  
  try {
    // Preload country data for SSR
    const preloadedCountryData = await preloadQuery(api.locations.getCountryBySlug, { slug: 'italy' });
    
    if (!preloadedCountryData) {
      console.log('❌ Italy not found in database');
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Italy Not Found</h1>
              <p className="text-gray-600 mb-8">Italy data is not available yet. We're working on adding it.</p>
            </div>
          </div>
          <Footer />
          <WhatsAppFloat />
        </div>
      );
    }

    // Preload builders data for SSR
    const preloadedBuildersData = await preloadQuery(api.locations.getBuildersForLocation, { 
      country: preloadedCountryData.countryName,
      limit: 12
    });

    console.log('✅ Found Italy data:', preloadedCountryData.countryName);
    console.log('📊 Loaded builders:', preloadedBuildersData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        <EnhancedCountryPageClient 
          countrySlug="italy"
          preloadedCountryData={preloadedCountryData}
          preloadedBuildersData={preloadedBuildersData}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading Italy page:', error);
    return (
      <div className="font-inter">
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
            <p className="text-gray-600 mb-8">There was an error loading this page. Please try again later.</p>
          </div>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }
}