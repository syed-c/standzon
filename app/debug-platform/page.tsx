'use client';

import { useState, useEffect } from 'react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';

export default function DebugPlatformPage() {
  const [platformInfo, setPlatformInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const debugPlatform = async () => {
      try {
        console.log('=== DEBUG PLATFORM START ===');
        
        // Check initialization status
        const isInitialized = unifiedPlatformAPI.isInitialized();
        console.log('Platform initialized:', isInitialized);
        
        // Try to get all builders
        let allBuilders = [];
        try {
          allBuilders = unifiedPlatformAPI.getBuilders();
          console.log('Sync getBuilders succeeded, count:', allBuilders.length);
        } catch (syncError) {
          console.log('Sync getBuilders failed:', syncError);
        }
        
        // Try async version
        let asyncBuilders = [];
        try {
          asyncBuilders = await unifiedPlatformAPI.getBuildersAsync();
          console.log('Async getBuilders succeeded, count:', asyncBuilders.length);
        } catch (asyncError) {
          console.log('Async getBuilders failed:', asyncError);
        }
        
        // Try UAE specific
        let uaeBuilders = [];
        try {
          uaeBuilders = unifiedPlatformAPI.getBuilders('united arab emirates');
          console.log('UAE getBuilders succeeded, count:', uaeBuilders.length);
        } catch (uaeError) {
          console.log('UAE getBuilders failed:', uaeError);
        }
        
        // Try Dubai specific
        let dubaiBuilders = [];
        try {
          dubaiBuilders = unifiedPlatformAPI.getBuilders('dubai');
          console.log('Dubai getBuilders succeeded, count:', dubaiBuilders.length);
        } catch (dubaiError) {
          console.log('Dubai getBuilders failed:', dubaiError);
        }
        
        // Try direct Supabase
        let supabaseBuilders = [];
        try {
          const { getAllBuilders } = await import('@/lib/supabase/builders');
          supabaseBuilders = await getAllBuilders();
          console.log('Direct Supabase fetch succeeded, count:', supabaseBuilders.length);
        } catch (supabaseError) {
          console.log('Direct Supabase fetch failed:', supabaseError);
        }
        
        setPlatformInfo({
          isInitialized,
          syncBuilders: allBuilders.length,
          asyncBuilders: asyncBuilders.length,
          uaeBuilders: uaeBuilders.length,
          dubaiBuilders: dubaiBuilders.length,
          supabaseBuilders: supabaseBuilders.length,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Debug error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    debugPlatform();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Debugging Platform...</h1>
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
      <h1 className="text-2xl font-bold mb-4">Platform Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Platform Initialized: {platformInfo?.isInitialized ? 'Yes' : 'No'}</li>
          <li>Sync Builders: {platformInfo?.syncBuilders}</li>
          <li>Async Builders: {platformInfo?.asyncBuilders}</li>
          <li>UAE Builders: {platformInfo?.uaeBuilders}</li>
          <li>Dubai Builders: {platformInfo?.dubaiBuilders}</li>
          <li>Supabase Builders: {platformInfo?.supabaseBuilders}</li>
        </ul>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Timestamp</h2>
        <p>{platformInfo?.timestamp}</p>
      </div>
    </div>
  );
}