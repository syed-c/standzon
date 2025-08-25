import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EnhancedCountryPageClient from './EnhancedCountryPageClient';

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  
  try {
    // Preload country data for metadata
    const countryData = await preloadQuery(api.locations.getCountryBySlug, { slug: country });
    
    if (!countryData) {
      return {
        title: 'Country Not Found',
        description: 'The requested country could not be found.'
      };
    }

    const countryName = countryData.countryName;

    return {
      title: `Exhibition Stand Builders in ${countryName} | Professional Trade Show Displays`,
      description: `Find professional exhibition stand builders across ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services. Connect with verified contractors in major cities.`,
      keywords: [`exhibition stands ${countryName}`, `booth builders ${countryName}`, `trade show displays ${countryName}`],
      openGraph: {
        title: `Exhibition Stand Builders in ${countryName}`,
        description: `Professional exhibition stand builders across ${countryName}. Custom trade show displays and booth design services.`,
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Exhibition Stand Builders in ${countryName}`,
        description: `Professional exhibition stand builders across ${countryName}. Custom trade show displays and booth design services.`,
      },
      alternates: {
        canonical: `/exhibition-stands/${country}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Exhibition Stand Builders',
      description: 'Find professional exhibition stand builders worldwide.'
    };
  }
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  console.log('🌍 Loading country page:', { country });
  
  try {
    // Preload country data for SSR
    const preloadedCountryData = await preloadQuery(api.locations.getCountryBySlug, { slug: country });
    
    if (!preloadedCountryData) {
      console.log('❌ Country not found:', { country });
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Country Not Found</h1>
              <p className="text-gray-600 mb-8">The requested country could not be found.</p>
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

    console.log('✅ Found country data:', preloadedCountryData.countryName);
    console.log('📊 Loaded builders:', preloadedBuildersData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        <EnhancedCountryPageClient 
          countrySlug={country}
          preloadedCountryData={preloadedCountryData}
          preloadedBuildersData={preloadedBuildersData}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading country page:', error);
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

export async function generateStaticParams() {
  console.log('🚀 Generating static params for all countries from comprehensive global dataset...');
  
  try {
    // Get all countries from comprehensive dataset
    const allCountries = await preloadQuery(api.locations.getAllCountries);
    
    // Check if allCountries is valid and is an array
    if (!allCountries || !Array.isArray(allCountries)) {
      console.warn('⚠️ No countries data available or invalid format, returning empty params');
      return [];
    }
    
    // Generate params for all countries in the comprehensive dataset
    const params = allCountries.map((country: any) => {
      return {
        country: country.countrySlug
      };
    });
    
    console.log(`📄 Generated ${params.length} static country pages from comprehensive global dataset`);
    console.log('🔍 Sample countries:', params.slice(0, 10).map(p => p.country));
    
    return params;
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    // Return empty array to prevent build failure
    return [];
  }
}


