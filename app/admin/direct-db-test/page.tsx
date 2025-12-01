'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, supabaseAdmin } from '@/lib/supabase/client';

export default function DirectDbTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testDirectQuery = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Testing direct database query...');
      
      // Use admin client if available (bypasses RLS)
      const client = supabaseAdmin || supabase;
      console.log('Using client type:', supabaseAdmin ? 'Admin (bypasses RLS)' : 'Regular (respects RLS)');
      
      // Try 'builders' table first
      console.log('Querying builders table...');
      const { data: data1, error: error1 } = await client
        .from('builders')
        .select('*')
        .limit(5);
      
      if (!error1 && data1) {
        console.log('Builders table result:', data1.length, 'records');
        setResult({
          buildersTable: {
            count: data1.length,
            data: data1
          }
        });
        return;
      }
      
      console.log('Builders table error:', error1?.message);
      
      // Fallback to 'builder_profiles' table
      console.log('Querying builder_profiles table...');
      const { data: data2, error: error2 } = await client
        .from('builder_profiles')
        .select('*')
        .limit(5);
      
      if (!error2 && data2) {
        console.log('Builder profiles table result:', data2.length, 'records');
        setResult({
          builderProfilesTable: {
            count: data2.length,
            data: data2
          }
        });
        return;
      }
      
      console.log('Builder profiles table error:', error2?.message);
      
      setError('No data found in either table');
    } catch (err) {
      console.error('Direct DB Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to test direct DB query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Direct Database Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={testDirectQuery} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Direct Database Query'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Database Result:</h3>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}