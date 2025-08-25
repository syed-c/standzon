'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminAPI } from '@/lib/api/admin';

export default function TestLocationsPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    setLoading(true);
    try {
      // Populate comprehensive locations first
      const populateResult = await adminAPI.populateComprehensiveLocations();
      console.log('📍 Population result:', populateResult);

      // Load countries and cities
      const [countriesResponse, citiesResponse] = await Promise.all([
        adminAPI.getCountries(),
        adminAPI.getCities()
      ]);

      if (countriesResponse.success) {
        setCountries(countriesResponse.data || []);
      }

      if (citiesResponse.success) {
        setCities(citiesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group cities by continent for display
  const citiesByContinent = cities.reduce((acc, city) => {
    const continent = city.continent || 'Unknown';
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(city);
    return acc;
  }, {} as Record<string, any[]>);

  // Check which countries from user's list are present
  const requiredData = [
    { country: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah'] },
    { country: 'India', cities: ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Lucknow', 'Kanpur'] },
    { country: 'Qatar', cities: ['Doha'] },
    { country: 'Oman', cities: ['Muscat'] },
    { country: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Dammam'] },
    { country: 'Bahrain', cities: ['Manama'] },
    { country: 'Kuwait', cities: ['Kuwait City'] },
    { country: 'Malaysia', cities: ['Kuala Lumpur', 'Penang'] },
    { country: 'Singapore', cities: ['Singapore'] },
    { country: 'Indonesia', cities: ['Jakarta'] },
    { country: 'Vietnam', cities: ['Ho Chi Minh City'] },
    { country: 'Philippines', cities: ['Manila'] },
    { country: 'China', cities: ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'] },
    { country: 'Japan', cities: ['Tokyo', 'Osaka'] },
    { country: 'South Korea', cities: ['Seoul', 'Busan'] },
    { country: 'Germany', cities: ['Frankfurt', 'Munich', 'Berlin', 'Cologne', 'Düsseldorf', 'Hannover'] },
    { country: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
    { country: 'Italy', cities: ['Milan', 'Rome', 'Bologna'] },
    { country: 'United Kingdom', cities: ['London', 'Birmingham', 'Manchester'] },
    { country: 'Netherlands', cities: ['Amsterdam', 'Rotterdam'] },
    { country: 'Belgium', cities: ['Brussels', 'Antwerp'] },
    { country: 'Austria', cities: ['Vienna'] },
    { country: 'Switzerland', cities: ['Geneva', 'Zurich'] },
    { country: 'Sweden', cities: ['Stockholm', 'Gothenburg'] },
    { country: 'Poland', cities: ['Warsaw'] },
    { country: 'Russia', cities: ['Moscow'] },
    { country: 'Czech Republic', cities: ['Prague'] },
    { country: 'Denmark', cities: ['Copenhagen'] },
    { country: 'United States', cities: ['Las Vegas', 'Orlando', 'New York', 'Chicago', 'Los Angeles'] },
    { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
    { country: 'Mexico', cities: ['Mexico City'] },
    { country: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro'] },
    { country: 'Argentina', cities: ['Buenos Aires'] },
    { country: 'Colombia', cities: ['Bogotá'] },
    { country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane'] },
    { country: 'New Zealand', cities: ['Auckland'] },
    { country: 'South Africa', cities: ['Johannesburg', 'Cape Town'] },
    { country: 'Kenya', cities: ['Nairobi'] },
    { country: 'Egypt', cities: ['Cairo', 'Alexandria'] },
    { country: 'Nigeria', cities: ['Lagos'] }
  ];

  const requiredCountries = requiredData.map(item => item.country);
  const allRequiredCities = requiredData.flatMap(item => 
    item.cities.map(city => ({ name: city, country: item.country }))
  );

  const presentCountries = countries.filter(c => requiredCountries.includes(c.name));
  const missingCountries = requiredCountries.filter(name => !countries.find(c => c.name === name));

  // Detailed city audit
  const cityAudit = requiredData.map(countryData => {
    const presentCities = countryData.cities.filter(cityName => 
      cities.find(c => c.name === cityName && c.country === countryData.country)
    );
    const missingCities = countryData.cities.filter(cityName => 
      !cities.find(c => c.name === cityName && c.country === countryData.country)
    );
    
    return {
      country: countryData.country,
      totalRequired: countryData.cities.length,
      presentCount: presentCities.length,
      missingCount: missingCities.length,
      presentCities,
      missingCities,
      isComplete: missingCities.length === 0
    };
  });

  const totalRequiredCities = allRequiredCities.length;
  const totalPresentCities = cityAudit.reduce((sum, item) => sum + item.presentCount, 0);
  const totalMissingCities = cityAudit.reduce((sum, item) => sum + item.missingCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading comprehensive location data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🌍 Comprehensive Location Audit</h1>
          <p className="text-gray-600">
            Verification of all countries and cities from your comprehensive list
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Countries</p>
                  <p className="text-3xl font-bold text-blue-900">{countries.length}</p>
                </div>
                <div className="text-blue-600">🏳️</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Cities</p>
                  <p className="text-3xl font-bold text-green-900">{cities.length}</p>
                </div>
                <div className="text-green-600">🏙️</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Required Countries</p>
                  <p className="text-3xl font-bold text-purple-900">{presentCountries.length}/{requiredCountries.length}</p>
                </div>
                <div className="text-purple-600">✅</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Required Cities</p>
                  <p className="text-3xl font-bold text-orange-900">{totalPresentCities}/{totalRequiredCities}</p>
                </div>
                <div className="text-orange-600">🌆</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Missing Cities</p>
                  <p className="text-3xl font-bold text-red-900">{totalMissingCities}</p>
                </div>
                <div className="text-red-600">❌</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missing Countries Alert */}
        {missingCountries.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">⚠️ Missing Countries ({missingCountries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {missingCountries.map(country => (
                  <Badge key={country} variant="destructive">{country}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed City Audit */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔍 Detailed City Audit by Country</CardTitle>
            <p className="text-gray-600">Verification of each city from your comprehensive list</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cityAudit.map(audit => (
                <div key={audit.country} className={`p-4 rounded-lg border ${
                  audit.isComplete ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold ${
                      audit.isComplete ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {audit.isComplete ? '✅' : '❌'} {audit.country}
                    </h3>
                    <Badge variant={audit.isComplete ? 'default' : 'destructive'}>
                      {audit.presentCount}/{audit.totalRequired}
                    </Badge>
                  </div>
                  
                  {audit.presentCities.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-green-600 font-medium mb-1">Present Cities:</p>
                      <div className="flex flex-wrap gap-1">
                        {audit.presentCities.map(city => (
                          <Badge key={city} variant="outline" className="text-green-700 border-green-300">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {audit.missingCities.length > 0 && (
                    <div>
                      <p className="text-xs text-red-600 font-medium mb-1">Missing Cities:</p>
                      <div className="flex flex-wrap gap-1">
                        {audit.missingCities.map(city => (
                          <Badge key={city} variant="destructive" className="text-xs">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Countries by Continent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(citiesByContinent).map(([continent, continentCities]) => {
            const cities = Array.isArray(continentCities) ? continentCities : [];
            return (
            <Card key={continent}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{continent}</span>
                  <Badge variant="outline">{cities.length} cities</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {cities.map((city: any) => (
                      <div key={city.id} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{city.name}</div>
                        <div className="text-gray-500 text-xs">{city.country} {city.isCapital && '👑'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>

        {/* Required Countries Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Required Countries Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {requiredCountries.map(countryName => {
                const isPresent = countries.find(c => c.name === countryName);
                return (
                  <div key={countryName} className={`p-3 rounded-lg border ${
                    isPresent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={isPresent ? 'text-green-600' : 'text-red-600'}>
                        {isPresent ? '✅' : '❌'}
                      </span>
                      <span className={`text-sm font-medium ${
                        isPresent ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {countryName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Final Audit Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Comprehensive Location Audit Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">{countries.length}</div>
                  <div className="text-sm text-blue-600">Total Countries in System</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">{presentCountries.length}/{requiredCountries.length}</div>
                  <div className="text-sm text-green-600">Required Countries Present</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">{totalPresentCities}/{totalRequiredCities}</div>
                  <div className="text-sm text-purple-600">Required Cities Present</div>
                </div>
              </div>
              
              {totalMissingCities === 0 ? (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 text-xl">🎉</span>
                    <span className="font-semibold text-green-800">
                      Audit Complete! All {totalRequiredCities} required cities from your comprehensive list are present in the system.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-600 text-xl">⚠️</span>
                    <span className="font-semibold text-yellow-800">
                      {totalMissingCities} cities still need to be added to complete your comprehensive list.
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Check the "Detailed City Audit" section above to see which specific cities are missing from each country.
                  </p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Coverage by Continent:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(citiesByContinent).map(([continent, continentCities]) => {
                    const cities = Array.isArray(continentCities) ? continentCities : [];
                    return (
                    <div key={continent} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{continent}</span>
                      <Badge variant="outline">{cities.length}</Badge>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}