'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function TestLocationFix() {
  const [country, setCountry] = useState('Germany');
  const [city, setCity] = useState('Berlin');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testLocationFiltering = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all builders from unified platform
      const allBuilders = unifiedPlatformAPI.getBuilders();
      console.log('Total builders:', allBuilders.length);
      
      // Test our filtering logic
      const normalizeString = (str: string) => {
        if (!str) return '';
        return str.toString().toLowerCase().trim();
      };
      
      const normalizedCountry = normalizeString(country);
      const normalizedCity = normalizeString(city);
      const isCity = !!city;
      
      // Create country variations
      const countryVariations = [normalizedCountry];
      if (normalizedCountry.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountry === "uae") {
        countryVariations.push("united arab emirates");
      }
      
      console.log('Testing with:', { country, city, normalizedCountry, normalizedCity, countryVariations });
      
      // Filter builders
      const filteredBuilders = allBuilders.filter((builder: any) => {
        // Skip inactive builders
        if (builder.status === 'inactive') return false;
        
        console.log('Checking builder:', builder.companyName, {
          headquarters: builder.headquarters,
          serviceLocations: builder.serviceLocations,
          headquarters_city: builder.headquarters_city,
          headquarters_country: builder.headquarters_country
        });
        
        // For city pages, match city and country
        if (isCity && city) {
          // Check headquarters city (multiple possible fields)
          const headquartersCity = normalizeString(builder.headquarters?.city || builder.headquarters_city);
          const cityMatch = headquartersCity === normalizedCity || headquartersCity.includes(normalizedCity);
          
          // Check service locations for city
          const serviceCityMatch = builder.serviceLocations?.some((loc: any) => {
            const serviceCity = normalizeString(loc.city);
            return serviceCity === normalizedCity || serviceCity.includes(normalizedCity);
          }) || false;
          
          // Check headquarters country (multiple possible fields)
          const headquartersCountry = normalizeString(builder.headquarters?.country || builder.headquarters_country);
          const countryMatch = headquartersCountry === normalizedCountry || 
                             headquartersCountry.includes(normalizedCountry) ||
                             // Handle UAE/United Arab Emirates variations
                             (normalizedCountry === 'uae' && headquartersCountry.includes('united arab emirates')) ||
                             (normalizedCountry === 'united arab emirates' && headquartersCountry.includes('uae'));
          
          // Check service locations for country
          const serviceCountryMatch = builder.serviceLocations?.some((loc: any) => {
            const serviceCountry = normalizeString(loc.country);
            return serviceCountry === normalizedCountry || 
                   serviceCountry.includes(normalizedCountry) ||
                   // Handle UAE/United Arab Emirates variations
                   (normalizedCountry === 'uae' && serviceCountry.includes('united arab emirates')) ||
                   (normalizedCountry === 'united arab emirates' && serviceCountry.includes('uae'));
          }) || false;
          
          const result = (cityMatch || serviceCityMatch) && (countryMatch || serviceCountryMatch);
          
          console.log('City page match for', builder.companyName, {
            cityMatch: cityMatch || serviceCityMatch,
            countryMatch: countryMatch || serviceCountryMatch,
            finalResult: result,
            headquartersCity,
            headquartersCountry
          });
          
          return result;
        }
        
        // For country pages, match country only
        if (country) {
          const headquartersCountry = normalizeString(builder.headquarters?.country || builder.headquarters_country);
          const countryMatch = headquartersCountry === normalizedCountry || 
                             headquartersCountry.includes(normalizedCountry) ||
                             // Handle UAE/United Arab Emirates variations
                             (normalizedCountry === 'uae' && headquartersCountry.includes('united arab emirates')) ||
                             (normalizedCountry === 'united arab emirates' && headquartersCountry.includes('uae'));
          
          const serviceCountryMatch = builder.serviceLocations?.some((loc: any) => {
            const serviceCountry = normalizeString(loc.country);
            return serviceCountry === normalizedCountry || 
                   serviceCountry.includes(normalizedCountry) ||
                   // Handle UAE/United Arab Emirates variations
                   (normalizedCountry === 'uae' && serviceCountry.includes('united arab emirates')) ||
                   (normalizedCountry === 'united arab emirates' && serviceCountry.includes('uae'));
          }) || false;
          
          const result = countryMatch || serviceCountryMatch;
          
          console.log('Country page match for', builder.companyName, {
            countryMatch: countryMatch || serviceCountryMatch,
            finalResult: result,
            headquartersCountry
          });
          
          return result;
        }
        
        return false;
      });
      
      setResults({
        totalBuilders: allBuilders.length,
        filteredBuilders: filteredBuilders.length,
        sampleBuilders: filteredBuilders.slice(0, 5).map((b: any) => ({
          id: b.id,
          companyName: b.companyName || b.company_name,
          headquarters: b.headquarters || {
            city: b.headquarters_city,
            country: b.headquarters_country
          },
          serviceLocations: b.serviceLocations,
          status: b.status
        })),
        countryVariations
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test location filtering');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testLocationFiltering();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Location Builder Filtering Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                />
              </div>
            </div>
            
            <Button 
              onClick={testLocationFiltering} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Location Filtering'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {results && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Results:</h3>
                <p>Total Builders: {results.totalBuilders}</p>
                <p>Filtered Builders: {results.filteredBuilders}</p>
                <p>Country Variations: {results.countryVariations.join(', ')}</p>
                
                {results.sampleBuilders.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Sample Builders:</h4>
                    <ul className="space-y-2">
                      {results.sampleBuilders.map((builder: any, index: number) => (
                        <li key={builder.id} className="p-2 bg-white rounded">
                          <div className="font-medium">{builder.companyName}</div>
                          <div className="text-sm text-gray-600">
                            Headquarters: {builder.headquarters?.city}, {builder.headquarters?.country}
                          </div>
                          <div className="text-sm text-gray-600">
                            Status: {builder.status || 'active'}
                          </div>
                          {builder.serviceLocations && builder.serviceLocations.length > 0 && (
                            <div className="text-sm text-gray-600">
                              Service Locations: {builder.serviceLocations.length} locations
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {results.filteredBuilders === 0 && (
                  <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                    <h4 className="font-medium mb-2">No builders found!</h4>
                    <p>This indicates there might be an issue with:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Data structure mismatch between what's stored and what's expected</li>
                      <li>Incorrect country/city names in the database</li>
                      <li>Filtering logic not matching the data format</li>
                      <li>Builders marked as inactive</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}