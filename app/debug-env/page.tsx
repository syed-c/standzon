'use client';

import { useState, useEffect } from 'react';

export default function DebugEnvPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugEnv = () => {
      try {
        // Client-side environment variables (only NEXT_PUBLIC_* ones)
        const clientEnv = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
          NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
          VERCEL_URL: process.env.VERCEL_URL,
        };

        // Window location info
        const windowInfo = {
          origin: typeof window !== 'undefined' ? window.location.origin : 'Not in browser',
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'Not in browser',
        };

        // Try to import and test Supabase
        let supabaseInfo = null;
        try {
          // This will only work if Supabase is properly configured
          supabaseInfo = {
            supabaseAvailable: true,
            // We can't actually instantiate Supabase here without the keys
          };
        } catch (error) {
          supabaseInfo = {
            supabaseAvailable: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }

        setEnvInfo({
          clientEnv,
          windowInfo,
          supabaseInfo,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Debug error:', error);
        setEnvInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
      }
    };

    debugEnv();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Debugging Environment...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Client-Side Environment Variables</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(envInfo?.clientEnv, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Window Information</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(envInfo?.windowInfo, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Supabase Info</h2>
        <pre className="bg-white p-2 rounded text-sm overflow-auto">
          {JSON.stringify(envInfo?.supabaseInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}