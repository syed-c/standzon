import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EnhancedCityPageClient from '../../[country]/[city]/EnhancedCityPageClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Barcelona, Spain | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders in Barcelona, Spain. Custom trade show displays, booth design, and comprehensive exhibition services. Connect with verified contractors in Barcelona.`,
    keywords: [`exhibition stands Barcelona`, `booth builders Barcelona Spain`, `trade show displays Barcelona`, `Barcelona exhibition builders`, `Fira de Barcelona stands`],
    openGraph: {
      title: `Exhibition Stand Builders in Barcelona, Spain`,
      description: `Professional exhibition stand builders in Barcelona, Spain. Custom trade show displays and booth design services.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Exhibition Stand Builders in Barcelona, Spain`,
      description: `Professional exhibition stand builders in Barcelona, Spain. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/spain/barcelona`,
    },
  };
}

export default async function BarcelonaPage() {
  console.log('🇪🇸 Loading Barcelona, Spain page...');
  
  try {
    // Preload city data for SSR
    const preloadedCityData = await preloadQuery(api.locations.getCityBySlug, { 
      countrySlug: 'spain', 
      citySlug: 'barcelona' 
    });
    
    if (!preloadedCityData) {
      console.log('❌ Barcelona not found in database');
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Barcelona Not Found</h1>
              <p className="text-gray-600 mb-8">Barcelona data is not available yet. We're working on adding it.</p>
            </div>
          </div>
          <Footer />
          <WhatsAppFloat />
        </div>
      );
    }

    // Preload builders data for SSR
    const preloadedBuildersData = await preloadQuery(api.locations.getBuildersForLocation, { 
      country: preloadedCityData.country.countryName,
      city: preloadedCityData.cityName
    });

    console.log('✅ Found Barcelona data:', preloadedCityData.cityName);
    console.log('📊 Loaded builders:', preloadedBuildersData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        <EnhancedCityPageClient 
          countrySlug="spain"
          citySlug="barcelona"
          preloadedCityData={preloadedCityData}
          preloadedBuildersData={preloadedBuildersData}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading Barcelona page:', error);
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