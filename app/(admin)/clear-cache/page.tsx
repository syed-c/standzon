'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function ClearCachePage() {
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleClearCache = async () => {
    setIsClearing(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult({
        success: response.ok,
        message: data.message || (response.ok ? 'Cache cleared successfully' : 'Failed to clear cache')
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Clear Application Cache</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Clear the application cache to refresh all cached data. This will force the application 
            to fetch fresh data from the database on the next request.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleClearCache} 
              disabled={isClearing}
              variant="destructive"
            >
              {isClearing ? 'Clearing Cache...' : 'Clear Cache'}
            </Button>
          </div>
          
          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                {result.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

