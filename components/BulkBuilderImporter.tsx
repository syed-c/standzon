'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  Database, 
  Globe2, 
  Building2, 
  Users, 
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  TrendingUp,
  Eye
} from 'lucide-react';

interface CountryStats {
  total: number;
  imported: number;
  cities: string[];
  cityCount: number;
}

interface BulkImportStatus {
  totalBuilders: number;
  totalImported: number;
  countryBreakdown: Record<string, CountryStats>;
  supportedCountries: string[];
  lastUpdated: string | null;
}

export default function BulkBuilderImporter() {
  const [importStatus, setImportStatus] = useState<BulkImportStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [buildersPerCountry, setBuildersPerCountry] = useState(20);
  const [importMode, setImportMode] = useState<'all' | 'selective'>('all');
  const [importResult, setImportResult] = useState<any>(null);

  useEffect(() => {
    loadImportStatus();
  }, []);

  const loadImportStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/bulk-import');
      const data = await response.json();
      
      if (data.success) {
        setImportStatus(data.data);
        console.log('📊 Current import status:', data.data);
      } else {
        console.error('❌ Failed to load import status:', data.error);
      }
    } catch (error) {
      console.error('❌ Error loading import status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryToggle = (country: string, checked: boolean) => {
    if (checked) {
      setSelectedCountries([...selectedCountries, country]);
    } else {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    }
  };

  const handleSelectAllCountries = (checked: boolean) => {
    if (checked) {
      setSelectedCountries(importStatus?.supportedCountries || []);
    } else {
      setSelectedCountries([]);
    }
  };

  const executeBulkImport = async () => {
    if (!importStatus) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const payload = importMode === 'all' 
        ? { action: 'generate-all' }
        : { 
            action: 'generate-country', 
            countries: selectedCountries, 
            count: buildersPerCountry 
          };

      console.log('🚀 Starting bulk import with payload:', payload);

      const response = await fetch('/api/admin/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      clearInterval(progressInterval);
      setImportProgress(100);

      if (result.success) {
        setImportResult(result);
        console.log('✅ Bulk import successful:', result);
        
        // Refresh the status
        setTimeout(() => {
          loadImportStatus();
        }, 1000);
      } else {
        console.error('❌ Bulk import failed:', result.error);
        setImportResult({ success: false, error: result.error });
      }
    } catch (error) {
      console.error('❌ Bulk import error:', error);
      setImportResult({ success: false, error: error.message });
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading import status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!importStatus) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load import status</p>
            <Button onClick={loadImportStatus} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current Builder Database Status
          </CardTitle>
          <CardDescription>
            Overview of builders currently in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{importStatus.totalBuilders}</div>
              <div className="text-sm text-gray-600">Total Builders</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600">{importStatus.totalImported}</div>
              <div className="text-sm text-gray-600">GMB Imported</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {Object.keys(importStatus.countryBreakdown).length}
              </div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>

          {/* Country Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Builders by Country</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(importStatus.countryBreakdown).map(([country, stats]) => (
                <div key={country} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{country}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{stats.total}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{stats.cityCount}</span>
                    </div>
                    <Badge variant={stats.imported > 0 ? "default" : "secondary"}>
                      {stats.imported} imported
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Bulk Import Missing Builders
          </CardTitle>
          <CardDescription>
            Import builders for countries that are missing data. This will restore the builders you expected to have imported.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import Mode Selection */}
          <div className="space-y-3">
            <Label>Import Mode</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="import-all"
                  checked={importMode === 'all'}
                  onCheckedChange={(checked) => checked && setImportMode('all')}
                />
                <Label htmlFor="import-all" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Import All Countries (Recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="import-selective"
                  checked={importMode === 'selective'}
                  onCheckedChange={(checked) => checked && setImportMode('selective')}
                />
                <Label htmlFor="import-selective" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Selective Import
                </Label>
              </div>
            </div>
          </div>

          {importMode === 'all' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Recommended: Import All Countries</span>
              </div>
              <p className="text-sm text-blue-700">
                This will import builders for all supported countries: United States (25 builders), 
                United Arab Emirates (15 builders), United Kingdom (20 builders), and Australia (25 builders).
                Total: <strong>85 new builders</strong>
              </p>
            </div>
          )}

          {importMode === 'selective' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Select Countries</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-countries"
                      checked={selectedCountries.length === importStatus.supportedCountries.length}
                      onCheckedChange={handleSelectAllCountries}
                    />
                    <Label htmlFor="select-all-countries" className="text-sm">Select All</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {importStatus.supportedCountries.map((country) => {
                    const stats = importStatus.countryBreakdown[country];
                    const needsBuilders = !stats || stats.total < 10;
                    
                    return (
                      <div key={country} className="flex items-center space-x-2 p-2 border rounded">
                        <Checkbox
                          id={`country-${country}`}
                          checked={selectedCountries.includes(country)}
                          onCheckedChange={(checked) => handleCountryToggle(country, checked)}
                        />
                        <Label htmlFor={`country-${country}`} className="flex-1 flex items-center justify-between">
                          <span>{country}</span>
                          {needsBuilders && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Needs builders
                            </Badge>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="builders-count">Builders per Country</Label>
                <Input
                  id="builders-count"
                  type="number"
                  min="5"
                  max="50"
                  value={buildersPerCountry}
                  onChange={(e) => setBuildersPerCountry(parseInt(e.target.value) || 20)}
                  className="w-32"
                />
                <p className="text-xs text-gray-600">
                  Total to import: {selectedCountries.length * buildersPerCountry} builders
                </p>
              </div>
            </div>
          )}

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing builders...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={`p-4 rounded-lg border ${
              importResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              {importResult.success ? (
                <div>
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                    <CheckCircle className="h-4 w-4" />
                    Import Successful!
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>✅ Imported: {importResult.data?.imported} new builders</p>
                    <p>📊 Total builders now: {importResult.data?.totalBuilders}</p>
                    {importResult.data?.duplicatesSkipped > 0 && (
                      <p>⚠️ Duplicates skipped: {importResult.data.duplicatesSkipped}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                    <AlertCircle className="h-4 w-4" />
                    Import Failed
                  </div>
                  <p className="text-sm text-red-700">{importResult.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Import Button */}
          <Button
            onClick={executeBulkImport}
            disabled={isImporting || (importMode === 'selective' && selectedCountries.length === 0)}
            className="w-full"
            size="lg"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing Builders...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {importMode === 'all' 
                  ? 'Import All Missing Builders (85 builders)' 
                  : `Import Selected (${selectedCountries.length * buildersPerCountry} builders)`
                }
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}