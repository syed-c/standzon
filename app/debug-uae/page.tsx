'use client';

import { useState, useEffect } from 'react';

export default function DebugUaePage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const debugUae = async () => {
      try {
        console.log('=== DEBUG UAE BUILDERS START ===');
        
        // Direct Supabase fetch
        console.log('Trying direct Supabase fetch...');
        const { getAllBuilders } = await import('@/lib/supabase/builders');
        const supabaseBuilders = await getAllBuilders();
        console.log('Direct Supabase builders count:', supabaseBuilders.length);
        
        // Log some sample builders to see their structure
        console.log('First 5 builders:');
        supabaseBuilders.slice(0, 5).forEach((builder: any, index: number) => {
          console.log(`${index + 1}.`, {
            id: builder.id,
            company_name: builder.company_name,
            headquarters_country: builder.headquarters_country,
            headquarters_city: builder.headquarters_city
          });
        });
        
        // Filter UAE builders from Supabase data
        console.log('Filtering for UAE builders...');
        const uaeBuilders = supabaseBuilders.filter((builder: any) => {
          const builderCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
          const match = builderCountry.includes('united arab emirates') || builderCountry.includes('uae');
          if (match) {
            console.log('Found UAE builder:', builder.company_name, {
              country: builderCountry,
              match: match
            });
          }
          return match;
        });
        console.log('Filtered UAE builders:', uaeBuilders.length);
        
        // Filter Dubai builders specifically
        console.log('Filtering for Dubai builders...');
        const dubaiBuilders = uaeBuilders.filter((builder: any) => {
          const builderCity = (builder.headquarters_city || builder.city || '').toLowerCase().trim();
          const match = builderCity.includes('dubai');
          if (match) {
            console.log('Found Dubai builder:', builder.company_name, {
              city: builderCity,
              match: match
            });
          }
          return match;
        });
        console.log('Filtered Dubai builders:', dubaiBuilders.length);
        
        setDebugInfo({
          totalBuilders: supabaseBuilders.length,
          uaeBuilders: uaeBuilders.length,
          dubaiBuilders: dubaiBuilders.length,
          sampleBuilders: supabaseBuilders.slice(0, 5).map((b: any) => ({
            id: b.id,
            company_name: b.company_name,
            headquarters_country: b.headquarters_country,
            headquarters_city: b.headquarters_city
          })),
          uaeSample: uaeBuilders.slice(0, 5).map((b: any) => ({
            id: b.id,
            company_name: b.company_name,
            headquarters_country: b.headquarters_country,
            headquarters_city: b.headquarters_city
          })),
          dubaiSample: dubaiBuilders.slice(0, 5).map((b: any) => ({
            id: b.id,
            company_name: b.company_name,
            headquarters_country: b.headquarters_country,
            headquarters_city: b.headquarters_city
          }))
        });
      } catch (err) {
        console.error('Debug error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    debugUae();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Debugging UAE Builders...</h1>
        <p>Check browser console for detailed logs.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Debug Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">UAE Builders Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Total Builders: {debugInfo?.totalBuilders}</li>
          <li>UAE Builders: {debugInfo?.uaeBuilders}</li>
          <li>Dubai Builders: {debugInfo?.dubaiBuilders}</li>
        </ul>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Sample Builders</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo?.sampleBuilders, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">UAE Builders Sample</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo?.uaeSample, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Dubai Builders Sample</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo?.dubaiSample, null, 2)}
        </pre>
      </div>
    </div>
  );
}