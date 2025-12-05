'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Globe, MapPin, Building, Search, Download, RefreshCw, TrendingUp, Map, Database, Users } from 'lucide-react';

interface LocationKKSData {
  continents: string[];
  countries: Array<{
    name: string;
    code: string;
    continent: string;
    cities: string[];
  }>;
  exhibitionHubs: Array<{
    id: string;
    name: string;
    country: string;
    countryCode: string;
    continent: string;
    coordinates: { lat: number; lng: number };
    annualEvents: number;
    keyIndustries: string[];
    is_exhibition_hub: boolean;
  }>;
  totalStats: {
    continents: number;
    countries: number;
    cities: number;
    exhibitionHubs: number;
    totalEvents: number;
  };
}

interface GMBLocation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  coordinates: { lat: number; lng: number };
  searchQueries: string[];
  priority: 'high' | 'medium' | 'low';
  annualEvents: number;
  keyIndustries: string[];
}

interface GMBSearchPlan {
  totalLocations: number;
  priorityLocations: GMBLocation[];
  regionalBreakdown: Array<{
    continent: string;
    locations: number;
    highPriority: number;
    totalEvents: number;
  }>;
  industryBreakdown: Array<{
    industry: string;
    locations: number;
  }>;
  searchQueries: Array<{
    location: string;
    queries: string[];
  }>;
}

