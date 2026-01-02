'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';

export default function DebugLocationPage() {
  const [country, setCountry] = useState('Germany');
  const [city, setCity] = useState('Berlin');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debugLocationBuilders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      params.append('country', country);
      if (city) params.append('city', city);
      
      const response = await fetch(`/api/debug-location-builders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to debug location builders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Debug Location Builders</CardTitle>
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
                <label className="block text-sm font-medium mb-1">City (optional)</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                />
              </div>
            </div>
            
            <Button 
              onClick={debugLocationBuilders} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Debugging...' : 'Debug Location Builders'}
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
                <p>Timestamp: {results.timestamp}</p>
                
                {results.sampleBuilders.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Sample Builders:</h4>
                    <ul className="space-y-2">
                      {results.sampleBuilders.map((builder: any, index: number) => (
                        <li key={builder.id} className="p-2 bg-white rounded">
                          <div className="font-medium">{builder.company_name}</div>
                          <div className="text-sm text-gray-600">
                            Headquarters: {builder.headquarters_city}, {builder.headquarters_country}
                          </div>
                          <div className="text-sm text-gray-600">
                            Status: {builder.status || 'active'}
                          </div>
                          {builder.service_locations && builder.service_locations.length > 0 && (
                            <div className="text-sm text-gray-600">
                              Service Locations: {builder.service_locations.length} locations
                            </div>
                          )}
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}