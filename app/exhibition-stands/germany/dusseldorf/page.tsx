import { Metadata } from 'next';
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { EnhancedCityPage } from '@/components/EnhancedCityPage';

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
    
    // Preload city data for metadata
    const cityData = await preloadQuery(api.locations.getCityBySlug, { 
      countrySlug: country, 
      citySlug: city 
    });
    
    if (!cityData || !cityData.country) {
      console.log(`❌ City or country data not found for metadata: ${city}, ${country}`);
      return {
        title: 'City Not Found',
        description: 'The requested city could not be found.'
      };
    }

    const cityName = cityData.cityName;
    const countryName = cityData.country.countryName;
    
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
  
  try {
    // Preload city data for SSR
    const preloadedCityData = await preloadQuery(api.locations.getCityBySlug, { 
      countrySlug: country, 
      citySlug: city 
    });
    
    if (!preloadedCityData || !preloadedCityData.country) {
      console.log('❌ City or country data not found:', { country, city });
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">City Not Found</h1>
              <p className="text-gray-600 mb-8">The requested city could not be found.</p>
            </div>
          </div>
          <Footer />
          <WhatsAppFloat />
        </div>
      );
    }

    // Preload builders data for this city
    const preloadedBuildersData = await preloadQuery(api.locations.getBuildersForLocation, { 
      country: preloadedCityData.country.countryName,
      city: preloadedCityData.cityName
    });

    console.log('✅ Found city data:', preloadedCityData.cityName, preloadedCityData.country.countryName);
    console.log('📊 Loaded builders:', preloadedBuildersData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        <EnhancedCityPage 
          countrySlug={country}
          citySlug={city}
          preloadedCityData={preloadedCityData}
          preloadedBuildersData={preloadedBuildersData}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading city page:', error);
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
  console.log('🚀 Generating static params for Dusseldorf...');
  
  // Return static params for this specific city
  return [
    {
      country: 'germany',
      city: 'dusseldorf'
    }
  ];
}
