"use client";

import { EnhancedCityPage } from '@/components/EnhancedCityPage';
import { getCityBySlug } from '@/lib/data/globalExhibitionDatabase';

interface EnhancedCityPageClientProps {
  countrySlug: string;
  citySlug: string;
}

export default function EnhancedCityPageClient({ countrySlug, citySlug }: EnhancedCityPageClientProps) {
  console.log('🏙️ EnhancedCityPageClient props:', { countrySlug, citySlug });
  
  // Ensure we have valid parameters
  if (!countrySlug || !citySlug || countrySlug === '' || citySlug === '') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invalid Parameters</h1>
          <p className="text-gray-600 mb-8">Missing country or city parameters.</p>
        </div>
      </div>
    );
  }

  // Get city data from global database
  const globalCityData = getCityBySlug(countrySlug, citySlug);
  
  if (!globalCityData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-8">The requested city could not be found.</p>
          <p className="text-sm text-gray-500">Looking for: {citySlug} in {countrySlug}</p>
        </div>
      </div>
    );
  }
  
  // Use global database data
  console.log('🔄 Using global database for:', citySlug);
  const mockPreloadedCityData = {
    _valueJSON: JSON.stringify({
      cityName: globalCityData.name,
      country: {
        countryName: globalCityData.country,
        countryCode: globalCityData.countryCode
      },
      slug: globalCityData.slug,
      countrySlug: globalCityData.countrySlug
    }),
    _args: { countrySlug, citySlug }
  } as any;

  const mockPreloadedBuildersData = {
    _valueJSON: JSON.stringify([]),
    _args: { country: globalCityData.country, city: globalCityData.name }
  } as any;

  return (
    <EnhancedCityPage 
      countrySlug={countrySlug}
      citySlug={citySlug}
      preloadedCityData={mockPreloadedCityData}
      preloadedBuildersData={mockPreloadedBuildersData}
    />
  );
}
