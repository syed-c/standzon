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
  try {
    const resolvedParams = await params;
    const { country, city } = resolvedParams;
    
    // Simple metadata without preloadQuery to avoid issues
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
    const countryName = country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' ');
    
    return {
      title: `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`,
      description: `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
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
    console.error('❌ generateMetadata error:', error);
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
  console.log('🚀 Generating static params for all cities from comprehensive global database...');
  
  try {
    // Get all cities from comprehensive global database
    const allCities = await preloadQuery(api.locations.getAllCities, {});
    
    // Check if allCities is valid and is an array
    if (!allCities || !Array.isArray(allCities)) {
      console.warn('⚠️ No cities data available or invalid format, returning empty params');
      return [];
    }
    
    // Generate params for all cities in the comprehensive database
    const params = allCities
      .filter((city) => city && city.countrySlug && city.slug) // Filter out invalid entries
      .map((city) => {
        return {
          country: city.countrySlug,
          city: city.slug
        };
      });
    
    console.log(`📄 Generated ${params.length} static city pages from comprehensive global database`);
    console.log('🔍 Sample cities:', params.slice(0, 10).map(p => `${p.city}, ${p.country}`));
    
    return params;
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}
