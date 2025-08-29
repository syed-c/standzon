import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import EnhancedCityPageClient from '@/components/EnhancedCityPageClient';
import { getCityBySlug } from '@/lib/data/globalExhibitionDatabase';

interface CityPageProps {
  params: {
    country: string;
    city: string;
  };
}

export async function generateMetadata({ params }: { params: { country: string; city: string } }): Promise<Metadata> {
  try {
    const { country, city } = params;
    const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const toTitle = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const countrySlug = normalize(country);
    const citySlug = normalize(city);
    
    // Try to get city data from global database for better metadata
    const cityData = getCityBySlug(countrySlug, citySlug);
    const cityName = cityData ? cityData.name : toTitle(citySlug);
    const countryName = toTitle(countrySlug);
    
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
        canonical: `/exhibition-stands/${countrySlug}/${citySlug}`,
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
  const { country, city } = params;
  const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const countrySlug = normalize(country);
  const citySlug = normalize(city);
  console.log('🏙️ Loading city page:', { country: countrySlug, city: citySlug });
  
  return (
    <div className="font-inter">
      <Navigation />
      <EnhancedCityPageClient countrySlug={countrySlug} citySlug={citySlug} />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

// Dynamic route: don't generate static params to avoid build-time dependencies
