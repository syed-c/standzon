'use client';

import { useEffect, useState } from 'react';

export default function TestProxyPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [proxyTestResult, setProxyTestResult] = useState<any>(null);
  const [imageTestResult, setImageTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        // Test the image proxy utility functions
        const utilityResponse = await fetch('/api/test-image-proxy');
        const utilityData = await utilityResponse.json();
        setTestResult(utilityData);
        
        // Test the media proxy endpoint
        const proxyResponse = await fetch('/api/media-test');
        const proxyData = await proxyResponse.json();
        setProxyTestResult(proxyData);
        
        // Test the image test endpoint
        const imageTestResponse = await fetch('/api/test-image');
        const imageData = await imageTestResponse.json();
        setImageTestResult(imageData);
      } catch (err) {
        setError('Failed to test proxy: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Media Proxy Test</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Testing media proxy...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {testResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Image Proxy Utility Tests</h2>
            <div className="mb-2">
              <span className={`px-2 py-1 rounded ${testResult.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {testResult.success ? 'PASS' : 'FAIL'}
              </span>
              <span className="ml-2">{testResult.message}</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        {proxyTestResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Media Proxy Endpoint Test</h2>
            <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(proxyTestResult, null, 2)}
            </pre>
          </div>
        )}
        
        {imageTestResult && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">Image Test Endpoint</h2>
            <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(imageTestResult, null, 2)}
            </pre>
            {imageTestResult.proxyUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">To test actual image proxying:</p>
                <a 
                  href={imageTestResult.proxyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Click here to test the image proxy
                </a>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Proxy Implementation Details</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The media proxy has been implemented to serve images through your custom domain instead of 
              directly from Supabase storage URLs.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Images uploaded to Supabase storage return absolute proxied URLs (e.g., http://localhost:3000/api/media/bucket/path/to/image.jpg)</li>
                <li>The proxy API route fetches the image from Supabase and serves it through your domain</li>
                <li>Existing Supabase URLs in the CMS are automatically converted to proxied URLs</li>
                <li>All images in galleries now use the proxy for consistent branding</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting:</h3>
              <p>If images are not displaying:</p>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>Check that the Supabase URL is correct and the image exists</li>
                <li>Verify the bucket name is correct (gallery or portfolio-images)</li>
                <li>Ensure the proxy endpoint is working by testing /api/media-test</li>
                <li>Check browser console for any errors</li>
                <li>Verify the image path format: http://domain.com/api/media/bucket/path/to/image.ext</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">URL Format Examples:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gallery images: <code className="bg-gray-200 px-1 rounded">http://localhost:3000/api/media/gallery/countries/germany/image.jpg</code></li>
                <li>Portfolio images: <code className="bg-gray-200 px-1 rounded">http://localhost:3000/api/media/portfolio-images/logos/company.png</code></li>
                <li>Direct Supabase URL: <code className="bg-gray-200 px-1 rounded">https://project.supabase.co/storage/v1/object/public/bucket/path/image.jpg</code></li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-green-800 mb-2">Current Domain Information:</h3>
              <p>Current domain: <code className="bg-gray-200 px-1 rounded">{typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'Not available in SSR'}</code></p>
              <p>All proxied URLs will now be generated with this domain prefix.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}