"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card";
import { Alert, AlertDescription } from "@/components/shared/alert";
import { Progress } from "@/components/shared/progress";
import { Terminal, Loader2 } from "lucide-react";

export default function InitializeLocationsPage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setProgress(0);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/initialize-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResult({
        success: response.ok,
        message: data.message || (response.ok ? 'Locations initialized successfully' : 'Failed to initialize locations'),
        details: data
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsInitializing(false);
      setProgress(100);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Initialize Location Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Initialize the database with comprehensive location data including countries and cities.
            This process will populate the database with location information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleInitialize} 
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                'Initialize Locations'
              )}
            </Button>
          </div>
          
          {isInitializing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Initializing location data...
              </p>
            </div>
          )}
          
          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                <p>{result.message}</p>
                {result.details && (
                  <pre className="mt-2 text-xs bg-muted p-2 rounded">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
