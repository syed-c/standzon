'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testApi = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/builders?limit=10');
      const data = await response.json();
      
      console.log('API Response:', data);
      setResult(data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to test API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test API Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={testApi} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test API Endpoint'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">API Result:</h3>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}