export default function LocationKKSDashboard() {
  const [locationData, setLocationData] = useState<LocationKKSData | null>(null);
  const [gmbPlan, setGmbPlan] = useState<GMBSearchPlan | null>(null);
  const [gmbLocations, setGmbLocations] = useState<GMBLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [industryFilter, setIndustryFilter] = useState<string>('');

  // Load initial location data
  useEffect(() => {
    loadLocationData();
    loadGMBSearchPlan();
  }, []);

  const loadLocationData = async () => {
    setLoading(true);
    try {
      console.log('🌍 Loading Location KKS data...');
      const response = await fetch('/api/admin/location-kks?action=all-regions');
      const result = await response.json();
      
      if (result.success) {
        setLocationData(result.data);
        console.log('✅ Location KKS data loaded:', result.data.totalStats);
      }
    } catch (error) {
      console.error('❌ Error loading location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGMBSearchPlan = async () => {
    try {
      console.log('📋 Loading GMB search plan...');
      const response = await fetch('/api/admin/location-kks?action=gmb-search-plan');
      const result = await response.json();
      
      if (result.success) {
        setGmbPlan(result.data);
        console.log('✅ GMB search plan loaded');
      }
    } catch (error) {
      console.error('❌ Error loading GMB plan:', error);
    }
  };

  const loadGMBLocations = async (filters: { continent?: string; country?: string; industry?: string }) => {
    setLoading(true);
    try {
      console.log('🔍 Loading GMB locations with filters:', filters);
      
      let url = '/api/admin/location-kks?action=gmb-locations';
      if (filters.continent) url += `&continent=${filters.continent}`;
      if (filters.country) url += `&country=${filters.country}`;
      if (filters.industry) {
        url = `/api/admin/location-kks?action=industry-hubs&industry=${filters.industry}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setGmbLocations(result.data);
        console.log('✅ GMB locations loaded:', result.data.length);
      }
    } catch (error) {
      console.error('❌ Error loading GMB locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!locationData) {
    return (
      <div data-macaly="location-kks-loading" className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading Location KKS Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-macaly="location-kks-dashboard" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Location KKS Dashboard</h1>
          <p className="text-gray-600">Key Knowledge Store for Exhibition Regions & GMB API Integration</p>
        </div>
        <Button onClick={loadLocationData} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Continents</p>
                <p className="text-2xl font-bold">{locationData.totalStats.continents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold">{locationData.totalStats.countries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Exhibition Hubs</p>
                <p className="text-2xl font-bold">{locationData.totalStats.exhibitionHubs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Annual Events</p>
                <p className="text-2xl font-bold">{locationData.totalStats.totalEvents.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Total Cities</p>
                <p className="text-2xl font-bold">{locationData.totalStats.cities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gmb-integration">GMB Integration</TabsTrigger>
          <TabsTrigger value="location-explorer">Location Explorer</TabsTrigger>
          <TabsTrigger value="search-queries">Search Queries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Continental Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Continental Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationData.continents.map(continent => {
                    const continentCountries = locationData.countries.filter(c => c.continent === continent);
                    const continentHubs = locationData.exhibitionHubs.filter(h => h.continent === continent);
                    const continentEvents = continentHubs.reduce((sum, hub) => sum + hub.annualEvents, 0);
                    
                    return (
                      <div key={continent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{continent}</p>
                          <p className="text-sm text-gray-600">
                            {continentCountries.length} countries, {continentHubs.length} hubs
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{continentEvents.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">annual events</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Exhibition Hubs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Top Exhibition Hubs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationData.exhibitionHubs
                    .sort((a, b) => b.annualEvents - a.annualEvents)
                    .slice(0, 8)
                    .map(hub => (
                      <div key={hub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{hub.name}</p>
                          <p className="text-sm text-gray-600">{hub.country}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{hub.annualEvents}</p>
                          <p className="text-xs text-gray-500">events/year</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GMB Integration Tab */}
        <TabsContent value="gmb-integration" className="space-y-6">
          {gmbPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GMB Plan Overview */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    GMB Search Plan Overview
                  </CardTitle>
                  <CardDescription>
                    Comprehensive plan for fetching exhibition stand builders via Google My Business API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{gmbPlan.totalLocations}</p>
                      <p className="text-sm text-gray-600">Total Locations</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{gmbPlan.priorityLocations.length}</p>
                      <p className="text-sm text-gray-600">High Priority</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{gmbPlan.regionalBreakdown.length}</p>
                      <p className="text-sm text-gray-600">Regions</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{gmbPlan.industryBreakdown.length}</p>
                      <p className="text-sm text-gray-600">Industries</p>
                    </div>
                  </div>

                  {/* Regional Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Regional Priority Breakdown</h4>
                    {gmbPlan.regionalBreakdown.map(region => (
                      <div key={region.continent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{region.continent}</p>
                          <p className="text-sm text-gray-600">
                            {region.locations} locations ({region.highPriority} high priority)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{region.totalEvents.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">total events</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Locations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>High Priority Locations</CardTitle>
                  <CardDescription>Top locations for GMB API searches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {gmbPlan.priorityLocations.slice(0, 15).map(location => (
                      <div key={location.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{location.name}</p>
                          <p className="text-xs text-gray-600">{location.country}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPriorityColor(location.priority)} text-white text-xs`}>
                            {location.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{location.annualEvents}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Industries */}
              <Card>
                <CardHeader>
                  <CardTitle>Industry Focus</CardTitle>
                  <CardDescription>Key industries for targeted searches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gmbPlan.industryBreakdown.slice(0, 10).map(industry => (
                      <div key={industry.industry} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{industry.industry}</span>
                        <Badge variant="outline" className="text-xs">
                          {industry.locations}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Location Explorer Tab */}
        <TabsContent value="location-explorer" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Location Filters</CardTitle>
              <CardDescription>Filter exhibition hubs by continent, country, or industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Continent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Continents</SelectItem>
                    {locationData.continents.map(continent => (
                      <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {locationData.countries
                      .filter(country => !selectedContinent || country.continent === selectedContinent)
                      .map(country => (
                        <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Filter by Industry"
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                />

                <Button
                  onClick={() => loadGMBLocations({
                    continent: selectedContinent || undefined,
                    country: selectedCountry || undefined,
                    industry: industryFilter || undefined
                  })}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search Locations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GMB Locations Results */}
          {gmbLocations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exhibition Hub Results ({gmbLocations.length})</CardTitle>
                <CardDescription>Filtered exhibition hubs with GMB search data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {gmbLocations.map(location => (
                    <div key={location.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{location.name}</h4>
                          <p className="text-sm text-gray-600">{location.country}</p>
                        </div>
                        <Badge className={`${getPriorityColor(location.priority)} text-white`}>
                          {location.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Annual Events:</span>
                          <span className="font-medium">{location.annualEvents}</span>
                        </div>
                        <div>
                          <span>Key Industries:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {location.keyIndustries.slice(0, 3).map(industry => (
                              <Badge key={industry} variant="outline" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span>GMB Queries:</span>
                          <p className="text-xs text-gray-500 mt-1">
                            {location.searchQueries.length} search terms available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Search Queries Tab */}
        <TabsContent value="search-queries" className="space-y-6">
          {gmbPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Sample GMB Search Queries</CardTitle>
                <CardDescription>
                  Example search queries for top exhibition hubs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gmbPlan.searchQueries.map(queryData => (
                    <div key={queryData.location} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{queryData.location}</h4>
                      <div className="flex flex-wrap gap-2">
                        {queryData.queries.map(query => (
                          <Badge key={query} variant="outline" className="text-xs">
                            {query}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Detailed analytics and insights about location performance, GMB search effectiveness, and builder distribution will be available here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}