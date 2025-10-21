'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Key, 
  TestTube,
  Save,
  MapPin,
  Building2,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Plus,
  Users,
  Calendar,
  Database,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllExpandedCities, getCitiesByCountry } from '@/lib/data/expandedLocations';

interface GMBListing {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  website: string;
  email?: string;
  rating: number;
  reviewCount: number;
  category: string;
  city: string;
  country: string;
  claimStatus: 'unclaimed' | 'claimed';
  businessHours?: string;
  description?: string;
}

interface GMBAPIFetchToolProps {
  adminId: string;
  permissions: string[];
}

// Business categories for search
const BUSINESS_CATEGORIES = [
  { value: 'exhibition_stand_builder', label: 'Exhibition Stand Builder', type: 'builder' },
  { value: 'booth_builder', label: 'Booth Builder', type: 'builder' },
  { value: 'trade_show_booth_builder', label: 'Trade Show Booth Builder', type: 'builder' }
];

// Available cities by country (expanded to include all major exhibition destinations)
const countryCityMap: { [key: string]: string[] } = {
  'United States': ['Las Vegas', 'New York', 'Chicago', 'Orlando', 'Los Angeles', 'San Francisco', 'Dallas', 'Miami', 'Atlanta', 'Houston', 'San Diego', 'Washington D.C.', 'Seattle', 'Boston', 'Philadelphia', 'Detroit', 'Phoenix', 'Denver'],
  'Germany': ['Berlin', 'Frankfurt', 'Munich', 'Dusseldorf', 'Cologne', 'Hamburg', 'Hannover', 'Stuttgart', 'Nuremberg', 'Leipzig'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Edinburgh', 'Leeds', 'Bristol'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Strasbourg', 'Bordeaux', 'Lille'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Fujairah', 'Ajman', 'Umm Al Quwain'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra'],
  'India': ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Lucknow', 'Kanpur', 'Kolkata'],
  'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan', 'Hangzhou', 'Nanjing', 'Tianjin', 'Xian'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Kobe', 'Chiba'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Curitiba', 'Belo Horizonte', 'Salvador', 'Recife', 'Porto Alegre'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Ottawa'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancun'],
  'Italy': ['Milan', 'Rome', 'Bologna', 'Florence', 'Venice', 'Naples', 'Turin', 'Verona'],
  'Spain': ['Barcelona', 'Madrid', 'Valencia', 'Seville', 'Bilbao', 'Zaragoza'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  'Belgium': ['Brussels', 'Antwerp', 'Ghent'],
  'Switzerland': ['Geneva', 'Zurich'],
  'Austria': ['Vienna'],
  'Sweden': ['Stockholm', 'Gothenburg'],
  'Poland': ['Warsaw'],
  'Russia': ['Moscow'],
  'Czech Republic': ['Prague'],
  'Denmark': ['Copenhagen'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam'],
  'Oman': ['Muscat'],
  'Bahrain': ['Manama'],
  'Qatar': ['Doha'],
  'Kuwait': ['Kuwait City'],
  'South Korea': ['Seoul', 'Busan'],
  'Malaysia': ['Kuala Lumpur', 'Penang'],
  'Singapore': ['Singapore'],
  'Indonesia': ['Jakarta'],
  'Vietnam': ['Ho Chi Minh City'],
  'Philippines': ['Manila'],
  'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
  'Kenya': ['Nairobi'],
  'Egypt': ['Cairo', 'Alexandria', 'Sharm El Sheikh', 'Luxor'],
  'Nigeria': ['Lagos'],
  'Morocco': ['Casablanca', 'Marrakech', 'Rabat', 'Fez'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
  'Chile': ['Santiago', 'Valparaíso', 'Concepción'],
  'Colombia': ['Bogotá']
};

export default function GMBAPIFetchTool({ adminId, permissions }: GMBAPIFetchToolProps) {
  // API Configuration State
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [apiConnectionStatus, setApiConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  // Search Configuration State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectAllCities, setSelectAllCities] = useState(false);
  
  // Results and Progress State
  const [searchResults, setSearchResults] = useState<GMBListing[]>([]);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState({ created: 0, total: 0, errors: 0 });

  // Add ref for search results section
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Load API key from storage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('gmb_api_key');
    const apiStatus = localStorage.getItem('gmb_api_status');
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setApiKeyValid(apiStatus === 'valid');
      setApiConnectionStatus(apiStatus === 'valid' ? 'connected' : 'disconnected');
    }
  }, []);

  // Get cities for selected country
  const availableCities = selectedCountry ? getCitiesByCountry(selectedCountry).map(city => city.name) : [];

  // Handle API key testing
  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setApiConnectionStatus('connecting');
    
    try {
      console.log('🧪 Testing API key:', apiKey.substring(0, 10) + '...');
      
      // First try with demo mode if it's a test key
      const isTestKey = apiKey.toLowerCase().includes('test') || apiKey.toLowerCase().includes('demo') || apiKey.length < 20;
      
      if (isTestKey) {
        console.log('🧪 Using demo mode for testing...');
        
        // Use demo API for testing
        const response = await fetch('/api/admin/gmb-demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setApiKeyValid(true);
          setApiConnectionStatus('connected');
          localStorage.setItem('gmb_api_key', apiKey);
          localStorage.setItem('gmb_api_status', 'valid');
          toast.success('✅ Demo mode activated! API key test successful');
          return;
        }
      }
      
      // Try real API key validation
      console.log('🔍 Testing real Google Places API key...');
      const response = await fetch('/api/admin/gmb-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test-api',
          data: { apiKey }
        })
      });
      
      const result = await response.json();
      console.log('📊 API test result:', result);
      
      if (result.success) {
        setApiKeyValid(true);
        setApiConnectionStatus('connected');
        localStorage.setItem('gmb_api_key', apiKey);
        localStorage.setItem('gmb_api_status', 'valid');
        
        // Show detailed success message
        const resultCount = result.data?.resultsCount || 0;
        toast.success(`✅ Google Places API Connected! Test found ${resultCount} results. Ready to fetch real business data.`);
        console.log('✅ Google Places API key validated successfully!');
      } else {
        setApiKeyValid(false);
        setApiConnectionStatus('error');
        
        console.error('❌ API key validation failed:', result.error);
        
        // Provide helpful error messages
        if (result.error?.includes('API key is invalid') || result.error?.includes('denied')) {
          toast.error(`❌ Invalid API Key. Please check your Google Places API key or try "demo-key" for testing.`);
        } else if (result.error?.includes('quota') || result.error?.includes('OVER_QUERY_LIMIT')) {
          toast.error(`❌ API quota exceeded. Check your Google Cloud Console billing and quotas.`);
        } else if (result.error?.includes('not configured')) {
          toast.error(`❌ API key not configured. Please enable Google Places API in Google Cloud Console.`);
        } else {
          toast.error(`❌ Connection failed: ${result.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      setApiKeyValid(false);
      setApiConnectionStatus('error');
      console.error('❌ API test request failed:', error);
      toast.error('❌ Failed to test API key. Check your connection and try again.');
    }
  };

  // Handle API key saving
  const saveApiKey = async () => {
    if (!apiKeyValid) {
      toast.error('Please test the API key first');
      return;
    }

    try {
      localStorage.setItem('gmb_api_key', apiKey);
      localStorage.setItem('gmb_api_status', 'valid');
      toast.success('✅ API key saved successfully');
    } catch (error) {
      toast.error('❌ Failed to save API key');
    }
  };

  // Handle city selection
  const handleCityToggle = (city: string) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  // Handle select all cities
  const handleSelectAllCities = () => {
    if (selectAllCities) {
      setSelectAllCities(false);
      setSelectedCities([]);
    } else {
      setSelectAllCities(true);
      setSelectedCities(availableCities);
    }
  };

  // Handle business search with auto-scroll
  const searchBusinesses = async () => {
    if (!selectedCategory || !selectedCountry || selectedCities.length === 0) {
      toast.error('Please select category, country, and at least one city');
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResults([]);

    try {
      // Update progress as we make the API call
      setSearchProgress(25);
      
      // Check if we're in demo mode
      const isDemoMode = apiKey.toLowerCase().includes('test') || apiKey.toLowerCase().includes('demo') || apiKey.length < 20;
      
      if (isDemoMode) {
        console.log('🧪 Running in demo mode...');
        setSearchProgress(50);
        
        // Generate mock data for demo
        const mockResults = generateMockBusinesses(selectedCategory, selectedCities[0], selectedCountry, Math.min(selectedCities.length * 3, 20));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSearchResults(mockResults);
        setSearchProgress(100);
        toast.success(`✅ Demo: Found ${mockResults.length} sample businesses across ${selectedCities.length} cities`);
        
        // Auto-scroll to search results after they appear
        setTimeout(() => {
          if (searchResultsRef.current) {
            searchResultsRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
        
        return;
      }

      // Real API call
      const response = await fetch('/api/admin/gmb-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'fetch-businesses',
          data: {
            businessType: selectedCategory,
            country: selectedCountry,
            cities: selectedCities,
            radius: 25,
            maxResults: selectedCities.length * 30,
            apiKey
          }
        })
      });

      setSearchProgress(75);
      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data.businesses || []);
        setSearchProgress(100);
        toast.success(`✅ Found ${result.data.businesses?.length || 0} real businesses from Google Places API`);
        
        // Auto-scroll to search results after they appear
        setTimeout(() => {
          if (searchResultsRef.current) {
            searchResultsRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
      } else {
        // Handle specific error cases
        if (result.error?.includes('API key')) {
          toast.error(`❌ API Error: ${result.error}. Try using \"demo-key\" for testing.`);
        } else if (result.error?.includes('quota')) {
          toast.error(`❌ API quota exceeded. Switch to demo mode or check your Google Cloud billing.`);
        } else {
          toast.error(`❌ Search failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('❌ Search failed. Please try demo mode by using \"demo-key\" as your API key.');
    } finally {
      setIsSearching(false);
    }
  };

  // Generate mock business data
  const generateMockBusinesses = (category: string, city: string, country: string, count: number): GMBListing[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `${city.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      businessName: `${category} ${city} ${index + 1}`,
      address: `${index + 1} Main Street, ${city}, ${country}`,
      phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: `https://${category.toLowerCase().replace(/\s+/g, '')}-${city.toLowerCase()}.com`,
      email: `info@${category.toLowerCase().replace(/\s+/g, '')}-${city.toLowerCase()}.com`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 200) + 10,
      category,
      city,
      country,
      claimStatus: Math.random() > 0.7 ? 'claimed' : 'unclaimed',
      businessHours: '9:00 AM - 6:00 PM',
      description: `Professional ${category.toLowerCase()} serving ${city} and surrounding areas.`
    }));
  };

  // Handle select all listings
  const handleSelectAllListings = () => {
    if (selectedListings.length === searchResults.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(searchResults.map(listing => listing.id));
    }
  };

  // Handle import listings
  const importListings = async () => {
    if (selectedListings.length === 0) {
      toast.error('Please select at least one listing to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportStats({ created: 0, total: selectedListings.length, errors: 0 });

    try {
      const category = BUSINESS_CATEGORIES.find(cat => cat.value === selectedCategory);
      
      // Get the selected listings data
      const listingsToImport = searchResults.filter(listing => 
        selectedListings.includes(listing.id)
      );
      
      console.log('📝 Importing listings:', listingsToImport.map(l => l.businessName));
      
      // Check if we're in demo mode
      const isDemoMode = apiKey.toLowerCase().includes('test') || apiKey.toLowerCase().includes('demo');
      
      if (isDemoMode) {
        console.log('🧪 Demo mode import - simulating save process...');
        
        // Simulate import progress
        for (let i = 0; i < selectedListings.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setImportProgress(((i + 1) / selectedListings.length) * 100);
          setImportStats(prev => ({
            ...prev,
            created: i + 1
          }));
        }
        
        toast.success(`✅ Demo: Successfully simulated importing ${selectedListings.length} builders to platform`);
        
        // Clear selections after successful demo import
        setSelectedListings([]);
        return;
      }

      // Real import
      const response = await fetch('/api/admin/gmb-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create-listings',
          data: {
            listings: listingsToImport,
            category: selectedCategory
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setImportStats({
          created: result.data.created,
          total: selectedListings.length,
          errors: result.data.failed
        });
        
        setImportProgress(100);
        
        if (result.data.duplicates > 0) {
          toast.success(`✅ Import complete! Created: ${result.data.created}, Duplicates skipped: ${result.data.duplicates}, Failed: ${result.data.failed}`);
        } else {
          toast.success(`✅ Successfully imported ${result.data.created} builders to platform`);
        }
        
        // Clear selections after successful import
        setSelectedListings([]);
        setSearchResults([]);
      } else {
        console.error('❌ Import failed:', result.error);
        toast.error(`❌ Import failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('❌ Import failed. Please try again or contact support.');
    } finally {
      setIsImporting(false);
    }
  };

  // Get connection status icon and color
  const getConnectionStatusDisplay = () => {
    switch (apiConnectionStatus) {
      case 'connected':
        return { icon: <Wifi className="h-4 w-4" />, color: 'text-green-600', text: 'Connected' };
      case 'connecting':
        return { icon: <Loader2 className="h-4 w-4 animate-spin" />, color: 'text-blue-600', text: 'Connecting...' };
      case 'error':
        return { icon: <WifiOff className="h-4 w-4" />, color: 'text-red-600', text: 'Connection Error' };
      default:
        return { icon: <WifiOff className="h-4 w-4" />, color: 'text-gray-600', text: 'Not Connected' };
    }
  };

  const connectionStatus = getConnectionStatusDisplay();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* API Configuration Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Configure your Google My Business API connection</CardDescription>
            </div>
            <div className={`flex items-center gap-2 ${connectionStatus.color}`}>
              {connectionStatus.icon}
              <span className="text-sm font-medium">{connectionStatus.text}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google My Business API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter 'demo-key' for testing or your real Google Places API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
            <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
              <strong>💡 For Testing:</strong> Use "demo-key" to test the system with sample data<br/>
              <strong>🔑 For Production:</strong> Get a real Google Places API key from <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={testApiKey}
              disabled={apiConnectionStatus === 'connecting' || !apiKey.trim()}
              variant="outline"
              className="text-gray-900"
            >
              {apiConnectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button
              onClick={saveApiKey}
              disabled={!apiKeyValid}
              variant="outline"
              className="text-gray-900"
            >
              <Save className="h-4 w-4 mr-2" />
              Save API Key
            </Button>
          </div>
          
          {/* Connection Status Details */}
          {apiConnectionStatus === 'connected' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">
                  {apiKey.toLowerCase().includes('demo') ? 'Demo Mode Active' : 'Google Places API Connected'}
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {apiKey.toLowerCase().includes('demo') 
                  ? 'Using sample data for testing. Switch to a real API key for production use.'
                  : 'Connected to Google Places API. Ready to fetch real business data.'
                }
              </p>
            </div>
          )}
          
          {apiConnectionStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Connection Failed</span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                Unable to connect with the provided API key. Try "demo-key" for testing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Search Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Business Search
          </CardTitle>
          <CardDescription>
            Search for businesses by category and location. 
            {apiKey.toLowerCase().includes('demo') ? (
              <><br />
              <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs mt-1">
                <TestTube className="h-3 w-3" />
                Demo Mode: Will generate sample businesses for testing
              </span></>
            ) : (
              <><br />
              <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs mt-1">
                <Wifi className="h-3 w-3" />
                Production Mode: Will fetch real businesses from Google Places API
              </span></>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Business Category Selection */}
          <div className="space-y-2">
            <Label>Business Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select business category" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      {category.type === 'builder' ? <Building2 className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="United States">🇺🇸 United States</SelectItem>
                <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="France">🇫🇷 France</SelectItem>
                <SelectItem value="United Arab Emirates">🇦🇪 United Arab Emirates</SelectItem>
                <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                <SelectItem value="India">🇮🇳 India</SelectItem>
                <SelectItem value="China">🇨🇳 China</SelectItem>
                <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                <SelectItem value="Brazil">🇧🇷 Brazil</SelectItem>
                <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                <SelectItem value="Mexico">🇲🇽 Mexico</SelectItem>
                <SelectItem value="Italy">🇮🇹 Italy</SelectItem>
                <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                <SelectItem value="Netherlands">🇳🇱 Netherlands</SelectItem>
                <SelectItem value="Belgium">🇧🇪 Belgium</SelectItem>
                <SelectItem value="Switzerland">🇨🇭 Switzerland</SelectItem>
                <SelectItem value="Austria">🇦🇹 Austria</SelectItem>
                <SelectItem value="Sweden">🇸🇪 Sweden</SelectItem>
                <SelectItem value="Poland">🇵🇱 Poland</SelectItem>
                <SelectItem value="Russia">🇷🇺 Russia</SelectItem>
                <SelectItem value="Czech Republic">🇨🇿 Czech Republic</SelectItem>
                <SelectItem value="Denmark">🇩🇰 Denmark</SelectItem>
                <SelectItem value="Saudi Arabia">🇸🇦 Saudi Arabia</SelectItem>
                <SelectItem value="Oman">🇴🇲 Oman</SelectItem>
                <SelectItem value="Bahrain">🇧🇭 Bahrain</SelectItem>
                <SelectItem value="Qatar">🇶🇦 Qatar</SelectItem>
                <SelectItem value="Kuwait">🇰🇼 Kuwait</SelectItem>
                <SelectItem value="South Korea">🇰🇷 South Korea</SelectItem>
                <SelectItem value="Malaysia">🇲🇾 Malaysia</SelectItem>
                <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                <SelectItem value="Indonesia">🇮🇩 Indonesia</SelectItem>
                <SelectItem value="Vietnam">🇻🇳 Vietnam</SelectItem>
                <SelectItem value="Philippines">🇵🇭 Philippines</SelectItem>
                <SelectItem value="New Zealand">🇳🇿 New Zealand</SelectItem>
                <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
                <SelectItem value="Kenya">🇰🇪 Kenya</SelectItem>
                <SelectItem value="Egypt">🇪🇬 Egypt</SelectItem>
                <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                <SelectItem value="Morocco">🇲🇦 Morocco</SelectItem>
                <SelectItem value="Argentina">🇦🇷 Argentina</SelectItem>
                <SelectItem value="Chile">🇨🇱 Chile</SelectItem>
                <SelectItem value="Colombia">🇨🇴 Colombia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* City Selection */}
          {selectedCountry && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Cities ({availableCities.length} available)</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAllCities}
                    onCheckedChange={handleSelectAllCities}
                  />
                  <Label htmlFor="select-all" className="text-sm">Select All</Label>
                </div>
              </div>
              
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                {availableCities.map((city) => (
                  <div key={city} className="flex items-center gap-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={selectedCities.includes(city)}
                      onCheckedChange={() => handleCityToggle(city)}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm">{city}</Label>
                  </div>
                ))}
              </div>
              
              {selectedCities.length > 0 && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedCities.length} cities
                </div>
              )}
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={searchBusinesses}
            disabled={!apiKeyValid || !selectedCategory || !selectedCountry || selectedCities.length === 0 || isSearching}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Businesses
              </>
            )}
          </Button>

          {/* Search Progress */}
          {isSearching && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Searching cities...</span>
                <span>{Math.round(searchProgress)}%</span>
              </div>
              <Progress value={searchProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card ref={searchResultsRef} className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Search Results
                </CardTitle>
                <CardDescription>Found {searchResults.length} businesses</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all-results"
                  checked={selectedListings.length === searchResults.length && searchResults.length > 0}
                  onCheckedChange={handleSelectAllListings}
                />
                <Label htmlFor="select-all-results" className="text-sm">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="max-h-96 overflow-y-auto space-y-2 scroll-smooth">
                {searchResults.map((listing) => (
                  <div key={listing.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      checked={selectedListings.includes(listing.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedListings([...selectedListings, listing.id]);
                        } else {
                          setSelectedListings(selectedListings.filter(id => id !== listing.id));
                        }
                      }}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{listing.businessName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {listing.claimStatus === 'claimed' ? (
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1 text-orange-600" />
                          )}
                          {listing.claimStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.address}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>★ {listing.rating} ({listing.reviewCount} reviews)</span>
                        <span>{listing.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Import Section */}
              <div className="border-t pt-4 space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">Enhanced Duplicate Detection Active</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    System automatically prevents duplicates by matching phone numbers, email addresses, business names + locations, and GMB IDs.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Selected: {selectedListings.length} / {searchResults.length} businesses
                  </span>
                  <Button
                    onClick={importListings}
                    disabled={selectedListings.length === 0 || isImporting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Import Selected ({selectedListings.length})
                      </>
                    )}
                  </Button>
                </div>

                {/* Import Progress */}
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Creating listings...</span>
                      <span>{importStats.created} / {importStats.total}</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Created: {importStats.created}</span>
                      <span>Errors: {importStats.errors}</span>
                      <span>Remaining: {importStats.total - importStats.created - importStats.errors}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
