'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { exhibitions, ExhibitionMatchingService, exhibitionStats, exhibitionIndustries, Exhibition } from '@/lib/data/exhibitions';
import { realExhibitions } from '@/lib/data/realExhibitions';
import {
  MapPin, Building2, Globe, Search, Filter, ArrowRight, Star, Calendar,
  Users, TrendingUp, Award, ChevronRight, ExternalLink, Flag, Plane,
  Clock, DollarSign, BarChart3, Eye, Heart, Bookmark, Crown, Edit,
  Plus, Settings, Database, Map, List, Grid, Target, Trophy, Zap,
  CheckCircle, AlertCircle, Info, Sparkles, Timer, Briefcase
} from 'lucide-react';

export default function GlobalExhibitionDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('exhibitions');
  const [showFilters, setShowFilters] = useState(false);

  console.log('GlobalExhibitionDirectory state:', {
    searchQuery,
    selectedIndustry,
    selectedCountry,
    selectedStatus,
    viewMode,
    sortBy,
    activeTab
  });

  // Combine regular and real exhibitions
  const allExhibitions = useMemo(() => {
    return [...exhibitions, ...realExhibitions];
  }, []);

  // Get unique countries and industries
  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(allExhibitions.map(ex => ex.country))).sort();
  }, [allExhibitions]);

  const uniqueIndustries = useMemo(() => {
    return exhibitionIndustries;
  }, []);

  // Filter exhibitions based on search and filters
  const filteredExhibitions = useMemo(() => {
    let filtered = allExhibitions;

    // Search filter
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = allExhibitions.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm) ||
        ex.description.toLowerCase().includes(searchTerm) ||
        ex.industry.name.toLowerCase().includes(searchTerm) ||
        ex.city.toLowerCase().includes(searchTerm) ||
        ex.country.toLowerCase().includes(searchTerm) ||
        ex.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(ex => ex.industry.slug === selectedIndustry);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(ex => ex.country === selectedCountry);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ex => ex.status === selectedStatus);
    }

    // Sort exhibitions
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'attendees':
          return b.expectedAttendees - a.expectedAttendees;
        case 'exhibitors':
          return b.expectedExhibitors - a.expectedExhibitors;
        case 'country':
          return a.country.localeCompare(b.country);
        default:
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
    });
  }, [allExhibitions, searchQuery, selectedIndustry, selectedCountry, selectedStatus, sortBy]);

  // Get featured and trending exhibitions
  const featuredExhibitions = useMemo(() => {
    return ExhibitionMatchingService.getFeaturedExhibitions();
  }, []);

  const trendingExhibitions = useMemo(() => {
    return ExhibitionMatchingService.getTrendingExhibitions();
  }, []);

  const upcomingExhibitions = useMemo(() => {
    return ExhibitionMatchingService.getUpcomingExhibitions();
  }, []);

  // Industry stats
  const industryStats = useMemo(() => {
    return exhibitionIndustries.map(industry => {
      const industryExhibitions = allExhibitions.filter(ex => ex.industry.slug === industry.slug);
      return {
        ...industry,
        exhibitionCount: industryExhibitions.length,
        totalAttendees: industryExhibitions.reduce((sum, ex) => sum + ex.expectedAttendees, 0),
        avgBoothCost: industryExhibitions.reduce((sum, ex) => sum + ex.pricing.standardBooth.min, 0) / industryExhibitions.length || 0
      };
    }).sort((a, b) => b.exhibitionCount - a.exhibitionCount);
  }, [allExhibitions]);

  // Country stats
  const countryStats = useMemo(() => {
    const countryMap = new globalThis.Map<string, {
      name: string;
      countryCode: string;
      exhibitions: Exhibition[];
      totalAttendees: number;
      totalExhibitors: number;
    }>();
    
    allExhibitions.forEach(ex => {
      if (!countryMap.has(ex.country)) {
        countryMap.set(ex.country, {
          name: ex.country,
          countryCode: ex.countryCode,
          exhibitions: [],
          totalAttendees: 0,
          totalExhibitors: 0
        });
      }
      
      const country = countryMap.get(ex.country)!;
      country.exhibitions.push(ex);
      country.totalAttendees += ex.expectedAttendees;
      country.totalExhibitors += ex.expectedExhibitors;
    });

    return Array.from(countryMap.values())
      .sort((a, b) => b.exhibitions.length - a.exhibitions.length);
  }, [allExhibitions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, ${startDate.getFullYear()}`;
    } else {
      return `${startDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-green-500';
      case 'Live': return 'bg-red-500';
      case 'Completed': return 'bg-gray-500';
      case 'Cancelled': return 'bg-red-600';
      case 'Postponed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'text-green-800 bg-green-100';
      case 'Live': return 'text-red-800 bg-red-100';
      case 'Completed': return 'text-gray-800 bg-gray-100';
      case 'Cancelled': return 'text-red-800 bg-red-100';
      case 'Postponed': return 'text-yellow-800 bg-yellow-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  // Helper function to generate builder search URLs
  const getBuilderSearchUrl = (country: string, city: string) => {
    const countrySlug = country.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const citySlug = city.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    return `/exhibition-stands/${countrySlug}/${citySlug}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-16 w-16 text-pink-300 mr-4" />
              <div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  Global Exhibition Directory
                </h1>
                <p className="text-xl md:text-2xl text-pink-100 mt-4">
                  Discover {allExhibitions.length}+ exhibitions across {uniqueCountries.length} countries worldwide
                </p>
              </div>
            </div>
            
            {/* Global Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{allExhibitions.length}</div>
                <div className="text-pink-200">Total Exhibitions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{uniqueCountries.length}</div>
                <div className="text-pink-200">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{Math.round(exhibitionStats.totalExpectedAttendees / 1000000)}M+</div>
                <div className="text-pink-200">Expected Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{Math.round(exhibitionStats.totalExpectedExhibitors / 1000)}K+</div>
                <div className="text-pink-200">Exhibitors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Primary Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search exhibitions by name, industry, city, or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 text-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {uniqueIndustries.map(industry => (
                      <SelectItem key={industry.id} value={industry.slug}>{industry.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Postponed">Postponed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="attendees">Attendees</SelectItem>
                    <SelectItem value="exhibitors">Exhibitors</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredExhibitions.length} of {allExhibitions.length} exhibitions
                {searchQuery && ` for "${searchQuery}"`}
              </span>
              <div className="flex items-center gap-4">
                <span>{exhibitionStats.upcomingCount} upcoming</span>
                <span>{exhibitionStats.featuredCount} featured</span>
                <span>{exhibitionStats.trendingCount} trending</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 lg:grid-cols-4 lg:w-auto">
              <TabsTrigger value="exhibitions" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Exhibitions ({filteredExhibitions.length})
              </TabsTrigger>
              <TabsTrigger value="industries" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Industries ({industryStats.length})
              </TabsTrigger>
              <TabsTrigger value="countries" className="flex items-center">
                <Flag className="h-4 w-4 mr-2" />
                Countries ({countryStats.length})
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Featured & Trending
              </TabsTrigger>
            </TabsList>

            {/* Exhibitions Tab */}
            <TabsContent value="exhibitions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Global Exhibitions & Trade Shows
                </h2>
              </div>
              
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredExhibitions.map((exhibition) => (
                  <Card key={exhibition.id} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                              {exhibition.name}
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {exhibition.city}, {exhibition.country}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getStatusTextColor(exhibition.status)}>
                            {exhibition.status}
                          </Badge>
                          {exhibition.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {exhibition.trending && (
                            <Badge className="bg-red-100 text-red-800">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-2">{exhibition.shortDescription}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{formatDateRange(exhibition.startDate, exhibition.endDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-green-500 mr-2" />
                          <span>{exhibition.industry.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-purple-500 mr-2" />
                          <span>{exhibition.expectedAttendees.toLocaleString()} attendees</span>
                        </div>
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 text-orange-500 mr-2" />
                          <span>{exhibition.expectedExhibitors.toLocaleString()} exhibitors</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Venue</span>
                          <span className="text-sm text-gray-600">{exhibition.venue.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Organizer Rating</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{exhibition.organizer.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <a href={`/trade-shows/${exhibition.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </a>
                          </Button>
                          <Button asChild size="sm" variant="outline" className="text-gray-900 border-gray-300 hover:bg-gray-50">
                            <a href={getBuilderSearchUrl(exhibition.country, exhibition.city)}>
                              <Building2 className="h-4 w-4 mr-2" />
                              Find Builders
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredExhibitions.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No exhibitions found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('all');
                    setSelectedCountry('all');
                    setSelectedStatus('all');
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Industries Tab */}
            <TabsContent value="industries" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Exhibition Industries
                </h2>
                <p className="text-gray-600">
                  {industryStats.length} industries covered
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industryStats.map((industry) => (
                  <Card key={industry.id} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl"
                            style={{ backgroundColor: industry.color }}
                          >
                            {industry.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                              {industry.name}
                            </CardTitle>
                            <CardDescription>
                              {industry.exhibitionCount} exhibitions
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {industry.description}
                      </p>

                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Annual Growth</span>
                          <span className="font-medium text-green-600">+{industry.annualGrowthRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg. Booth Cost</span>
                          <span className="font-medium">${Math.round(industry.avgBoothCost || industry.averageBoothCost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Attendees</span>
                          <span className="font-medium">{industry.totalAttendees.toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Subcategories:</p>
                        <div className="flex flex-wrap gap-1">
                          {industry.subcategories.slice(0, 3).map((sub, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Button 
                          onClick={() => {
                            setSelectedIndustry(industry.slug);
                            setActiveTab('exhibitions');
                          }}
                          className="w-full"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          View {industry.exhibitionCount} Exhibitions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Countries Tab */}
            <TabsContent value="countries" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">
                  Exhibition Markets by Country
                </h2>
                <p className="text-gray-600">
                  {countryStats.length} countries hosting exhibitions
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryStats.map((country) => (
                  <Card key={country.name} className="hover:shadow-xl transition-all duration-300 group border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Flag className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                              {country.name}
                            </CardTitle>
                            <CardDescription>
                              {country.exhibitions.length} exhibitions
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{country.exhibitions.length}</div>
                          <div className="text-xs text-gray-600">Exhibitions</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{Math.round(country.totalAttendees / 1000)}K</div>
                          <div className="text-xs text-gray-600">Attendees</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Top Exhibition:</span>
                          <span className="font-medium text-right text-xs">
                            {country.exhibitions.sort((a, b) => b.expectedAttendees - a.expectedAttendees)[0]?.name.slice(0, 25) + 
                             (country.exhibitions.sort((a, b) => b.expectedAttendees - a.expectedAttendees)[0]?.name.length > 25 ? '...' : '')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Exhibitors:</span>
                          <span className="font-medium">{country.totalExhibitors.toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Popular Industries:</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(country.exhibitions.map(ex => ex.industry.name))).slice(0, 3).map((industry, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <Button 
                          onClick={() => {
                            setSelectedCountry(country.name);
                            setActiveTab('exhibitions');
                          }}
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Exhibitions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Featured Tab */}
            <TabsContent value="featured" className="space-y-8">
              {/* Featured Exhibitions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Star className="h-8 w-8 text-yellow-500 mr-3" />
                    Featured Exhibitions
                  </h2>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {featuredExhibitions.length} featured
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredExhibitions.slice(0, 6).map((exhibition) => (
                    <Card key={exhibition.id} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-yellow-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5"></div>
                      
                      <CardHeader className="relative z-10">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-gray-900 group-hover:text-orange-600 transition-colors">
                              {exhibition.name}
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {exhibition.city}, {exhibition.country}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exhibition.shortDescription}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-600">{exhibition.expectedAttendees.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Attendees</div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-lg font-bold text-green-600">{exhibition.expectedExhibitors.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Exhibitors</div>
                          </div>
                        </div>
                        
                        <Button asChild className="w-full group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-600 transition-all">
                          <a href={`/trade-shows/${exhibition.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Exhibition
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Trending Exhibitions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                    Trending Exhibitions
                  </h2>
                  <Badge className="bg-red-100 text-red-800">
                    {trendingExhibitions.length} trending
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingExhibitions.slice(0, 6).map((exhibition) => (
                    <Card key={exhibition.id} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-red-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-purple-500/5"></div>
                      
                      <CardHeader className="relative z-10">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                              {exhibition.name}
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {exhibition.city}, {exhibition.country}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exhibition.shortDescription}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-600">{formatDate(exhibition.startDate)}</div>
                            <div className="text-xs text-gray-600">Start Date</div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-lg font-bold text-green-600">{exhibition.industry.name}</div>
                            <div className="text-xs text-gray-600">Industry</div>
                          </div>
                        </div>
                        
                        <Button asChild className="w-full group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-pink-600 transition-all">
                          <a href={`/trade-shows/${exhibition.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Exhibition
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Upcoming Exhibitions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Timer className="h-8 w-8 text-green-500 mr-3" />
                    Upcoming Exhibitions
                  </h2>
                  <Badge className="bg-green-100 text-green-800">
                    {upcomingExhibitions.length} upcoming
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingExhibitions.slice(0, 8).map((exhibition) => (
                    <Card key={exhibition.id} className="hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-green-100 text-green-800">
                              <Timer className="h-3 w-3 mr-1" />
                              Upcoming
                            </Badge>
                            <span className="text-xs text-gray-500">{exhibition.industry.name}</span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {exhibition.name}
                          </h3>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(exhibition.startDate)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{exhibition.city}</span>
                            </div>
                          </div>

                          <Button asChild size="sm" variant="outline" className="w-full text-gray-900">
                            <a href={`/trade-shows/${exhibition.slug}`}>
                              View Details
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Exhibit at Your Next Trade Show?
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            Find verified exhibition stand builders worldwide. Professional displays, local expertise, global reach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              <a href="/builders">
                <Building2 className="h-5 w-5 mr-2" />
                Find Booth Builders
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
              <a href="/quote">
                <Calendar className="h-5 w-5 mr-2" />
                Plan Your Exhibition
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}