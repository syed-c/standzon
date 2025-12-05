'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InspectDatabase() {
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inspectDatabase = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/inspect-builders');
      const data = await response.json();
      
      if (data.success) {
        setDbInfo(data.data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to inspect database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Inspection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={inspectDatabase} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Inspecting Database...' : 'Inspect Database'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {dbInfo && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Database Info:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-white rounded">
                    <p className="font-medium">Builder Profiles</p>
                    <p className="text-2xl">{dbInfo.builderProfiles.length}</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-medium">Builders</p>
                    <p className="text-2xl">{dbInfo.builders.length}</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-medium">Service Locations</p>
                    <p className="text-2xl">{dbInfo.serviceLocations.length}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dbInfo.builderProfiles.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Sample Builder Profiles:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {dbInfo.builderProfiles.map((builder: any, index: number) => (
                          <div key={builder.id} className="p-2 bg-white rounded text-sm">
                            <div className="font-medium">{builder.company_name}</div>
                            <div className="text-gray-600">
                              {builder.headquarters_city}, {builder.headquarters_country}
                            </div>
                            <div className="text-gray-500 text-xs">
                              ID: {builder.id} | Created: {builder.created_at}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dbInfo.builders.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Sample Builders:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {dbInfo.builders.map((builder: any, index: number) => (
                          <div key={builder.id} className="p-2 bg-white rounded text-sm">
                            <div className="font-medium">{builder.company_name}</div>
                            <div className="text-gray-600">
                              {builder.headquarters_city}, {builder.headquarters_country}
                            </div>
                            <div className="text-gray-500 text-xs">
                              ID: {builder.id} | Created: {builder.created_at}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dbInfo.serviceLocations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Sample Service Locations:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {dbInfo.serviceLocations.map((location: any, index: number) => (
                          <div key={location.id || index} className="p-2 bg-white rounded text-sm">
                            <div className="font-medium">{location.city}, {location.country}</div>
                            <div className="text-gray-500 text-xs">
                              Builder ID: {location.builder_id} | Headquarters: {location.is_headquarters ? 'Yes' : 'No'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}