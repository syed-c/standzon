'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIndexedDB } from '@/hooks/useIndexedDB';

export default function OfflineTest() {
  const [status, setStatus] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const { saveUserPreference, getUserPreference } = useIndexedDB();
  
  const testApiCall = async () => {
    setStatus('Testing API call...');
    
    try {
      const response = await fetch('/api/offline-test');
      const result = await response.json();
      
      setData(result);
      setStatus(`Success: ${result.message}`);
      
      // Save to IndexedDB for offline access
      await saveUserPreference('lastApiResult', result);
    } catch (error) {
      setStatus('Failed - you might be offline');
      
      // Try to get from IndexedDB
      const cached = await getUserPreference('lastApiResult');
      if (cached) {
        setData(cached);
        setStatus('Showing cached data (offline mode)');
      }
    }
  };
  
  const testBackgroundSync = async () => {
    setStatus('Testing background sync...');
    
    try {
      const response = await fetch('/api/offline-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test data',
          timestamp: new Date().toISOString()
        }),
      });
      
      const result = await response.json();
      
      if (response.status === 503) {
        setStatus('Request queued for background sync');
        // In a real app, we would queue this for background sync
      } else {
        setStatus(`Success: ${result.message}`);
      }
    } catch (error) {
      setStatus('Request queued for background sync (offline)');
      // In a real app, we would queue this for background sync
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Offline Functionality Test</h3>
      
      <div className="space-y-2">
        <Button onClick={testApiCall} variant="outline">
          Test API Call
        </Button>
        
        <Button onClick={testBackgroundSync} variant="outline">
          Test Background Sync
        </Button>
      </div>
      
      {status && (
        <div className="mt-3 p-2 bg-blue-50 text-blue-800 rounded">
          {status}
        </div>
      )}
      
      {data && (
        <div className="mt-3 p-2 bg-green-50 text-green-800 rounded">
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}