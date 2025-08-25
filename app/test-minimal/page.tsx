'use client';

import { useState, useEffect } from 'react';

export default function TestMinimalPage() {
  const [builders, setBuilders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBuilders = async () => {
      try {
        console.log('🔄 Loading builders...');
        const response = await fetch('/api/admin/builders');
        console.log('📡 Response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Data:', data);
        
        if (data.success && data.data && Array.isArray(data.data.builders)) {
          setBuilders(data.data.builders);
          console.log('✅ Loaded builders:', data.data.builders.length);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadBuilders();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Minimal - Loading...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Minimal - Error</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Minimal - Success</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-green-800">Successfully loaded {builders.length} builders</p>
      </div>
      
      <div className="space-y-4">
        {builders.map((builder, index) => (
          <div key={builder.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg">{builder.companyName}</h3>
            <p className="text-gray-600">{builder.headquarters?.city}, {builder.headquarters?.country}</p>
            <p className="text-sm text-gray-500">Email: {builder.contactInfo?.primaryEmail}</p>
            {builder.id?.startsWith('gmb_') && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                GMB Imported
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}