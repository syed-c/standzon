import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EnhancedCountryPageClient from '../[country]/EnhancedCountryPageClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in UK | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across United Kingdom. Custom trade show displays, booth design, and comprehensive exhibition services in London, Birmingham, Manchester, and more.`,
    keywords: [`exhibition stands UK`, `booth builders UK`, `trade show displays UK`, `London exhibition builders`, `Birmingham booth design`, `UK exhibitions`],
    openGraph: {
      title: `Exhibition Stand Builders in UK`,
      description: `Professional exhibition stand builders across United Kingdom. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in UK`,
      description: `Professional exhibition stand builders across United Kingdom. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/united-kingdom`,
    },
  };
}

export default async function UnitedKingdomPage() {
  console.log('🇬🇧 Loading United Kingdom page...');
  
  try {
    // Preload country data for SSR
    const preloadedCountryData = await preloadQuery(api.locations.getCountryBySlug, { slug: 'united-kingdom' });
    
    if (!preloadedCountryData) {
      console.log('❌ United Kingdom not found in database');
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">United Kingdom Not Found</h1>
              <p className="text-gray-600 mb-8">United Kingdom data is not available yet. We're working on adding it.</p>
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

    console.log('✅ Found United Kingdom data:', preloadedCountryData.countryName);
    console.log('📊 Loaded builders:', preloadedBuildersData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        <EnhancedCountryPageClient 
          countrySlug="united-kingdom"
          preloadedCountryData={preloadedCountryData}
          preloadedBuildersData={preloadedBuildersData}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading United Kingdom page:', error);
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