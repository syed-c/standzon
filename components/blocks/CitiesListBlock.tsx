/**
 * Cities List Block - Server Component
 * Displays list of cities in a country
 */

import Link from 'next/link';
import { Card, CardContent } from '@/components/shared/card';
import { MapPin } from 'lucide-react';
import { BaseBlockProps } from './types';

interface CityData {
  name: string;
  slug: string;
  builderCount: number;
}

interface CitiesListData {
  countrySlug: string;
  countryName: string;
  cities: CityData[];
  heading?: string;
  intro?: string;
}

export default function CitiesListBlock({ data, className = '' }: BaseBlockProps) {
  const citiesListData = data as CitiesListData;
  const cities = citiesListData.cities || [];
  const countrySlug = citiesListData.countrySlug;
  const countryName = citiesListData.countryName;

  return (
    <div className={className}>
      {citiesListData.heading && (
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {citiesListData.heading}
        </h2>
      )}
      {citiesListData.intro && (
        <p className="text-gray-600 mb-8">{citiesListData.intro}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/exhibition-stands/${countrySlug}/${city.slug}`}
            className="group"
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300">
              <CardContent className="p-4 text-center">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600 group-hover:text-blue-700" />
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 text-sm">
                  {city.name}
                </h3>
                {city.builderCount > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {city.builderCount} builders
                  </p>
                )}
                <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details →
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* SEO-friendly text links */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Popular Cities for Exhibition Stands in {countryName}
        </h3>
        <div className="flex flex-wrap gap-2">
          {cities.map((city, index) => (
            <span key={city.slug}>
              <Link
                href={`/exhibition-stands/${countrySlug}/${city.slug}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Exhibition Stands in {city.name}
              </Link>
              {index < cities.length - 1 && (
                <span className="text-gray-400 ml-2">•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
