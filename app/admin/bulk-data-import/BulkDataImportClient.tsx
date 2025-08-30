"use client";

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Database, Users, MapPin, Wrench, Target, Loader2 } from 'lucide-react';

export default function BulkDataImportClient() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [clearExisting, setClearExisting] = useState(false);

  const bulkImport = useMutation(api.bulkBuilderImport.bulkImportBuilders);
  const builderStats = useQuery(api.builders.getBuilderStats);

  const handleImport = async () => {
    setIsImporting(true);
    setImportResult(null);
    
    try {
      const result = await bulkImport({ clearExisting });
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Import failed. Please try again.'
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bulk Data Import</h1>
          <p className="text-muted-foreground mt-2">
            Import comprehensive sample data to populate the platform with builders across major cities worldwide
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Database className="w-4 h-4 mr-2" />
          Data Management
        </Badge>
      </div>

      {/* Current Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Platform Statistics
          </CardTitle>
          <CardDescription>
            Overview of existing data in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {builderStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{builderStats.totalBuilders}</div>
                <div className="text-sm text-blue-700">Total Builders</div>
              </div>
              <div className="text-center p-4 bg-claret-50 rounded-lg">
                <div className="text-2xl font-bold text-claret-600">{builderStats.verifiedBuilders}</div>
                <div className="text-sm text-claret-700">Verified Builders</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{builderStats.totalCountries}</div>
                <div className="text-sm text-purple-700">Countries</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{builderStats.totalCities}</div>
                <div className="text-sm text-orange-700">Cities</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading statistics...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Import Sample Data
          </CardTitle>
          <CardDescription>
            Import comprehensive builder data across major exhibition cities worldwide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What will be imported */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">What will be imported:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium">16 Premium Builders</div>
                  <div className="text-sm text-gray-600">Professional exhibition stand builders with complete profiles</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-claret-500 mt-0.5" />
                <div>
                  <div className="font-medium">45+ Service Locations</div>
                  <div className="text-sm text-gray-600">Major cities across US, Europe, Asia, and Australia</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Wrench className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium">80+ Services</div>
                  <div className="text-sm text-gray-600">Design, construction, graphics, AV integration, and more</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-medium">48+ Specializations</div>
                  <div className="text-sm text-gray-600">Industry expertise across technology, healthcare, automotive, etc.</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cities covered */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Major Cities Covered:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                'Las Vegas, US', 'Berlin, DE', 'Dubai, UAE', 'Sydney, AU',
                'Melbourne, AU', 'Paris, FR', 'London, UK', 'Milan, IT',
                'Barcelona, ES', 'Amsterdam, NL', 'Singapore, SG', 'Tokyo, JP',
                'Los Angeles, US', 'Munich, DE', 'Abu Dhabi, AE', 'Brisbane, AU'
              ].map((city) => (
                <Badge key={city} variant="secondary" className="justify-center">
                  {city}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Import Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="clearExisting"
                checked={clearExisting}
                onChange={(e) => setClearExisting(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="clearExisting" className="text-sm font-medium">
                Clear existing builder data before import
              </label>
            </div>
            {clearExisting && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> This will permanently delete all existing builders, services, locations, and specializations before importing new data.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Import Button */}
          <Button
            onClick={handleImport}
            disabled={isImporting}
            size="lg"
            className="w-full"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing Data...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                {clearExisting ? 'Clear & Import Sample Data' : 'Import Sample Data'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="w-5 h-5 text-claret-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={importResult.success ? "border-claret-200 bg-claret-50" : "border-red-200 bg-red-50"}>
              <AlertDescription className={importResult.success ? "text-claret-800" : "text-red-800"}>
                {importResult.message}
              </AlertDescription>
            </Alert>

            {importResult.success && importResult.imported && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{importResult.imported.builders}</div>
                  <div className="text-sm text-blue-700">Builders</div>
                </div>
                <div className="text-center p-3 bg-claret-50 rounded-lg">
                  <div className="text-xl font-bold text-claret-600">{importResult.imported.serviceLocations}</div>
                  <div className="text-sm text-claret-700">Locations</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{importResult.imported.services}</div>
                  <div className="text-sm text-purple-700">Services</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{importResult.imported.specializations}</div>
                  <div className="text-sm text-orange-700">Specializations</div>
                </div>
              </div>
            )}

            {importResult.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-800">
                  <strong>Error Details:</strong> {importResult.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}