'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ClearCachePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const clearAllCache = useMutation(api.locations.clearAllCache);

  const handleClearCache = async () => {
    setStatus('loading');
    setMessage('');
    
    try {
      const result = await clearAllCache();
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Cache cleared successfully!');
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to clear cache');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to clear cache');
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Clear Cache</CardTitle>
              <CardDescription>
                Clear all cached data including countries, cities, builders, and statistics.
                This will force the system to reload fresh data from the database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-1">Important</h4>
                    <p className="text-sm text-yellow-800">
                      Clearing the cache will temporarily slow down the application while it reloads data.
                      Use this feature when you've made changes to location data or need to ensure you're seeing the latest information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">Alternative Method</h4>
                    <p className="text-sm text-blue-800">
                      If the cache clear fails, you can restart your development server to clear all cached data:
                    </p>
                    <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-2 block">
                      npm run dev
                    </code>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleClearCache}
                disabled={status === 'loading'}
                size="lg"
                className="w-full"
              >
                {status === 'loading' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Clear All Cache
              </Button>

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-1">Success!</h4>
                      <p className="text-sm text-green-800">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                      <p className="text-sm text-red-800">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">What gets cleared:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Country data cache (30 minutes TTL)</li>
                  <li>• City data cache (15 minutes TTL)</li>
                  <li>• Builder data cache (10 minutes TTL)</li>
                  <li>• Statistics cache (5 minutes TTL)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

