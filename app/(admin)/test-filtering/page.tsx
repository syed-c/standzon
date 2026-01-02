'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/card';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function TestFiltering() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testFiltering = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Testing unified platform filtering...');
      
      // Test getting all builders
      const allBuilders = unifiedPlatformAPI.getBuilders();
      console.log('📊 All builders:', allBuilders.length);
      
      // Test getting builders for UAE
      const uaeBuilders = unifiedPlatformAPI.getBuilders('United Arab Emirates');
      console.log('📊 UAE builders:', uaeBuilders.length);
      
      // Test async version
      const asyncUaeBuilders = await unifiedPlatformAPI.getBuildersAsync('United Arab Emirates');
      console.log('📊 Async UAE builders:', asyncUaeBuilders.length);
      
      setResult({
        allBuilders: allBuilders.length,
        uaeBuilders: uaeBuilders.length,
        asyncUaeBuilders: asyncUaeBuilders.length,
        sampleBuilders: uaeBuilders.slice(0, 3).map((b: any) => ({
          id: b.id,
          companyName: b.companyName,
          headquarters: b.headquarters
        }))
      });
    } catch (err) {
      console.error('❌ Filtering test error:', err);
      setError(err instanceof Error ? err.message : 'Failed to test filtering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Unified Platform Filtering Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={testFiltering} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Filtering'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Filtering Result:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-white rounded">
                    <p className="font-medium">All Builders</p>
                    <p className="text-2xl">{result.allBuilders}</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-medium">UAE Builders (Sync)</p>
                    <p className="text-2xl">{result.uaeBuilders}</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <p className="font-medium">UAE Builders (Async)</p>
                    <p className="text-2xl">{result.asyncUaeBuilders}</p>
                  </div>
                </div>
                
                {result.sampleBuilders.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sample UAE Builders:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {result.sampleBuilders.map((builder: any) => (
                        <div key={builder.id} className="p-2 bg-white rounded text-sm">
                          <div className="font-medium">{builder.companyName}</div>
                          <div className="text-gray-600">
                            {builder.headquarters.city}, {builder.headquarters.country}
                          </div>
                        </div>
                      ))}
                    </div>
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