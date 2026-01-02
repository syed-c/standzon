'use client';

import React from 'react';
import { Badge } from '@/components/shared/badge';
import { Card, CardContent } from '@/components/shared/card';
import { MapPin, Globe, Building, Users, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlobalLocationManager, { type LocationOption } from '@/lib/utils/globalLocationManager';
import type { ExhibitionCity, ExhibitionCountry } from '@/lib/data/globalCities';

interface LocationDisplayProps {
  country?: string;
  city?: string;
  mode?: 'compact' | 'detailed' | 'card';
  showStats?: boolean;
  showBuilders?: boolean;
  className?: string;
}

export function LocationDisplay({
  country,
  city,
  mode = 'compact',
  showStats = false,
  showBuilders = false,
  className
}: LocationDisplayProps) {
  const countryData = country ? GlobalLocationManager.getLocationDetails(country, 'country') as ExhibitionCountry : null;
  const cityData = city ? GlobalLocationManager.getLocationDetails(city, 'city') as ExhibitionCity : null;
  const buildersCount = GlobalLocationManager.getBuildersCountByLocation(country, city);

  if (!countryData && !cityData) {
    return null;
  }

  const currentLocation = cityData || countryData;
  if (!currentLocation) return null;

  if (mode === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <MapPin className="w-4 h-4 text-blue-600" />
        <span className="font-medium">
          {cityData ? `${cityData.name}, ${cityData.country}` : countryData?.name}
        </span>
        {showBuilders && buildersCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {buildersCount} builders
          </Badge>
        )}
        {showStats && 'annualEvents' in currentLocation && (
          <Badge variant="outline" className="text-xs">
            {currentLocation.annualEvents} events/year
          </Badge>
        )}
      </div>
    );
  }

  if (mode === 'detailed') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {cityData ? (
              <Building className="w-5 h-5 text-blue-600" />
            ) : (
              <Globe className="w-5 h-5 text-green-600" />
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {cityData ? cityData.name : countryData?.name}
              </h3>
              {cityData && (
                <p className="text-sm text-gray-600">
                  {cityData.country} • {cityData.continent}
                </p>
              )}
              {countryData && !cityData && (
                <p className="text-sm text-gray-600">
                  {countryData.continent} • {countryData.currency}
                </p>
              )}
            </div>
          </div>
        </div>

        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {'annualEvents' in currentLocation && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{currentLocation.annualEvents}</p>
                  <p className="text-xs text-gray-600">Events/Year</p>
                </div>
              </div>
            )}
            
            {cityData && (
              <>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{cityData.venues.length}</p>
                    <p className="text-xs text-gray-600">Venues</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">{cityData.population}</p>
                    <p className="text-xs text-gray-600">Population</p>
                  </div>
                </div>
              </>
            )}

            {countryData && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">#{countryData.exhibitionRanking}</p>
                  <p className="text-xs text-gray-600">Global Rank</p>
                </div>
              </div>
            )}

            {showBuilders && buildersCount > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">{buildersCount}</p>
                  <p className="text-xs text-gray-600">Builders</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {currentLocation.keyIndustries.slice(0, 5).map((industry) => (
            <Badge key={industry} variant="outline" className="text-xs">
              {industry}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  // Card mode
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {cityData ? (
            <Building className="w-5 h-5 text-blue-600" />
          ) : (
            <Globe className="w-5 h-5 text-green-600" />
          )}
          <div>
            <h3 className="font-semibold">
              {cityData ? cityData.name : countryData?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {cityData ? `${cityData.country} • ${cityData.continent}` : `${countryData?.continent}`}
            </p>
          </div>
        </div>

        {showStats && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {'annualEvents' in currentLocation && (
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-lg font-bold text-blue-600">{currentLocation.annualEvents}</p>
                <p className="text-xs text-gray-600">Events/Year</p>
              </div>
            )}
            {cityData && (
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-lg font-bold text-green-600">{cityData.venues.length}</p>
                <p className="text-xs text-gray-600">Venues</p>
              </div>
            )}
            {countryData && !cityData && (
              <div className="text-center p-2 bg-yellow-50 rounded">
                <p className="text-lg font-bold text-yellow-600">#{countryData.exhibitionRanking}</p>
                <p className="text-xs text-gray-600">Global Rank</p>
              </div>
            )}
            {showBuilders && buildersCount > 0 && (
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="text-lg font-bold text-purple-600">{buildersCount}</p>
                <p className="text-xs text-gray-600">Builders</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {currentLocation.keyIndustries.slice(0, 4).map((industry) => (
            <Badge key={industry} variant="secondary" className="text-xs">
              {industry}
            </Badge>
          ))}
          {currentLocation.keyIndustries.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{currentLocation.keyIndustries.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationDisplay;