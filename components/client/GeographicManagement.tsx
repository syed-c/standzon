'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/card';
import { Button } from '@/components/shared/button';
import { Badge } from '@/components/shared/badge';
import { Input } from '@/components/shared/input';
import { Label } from '@/components/shared/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shared/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/select';
import { toast } from '@/hooks/use-toast';
import {
  Globe,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Building,
  Users,
  Star,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { adminAPI } from '@/lib/api/admin';

interface Country {
  id: string;
  name: string;
  code: string;
  builderCount: number;
}

interface City {
  id: string;
  name: string;
  country: string;
  builderCount: number;
}

interface GeographicManagementProps {
  adminId: string;
  permissions: string[];
}

export default function GeographicManagement({ adminId, permissions }: GeographicManagementProps) {
  const [activeTab, setActiveTab] = useState('countries');
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('all');
  
  // Dialog states
  const [showAddCountryDialog, setShowAddCountryDialog] = useState(false);
  const [showAddCityDialog, setShowAddCityDialog] = useState(false);
  const [showEditCountryDialog, setShowEditCountryDialog] = useState(false);
  const [showEditCityDialog, setShowEditCityDialog] = useState(false);
  
  // Form states
  const [newCountry, setNewCountry] = useState({ name: '', code: '' });
  const [newCity, setNewCity] = useState({ name: '', country: '' });
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  useEffect(() => {
    console.log('Geographic Management: Component initialized');
    loadGeographicData();
  }, []);

  const loadGeographicData = async () => {
    try {
      setLoading(true);
      console.log('Loading geographic data...');
      
      const [countriesResponse, citiesResponse] = await Promise.all([
        adminAPI.getCountries(),
        adminAPI.getCities()
      ]);

      if (countriesResponse.success) {
        setCountries(countriesResponse.data || []);
        console.log('Countries loaded:', countriesResponse.data?.length);
      }

      if (citiesResponse.success) {
        setCities(citiesResponse.data || []);
        console.log('Cities loaded:', citiesResponse.data?.length);
      }

    } catch (error) {
      console.error('Error loading geographic data:', error);
      toast({
        title: "Error",
        description: "Failed to load geographic data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    if (!newCountry.name || !newCountry.code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Adding new country:', newCountry);
      const response = await adminAPI.createCountry({
        ...newCountry,
        builderCount: 0
      });

      if (response.success) {
        setCountries(prev => [...prev, response.data]);
        setNewCountry({ name: '', code: '' });
        setShowAddCountryDialog(false);
        toast({
          title: "✅ Success",
          description: `Country "${newCountry.name}" added successfully.`
        });
      }
    } catch (error) {
      console.error('Error adding country:', error);
      toast({
        title: "Error",
        description: "Failed to add country.",
        variant: "destructive"
      });
    }
  };

  const handleAddCity = async () => {
    if (!newCity.name || !newCity.country) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Adding new city:', newCity);
      const response = await adminAPI.createCity({
        ...newCity,
        builderCount: 0
      });

      if (response.success) {
        setCities(prev => [...prev, response.data]);
        setNewCity({ name: '', country: '' });
        setShowAddCityDialog(false);
        toast({
          title: "✅ Success",
          description: `City "${newCity.name}" added successfully.`
        });
      }
    } catch (error) {
      console.error('Error adding city:', error);
      toast({
        title: "Error",
        description: "Failed to add city.",
        variant: "destructive"
      });
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
    country.code.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchCity.toLowerCase());
    const matchesCountry = selectedCountryFilter === 'all' || city.country === selectedCountryFilter;
    return matchesSearch && matchesCountry;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading geographic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geographic Management</h2>
          <p className="text-gray-600 mt-1">
            Manage countries and cities for the platform
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Globe className="h-3 w-3 mr-1" />
              {countries.length} Countries
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <MapPin className="h-3 w-3 mr-1" />
              {cities.length} Cities
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={loadGeographicData}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="countries">Countries Management</TabsTrigger>
          <TabsTrigger value="cities">Cities Management</TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Countries Directory</span>
                </div>
                <Dialog open={showAddCountryDialog} onOpenChange={setShowAddCountryDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Country</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Country</DialogTitle>
                      <DialogDescription>
                        Add a new country to the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="countryName">Country Name</Label>
                        <Input
                          id="countryName"
                          value={newCountry.name}
                          onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
                          placeholder="e.g., United States"
                        />
                      </div>
                      <div>
                        <Label htmlFor="countryCode">Country Code</Label>
                        <Input
                          id="countryCode"
                          value={newCountry.code}
                          onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })}
                          placeholder="e.g., US"
                          maxLength={3}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-4">
                        <Button onClick={handleAddCountry}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Country
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddCountryDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                Manage the list of countries available on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search countries..."
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="space-y-3">
                {filteredCountries.map((country) => (
                  <div key={country.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{country.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">Code: {country.code}</span>
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{country.builderCount} builders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCountry(country);
                          setShowEditCountryDialog(true);
                        }}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCountries.length === 0 && (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No countries found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Cities Directory</span>
                </div>
                <Dialog open={showAddCityDialog} onOpenChange={setShowAddCityDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add City</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New City</DialogTitle>
                      <DialogDescription>
                        Add a new city to the platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cityName">City Name</Label>
                        <Input
                          id="cityName"
                          value={newCity.name}
                          onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                          placeholder="e.g., New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cityCountry">Country</Label>
                        <Select 
                          value={newCity.country} 
                          onValueChange={(value) => setNewCity({ ...newCity, country: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country.id} value={country.name}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-4">
                        <Button onClick={handleAddCity}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add City
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddCityDialog(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
              <CardDescription>
                Manage the list of cities available on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search cities..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCountryFilter} onValueChange={setSelectedCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cities List */}
              <div className="space-y-3">
                {filteredCities.map((city) => (
                  <div key={city.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{city.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">Country: {city.country}</span>
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{city.builderCount} builders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCity(city);
                          setShowEditCityDialog(true);
                        }}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCities.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No cities found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}