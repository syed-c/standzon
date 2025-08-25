"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export default function TestConvexPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConvexConnection = async () => {
    setLoading(true);
    try {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      
      console.log('Testing Convex connection...');
      const buildersData = await convex.query(api.builders.getAllBuilders, { 
        limit: 10,
        offset: 0 
      });
      
      console.log('Convex response:', buildersData);
      setResult(buildersData);
    } catch (error) {
      console.error('Convex error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testImportBuilder = async () => {
    setLoading(true);
    try {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      
      const testBuilder = {
        builderData: {
          companyName: "Test Dubai Builder",
          primaryEmail: "",
          phone: "+971-4-123-4567",
          website: "https://www.testdubaibuilder.ae",
          contactPerson: "Test Contact",
          position: "Manager",
          headquartersCity: "Dubai",
          headquartersCountry: "United Arab Emirates",
          headquartersCountryCode: "AE",
          headquartersAddress: "Test Address, Dubai, UAE",
          headquartersLatitude: 25.2048,
          headquartersLongitude: 55.2708,
          companyDescription: "Test builder for verification",
          rating: 4.5,
          reviewCount: 10,
          verified: true,
          claimed: false,
          claimStatus: "unclaimed",
          gmbPlaceId: "test_builder_" + Date.now(),
          source: "GMB_API",
          importedAt: Date.now(),
          lastUpdated: Date.now(),
        },
        serviceLocations: [{
          city: "Dubai",
          country: "United Arab Emirates",
          countryCode: "AE",
          address: "Test Address, Dubai, UAE",
          latitude: 25.2048,
          longitude: 55.2708,
          isHeadquarters: true,
        }],
        services: [{
          name: "Exhibition Stand Builder",
          description: "Test service",
          category: "General",
          currency: "AED",
          unit: "per project",
          popular: false,
          turnoverTime: "Contact for details",
        }],
      };

      console.log('Importing test builder...');
      const importResult = await convex.mutation(api.builders.importGMBBuilder, testBuilder);
      
      console.log('Import result:', importResult);
      setResult({ importResult, message: 'Builder imported successfully' });
    } catch (error) {
      console.error('Import error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Convex Database Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={testConvexConnection}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing...' : 'Test Connection & Query Builders'}
              </Button>
              
              <Button 
                onClick={testImportBuilder}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Importing...' : 'Import Test Builder'}
              </Button>
            </div>

            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}