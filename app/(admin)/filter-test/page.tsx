import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { getServerSupabase } from '@/lib/supabase';

export default async function FilterTest() {
  console.log('=== FILTER TEST ===');
  
  let result = null;
  let error = null;
  
  try {
    const sb = getServerSupabase();
    if (!sb) {
      error = 'Supabase not configured';
    } else {
      console.log('✅ Supabase configured');
      
      // Get all builders from builder_profiles (since that's where the data is)
      console.log('🔍 Getting all builders from builder_profiles...');
      const { data: allBuilders, error: buildersError } = await sb
        .from('builder_profiles')
        .select('*');
      
      if (buildersError) {
        throw new Error(`Failed to fetch builders: ${buildersError.message}`);
      }
      
      console.log(`✅ Found ${allBuilders?.length || 0} builders`);
      
      // Test filtering for United Arab Emirates
      console.log('🔍 Testing filtering for United Arab Emirates...');
      const countryInfo = { name: 'United Arab Emirates' };
      const countryVariations = [countryInfo.name.toLowerCase()];
      if (countryInfo.name === "United Arab Emirates") {
        countryVariations.push("uae");
      } else if (countryInfo.name === "UAE") {
        countryVariations.push("united arab emirates");
      }
      
      console.log('Country variations:', countryVariations);
      
      // Apply filtering logic
      const filteredBuilders = allBuilders?.filter((builder: any) => {
        // Normalize strings for comparison
        const normalizeString = (str: string) => {
          if (!str) return '';
          return str.toString().toLowerCase().trim();
        };
        
        const normalizedCountry = normalizeString(countryInfo.name);
        
        // Check headquarters country (handle different field names)
        const headquartersCountry = normalizeString(
          builder.headquarters_country || 
          builder.headquarters?.country || 
          builder.headquartersCountry || 
          ''
        );
        
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
        
        // Log first few builders for debugging
        if (allBuilders && allBuilders.indexOf(builder) < 3) {
          console.log(`Builder ${builder.company_name}:`, {
            headquartersCountry,
            headquartersMatch,
            serviceLocationMatch,
            finalResult: headquartersMatch || serviceLocationMatch
          });
        }
        
        return headquartersMatch || serviceLocationMatch;
      }) || [];
      
      console.log(`✅ Filtered builders for ${countryInfo.name}: ${filteredBuilders.length}`);
      
      // Show sample of filtered builders
      const sampleBuilders = filteredBuilders.slice(0, 3).map((builder: any) => ({
        id: builder.id,
        company_name: builder.company_name,
        headquarters_city: builder.headquarters_city,
        headquarters_country: builder.headquarters_country
      }));
      
      result = {
        totalBuilders: allBuilders?.length || 0,
        filteredBuilders: filteredBuilders.length,
        countryVariations,
        sampleBuilders
      };
    }
  } catch (err) {
    console.error('❌ Filter test error:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Server-Side Filtering Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Filtering Result:</h3>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            {!result && !error && (
              <div className="p-4 bg-yellow-100 rounded">
                <p>No results yet. Check server console for logs.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}