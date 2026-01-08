'use client';

import React, { useState, useEffect } from 'react';
import ClientPageWithBreadcrumbs from '@/components/ClientPageWithBreadcrumbs';
import TradeStyleBanner from '@/components/TradeStyleBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, MapPin, Building, Search, ArrowRight, Users, Star, TrendingUp, ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import { getAllCountries, getAllCities, GLOBAL_STATS } from '@/lib/data/globalExhibitionDatabase';

interface CountryData {
  name: string;
  code: string;
  continent: string;
  builderCount: number;
  averageRating?: number;
  cities?: string[];
  slug: string;
  marketSize: number;
  annualEvents: number;
}

export default function ExhibitionStandsContent() {
  const [saved, setSaved] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set());
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('🌍 Loading comprehensive global exhibition directory...');

  useEffect(() => {
    loadGlobalCountriesData();
    (async () => {
      try {
        const res = await fetch('/api/admin/pages-editor?action=get-content&path=%2Fexhibition-stands', { cache: 'no-store' });
        const data = await res.json();
        if (data?.success && data?.data) setSaved(data.data);
      } catch {}
    })();
  }, []);

  const loadGlobalCountriesData = async () => {
    try {
      console.log('📡 Loading comprehensive global countries data...');
      
      // ✅ FIXED: Get comprehensive countries data from global database
      const allCountries = getAllCountries();
      const allCities = getAllCities();
      
      // Try to get real builder data from API
      let buildersByCountry: { [key: string]: number } = {};
      let averageRatingByCountry: { [key: string]: number } = {};
      try {
        const response = await fetch('/api/admin/builders?action=countries');
        const result = await response.json();
        
        if (result.success && result.data) {
          result.data.forEach((country: any) => {
            buildersByCountry[country.name] = country.builderCount || 0;
            averageRatingByCountry[country.name] = typeof country.averageRating === 'number' ? country.averageRating : 0;
            // Handle country name variations
            if (country.name === 'UAE') {
              buildersByCountry['United Arab Emirates'] = country.builderCount || 0;
              averageRatingByCountry['United Arab Emirates'] = typeof country.averageRating === 'number' ? country.averageRating : 0;
            } else if (country.name === 'United Arab Emirates') {
              buildersByCountry['UAE'] = country.builderCount || 0;
              averageRatingByCountry['UAE'] = typeof country.averageRating === 'number' ? country.averageRating : 0;
            }
          });
        }
      } catch (apiError) {
        console.warn('⚠️ Could not load real builder data, using static data:', apiError);
      }

      // ✅ FIXED: Process comprehensive countries data from global database
      const processedCountries = allCountries.map(country => {
        const countryCities = allCities.filter(city => city.countrySlug === country.slug);
        const realBuilderCount = buildersByCountry[country.name] || 0;
        const averageRating = averageRatingByCountry[country.name] || 0;
        
        return {
          name: country.name,
          code: country.code,
          continent: country.continent,
          builderCount: realBuilderCount,
          averageRating,
          cities: countryCities.map(city => city.name),
          slug: country.slug,
          marketSize: country.marketSize,
          annualEvents: country.annualEvents
        };
      });

      // Remove duplicates based on country code
      const uniqueCountries = processedCountries.filter((country, index, self) => 
        index === self.findIndex(c => c.code === country.code)
      );

      // Sort countries: active (with builders) first, then by market size, then alphabetically
      const sortedCountries = uniqueCountries.sort((a, b) => {
        // Active countries (with builders) first
        if (a.builderCount > 0 && b.builderCount === 0) return -1;
        if (a.builderCount === 0 && b.builderCount > 0) return 1;
        
        // Among active countries, sort by builder count
        if (a.builderCount > 0 && b.builderCount > 0) {
          return b.builderCount - a.builderCount;
        }
        
        // Among inactive countries, sort by market size, then alphabetically
        if (a.builderCount === 0 && b.builderCount === 0) {
          if (a.marketSize !== b.marketSize) {
            return b.marketSize - a.marketSize;
          }
          return a.name.localeCompare(b.name);
        }
        
        return 0;
      });

      setCountries(sortedCountries);
      console.log('✅ Loaded comprehensive global countries:', sortedCountries.length);
      console.log('📊 Active countries:', sortedCountries.filter(c => c.builderCount > 0).length);
      console.log('🔮 Coming soon countries:', sortedCountries.filter(c => c.builderCount === 0).length);
      
    } catch (error) {
      console.error('❌ Error loading global countries data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter countries based on search and continent
  const filteredCountries = countries.filter(country => {
    const matchesSearch = searchQuery === '' || 
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (country.cities && country.cities.some(city => city.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesContinent = selectedContinent === 'all' || country.continent === selectedContinent;
    
    console.log(`🔍 Filtering ${country.name}:`, {
      searchQuery,
      selectedContinent,
      matchesSearch,
      matchesContinent,
      countryContinent: country.continent
    });
    
    return matchesSearch && matchesContinent;
  });

  const toggleCountryExpansion = (countryCode: string) => {
    const newExpanded = new Set(expandedCountries);
    if (newExpanded.has(countryCode)) {
      newExpanded.delete(countryCode);
    } else {
      newExpanded.add(countryCode);
    }
    setExpandedCountries(newExpanded);
  };

  // Calculate stats from comprehensive global database
  const totalCountries = countries.length;
  const totalCities = GLOBAL_STATS.totalCities;
  const totalBuilders = GLOBAL_STATS.totalBuilders;
  const activeCountries = countries.filter(c => c.builderCount > 0).length;
  const totalMarketSize = GLOBAL_STATS.totalMarketSize;

  const continents = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];

  if (loading) {
    return (
      <div className="font-inter min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-600">Loading comprehensive global exhibition directory...</p>
          <p className="text-sm text-gray-500 mt-2">Covering {GLOBAL_STATS.totalCountries} countries worldwide</p>
        </div>
      </div>
    );
  }

  return (
    <ClientPageWithBreadcrumbs className="font-inter min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Trade Shows style banner */}
      <TradeStyleBanner
        badgeText="Professional Trade Show Database"
        mainHeading="Global Exhibition Directory"
        highlightHeading="& Builders by Location"
        description={`Professional builders across ${totalCountries} countries and ${totalCities}+ cities worldwide. $${totalMarketSize}B+ market coverage.`}
        stats={[
          { icon: 'calendar', value: totalBuilders.toLocaleString(), label: 'Expert Builders', color: '#2ec4b6' },
          { icon: 'map-pin', value: String(totalCountries), label: 'Countries', color: '#3dd598' },
          { icon: 'users', value: String(totalCities), label: 'Major Cities', color: '#f4a261' },
          { icon: 'chart-line', value: String(activeCountries), label: 'Active Markets', color: '#a06cd5' }
        ]}
        showSearch={false}
        searchPlaceholder=""
      />

      {/* Render saved raw HTML if available */}
      {saved?.content?.extra?.rawHtml && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: saved.content.extra.rawHtml }} />
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search countries or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Continents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Continents</SelectItem>
                  {continents.map(continent => (
                    <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredCountries.length} of {totalCountries} countries
            </div>
          </div>
        </div>
      </section>

      {/* Countries Directory - 3 CARDS PER ROW */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map((country, index) => {
              const isExpanded = expandedCountries.has(country.code);
              const isActive = country.builderCount > 0;
              
              return (
                <Card key={`${country.code}-${index}`} className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isActive ? 'ring-2 ring-blue-200 bg-white' : 'bg-gray-50 border-dashed'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                          isActive ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          {country.code}
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                            {country.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {country.continent}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        {country.cities && country.cities.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCountryExpansion(country.code)}
                            className="p-1"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Country Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`text-center p-3 rounded-lg ${isActive ? 'bg-blue-50' : 'bg-gray-100'}`}>
                        <div className={`text-xl font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                          {country.builderCount}
                        </div>
                        <div className="text-xs text-gray-600">Builders</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${isActive ? 'bg-green-50' : 'bg-gray-100'}`}>
                        <div className={`text-xl font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {isActive && country.averageRating ? country.averageRating.toFixed(1) : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${isActive ? 'bg-purple-50' : 'bg-gray-100'}`}>
                        <div className={`text-xl font-bold ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                          {country.cities?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Cities</div>
                      </div>
                    </div>

                    {/* Removed Coming Soon/Expanding Soon section as requested */}

                    {/* Cities List - Expandable */}
                    {isExpanded && country.cities && country.cities.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Exhibition Cities:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {country.cities.slice(0, 8).map((city, index) => (
                            <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                              isActive ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                              <Building className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-700">{city}</span>
                            </div>
                          ))}
                          {country.cities.length > 8 && (
                            <div className="text-xs text-gray-500 col-span-2 text-center pt-2">
                              +{country.cities.length - 8} more cities
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button 
                        asChild 
                        className={`w-full bg-blue-600 hover:bg-blue-700`}
                      >
                        <a href={`/exhibition-stands/${country.slug}`}>
                          <Building className="h-4 w-4 mr-2" />
                          {`Explore ${country.name} Builders`}
                          <ArrowRight className="h-4 w-4 ml-auto" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No countries found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>
      
    </ClientPageWithBreadcrumbs>
  );
}
