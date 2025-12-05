'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function ComprehensiveDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runComprehensiveDebug = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Step 1: Check unified platform API
      console.log('=== COMPREHENSIVE DEBUG START ===');
      
      const isInitialized = unifiedPlatformAPI.isInitialized();
      console.log('1. Unified platform initialized:', isInitialized);
      
      // Step 2: Get builders from unified platform
      let allBuilders = unifiedPlatformAPI.getBuilders();
      console.log('2. Builders from getBuilders():', allBuilders.length);
      
      if (allBuilders.length === 0) {
        console.log('2a. Trying async version...');
        allBuilders = await unifiedPlatformAPI.getBuildersAsync();
        console.log('2b. Builders from getBuildersAsync():', allBuilders.length);
      }
      
      // Step 3: Show sample builder data structure
      if (allBuilders.length > 0) {
        console.log('3. Sample builder structure:', {
          id: allBuilders[0].id,
          companyName: (allBuilders[0] as any).companyName,
          company_name: (allBuilders[0] as any).company_name,
          headquarters: (allBuilders[0] as any).headquarters,
          headquarters_city: (allBuilders[0] as any).headquarters_city,
          headquarters_country: (allBuilders[0] as any).headquarters_country,
          serviceLocations: (allBuilders[0] as any).serviceLocations,
          service_locations: (allBuilders[0] as any).service_locations,
          status: (allBuilders[0] as any).status
        });
      }
      
      // Step 4: Test API endpoint
      console.log('4. Testing API endpoint...');
      try {
        const response = await fetch('/api/admin/builders?limit=10');
        const apiData = await response.json();
        console.log('4a. API response:', {
          success: apiData.success,
          builderCount: apiData.data?.builders?.length,
          total: apiData.data?.total
        });
        
        if (apiData.success && apiData.data.builders.length > 0) {
          console.log('4b. First API builder:', {
            id: apiData.data.builders[0].id,
            company_name: apiData.data.builders[0].company_name,
            headquarters_city: apiData.data.builders[0].headquarters_city,
            headquarters_country: apiData.data.builders[0].headquarters_country,
            service_locations: apiData.data.builders[0].service_locations
          });
        }
      } catch (apiError) {
        console.error('4. API endpoint error:', apiError);
      }
      
      // Step 5: Test location filtering with Germany/Berlin
      console.log('5. Testing location filtering for Germany/Berlin...');
      const normalizeString = (str: string) => {
        if (!str) return '';
        return str.toString().toLowerCase().trim();
      };
      
      const country = 'Germany';
      const city = 'Berlin';
      const normalizedCountry = normalizeString(country);
      const normalizedCity = normalizeString(city);
      
      console.log('5a. Normalized values:', { normalizedCountry, normalizedCity });
      
      // Create country variations
      const countryVariations = [normalizedCountry];
      if (normalizedCountry.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountry === "uae") {
        countryVariations.push("united arab emirates");
      }
      
      console.log('5b. Country variations:', countryVariations);
      
      // Filter builders for Germany/Berlin
      const filteredBuilders = allBuilders.filter((builder: any) => {
        // Check headquarters country
        const headquartersCountry = normalizeString(builder.headquarters_country || builder.headquarters?.country);
        const headquartersMatch = countryVariations.some(variation => 
          headquartersCountry === variation || headquartersCountry.includes(variation)
        );
        
        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = normalizeString(loc.country);
          return countryVariations.some(variation => 
            serviceCountry === variation || serviceCountry.includes(variation)
          );
        });
        
        // Check headquarters city
        const headquartersCity = normalizeString(builder.headquarters_city || builder.headquarters?.city);
        const headquartersCityMatch = headquartersCity === normalizedCity || headquartersCity.includes(normalizedCity);
        
        // Check service locations for city
        const serviceCityMatch = serviceLocations.some((loc: any) => {
          const serviceCity = normalizeString(loc.city);
          return serviceCity === normalizedCity || serviceCity.includes(normalizedCity);
        });
        
        const cityMatch = headquartersCityMatch || serviceCityMatch;
        const countryMatch = headquartersMatch || serviceLocationMatch;
        const isActive = builder.status !== 'inactive';
        
        const result = countryMatch && cityMatch && isActive;
        
        // Log first builder details
        if (allBuilders.indexOf(builder) === 0) {
          console.log('5c. First builder filtering details:', {
            headquartersCountry,
            headquartersCity,
            headquartersMatch,
            serviceLocationMatch,
            headquartersCityMatch,
            serviceCityMatch,
            cityMatch,
            countryMatch,
            isActive,
            finalResult: result
          });
        }
        
        return result;
      });
      
      console.log('5d. Filtered builders count:', filteredBuilders.length);
      
      setDebugInfo({
        unifiedInitialized: isInitialized,
        unifiedBuilders: allBuilders.length,
        sampleBuilder: allBuilders.length > 0 ? {
          id: allBuilders[0].id,
          companyName: (allBuilders[0] as any).companyName || (allBuilders[0] as any).company_name,
          headquarters: (allBuilders[0] as any).headquarters,
          headquarters_city: (allBuilders[0] as any).headquarters_city,
          headquarters_country: (allBuilders[0] as any).headquarters_country,
          serviceLocations: (allBuilders[0] as any).serviceLocations || (allBuilders[0] as any).service_locations,
          status: (allBuilders[0] as any).status
        } : null,
        filteredBuilders: filteredBuilders.length,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Comprehensive debug error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run comprehensive debug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Debug for Location Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runComprehensiveDebug} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Running Debug...' : 'Run Comprehensive Debug'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {debugInfo && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Debug Results:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Unified Platform Initialized:</strong> {debugInfo.unifiedInitialized ? 'Yes' : 'No'}</p>
                    <p><strong>Total Builders:</strong> {debugInfo.unifiedBuilders}</p>
                    <p><strong>Filtered Builders (Germany/Berlin):</strong> {debugInfo.filteredBuilders}</p>
                    <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
                  </div>
                  
                  {debugInfo.sampleBuilder && (
                    <div>
                      <p><strong>Sample Builder:</strong></p>
                      <pre className="text-xs bg-white p-2 rounded overflow-auto">
                        {JSON.stringify(debugInfo.sampleBuilder, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                
                {debugInfo.filteredBuilders === 0 && (
                  <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                    <h4 className="font-medium mb-2">⚠️ No builders found for Germany/Berlin!</h4>
                    <p>Possible causes:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Builders don't have correct location data</li>
                      <li>Field name mismatches (headquarters_city vs headquarters?.city)</li>
                      <li>Filtering logic not matching data structure</li>
                      <li>Builders marked as inactive</li>
                      <li>Country/city names don't match exactly</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-medium mb-2">Next Steps:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Check browser console for detailed debug logs</li>
                <li>Verify builder data structure in Supabase</li>
                <li>Check if builders have correct location information</li>
                <li>Verify country/city names match exactly</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}