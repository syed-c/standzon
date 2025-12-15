'use client';

import { useState, useEffect } from 'react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function DebugBuildersPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const debugBuilders = async () => {
      try {
        console.log('=== DEBUG BUILDERS START ===');
        
        // Check if unified platform is initialized
        const isInitialized = unifiedPlatformAPI.isInitialized();
        console.log('Unified platform initialized:', isInitialized);
        
        // Get all builders
        const allBuilders = unifiedPlatformAPI.getBuilders();
        console.log('All builders count:', allBuilders.length);
        
        // Try UAE builders specifically
        const uaeBuilders = unifiedPlatformAPI.getBuilders('united arab emirates');
        console.log('UAE builders count:', uaeBuilders.length);
        
        // Try Dubai builders specifically
        const dubaiBuilders = unifiedPlatformAPI.getBuilders('dubai');
        console.log('Dubai builders count:', dubaiBuilders.length);
        
        // Try async version
        console.log('Trying async version...');
        const asyncBuilders = await unifiedPlatformAPI.getBuildersAsync('united arab emirates');
        console.log('Async UAE builders count:', asyncBuilders.length);
        
        // Direct Supabase fetch
        console.log('Trying direct Supabase fetch...');
        const { getAllBuilders } = await import('@/lib/supabase/builders');
        const supabaseBuilders = await getAllBuilders();
        console.log('Direct Supabase builders count:', supabaseBuilders.length);
        
        // Filter UAE builders from Supabase data
        const uaeSupabaseBuilders = supabaseBuilders.filter((builder: any) => {
          const builderCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
          return builderCountry.includes('united arab emirates') || builderCountry.includes('uae');
        });
        console.log('Filtered UAE builders from Supabase:', uaeSupabaseBuilders.length);
        
        setDebugInfo({
          isInitialized,
          allBuilders: allBuilders.length,
          uaeBuilders: uaeBuilders.length,
          dubaiBuilders: dubaiBuilders.length,
          asyncUaeBuilders: asyncBuilders.length,
          supabaseBuilders: supabaseBuilders.length,
          uaeSupabaseBuilders: uaeSupabaseBuilders.length,
          firstFewBuilders: allBuilders.slice(0, 3).map((b: any) => ({
            id: b.id,
            companyName: b.companyName,
            headquarters: b.headquarters
          })),
          firstFewUaeBuilders: uaeSupabaseBuilders.slice(0, 3).map((b: any) => ({
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

    debugBuilders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Debugging Builders...</h1>
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
      <h1 className="text-2xl font-bold mb-4">Builders Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Unified Platform Initialized: {debugInfo?.isInitialized ? 'Yes' : 'No'}</li>
          <li>Total Builders: {debugInfo?.allBuilders}</li>
          <li>UAE Builders (sync): {debugInfo?.uaeBuilders}</li>
          <li>Dubai Builders (sync): {debugInfo?.dubaiBuilders}</li>
          <li>UAE Builders (async): {debugInfo?.asyncUaeBuilders}</li>
          <li>Supabase Builders: {debugInfo?.supabaseBuilders}</li>
          <li>UAE Supabase Builders: {debugInfo?.uaeSupabaseBuilders}</li>
        </ul>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">First Few Builders (Unified Platform)</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo?.firstFewBuilders, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">First Few UAE Builders (Supabase)</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(debugInfo?.firstFewUaeBuilders, null, 2)}
        </pre>
      </div>
    </div>
  );
}