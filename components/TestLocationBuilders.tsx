'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TestLocationBuilders() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testLocationBuilders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (country) params.append('country', country);
      if (city) params.append('city', city);
      
      const response = await fetch(`/api/test-location-builders?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test location builders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Location Builders API</CardTitle>
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
              onClick={testLocationBuilders} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Location Builders'}
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
                <p>Timestamp: {results.timestamp}</p>
                
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}