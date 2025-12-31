'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationDisplay from '@/components/LocationDisplay';
import BuilderCard from '@/components/builder/BuilderCard';
import LeadInquiryForm from '@/components/LeadInquiryForm';
import GlobalLocationManager from '@/lib/utils/globalLocationManager';
import type { ExhibitionCity, ExhibitionCountry } from '@/lib/data/globalCities';
// Import the unified platform API to get real-time builder data
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { exhibitionBuilders } from '@/lib/data/exhibitionBuilders';
import { 
  MapPin, Building, Calendar, Users, Award, Star,
  Search, Filter, Grid, List, ChevronRight, Globe,
  TrendingUp, Target, Zap, Heart
} from 'lucide-react';

interface GlobalLocationPageProps {
  country?: string;
  city?: string;
  mode?: 'country' | 'city' | 'global';
}

export function GlobalLocationPage({ country, city, mode = 'global' }: GlobalLocationPageProps) {
  const [locationData, setLocationData] = useState<{
    countryData?: ExhibitionCountry;
    cityData?: ExhibitionCity;
  }>({});
  const [filteredBuilders, setFilteredBuilders] = useState(exhibitionBuilders);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [relatedLocations, setRelatedLocations] = useState<any[]>([]);

  useEffect(() => {
    // Load location data
    if (country) {
      const countryData = GlobalLocationManager.getLocationDetails(country, 'country') as ExhibitionCountry;
      const cityData = city ? GlobalLocationManager.getLocationDetails(city, 'city') as ExhibitionCity : undefined;
      
      setLocationData({ countryData, cityData });
      
      // Get related locations
      if (city) {
        const similar = GlobalLocationManager.getSimilarLocations(city, 'city', 4);
        setRelatedLocations(similar);
      } else if (country) {
        const cities = GlobalLocationManager.getCitiesByCountry(country);
        setRelatedLocations(cities.slice(0, 6));
      }
    }
  }, [country, city]);

  useEffect(() => {
    // Filter builders based on location - NOW USING REAL-TIME DATA FROM UNIFIED PLATFORM
    const loadBuilders = async () => {
      try {
        // Get all builders from unified platform (includes GMB imports, manual additions, etc.)
        const allBuilders = unifiedPlatformAPI.getBuilders();
        console.log(`📊 Found ${allBuilders.length} total builders from unified platform`);
        
        let builders = allBuilders;
        
        if (city) {
          // Filter by city
          builders = builders.filter(builder => 
            (builder.headquarters?.city?.toLowerCase() === locationData.cityData?.name?.toLowerCase() ||
            builder.serviceLocations?.some(loc => 
              loc.city?.toLowerCase() === locationData.cityData?.name?.toLowerCase()
            )) && builder.status !== 'inactive'
          );
        } else if (country) {
          // Filter by country
          builders = builders.filter(builder => 
            (builder.headquarters?.country?.toLowerCase() === locationData.countryData?.name?.toLowerCase() ||
            builder.serviceLocations?.some(loc => 
              loc.country?.toLowerCase() === locationData.countryData?.name?.toLowerCase()
            )) && builder.status !== 'inactive'
          );
        }

        // Apply search filter
        if (searchTerm) {
          builders = builders.filter(builder =>
            builder.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            builder.companyDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            builder.specializations?.some(spec => 
              spec.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }

        // Apply sorting
        builders.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return (b.rating || 0) - (a.rating || 0);
            case 'reviews':
              return (b.reviewCount || 0) - (a.reviewCount || 0);
            case 'projects':
              return (b.projectsCompleted || 0) - (a.projectsCompleted || 0);
            case 'name':
              return (a.companyName || '').localeCompare(b.companyName || '');
            default:
              return 0;
          }
        });

        console.log(`📍 Found ${builders.length} builders for location: ${city || country}`);
        setFilteredBuilders(builders);
      } catch (error) {
        console.error('Error loading builders:', error);
        // Fallback to static data
        setFilteredBuilders(exhibitionBuilders);
      }
    };

    loadBuilders();
  }, [searchTerm, sortBy, locationData, city, country]);

  const getPageTitle = () => {
    if (locationData.cityData) {
      return `Exhibition Stand Builders in ${locationData.cityData.name}, ${locationData.cityData.country}`;
    } else if (locationData.countryData) {
      return `Exhibition Stand Builders in ${locationData.countryData.name}`;
    }
    return 'Global Exhibition Stand Builders';
  };

  const getPageDescription = () => {
    if (locationData.cityData) {
      return `Find professional exhibition stand builders in ${locationData.cityData.name}. Get quotes from ${filteredBuilders.length} verified builders for your next trade show.`;
    } else if (locationData.countryData) {
      return `Connect with expert exhibition stand builders across ${locationData.countryData.name}. Compare ${filteredBuilders.length} verified companies and get competitive quotes.`;
    }
    return 'Discover exhibition stand builders worldwide. Connect with verified professionals and get competitive quotes for your trade show displays.';
  };

  const builderStats = {
    totalBuilders: filteredBuilders.length,
    averageRating: filteredBuilders.length > 0 ? 
      (filteredBuilders.reduce((sum, b) => sum + (b.rating || 0), 0) / filteredBuilders.length).toFixed(1) : '0',
    totalProjects: filteredBuilders.reduce((sum, b) => sum + (b.projectsCompleted || 0), 0),
    topRated: filteredBuilders.filter(b => (b.rating || 0) >= 4.5).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              {getPageDescription()}
            </p>
            
            {/* Location Display */}
            {(locationData.cityData || locationData.countryData) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto">
                <LocationDisplay
                  country={country}
                  city={city}
                  mode="detailed"
                  showStats
                  showBuilders
                  className="text-white"
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">{builderStats.totalBuilders}</div>
                <div className="text-blue-200">Verified Builders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{builderStats.averageRating}★</div>
                <div className="text-blue-200">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{builderStats.totalProjects}+</div>
                <div className="text-blue-200">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{builderStats.topRated}</div>
                <div className="text-blue-200">Top Rated (4.5+)</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 mt-8"
              onClick={() => setShowLeadModal(true)}
            >
              Get Free Quotes
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search builders by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="builders" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="builders">Builders ({filteredBuilders.length})</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="builders" className="space-y-6">
              {filteredBuilders.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Builders Found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? 
                        'Try adjusting your search terms or filters.' :
                        'No builders currently serve this location.'
                      }
                    </p>
                    <Button onClick={() => setShowLeadModal(true)}>
                      Request Builders for This Location
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {filteredBuilders.map((builder) => (
                    <BuilderCard 
                      key={builder.id} 
                      builder={{
                        ...builder,
                        planType: builder.planType || 'free' // Add missing planType property
                      }}
                      currentPageLocation={{
                        country: country,
                        city: city
                      }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="venues" className="space-y-6">
              {locationData.cityData?.venues && locationData.cityData?.venues.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locationData.cityData.venues.map((venue, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-600" />
                          {venue.name}
                        </CardTitle>
                        <CardDescription>{venue.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Size:</span>
                            <Badge variant="outline">{venue.size}</Badge>
                          </div>
                          {venue.majorEvents.length > 0 && (
                            <div>
                              <span className="text-sm text-gray-600">Major Events:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {venue.majorEvents.slice(0, 3).map((event, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600">Venue Information Coming Soon</h3>
                    <p className="text-gray-500">We're collecting venue data for this location.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600">Upcoming Events</h3>
                  <p className="text-gray-500 mb-4">Event listings for this location coming soon.</p>
                  <Button variant="outline">
                    Subscribe for Updates
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Locations */}
      {relatedLocations.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              {city ? 'Similar Cities' : 'Major Cities'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedLocations.map((location) => (
                <Card key={location.value} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">{location.label}</h3>
                    {location.data.annualEvents && (
                      <p className="text-xs text-gray-600">{location.data.annualEvents} events</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <LeadInquiryForm
              isModal={true}
              onClose={() => setShowLeadModal(false)}
              builderLocation={
                locationData.cityData ? 
                  `${locationData.cityData.name}, ${locationData.cityData.country}` :
                  locationData.countryData?.name
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalLocationPage;