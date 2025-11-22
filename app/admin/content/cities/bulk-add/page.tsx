'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Download, 
  Upload, 
  Plus,
  Globe,
  Building2,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { tier1Countries } from '@/lib/data/countries';

interface CityData {
  name: string;
  country: string;
  population: number;
  isCapital: boolean;
  majorVenues: string;
  builderCount: number;
  upcomingShows: number;
  averageStandCost: number;
  airports: string;
  publicTransport: string;
}

export default function BulkAddCitiesPage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [csvContent, setCsvContent] = useState('');

  const addNewCity = () => {
    const newCity: CityData = {
      name: '',
      country: selectedCountry || '',
      population: 0,
      isCapital: false,
      majorVenues: '',
      builderCount: 0,
      upcomingShows: 0,
      averageStandCost: 0,
      airports: '',
      publicTransport: ''
    };

    setCities(prev => [...prev, newCity]);
  };

  const updateCity = (index: number, field: keyof CityData, value: any) => {
    setCities(prev => prev.map((city, i) => 
      i === index ? { ...city, [field]: value } : city
    ));
  };

  const removeCity = (index: number) => {
    setCities(prev => prev.filter((_, i) => i !== index));
  };

  const saveCities = async () => {
    if (cities.length === 0) {
      toast.error('Please add at least one city');
      return;
    }

    // Validate all cities
    const invalidCities = cities.filter(city => 
      !city.name || !city.country || city.population <= 0
    );

    if (invalidCities.length > 0) {
      toast.error(`${invalidCities.length} cities have invalid data`);
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing
      for (let i = 0; i < cities.length; i++) {
        setProgress((i / cities.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setProgress(100);
      
      toast.success(`Successfully added ${cities.length} cities to the system`);

      // Reset form
      setCities([]);
      setSelectedCountry('');

    } catch (error: any) {
      toast.error('Failed to save cities');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'name',
      'country',
      'population',
      'isCapital',
      'majorVenues',
      'builderCount',
      'upcomingShows',
      'averageStandCost',
      'airports',
      'publicTransport'
    ];

    const sampleData = [
      'Frankfurt,Germany,753000,false,"Messe Frankfurt",35,120,380,"Frankfurt Airport","U-Bahn, S-Bahn, Buses"',
      'Barcelona,Spain,1620000,false,"Fira Barcelona",45,95,350,"Barcelona Airport","Metro, Buses, Trams"',
      'Lyon,France,515000,false,"Eurexpo Lyon",25,60,320,"Lyon Airport","Metro, Buses, Trams"'
    ];

    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = 'cities-template.csv';
    link.click();
    
    toast.success('Template downloaded successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      
      // Parse CSV and populate cities
      try {
        const lines = content.trim().split('\n');
        const headers = lines[0].split(',');
        const cityData: CityData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          cityData.push({
            name: values[0] || '',
            country: values[1] || '',
            population: parseInt(values[2]) || 0,
            isCapital: values[3] === 'true',
            majorVenues: values[4] || '',
            builderCount: parseInt(values[5]) || 0,
            upcomingShows: parseInt(values[6]) || 0,
            averageStandCost: parseInt(values[7]) || 0,
            airports: values[8] || '',
            publicTransport: values[9] || ''
          });
        }

        setCities(cityData);
        toast.success(`Loaded ${cityData.length} cities from CSV`);

      } catch (error: any) {
        toast.error('Failed to parse CSV file');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Cities to Platform</h1>
            <p className="text-gray-600 mt-1">Expand global coverage by adding new exhibition cities</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Countries</p>
                  <p className="text-2xl font-bold text-gray-900">{tier1Countries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Cities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tier1Countries.reduce((sum, country) => sum + country.majorCities.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Builders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tier1Countries.reduce((sum, country) => sum + country.builderCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Plus className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cities to Add</p>
                  <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button onClick={downloadTemplate} variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download CSV Template</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button asChild variant="outline" className="flex items-center space-x-2">
                    <span>
                      <Upload className="w-4 h-4" />
                      <span>Upload CSV</span>
                    </span>
                  </Button>
                </label>
              </div>

              <div className="flex-1"></div>
              
              <Button onClick={addNewCity} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add City Manually</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Country Filter */}
        {cities.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by Country:</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {tier1Countries.map(country => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cities Form */}
        {cities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cities to Add ({cities.length})</CardTitle>
              <CardDescription>Review and edit city information before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cities.map((city, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">City #{index + 1}</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeCity(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                      <Input
                        value={city.name}
                        onChange={(e) => updateCity(index, 'name', e.target.value)}
                        placeholder="Enter city name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <Select value={city.country} onValueChange={(value) => updateCity(index, 'country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {tier1Countries.map(country => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                      <Input
                        type="number"
                        value={city.population}
                        onChange={(e) => updateCity(index, 'population', parseInt(e.target.value) || 0)}
                        placeholder="City population"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Major Venues</label>
                      <Input
                        value={city.majorVenues}
                        onChange={(e) => updateCity(index, 'majorVenues', e.target.value)}
                        placeholder="Exhibition venues"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Builders Count</label>
                      <Input
                        type="number"
                        value={city.builderCount}
                        onChange={(e) => updateCity(index, 'builderCount', parseInt(e.target.value) || 0)}
                        placeholder="Number of builders"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Stand Cost (EUR/sqm)</label>
                      <Input
                        type="number"
                        value={city.averageStandCost}
                        onChange={(e) => updateCity(index, 'averageStandCost', parseInt(e.target.value) || 0)}
                        placeholder="Average cost"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Airports</label>
                      <Input
                        value={city.airports}
                        onChange={(e) => updateCity(index, 'airports', e.target.value)}
                        placeholder="Major airports"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                      <Input
                        value={city.publicTransport}
                        onChange={(e) => updateCity(index, 'publicTransport', e.target.value)}
                        placeholder="Public transport"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`capital-${index}`}
                        checked={city.isCapital}
                        onChange={(e) => updateCity(index, 'isCapital', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`capital-${index}`} className="text-sm text-gray-700">
                        Capital City
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {/* Processing */}
              {isProcessing && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="font-medium">Saving cities to platform...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 border-t pt-4">
                <Button 
                  onClick={saveCities} 
                  disabled={isProcessing || cities.length === 0}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save {cities.length} Cities to Platform
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCities([])}
                  disabled={isProcessing}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started */}
        {cities.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Cities to Platform</h3>
              <p className="text-gray-600 mb-6">
                Expand global coverage by adding new exhibition cities. You can add cities manually or import via CSV.
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={addNewCity} className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add First City</span>
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Get CSV Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}