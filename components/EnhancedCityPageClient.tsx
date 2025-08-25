"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EnhancedCityPage } from '@/components/EnhancedCityPage';
import LoadingSpinner from '@/components/LoadingSpinner';

interface EnhancedCityPageClientProps {
  countrySlug: string;
  citySlug: string;
}

export default function EnhancedCityPageClient({ countrySlug, citySlug }: EnhancedCityPageClientProps) {
  console.log('🏙️ EnhancedCityPageClient props:', { countrySlug, citySlug });
  
  // Ensure we have valid parameters before making the query
  const shouldSkipQuery = !countrySlug || !citySlug || countrySlug === '' || citySlug === '';
  
  const cityData = useQuery(
    api.locations.getCityBySlug, 
    shouldSkipQuery ? "skip" : { 
      countrySlug, 
      citySlug 
    }
  );
  
  const builders = useQuery(
    api.locations.getBuildersForLocation, 
    (shouldSkipQuery || !cityData || cityData === null) ? "skip" : {
      country: cityData.country?.countryName,
      city: cityData.cityName
    }
  );

  // Show loading state
  if (shouldSkipQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invalid Parameters</h1>
          <p className="text-gray-600 mb-8">Missing country or city parameters.</p>
        </div>
      </div>
    );
  }

  if (cityData === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (cityData === null) {
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

  // Create mock preloaded data structure for compatibility
  const mockPreloadedCityData = {
    _valueJSON: JSON.stringify(cityData),
    _args: { countrySlug, citySlug }
  } as any;

  const mockPreloadedBuildersData = {
    _valueJSON: JSON.stringify(builders || []),
    _args: cityData && cityData.country ? {
      country: cityData.country.countryName,
      city: cityData.cityName
    } : {}
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
