import { getServerSupabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function DebugCityBuildersPage() {
  let debugInfo: any = {};
  let error: string | null = null;

  try {
    console.log('=== DEBUG CITY BUILDERS SERVER SIDE ===');
    
    // Try direct Supabase fetch
    let supabaseBuilders: any[] = [];
    try {
      console.log('Attempting direct Supabase fetch...');
      const sb = getServerSupabase();
      if (sb) {
        console.log('Supabase client initialized successfully');
        
        // Try to fetch builders
        const { data, error: supabaseError } = await sb
          .from('builder_profiles')
          .select('*')
          .limit(10);
          
        if (supabaseError) {
          console.error('Supabase query error:', supabaseError);
          throw supabaseError;
        }
        
        supabaseBuilders = data || [];
        console.log(`Successfully fetched ${supabaseBuilders.length} builders from builder_profiles`);
        
        // Log sample builders
        supabaseBuilders.slice(0, 3).forEach((builder, index) => {
          console.log(`Builder ${index + 1}:`, {
            id: builder.id,
            company_name: builder.company_name,
            headquarters_country: builder.headquarters_country,
            headquarters_city: builder.headquarters_city,
          });
        });
      } else {
        console.log('Failed to initialize Supabase client');
      }
    } catch (supabaseError) {
      console.error('Direct Supabase fetch failed:', supabaseError);
      error = `Supabase error: ${supabaseError instanceof Error ? supabaseError.message : 'Unknown error'}`;
    }
    
    // Try builders table as well
    let buildersTableData: any[] = [];
    try {
      console.log('Attempting fetch from builders table...');
      const sb = getServerSupabase();
      if (sb) {
        const { data, error: buildersError } = await sb
          .from('builders')
          .select('*')
          .limit(10);
          
        if (buildersError) {
          console.error('Builders table query error:', buildersError);
        } else {
          buildersTableData = data || [];
          console.log(`Successfully fetched ${buildersTableData.length} builders from builders table`);
        }
      }
    } catch (buildersError) {
      console.error('Builders table fetch failed:', buildersError);
    }
    
    // Try API fetch
    let apiBuilders: any = null;
    try {
      console.log('Attempting API fetch...');
      // Use localhost for testing - in production this would be the actual domain
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/admin/builders?limit=10`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        apiBuilders = await response.json();
        console.log('API fetch successful:', {
          success: apiBuilders.success,
          buildersCount: apiBuilders.data?.builders?.length || 0
        });
      } else {
        console.error('API fetch failed:', response.status, response.statusText);
      }
    } catch (apiError) {
      console.error('API fetch failed:', apiError);
    }
    
    debugInfo = {
      supabaseBuilders: supabaseBuilders.length,
      buildersTable: buildersTableData.length,
      apiBuilders: apiBuilders ? {
        success: apiBuilders.success,
        count: apiBuilders.data?.builders?.length || 0
      } : null,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Debug error:', err);
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">City Builders Debug Info (Server Side)</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2 text-red-800">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Builder Profiles Table: {debugInfo?.supabaseBuilders || 0} builders</li>
          <li>Builders Table: {debugInfo?.buildersTable || 0} builders</li>
          <li>API Response: {debugInfo?.apiBuilders ? 
            (debugInfo.apiBuilders.success ? 
              `${debugInfo.apiBuilders.count} builders` : 
              'Failed') : 
            'Not attempted'}
          </li>
        </ul>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Timestamp</h2>
        <p>{debugInfo?.timestamp}</p>
      </div>
    </div>
  );
}