import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { getServerSupabase } from '@/lib/supabase';

export default async function ServerTest() {
  console.log('=== SERVER TEST ===');
  
  let result = null;
  let error = null;
  
  try {
    const sb = getServerSupabase();
    if (!sb) {
      error = 'Supabase not configured';
    } else {
      console.log('✅ Supabase server client configured');
      
      // Try 'builders' table first
      console.log('🔍 Querying builders table...');
      const { data: data1, error: error1 } = await sb
        .from('builders')
        .select('*')
        .limit(5);
      
      if (!error1 && data1) {
        console.log('✅ Found data in builders table:', data1.length, 'records');
        result = {
          buildersTable: {
            count: data1.length,
            data: data1.slice(0, 2) // Just show first 2 records
          }
        };
      } else {
        console.log('⚠️ Builders table error:', error1?.message);
        
        // Fallback to 'builder_profiles' table
        console.log('🔍 Querying builder_profiles table...');
        const { data: data2, error: error2 } = await sb
          .from('builder_profiles')
          .select('*')
          .limit(5);
        
        if (!error2 && data2) {
          console.log('✅ Found data in builder_profiles table:', data2.length, 'records');
          result = {
            builderProfilesTable: {
              count: data2.length,
              data: data2.slice(0, 2) // Just show first 2 records
            }
          };
        } else {
          console.log('⚠️ Builder profiles table error:', error2?.message);
          error = 'No data found in either table';
        }
      }
    }
  } catch (err) {
    console.error('❌ Server test error:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Server-Side Database Test</CardTitle>
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
                <h3 className="font-semibold mb-2">Server Database Result:</h3>
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