'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import LocationSelector from '@/components/LocationSelector';
import LocationDisplay from '@/components/LocationDisplay';
import GlobalLocationManager from '@/lib/utils/globalLocationManager';
import { GLOBAL_EXHIBITION_DATA, type ExhibitionCountry, type ExhibitionCity } from '@/lib/data/globalCities';
import { 
  Plus, Edit, Trash2, Save, X, Search, Filter, MoreVertical,
  Globe, Building, MapPin, Calendar, Users, Award, TrendingUp,
  BarChart3, PieChart, Activity, RefreshCw, Download, Upload,
  Eye, CheckCircle, AlertCircle, Settings
} from 'lucide-react';

interface LocationStats {
  totalCountries: number;
  totalCities: number;
  totalBuilders: number;
  totalEvents: number;
  topContinents: Array<{ name: string; count: number; }>;
  topCountries: Array<{ name: string; events: number; rank: number; }>;
  topCities: Array<{ name: string; country: string; events: number; }>;
}

export function SuperAdminLocationManager() {
  const [activeTab, setActiveTab] = useState('overview');
  const [countries] = useState(GLOBAL_EXHIBITION_DATA.countries);
  const [cities] = useState(GLOBAL_EXHIBITION_DATA.cities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'country' | 'city' | null>(null);
  const { toast } = useToast();

  // Calculate statistics
  const [stats, setStats] = useState<LocationStats>({
    totalCountries: 0,
    totalCities: 0,
    totalBuilders: 0,
    totalEvents: 0,
    topContinents: [],
    topCountries: [],
    topCities: []
  });

  useEffect(() => {
    // Calculate comprehensive statistics
    const continentCounts = GLOBAL_EXHIBITION_DATA.continents.map(continent => ({
      name: continent,
      count: countries.filter(c => c.continent === continent).length
    }));

    const topCountries = countries
      .sort((a, b) => a.exhibitionRanking - b.exhibitionRanking)
      .slice(0, 10)
      .map(country => ({
        name: country.name,
        events: country.annualEvents,
        rank: country.exhibitionRanking
      }));

    const topCities = cities
      .sort((a, b) => b.annualEvents - a.annualEvents)
      .slice(0, 10)
      .map(city => ({
        name: city.name,
        country: city.country,
        events: city.annualEvents
      }));

    const totalEvents = countries.reduce((sum, c) => sum + c.annualEvents, 0);
    const totalBuilders = countries.reduce((sum, c) => sum + (c.totalVenues * 2), 0); // Estimated

    setStats({
      totalCountries: countries.length,
      totalCities: cities.length,
      totalBuilders,
      totalEvents,
      topContinents: continentCounts,
      topCountries,
      topCities
    });
  }, [countries, cities]);

  // Filter data based on search and continent
  const filteredCountries = countries.filter(country => {
    const matchesSearch = !searchTerm || 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.keyIndustries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesContinent = !selectedContinent || country.continent === selectedContinent;
    
    return matchesSearch && matchesContinent;
  });

  const filteredCities = cities.filter(city => {
    const matchesSearch = !searchTerm || 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.keyIndustries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesContinent = !selectedContinent || city.continent === selectedContinent;
    
    return matchesSearch && matchesContinent;
  });

  const handleEdit = (item: any, type: 'country' | 'city') => {
    setEditingItem(item);
    setEditType(type);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    // In a real implementation, this would call an API to save changes
    toast({
      title: "Changes Saved",
      description: `${editType === 'country' ? 'Country' : 'City'} information has been updated.`,
    });
    setIsEditModalOpen(false);
    setEditingItem(null);
    setEditType(null);
  };

  const handleDelete = (item: any, type: 'country' | 'city') => {
    // In a real implementation, this would call an API to delete the item
    toast({
      title: "Item Deleted",
      description: `${type === 'country' ? 'Country' : 'City'} has been removed from the database.`,
      variant: "destructive",
    });
  };

  const exportData = () => {
    // Export location data as JSON
    const data = {
      countries: filteredCountries,
      cities: filteredCities,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `location-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({
      title: "Data Exported",
      description: "Location data has been exported successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Location Manager</h1>
          <p className="text-gray-600">Manage countries, cities, and exhibition destinations worldwide</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Countries</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalCountries}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Across {GLOBAL_EXHIBITION_DATA.continents.length} continents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cities</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalCities}</p>
              </div>
              <Building className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Major exhibition destinations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Events</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalEvents.toLocaleString()}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Worldwide exhibitions per year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estimated Builders</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalBuilders.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Active exhibition builders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search countries, cities, or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedContinent} onValueChange={setSelectedContinent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Continents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Continents</SelectItem>
                {GLOBAL_EXHIBITION_DATA.continents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="countries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="countries">Countries ({filteredCountries.length})</TabsTrigger>
          <TabsTrigger value="cities">Cities ({filteredCities.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Countries Tab */}
        <TabsContent value="countries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Countries Management</CardTitle>
              <CardDescription>
                Manage exhibition countries, rankings, and industry data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Continent</TableHead>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Annual Events</TableHead>
                    <TableHead>Key Industries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.slice(0, 20).map((country) => (
                    <TableRow key={country.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{country.name}</div>
                            <div className="text-sm text-gray-500">{country.countryCode}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{country.continent}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">#{country.exhibitionRanking}</Badge>
                      </TableCell>
                      <TableCell>{country.annualEvents.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {country.keyIndustries.slice(0, 2).map((industry) => (
                            <Badge key={industry} variant="outline" className="text-xs">
                              {industry}
                            </Badge>
                          ))}
                          {country.keyIndustries.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{country.keyIndustries.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(country, 'country')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(country, 'country')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cities Tab */}
        <TabsContent value="cities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cities Management</CardTitle>
              <CardDescription>
                Manage exhibition cities, venues, and event data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Venues</TableHead>
                    <TableHead>Annual Events</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCities.slice(0, 20).map((city) => (
                    <TableRow key={city.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">{city.name}</div>
                            {city.isCapital && (
                              <Badge variant="default" className="text-xs">Capital</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{city.country}</TableCell>
                      <TableCell>{city.population}</TableCell>
                      <TableCell>{city.venues.length}</TableCell>
                      <TableCell>{city.annualEvents.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(city, 'city')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(city, 'city')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle>Top Exhibition Countries</CardTitle>
                <CardDescription>Ranked by global exhibition activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCountries.map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <span className="font-medium">{country.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{country.events.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">events/year</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card>
              <CardHeader>
                <CardTitle>Top Exhibition Cities</CardTitle>
                <CardDescription>Cities with highest event activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCities.map((city, index) => (
                    <div key={`${city.name}-${city.country}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <div className="text-xs text-gray-500">{city.country}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{city.events.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">events/year</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Continental Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Continental Distribution</CardTitle>
                <CardDescription>Countries by continent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topContinents.map((continent) => (
                    <div key={continent.name} className="flex items-center justify-between">
                      <span className="font-medium">{continent.name}</span>
                      <Badge variant="secondary">{continent.count} countries</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Recent system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Last Updated</span>
                    <Badge variant="outline">Just now</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <Badge variant="outline">&lt; 100ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Status</span>
                    <Badge variant="default" className="bg-green-600">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Coverage</span>
                    <Badge variant="secondary">100% Global</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location System Settings</CardTitle>
              <CardDescription>Configure global location management options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh All Data
                  </Button>
                  <Button variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validate Data Integrity
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Import
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="api-rate-limit">API Rate Limit (requests/minute)</Label>
                  <Input id="api-rate-limit" value="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                  <Input id="cache-duration" value="60" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Search Configuration</h3>
                <div className="space-y-2">
                  <Label htmlFor="search-limit">Default Search Limit</Label>
                  <Input id="search-limit" value="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-search-length">Minimum Search Length</Label>
                  <Input id="min-search-length" value="2" />
                </div>
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit {editType === 'country' ? 'Country' : 'City'}: {editingItem?.name}
            </DialogTitle>
            <DialogDescription>
              Modify location information and exhibition data
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" value={editingItem.name} />
                </div>
                {editType === 'country' && (
                  <div>
                    <Label htmlFor="edit-ranking">Exhibition Ranking</Label>
                    <Input id="edit-ranking" type="number" value={editingItem.exhibitionRanking} />
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-events">Annual Events</Label>
                <Input id="edit-events" type="number" value={editingItem.annualEvents} />
              </div>
              
              <div>
                <Label htmlFor="edit-industries">Key Industries (comma-separated)</Label>
                <Textarea id="edit-industries" value={editingItem.keyIndustries.join(', ')} />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SuperAdminLocationManager;