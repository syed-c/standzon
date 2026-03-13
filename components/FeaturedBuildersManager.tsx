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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Builder {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  rating: number | null;
  projectsCompleted: number | null;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Pagination
  const totalPages = Math.ceil(filteredBuilders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBuilders = filteredBuilders.slice(startIndex, startIndex + itemsPerPage);

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
          companyName: builder.company_name || 'Unknown',
          email: builder.primary_email || '',
          phone: builder.phone || '',
          city: builder.headquarters_city || 'Unknown',
          country: builder.headquarters_country || 'Unknown',
          rating: builder.rating ?? null,
          projectsCompleted: builder.projects_completed ?? null,
          verified: builder.verified || false,
          featured: builder.featured || builder.premium_member || false,
          adminFeatured: builder.adminFeatured || false,
          featuredPriority: builder.featuredPriority || undefined,
          gmbImported: builder.gmb_imported || false
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
      const companyName = builder.companyName || '';
      const email = builder.email || '';
      const city = builder.city || '';
      const country = builder.country || '';
      
      const matchesSearch = companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.toLowerCase().includes(searchTerm.toLowerCase());
      
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
      
      // Finally by rating (handle null)
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      return ratingB - ratingA;
    });

    setFilteredBuilders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
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
        .filter(b => b.verified && (b.rating ?? 0) >= 4.0)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
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
    topRated: builders.filter(b => (b.rating ?? 0) >= 4.5).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3886] mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading featured builders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Featured Builders Manager</h1>
          <p className="text-slate-500 mt-1">Control which builders appear as featured on location pages</p>
          
          {/* Feature Descriptions */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-purple-600 text-lg">workspace_premium</span>
              <span className="text-slate-600">Admin Featured: Set top 3-5 builders to appear first on all location pages</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-blue-600 text-lg">format_list_numbered</span>
              <span className="text-slate-600">Priority Rankings: Control exact position (Top 1, Top 2, Top 3) for featured builders</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-green-600 text-lg">trending_up</span>
              <span className="text-slate-600">Auto-Feature: Quickly feature the top 3 highest-rated verified builders</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-orange-600 text-lg">location_on</span>
              <span className="text-slate-600">Location Impact: Featured builders appear at top with special badges and highlighting</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={loadBuilders} 
            variant="outline" 
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <span className="material-symbols-outlined mr-2">refresh</span>
            Refresh
          </Button>
          <Button
            onClick={featureTopBuilders}
            className="bg-green-600 hover:bg-green-700"
          >
            <span className="material-symbols-outlined mr-2">trending_up</span>
            Feature Top 3
          </Button>
          <Button
            onClick={clearAllFeatured}
            variant="destructive"
          >
            <span className="material-symbols-outlined mr-2">settings</span>
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Builders', value: stats.totalBuilders, icon: 'groups', color: 'bg-blue-100 text-blue-600' },
          { title: 'Admin Featured', value: stats.adminFeatured, icon: 'workspace_premium', color: 'bg-purple-100 text-purple-600' },
          { title: 'Regular Featured', value: stats.regularFeatured, icon: 'star', color: 'bg-orange-100 text-orange-600' },
          { title: 'Top Rated (4.5+)', value: stats.topRated, icon: 'trending_up', color: 'bg-green-100 text-green-600' },
        ].map((stat, index) => (
          <Card 
            key={index} 
            className="border-slate-200 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Filters & Search</CardTitle>
          <CardDescription className="text-slate-500">
            {filteredBuilders.length} of {builders.length} builders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-slate-600">Search</Label>
              <div className="relative mt-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
                <Input
                  id="search"
                  placeholder="Search builders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country" className="text-slate-600">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="mt-1 border-slate-300">
                  <SelectValue placeholder="All Countries" />
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
              <Label htmlFor="city" className="text-slate-600">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="mt-1 border-slate-300">
                  <SelectValue placeholder="All Cities" />
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
              <Label htmlFor="type" className="text-slate-600">Featured Status</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="mt-1 border-slate-300">
                  <SelectValue placeholder="All Builders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Builders</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                  <SelectItem value="unfeatured">Unfeatured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Builders Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Builders Directory</CardTitle>
          <CardDescription className="text-slate-500">
            Manage featured status for builders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600">Company</TableHead>
                  <TableHead className="text-slate-600">Location</TableHead>
                  <TableHead className="text-slate-600">Rating</TableHead>
                  <TableHead className="text-slate-600">Is Featured</TableHead>
                  <TableHead className="text-slate-600">Status</TableHead>
                  <TableHead className="text-slate-600">Priority</TableHead>
                  <TableHead className="text-slate-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBuilders.map((builder) => (
                  <TableRow key={builder.id} className="border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-slate-900">{builder.companyName}</div>
                        <div className="text-slate-500 text-xs">
                          {builder.email && !builder.email.includes('no-email+') 
                            ? builder.email 
                            : 'No email'}
                          {builder.phone ? ` • ${builder.phone}` : ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {builder.city}, {builder.country}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span className="text-slate-900">{builder.rating !== null ? builder.rating.toFixed(1) : 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {builder.adminFeatured ? (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          <span className="material-symbols-outlined text-xs mr-1">check_circle</span>
                          Yes
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-slate-200">
                          <span className="material-symbols-outlined text-xs mr-1">cancel</span>
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {builder.adminFeatured ? (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          <span className="material-symbols-outlined text-xs mr-1">workspace_premium</span>
                          Featured
                        </Badge>
                      ) : builder.featured ? (
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                          <span className="material-symbols-outlined text-xs mr-1">star</span>
                          Premium
                        </Badge>
                      ) : builder.verified ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <span className="material-symbols-outlined text-xs mr-1">verified</span>
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                          Standard
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {builder.adminFeatured ? (
                        <Select
                          value={builder.featuredPriority?.toString() || '1'}
                          onValueChange={(value) => updateFeaturedStatus(builder.id, true, parseInt(value))}
                        >
                          <SelectTrigger className="w-20 h-8 bg-purple-50 border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Top 1</SelectItem>
                            <SelectItem value="2">Top 2</SelectItem>
                            <SelectItem value="3">Top 3</SelectItem>
                            <SelectItem value="4">Top 4</SelectItem>
                            <SelectItem value="5">Top 5</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                            <span className="material-symbols-outlined">more_vert</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          {builder.adminFeatured ? (
                            <DropdownMenuItem 
                              onClick={() => updateFeaturedStatus(builder.id, false)}
                              className="cursor-pointer text-red-600"
                            >
                              <span className="material-symbols-outlined mr-2">star_border</span>
                              Remove Feature
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => updateFeaturedStatus(builder.id, true, 1)}
                              className="cursor-pointer"
                            >
                              <span className="material-symbols-outlined mr-2">star</span>
                              Feature Builder
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBuilders.length)} of {filteredBuilders.length} builders
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum 
                          ? "bg-[#1e3886] border-[#1e3886] text-white" 
                          : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}