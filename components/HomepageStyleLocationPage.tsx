'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FiMapPin, 
  FiStar, 
  FiUsers, 
  FiArrowRight, 
  FiAward, 
  FiSearch, 
  FiFilter,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiSettings
} from 'react-icons/fi';
import Link from 'next/link';
import Navigation from './Navigation';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';

interface Builder {
  id: string;
  companyName: string;
  slug: string;
  headquarters: {
    city: string;
    country: string;
  };
  serviceLocations: Array<{
    city: string;
    country: string;
  }>;
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  responseTime: string;
  verified: boolean;
  premiumMember: boolean;
  planType?: 'free' | 'basic' | 'professional' | 'enterprise';
  services: Array<{
    name: string;
    description: string;
  }>;
  specializations: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  companyDescription: string;
  keyStrengths: string[];
  featured?: boolean;
  adminFeatured?: boolean; // New: Admin-controlled featured status
  featuredPriority?: number; // New: Admin-controlled priority (1-3 for top positions)
}

interface HomepageStyleLocationPageProps {
  country: string;
  city?: string;
  initialBuilders: Builder[];
  isEditable?: boolean;
}

const BUILDERS_PER_PAGE = 12;

export function HomepageStyleLocationPage({ 
  country, 
  city, 
  initialBuilders = [],
  isEditable = false 
}: HomepageStyleLocationPageProps) {
  const [builders, setBuilders] = useState<Builder[]>(initialBuilders);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>(initialBuilders);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(city || 'all-cities');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeaturedManagement, setShowFeaturedManagement] = useState(false);
  
  const { toast } = useToast();

  // Load builders data
  useEffect(() => {
    const loadBuilders = async () => {
      try {
        console.log(`🔍 Loading builders for ${city ? `${city}, ` : ''}${country} from unified platform...`);
        
        // Get all builders from unified platform (includes GMB imports, manual additions, etc.)
        const allBuilders = unifiedPlatformAPI.getBuilders();
        console.log(`📊 Total builders in unified platform: ${allBuilders.length}`);
        
        // Handle country name variations
        const countryVariations = [country];
        if (country === 'United Arab Emirates') {
          countryVariations.push('UAE');
        } else if (country === 'UAE') {
          countryVariations.push('United Arab Emirates');
        }
        
        // Filter builders for this country
        const countryBuilders = allBuilders.filter((builder: any) => {
          const servesCountry = builder.serviceLocations?.some((loc: any) => 
            countryVariations.includes(loc.country)
          );
          const headquartersMatch = countryVariations.includes(builder.headquarters?.country);
          
          return (servesCountry || headquartersMatch) && builder.status !== 'inactive';
        });
        
        // Deduplicate builders by ID to ensure each builder appears only once per country
        const builderMap = new Map();
        countryBuilders.forEach((builder: any) => {
          if (!builderMap.has(builder.id)) {
            builderMap.set(builder.id, builder);
          }
        });

        const uniqueBuilders = Array.from(builderMap.values());

        // Extract cities from builders
        const cityMap = new Map();
        uniqueBuilders.forEach((builder: any) => {
          // Add headquarters city
          if (countryVariations.includes(builder.headquarters?.country) && builder.headquarters?.city) {
            const cityName = builder.headquarters.city;
            if (!cityMap.has(cityName)) {
              cityMap.set(cityName, { name: cityName, slug: cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), builderCount: 0 });
            }
            cityMap.get(cityName).builderCount++;
          }
          
          // Add service location cities
          builder.serviceLocations?.forEach((loc: any) => {
            if (countryVariations.includes(loc.country) && loc.city) {
              const cityName = loc.city;
              if (!cityMap.has(cityName)) {
                cityMap.set(cityName, { name: cityName, slug: cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), builderCount: 0 });
              }
              cityMap.get(cityName).builderCount++;
            }
          });
        });

        const cityList = Array.from(cityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        
        setCities(cityList);
        setBuilders(uniqueBuilders);
        setFilteredBuilders(uniqueBuilders);
        
        console.log(`✅ Loaded ${uniqueBuilders.length} unique builders for ${country}`);
      } catch (error) {
        console.error('❌ Error loading builders:', error);
      }
    };

    loadBuilders();
    
    // Set up real-time updates
    const interval = setInterval(loadBuilders, 30000);
    return () => clearInterval(interval);
  }, [country, city]);

  // Filter and sort builders
  useEffect(() => {
    let filtered = builders.filter(builder => {
      const matchesSearch = builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.companyDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.specializations.some(spec => 
          spec.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesCity = !selectedCity || selectedCity === 'all-cities' ||
        builder.headquarters?.city === selectedCity ||
        builder.serviceLocations?.some(loc => loc.city === selectedCity);
      
      return matchesSearch && matchesCity;
    });

    // Sort builders with admin-featured priority
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          // First: Admin featured with priority
          const aPriority = a.adminFeatured ? (a.featuredPriority || 999) : 999;
          const bPriority = b.adminFeatured ? (b.featuredPriority || 999) : 999;
          if (aPriority !== bPriority) return aPriority - bPriority;
          
          // Second: Regular featured
          const aFeatured = a.featured || a.premiumMember || false;
          const bFeatured = b.featured || b.premiumMember || false;
          if (aFeatured !== bFeatured) return bFeatured ? 1 : -1;
          
          // Third: Rating
          return b.rating - a.rating;
        case 'rating':
          return b.rating - a.rating;
        case 'projects':
          return b.projectsCompleted - a.projectsCompleted;
        case 'name':
          return a.companyName.localeCompare(b.companyName);
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredBuilders(filtered);
    setCurrentPage(1);
  }, [builders, searchTerm, sortBy, selectedCity]);

  // Pagination
  const totalPages = Math.ceil(filteredBuilders.length / BUILDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * BUILDERS_PER_PAGE;
  const currentBuilders = filteredBuilders.slice(startIndex, startIndex + BUILDERS_PER_PAGE);

  // Get featured builders (top 3 admin-featured or top rated)
  const topFeaturedBuilders = filteredBuilders
    .filter(builder => builder.adminFeatured || builder.featured || builder.premiumMember)
    .slice(0, 3);

  // Stats
  const stats = {
    totalBuilders: filteredBuilders.length,
    averageRating: filteredBuilders.length > 0 ? 
      filteredBuilders.reduce((sum, b) => sum + b.rating, 0) / filteredBuilders.length : 0,
    verifiedBuilders: filteredBuilders.filter(b => b.verified).length,
    totalProjects: filteredBuilders.reduce((sum, b) => sum + b.projectsCompleted, 0)
  };

  // Update featured status
  const updateFeaturedStatus = async (builderId: string, featured: boolean, priority?: number) => {
    try {
      // In real implementation, this would update the database
      setBuilders(prev => prev.map(builder => 
        builder.id === builderId 
          ? { ...builder, adminFeatured: featured, featuredPriority: priority }
          : builder
      ));
      
      toast({
        title: "Featured Status Updated",
        description: `Builder has been ${featured ? 'featured' : 'unfeatured'} successfully.`,
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

  const locationName = city || country;
  const pageTitle = city ? `Exhibition Stand Builders in ${city}, ${country}` : `Exhibition Stand Builders in ${country}`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section - Same style as homepage */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-pink-900 text-white pt-24 lg:pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-transparent to-pink-900/90"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {pageTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pink-100">
            {stats.totalBuilders} verified builders • {stats.verifiedBuilders} verified • {stats.averageRating.toFixed(1)}★ average rating
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-pink-600 text-white px-8 py-3 text-lg">
              Get Free Quotes
            </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 text-lg">
              View All Builders
            </Button>
          </div>
        </div>
      </section>

      {/* Top Featured Builders Section - Same style as homepage FeaturedBuilders */}
      {topFeaturedBuilders.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div className="text-center flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                  Top Featured Builders in {locationName}
                </h2>
                <p className="text-xl text-gray-600">
                  Premium verified contractors with proven excellence
                </p>
              </div>
              
              {isEditable && (
                <Button
                  onClick={() => setShowFeaturedManagement(!showFeaturedManagement)}
                  variant="outline"
                  className="ml-4 text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <FiSettings className="w-4 h-4 mr-2" />
                  Manage Featured
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topFeaturedBuilders.map((builder, index) => (
                <Link key={`featured-${builder.id}-${index}`} href={`/companies/${builder.slug}`} className="group">
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-gradient-to-br from-white to-pink-50/30 border-pink-100 hover:border-pink-300 ${builder.adminFeatured || builder.featured ? 'ring-2 ring-pink-600 bg-gradient-to-br from-pink-50 to-white' : ''}`}>
                    <CardContent className="p-6">
                      {(builder.adminFeatured || builder.featured) && (
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <FiAward className="w-4 h-4 text-gold-primary" />
                            <span className="text-sm font-medium text-gold-primary">
                              {builder.adminFeatured ? `TOP ${builder.featuredPriority || index + 1}` : 'FEATURED'}
                            </span>
                          </div>
                          {builder.adminFeatured && (
                            <Badge className="bg-red-100 text-red-800 text-xs">Admin Featured</Badge>
                          )}
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold text-navy-900 mb-2">{builder.companyName}</h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{builder.headquarters?.city}, {builder.headquarters?.country}</span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-navy-900">{builder.rating}</span>
                          <span className="text-gray-500">({builder.reviewCount})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiUsers className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{builder.projectsCompleted} projects</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {builder.companyDescription?.substring(0, 120)}...
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {builder.specializations.slice(0, 2).map((specialty) => (
                          <span 
                            key={specialty.id}
                            className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full"
                          >
                            {specialty.name}
                          </span>
                        ))}
                        {builder.specializations.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{builder.specializations.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {builder.serviceLocations?.length || 1} locations
                        </div>
                        <div className="text-pink-600 group-hover:text-pink-700 font-medium flex items-center">
                          View Profile <FiArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Management Panel */}
      {isEditable && showFeaturedManagement && (
        <section className="py-8 bg-blue-50 border-y border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Featured Builder Management</h3>
            <div className="grid gap-4 max-h-64 overflow-y-auto">
              {builders.slice(0, 10).map((builder) => (
                <div key={builder.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">{builder.companyName}</p>
                      <p className="text-sm text-gray-500">{builder.headquarters?.city}, {builder.headquarters?.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {builder.adminFeatured && (
                      <Select
                        value={builder.featuredPriority?.toString() || ''}
                        onValueChange={(value) => updateFeaturedStatus(builder.id, true, parseInt(value))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Top 1</SelectItem>
                          <SelectItem value="2">Top 2</SelectItem>
                          <SelectItem value="3">Top 3</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      size="sm"
                      onClick={() => updateFeaturedStatus(builder.id, !builder.adminFeatured, builder.adminFeatured ? undefined : 1)}
                      className={builder.adminFeatured ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    >
                      {builder.adminFeatured ? 'Unfeature' : 'Feature'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Builders Section with Search and Filters */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">All Builders in {locationName}</h2>
              <p className="text-gray-600 mt-2">{filteredBuilders.length} builders found</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? "" : "text-gray-900 border-gray-300 hover:bg-gray-50"}
              >
                <FiGrid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "" : "text-gray-900 border-gray-300 hover:bg-gray-50"}
              >
                <FiList className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search builders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {cities.length > 0 && (
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-cities">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city.slug} value={city.name}>
                      {city.name} ({city.builderCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="projects">Most Projects</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-500 flex items-center">
              <FiFilter className="w-4 h-4 mr-1" />
              {filteredBuilders.length} of {builders.length} builders
            </div>
          </div>

          {/* Builders Grid/List */}
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {currentBuilders.map((builder, index) => (
              <Link key={`${builder.id}-${index}`} href={`/companies/${builder.slug}`} className="group">
                <Card className={`h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
                  <CardContent className={`p-6 ${viewMode === 'list' ? 'flex items-center space-x-6 w-full' : ''}`}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      {(builder.adminFeatured || builder.featured || builder.premiumMember) && (
                        <div className="flex items-center space-x-2 mb-3">
                          <FiAward className="w-4 h-4 text-gold-primary" />
                          <span className="text-sm font-medium text-gold-primary">
                            {builder.adminFeatured ? `TOP ${builder.featuredPriority}` : 'FEATURED'}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{builder.companyName}</h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{builder.headquarters?.city}, {builder.headquarters?.country}</span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{builder.rating}</span>
                          <span className="text-gray-500">({builder.reviewCount})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiUsers className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{builder.projectsCompleted}</span>
                        </div>
                      </div>

                      {viewMode === 'grid' && (
                        <>
                          <p className="text-gray-600 mb-4 text-sm">
                            {builder.companyDescription?.substring(0, 100)}...
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {builder.specializations.slice(0, 3).map((specialty) => (
                              <span 
                                key={specialty.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {specialty.name}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {viewMode === 'list' && (
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          {builder.serviceLocations?.length || 1} locations
                        </div>
                        <div className="text-pink-600 group-hover:text-pink-700 font-medium flex items-center">
                          View Profile <FiArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-gray-900 border-gray-300 hover:bg-gray-50"
              >
                <FiChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "" : "text-gray-900 border-gray-300 hover:bg-gray-50"}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="text-gray-900 border-gray-300 hover:bg-gray-50"
              >
                <FiChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}