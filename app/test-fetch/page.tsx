'use client';

import { useState, useEffect } from 'react';

export default function TestFetch() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('🧪 Testing fetch to /api/admin/builders');
        setStatus('Fetching...');
        
        const response = await fetch('/api/admin/builders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('🧪 Response status:', response.status);
        setStatus(`Response status: ${response.status}`);
        
        if (response.ok) {
          const result = await response.json();
          console.log('🧪 Response data:', result);
          setData(result);
          setStatus('Success!');
        } else {
          const errorText = await response.text();
          console.error('🧪 Error response:', errorText);
          setError(`HTTP ${response.status}: ${errorText}`);
          setStatus('Error');
        }
      } catch (err) {
        console.error('🧪 Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('Failed');
      }
    };

    testFetch();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Fetch Test</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        {data && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success!</strong> Found {data.data?.builders?.length || 0} builders
            <pre className="mt-2 text-xs overflow-auto max-h-40">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}