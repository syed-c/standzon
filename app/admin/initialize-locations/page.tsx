"use client";

import { useState } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, MapPin, Building2, Globe } from "lucide-react";

export default function InitializeLocationsPage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initResults, setInitResults] = useState<any>(null);
  
  const initializeLocations = useMutation(api.locations.initializeLocations);
  const updateBuilderCounts = useMutation(api.locations.updateLocationBuilderCounts);
  const locationStats = useQuery(api.locations.getLocationStats);
  const allCountries = useQuery(api.locations.getAllCountries);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      console.log("Starting location initialization...");
      const result = await initializeLocations({});
      setInitResults(result);
      
      if (result.success) {
        console.log("Updating builder counts...");
        await updateBuilderCounts({});
      }
    } catch (error) {
      console.error("Initialization error:", error);
      setInitResults({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Location Data Initialization
          </h1>
          <p className="text-gray-600">
            Initialize countries and cities data from the comprehensive location dataset.
          </p>
        </div>

        {/* Current Stats */}
        {locationStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Countries</p>
                    <p className="text-2xl font-bold text-gray-900">{locationStats.totalCountries}</p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cities</p>
                    <p className="text-2xl font-bold text-gray-900">{locationStats.totalCities}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Builders</p>
                    <p className="text-2xl font-bold text-gray-900">{locationStats.totalBuilders}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-gray-900">{locationStats.verifiedBuilders}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initialize Button */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Initialize Location Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleInitialize}
                disabled={isInitializing}
                size="lg"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Initialize Countries & Cities"
                )}
              </Button>
              <p className="text-sm text-gray-600">
                This will populate the database with countries and cities from the location dataset.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {initResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {initResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Initialization Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {initResults.success ? (
                <div className="space-y-4">
                  <p className="text-green-600 font-medium">{initResults.message}</p>
                  {initResults.results && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {initResults.results.countriesCreated}
                        </p>
                        <p className="text-sm text-gray-600">Countries Created</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {initResults.results.citiesCreated}
                        </p>
                        <p className="text-sm text-gray-600">Cities Created</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">
                          {initResults.results.countriesSkipped}
                        </p>
                        <p className="text-sm text-gray-600">Countries Skipped</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">
                          {initResults.results.citiesSkipped}
                        </p>
                        <p className="text-sm text-gray-600">Cities Skipped</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-600">
                  <p className="font-medium">Error occurred during initialization:</p>
                  <p className="text-sm mt-2">{initResults.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Countries List */}
        {allCountries && allCountries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Countries in Database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCountries.map((country) => (
                  <div key={country._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{country.countryName}</p>
                      <p className="text-sm text-gray-600">
                        {country.cityCount} cities • {country.builderCount} builders
                      </p>
                    </div>
                    <Badge variant="outline">
                      {country.countryCode}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}