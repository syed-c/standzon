'use client';

import { useEffect, useState } from 'react';

export default function DebugImagePage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        // Use a consistent filename for testing
        const testFilename = '1762767272165-1p60c0uhnnw.jpg';
        
        // Test various aspects of image access
        const tests = {
          // Test if the specific image exists in Supabase
          supabaseUrl: `https://elipzumpfnzmzifrcnl.supabase.co/storage/v1/object/public/gallery/countries/germany/2025-11-10/${testFilename}`,
          
          // Test our proxy with the correct port
          proxyUrl3002: `http://localhost:3002/api/media/gallery/countries/germany/2025-11-10/${testFilename}`,
          
          // Test with the port you mentioned
          proxyUrl3001: `http://localhost:3001/api/media/gallery/countries/germany/2025-11-10/${testFilename}`
        };
        
        // Helper function to safely fetch with error handling
        const safeFetch = async (url: string, options?: RequestInit) => {
          try {
            const response = await fetch(url, options);
            return {
              ok: response.ok,
              status: response.status,
              data: await response.json().catch(() => ({}))
            };
          } catch (err) {
            return {
              ok: false,
              status: 0,
              error: err instanceof Error ? err.message : String(err)
            };
          }
        };
        
        // Test direct Supabase access
        const supabaseResponse = await safeFetch(tests.supabaseUrl, { method: 'HEAD' });
        
        // Test our proxy on port 3002
        const proxyResponse3002 = await safeFetch(tests.proxyUrl3002, { method: 'HEAD' });
        
        // Test our proxy on port 3001
        const proxyResponse3001 = await safeFetch(tests.proxyUrl3001, { method: 'HEAD' });
        
        // Test our API endpoints
        const checkImageResponse = await safeFetch('/api/check-image');
        const testImageExistsResponse = await safeFetch('/api/test-image-exists');
        const testSupabaseUrlResponse = await safeFetch('/api/test-supabase-url');
        const networkTestResponse = await safeFetch('/api/network-test');
        const mediaTestResponse = await safeFetch('/api/media-test');
        
        setTestResult({
          tests,
          supabase: {
            url: tests.supabaseUrl,
            exists: supabaseResponse.ok,
            status: supabaseResponse.status,
            error: supabaseResponse.error
          },
          proxy3002: {
            url: tests.proxyUrl3002,
            exists: proxyResponse3002.ok,
            status: proxyResponse3002.status,
            error: proxyResponse3002.error
          },
          proxy3001: {
            url: tests.proxyUrl3001,
            exists: proxyResponse3001.ok,
            status: proxyResponse3001.status,
            error: proxyResponse3001.error
          },
          checkImage: checkImageResponse.data || checkImageResponse,
          testImageExists: testImageExistsResponse.data || testImageExistsResponse,
          testSupabaseUrl: testSupabaseUrlResponse.data || testSupabaseUrlResponse,
          networkTest: networkTestResponse.data || networkTestResponse,
          mediaTest: mediaTestResponse.data || mediaTestResponse
        });
      } catch (err) {
        setError('Failed to test: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Image Debug Test</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Testing image access...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {testResult && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Direct Supabase Access</h2>
              <p>URL: <code className="bg-gray-200 px-1 rounded break-all">{testResult.supabase.url}</code></p>
              <p>Status: <span className={`px-2 py-1 rounded ${testResult.supabase.exists ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {testResult.supabase.status} ({testResult.supabase.exists ? 'Found' : 'Not Found'})
              </span></p>
              {testResult.supabase.error && (
                <p className="text-red-600 mt-2">Error: {testResult.supabase.error}</p>
              )}
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Proxy Access (Port 3002)</h2>
              <p>URL: <code className="bg-gray-200 px-1 rounded break-all">{testResult.proxy3002.url}</code></p>
              <p>Status: <span className={`px-2 py-1 rounded ${testResult.proxy3002.exists ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {testResult.proxy3002.status} ({testResult.proxy3002.exists ? 'Found' : 'Not Found'})
              </span></p>
              {testResult.proxy3002.error && (
                <p className="text-red-600 mt-2">Error: {testResult.proxy3002.error}</p>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">Proxy Access (Port 3001)</h2>
              <p>URL: <code className="bg-gray-200 px-1 rounded break-all">{testResult.proxy3001.url}</code></p>
              <p>Status: <span className={`px-2 py-1 rounded ${testResult.proxy3001.exists ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {testResult.proxy3001.status} ({testResult.proxy3001.exists ? 'Found' : 'Not Found'})
              </span></p>
              {testResult.proxy3001.error && (
                <p className="text-red-600 mt-2">Error: {testResult.proxy3001.error}</p>
              )}
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">Supabase File Check</h2>
              <pre className="bg-white p-2 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResult.checkImage, null, 2)}
              </pre>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-indigo-800 mb-2">Image Existence Test</h2>
              <pre className="bg-white p-2 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResult.testImageExists, null, 2)}
              </pre>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-orange-800 mb-2">Direct Supabase URL Test</h2>
              <pre className="bg-white p-2 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResult.testSupabaseUrl, null, 2)}
              </pre>
            </div>
            
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-teal-800 mb-2">Network Test</h2>
              <pre className="bg-white p-2 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResult.networkTest, null, 2)}
              </pre>
            </div>
            
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-cyan-800 mb-2">Media API Test</h2>
              <pre className="bg-white p-2 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResult.mediaTest, null, 2)}
              </pre>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-pink-800 mb-2">Image Display Test</h2>
              <p>Trying to display the image through proxy (port 3002):</p>
              <img 
                src={`http://localhost:3002/api/media/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg`} 
                alt="Test image" 
                className="max-w-full h-auto mt-2 border border-gray-300"
                onError={(e) => console.log('Image failed to load on port 3002')}
                onLoad={(e) => console.log('Image loaded successfully on port 3002')}
              />
              <p className="mt-4">Trying to display the image through proxy (port 3001):</p>
              <img 
                src={`http://localhost:3001/api/media/gallery/countries/germany/2025-11-10/1762767272165-1p60c0uhnnw.jpg`} 
                alt="Test image" 
                className="max-w-full h-auto mt-2 border border-gray-300"
                onError={(e) => console.log('Image failed to load on port 3001')}
                onLoad={(e) => console.log('Image loaded successfully on port 3001')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}