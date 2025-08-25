'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Crown, 
  MapPin, 
  Building, 
  Search, 
  Filter,
  Settings,
  Save,
  RefreshCw,
  Users,
  TrendingUp
} from 'lucide-react';

interface Builder {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  rating: number;
  projectsCompleted: number;
  verified: boolean;
  featured: boolean;
  adminFeatured?: boolean;
  featuredPriority?: number;
  gmbImported?: boolean;
}

export default function FeaturedBuildersManager() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, featured, unfeatured
  const { toast } = useToast();

  // Load builders
  const loadBuilders = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading builders for featured management...');
      
      const response = await fetch('/api/admin/builders?limit=1000');
      const data = await response.json();
      
      if (data.success && data.data && data.data.builders) {
        const allBuilders = data.data.builders.map((builder: any) => ({
          id: builder.id,
          companyName: builder.companyName,
          email: builder.contactInfo?.primaryEmail || '',
          phone: builder.contactInfo?.phone || '',
          city: builder.headquarters?.city || 'Unknown',
          country: builder.headquarters?.country || 'Unknown',
          rating: builder.rating || 0,
          projectsCompleted: builder.projectsCompleted || 0,
          verified: builder.verified || false,
          featured: builder.featured || builder.premiumMember || false,
          adminFeatured: builder.adminFeatured || false,
          featuredPriority: builder.featuredPriority || undefined,
          gmbImported: builder.gmbImported || false
        }));
        
        setBuilders(allBuilders);
        setFilteredBuilders(allBuilders);
        console.log(`✅ Loaded ${allBuilders.length} builders`);
      }
    } catch (error) {
      console.error('❌ Error loading builders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuilders();
  }, []);

  // Filter builders
  useEffect(() => {
    let filtered = builders.filter(builder => {
      const matchesSearch = builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountry === 'all' || builder.country === selectedCountry;
      const matchesCity = selectedCity === 'all' || builder.city === selectedCity;
      
      const matchesType = filterType === 'all' || 
        (filterType === 'featured' && (builder.adminFeatured || builder.featured)) ||
        (filterType === 'unfeatured' && !builder.adminFeatured && !builder.featured);
      
      return matchesSearch && matchesCountry && matchesCity && matchesType;
    });

    // Sort by featured status, then rating
    filtered.sort((a, b) => {
      // Admin featured first
      if (a.adminFeatured && !b.adminFeatured) return -1;
      if (!a.adminFeatured && b.adminFeatured) return 1;
      
      // Then by featured priority
      if (a.adminFeatured && b.adminFeatured) {
        return (a.featuredPriority || 999) - (b.featuredPriority || 999);
      }
      
      // Then regular featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Finally by rating
      return b.rating - a.rating;
    });

    setFilteredBuilders(filtered);
  }, [builders, searchTerm, selectedCountry, selectedCity, filterType]);

  // Get unique countries and cities
  const countries = Array.from(new Set(builders.map(b => b.country))).sort();
  const cities = selectedCountry === 'all' 
    ? Array.from(new Set(builders.map(b => b.city))).sort()
    : Array.from(new Set(builders.filter(b => b.country === selectedCountry).map(b => b.city))).sort();

  // Update featured status
  const updateFeaturedStatus = async (builderId: string, adminFeatured: boolean, priority?: number) => {
    try {
      // Update local state immediately for better UX
      setBuilders(prev => prev.map(builder => 
        builder.id === builderId 
          ? { 
              ...builder, 
              adminFeatured, 
              featuredPriority: adminFeatured ? priority : undefined 
            }
          : builder
      ));
      
      // In a real implementation, this would call an API to update the database
      console.log(`🔄 Updating featured status for builder ${builderId}:`, { adminFeatured, priority });
      
      toast({
        title: "Featured Status Updated",
        description: `Builder has been ${adminFeatured ? 'featured' : 'unfeatured'} successfully.`,
      });
    } catch (error) {
      console.error('❌ Error updating featured status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update featured status.",
        variant: "destructive",
      });
    }
  };

  // Quick feature top builders
  const featureTopBuilders = async () => {
    try {
      const topBuilders = builders
        .filter(b => b.verified && b.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      
      topBuilders.forEach((builder, index) => {
        updateFeaturedStatus(builder.id, true, index + 1);
      });
      
      toast({
        title: "Top Builders Featured",
        description: `Featured top 3 highest-rated verified builders.`,
      });
    } catch (error) {
      console.error('❌ Error featuring top builders:', error);
    }
  };

  // Clear all featured
  const clearAllFeatured = async () => {
    try {
      builders.forEach(builder => {
        if (builder.adminFeatured) {
          updateFeaturedStatus(builder.id, false);
        }
      });
      
      toast({
        title: "All Featured Cleared",
        description: "Removed admin featured status from all builders.",
      });
    } catch (error) {
      console.error('❌ Error clearing featured:', error);
    }
  };

  // Stats
  const stats = {
    totalBuilders: builders.length,
    adminFeatured: builders.filter(b => b.adminFeatured).length,
    regularFeatured: builders.filter(b => b.featured && !b.adminFeatured).length,
    topRated: builders.filter(b => b.rating >= 4.5).length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium">Loading builders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Builders Manager</h1>
          <p className="text-gray-600 mt-1">
            Control which builders appear as featured on location pages
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={loadBuilders}
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={featureTopBuilders}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Feature Top 3
          </Button>
          <Button
            onClick={clearAllFeatured}
            variant="destructive"
          >
            <Settings className="h-4 w-4 mr-2" />
            Clear All Featured
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Builders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBuilders}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin Featured</p>
                <p className="text-2xl font-bold text-purple-600">{stats.adminFeatured}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Regular Featured</p>
                <p className="text-2xl font-bold text-orange-600">{stats.regularFeatured}</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Rated (4.5+)</p>
                <p className="text-2xl font-bold text-green-600">{stats.topRated}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search builders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Featured Status</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Builders</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                  <SelectItem value="unfeatured">Unfeatured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-1 inline" />
                {filteredBuilders.length} of {builders.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Builders List */}
      <Card>
        <CardHeader>
          <CardTitle>Builders ({filteredBuilders.length})</CardTitle>
          <CardDescription>
            Click to manage featured status and priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBuilders.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No builders found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredBuilders.map((builder) => (
                <div 
                  key={builder.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                    builder.adminFeatured ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{builder.companyName}</h3>
                        {builder.adminFeatured && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Admin Featured #{builder.featuredPriority}
                          </Badge>
                        )}
                        {builder.featured && !builder.adminFeatured && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Regular Featured
                          </Badge>
                        )}
                        {builder.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Verified
                          </Badge>
                        )}
                        {builder.gmbImported && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            GMB
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-4">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {builder.city}, {builder.country}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-400" />
                          {builder.rating.toFixed(1)}
                        </span>
                        <span>{builder.projectsCompleted} projects</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {builder.adminFeatured && (
                      <Select
                        value={builder.featuredPriority?.toString() || ''}
                        onValueChange={(value) => updateFeaturedStatus(builder.id, true, parseInt(value))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Top 1</SelectItem>
                          <SelectItem value="2">Top 2</SelectItem>
                          <SelectItem value="3">Top 3</SelectItem>
                          <SelectItem value="4">Top 4</SelectItem>
                          <SelectItem value="5">Top 5</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      size="sm"
                      onClick={() => updateFeaturedStatus(
                        builder.id, 
                        !builder.adminFeatured, 
                        builder.adminFeatured ? undefined : 1
                      )}
                      className={builder.adminFeatured 
                        ? "bg-red-600 hover:bg-red-700 text-white" 
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                      }
                    >
                      {builder.adminFeatured ? (
                        <>
                          <Crown className="h-4 w-4 mr-1" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-1" />
                          Feature
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}