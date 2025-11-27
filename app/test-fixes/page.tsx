'use client';

import { useState, useEffect } from 'react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function TestFixesPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test unified platform
        const isInitialized = unifiedPlatformAPI.isInitialized();
        console.log('Unified platform initialized:', isInitialized);
        
        // Get builders synchronously
        const syncBuilders = unifiedPlatformAPI.getBuilders();
        console.log('Sync builders count:', syncBuilders.length);
        
        // Get builders asynchronously
        const asyncBuilders = await unifiedPlatformAPI.getBuildersAsync();
        console.log('Async builders count:', asyncBuilders.length);
        
        // Count builders by country
        const countryCounts: Record<string, number> = {};
        asyncBuilders.forEach((builder: any) => {
          const country = builder.headquarters_country || builder.headquarters?.country || 'Unknown';
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
        
        setTestResults({
          isInitialized,
          syncBuilders: syncBuilders.length,
          asyncBuilders: asyncBuilders.length,
          countryCounts,
          sampleBuilders: asyncBuilders.slice(0, 5).map((b: any) => ({
            id: b.id,
            companyName: b.companyName,
            headquarters: b.headquarters,
            headquarters_city: b.headquarters_city,
            headquarters_country: b.headquarters_country
          }))
        });
      } catch (err) {
        console.error('Test error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    runTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Running tests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg max-w-2xl">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Test Error</h1>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Fixes Test Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Initialization</h2>
            <p className="text-2xl font-bold">{testResults.isInitialized ? '✅ Initialized' : '❌ Not Initialized'}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Sync Builders</h2>
            <p className="text-2xl font-bold">{testResults.syncBuilders}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Async Builders</h2>
            <p className="text-2xl font-bold">{testResults.asyncBuilders}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Builders by Country</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(testResults.countryCounts).map(([country, count]) => (
              <div key={country} className="p-4 border rounded-lg">
                <h3 className="font-medium">{country}</h3>
                <p className="text-2xl font-bold">{count} builders</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Sample Builders</h2>
          <div className="space-y-4">
            {testResults.sampleBuilders.map((builder: any) => (
              <div key={builder.id} className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg">{builder.companyName}</h3>
                <p className="text-gray-600">ID: {builder.id}</p>
                <div className="mt-2">
                  <p className="font-medium">Headquarters:</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(builder.headquarters, null, 2)}
                  </pre>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="font-medium">City:</p>
                    <p>{builder.headquarters_city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Country:</p>
                    <p>{builder.headquarters_country || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}