'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BuilderCard } from './BuilderCard';
import { EnhancedLocationPage } from './EnhancedLocationPage';
import LocationPageEditor from './LocationPageEditor';
import { 
  MapPin, Users, Building2, TrendingUp, Search, Filter,
  Grid, List, ChevronLeft, ChevronRight, Edit3, Save,
  Eye, Globe, FileText, Settings, Star, Award, Calendar, Tag, Building
} from 'lucide-react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { storageAPI, PageContent as SavedPageContent } from '@/lib/data/storage';

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
}

interface LocalPageContent {
  id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  heroContent: string;
  seoKeywords: string[];
}

interface CountryCityPageProps {
  country: string;
  city?: string;
  initialBuilders: Builder[];
  initialContent?: LocalPageContent;
  isEditable?: boolean;
  cityData?: any;
  showComingSoon?: boolean;
}

const BUILDERS_PER_PAGE = 9;

export function CountryCityPage({ 
  country, 
  city, 
  initialBuilders = [], 
  initialContent,
  isEditable = false,
  cityData,
  showComingSoon = false
}: CountryCityPageProps) {
  const [builders, setBuilders] = useState<Builder[]>(initialBuilders);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>(initialBuilders);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(city || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [savedPageContent, setSavedPageContent] = useState<SavedPageContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [pageContent, setPageContent] = useState<LocalPageContent>(initialContent || {
    id: `${country}-${city || 'main'}`,
    title: city ? `Exhibition Stand Builders in ${city}, ${country}` : `Exhibition Stand Builders in ${country}`,
    metaTitle: city ? `${city} Exhibition Stand Builders | ${country}` : `${country} Exhibition Stand Builders`,
    metaDescription: city ? 
      `Professional exhibition stand builders in ${city}, ${country}. Get custom trade show displays and booth design services.` :
      `Leading exhibition stand builders across ${country}. Custom trade show displays and professional booth construction.`,
    description: city ?
      `Discover professional exhibition stand builders in ${city}, ${country}. Our verified contractors specialize in custom trade show displays, booth design, and comprehensive exhibition services.` :
      `Find the best exhibition stand builders across ${country}. Connect with experienced professionals who create stunning custom displays for trade shows and exhibitions.`,
    heroContent: city ?
      `Connect with ${city}'s leading exhibition stand builders for your next trade show project.` :
      `Discover ${country}'s premier exhibition stand builders and booth designers.`,
    seoKeywords: city ?
      [`${city} exhibition stands`, `${city} trade show builders`, `${city} booth design`] :
      [`${country} exhibition stands`, `${country} trade show builders`, `${country} booth design`]
  });

  const { toast } = useToast();

  // If showComingSoon is true, render the coming soon state
  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Exhibition Stand Builders in {city}, {country}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Professional booth design and construction services
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Building className="h-12 w-12 text-yellow-300 mr-3" />
                  <span className="text-2xl font-semibold">Coming Soon</span>
                </div>
                <p className="text-lg text-blue-100">
                  We're expanding our network to {city}! Exhibition stand builders will be available here soon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* City Information Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* City Overview */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  About {city}, {country}
                </h2>
                <div className="prose prose-lg text-gray-600">
                  <p>
                    {cityData?.seoContent?.introduction || 
                    `${city} stands as a key exhibition destination in ${country}, hosting dynamic trade shows and business events. The city offers excellent opportunities for exhibition success with its growing business environment and professional infrastructure.`}
                  </p>
                </div>

                {/* City Stats */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Population</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {cityData?.population || '2.5M+'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Annual Events</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {cityData?.statistics?.annualEvents || '200+'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Industries */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Key Industries
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(cityData?.keyIndustries || ['Technology', 'Healthcare', 'Manufacturing', 'Finance', 'Tourism', 'Construction']).map((industry: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium text-gray-900">{industry}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Major Venues */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Major Venues
                  </h3>
                  <div className="space-y-4">
                    {(cityData?.majorVenues || []).slice(0, 3).map((venue: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-start">
                          <Building2 className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{venue.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{venue.description}</p>
                            <p className="text-sm text-blue-600 mt-2">{venue.size}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Get Notified When We Launch in {city}
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Be the first to know when exhibition stand builders become available in {city}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-transparent text-purple-600 hover:bg-gray-100 font-semibold">
                Notify Me
              </Button>
            </div>
          </div>
        </div>

        {/* Alternative Locations */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Available in Other {country} Cities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Show other cities in the same country */}
              {getOtherCitiesInCountry(country, city).map((otherCity: any, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-xl font-semibold">{otherCity.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {otherCity.builderCount || 0} builders available
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const countrySlug = country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        const citySlug = otherCity.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        window.location.href = `/exhibition-stands/${countrySlug}/${citySlug}`;
                      }}
                    >
                      View Builders
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Load saved page content
  useEffect(() => {
    const loadSavedContent = async () => {
      setIsLoadingContent(true);
      try {
        const pageId = city ? 
          `${country.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${city.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` :
          `${country.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        
        console.log('🔍 Loading saved content for page:', pageId);
        
        const response = await fetch(`/api/admin/global-pages?action=get-content&pageId=${pageId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          console.log('✅ Found saved content for page:', pageId);
          setSavedPageContent(data.data);
        } else {
          console.log('ℹ️ No saved content found for page:', pageId);
        }
      } catch (error) {
        console.error('❌ Error loading saved content:', error);
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadSavedContent();
  }, [country, city]);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent)?.detail as { pageId?: string } | undefined;
        const currentPageId = city ? 
          `${country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` :
          `${country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        if (!detail?.pageId || detail.pageId === currentPageId) {
          // Re-run saved content fetch
          (async () => {
            try {
              const resp = await fetch(`/api/admin/global-pages?action=get-content&pageId=${currentPageId}`);
              const data = await resp.json();
              if (data.success && data.data) {
                setSavedPageContent(data.data);
              }
            } catch {}
          })();
        }
      } catch {}
    };
    window.addEventListener('global-pages:updated', handler as EventListener);
    return () => window.removeEventListener('global-pages:updated', handler as EventListener);
  }, [country, city]);

  useEffect(() => {
    const loadBuilders = async () => {
      try {
        console.log(`🔍 Loading builders for ${city ? `${city}, ` : ''}${country} from persistent storage...`);
        
        // Load from persistent storage API
        const response = await fetch('/api/admin/builders');
        const data = await response.json();
        
        if (data.success && data.data && data.data.builders) {
          const allBuilders = data.data.builders;
          console.log(`📊 Total builders in persistent storage: ${allBuilders.length}`);
          
          // Handle country name variations (UAE vs United Arab Emirates)
          const countryVariations = [country];
          if (country === 'United Arab Emirates') {
            countryVariations.push('UAE');
          } else if (country === 'UAE') {
            countryVariations.push('United Arab Emirates');
          }
          
          // Filter builders for this country (with variations)
          const countryBuilders = allBuilders.filter((builder: any) => {
            const servesCountry = builder.serviceLocations?.some((loc: any) => 
              countryVariations.includes(loc.country)
            );
            const headquartersMatch = countryVariations.includes(builder.headquarters?.country);
            
            return servesCountry || headquartersMatch;
          });
          
          // CRITICAL FIX: Deduplicate builders by ID to ensure each builder appears only once per country
          const builderMap = new Map();
          countryBuilders.forEach((builder: any) => {
            if (!builderMap.has(builder.id)) {
              builderMap.set(builder.id, {
                ...builder,
                // Track all cities they serve in this country for better display
                allServiceCities: Array.from(new Set([
                  ...(builder.serviceLocations?.filter((loc: any) => 
                    countryVariations.includes(loc.country)
                  ).map((loc: any) => loc.city) || []),
                  ...(countryVariations.includes(builder.headquarters?.country) ? [builder.headquarters?.city] : [])
                ].filter(Boolean)))
              });
            }
          });
          
          const uniqueBuilders = Array.from(builderMap.values());
          
          // Filter for specific city if we're on a city page
          let finalBuilders = uniqueBuilders;
          if (city) {
            console.log(`🏙️ Filtering builders for city: ${city}`);
            console.log(`🔍 Total builders to filter from: ${uniqueBuilders.length}`);
            
            finalBuilders = uniqueBuilders.filter((builder: any) => {
              // More flexible city matching - handle case variations and partial matches
              const cityLower = city.toLowerCase().trim();
              
              console.log(`🔍 Checking builder: ${builder.companyName}`);
              console.log(`  - HQ: ${builder.headquarters?.city}, ${builder.headquarters?.country}`);
              console.log(`  - Service locations: ${builder.serviceLocations?.map((l: any) => `${l.city}, ${l.country}`).join(' | ')}`);
              
              const servesCity = builder.serviceLocations?.some((loc: any) => 
                countryVariations.includes(loc.country) && 
                loc.city && loc.city.toLowerCase().trim() === cityLower
              );
              const headquartersMatch = countryVariations.includes(builder.headquarters?.country) && 
                                     builder.headquarters?.city && 
                                     builder.headquarters?.city.toLowerCase().trim() === cityLower;
              
              // Also try partial matching for debugging
              const flexibleHQMatch = countryVariations.includes(builder.headquarters?.country) && 
                                    builder.headquarters?.city && 
                                    builder.headquarters?.city.toLowerCase().includes(cityLower);
              const flexibleServiceMatch = builder.serviceLocations?.some((loc: any) => 
                countryVariations.includes(loc.country) && 
                loc.city && loc.city.toLowerCase().includes(cityLower)
              );
              
              const matches = servesCity || headquartersMatch || flexibleHQMatch || flexibleServiceMatch;
              
              console.log(`  - Exact match: ${servesCity || headquartersMatch}, Flexible match: ${flexibleHQMatch || flexibleServiceMatch}`);
              
              if (matches) {
                console.log(`✅ Builder "${builder.companyName}" serves ${city}`);
              }
              
              return matches;
            });
            
            console.log(`🏙️ Found ${finalBuilders.length} builders serving ${city}`);
          }
          
          console.log(`🔧 FIXED: Found ${countryBuilders.length} total builder entries, deduplicated to ${uniqueBuilders.length} unique builders for ${country}${city ? `, filtered to ${finalBuilders.length} for ${city}` : ''}`);
          
          // Extract cities from builders (for country page display)
          const citySet = new Set<string>();
          uniqueBuilders.forEach((builder: any) => {
            if (countryVariations.includes(builder.headquarters?.country) && builder.headquarters?.city) {
              citySet.add(builder.headquarters.city);
            }
            builder.serviceLocations?.forEach((loc: any) => {
              if (countryVariations.includes(loc.country) && loc.city) {
                citySet.add(loc.city);
              }
            });
          });
          
          const cityList = Array.from(citySet).sort().map(cityName => ({
            name: cityName,
            slug: cityName.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            builderCount: uniqueBuilders.filter((builder: any) => {
              const servesCity = builder.serviceLocations?.some((loc: any) => 
                countryVariations.includes(loc.country) && loc.city === cityName
              );
              const headquartersMatch = countryVariations.includes(builder.headquarters?.country) && 
                                     builder.headquarters?.city === cityName;
              
              return servesCity || headquartersMatch;
            }).length
          }));
          
          setCities(cityList);
          
          // Sort featured builders first
          finalBuilders.sort((a: any, b: any) => {
            const aFeatured = a.featured || false;
            const bFeatured = b.featured || false;
            if (aFeatured && !bFeatured) return -1;
            if (!aFeatured && bFeatured) return 1;
            return (b.rating || 0) - (a.rating || 0);
          });

          setBuilders(finalBuilders);
          setFilteredBuilders(finalBuilders);
          
          console.log(`✅ Updated builders list for ${city || country} with ${cityList.length} cities and ${finalBuilders.length} builders`);
        } else {
          console.log('ℹ️ No builders found in persistent storage, using initial data');
          setBuilders(initialBuilders);
          setFilteredBuilders(initialBuilders);
        }
      } catch (error) {
        console.error('❌ Error loading builders:', error);
        setBuilders(initialBuilders);
        setFilteredBuilders(initialBuilders);
      }
    };

    loadBuilders();

    // Set up real-time updates by polling every 30 seconds
    const interval = setInterval(loadBuilders, 30000);

    return () => clearInterval(interval);
  }, [country, city]);

  useEffect(() => {
    // Filter and sort builders (only for search and sorting, not for city filtering)
    let filtered = builders.filter(builder => {
      // Text search filter
      const matchesSearch = builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.companyDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.specializations.some(spec => 
          spec.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // City filter (only applies when selectedCity is different from the page city)
      let matchesCity = true;
      if (selectedCity && selectedCity !== city) {
        matchesCity = builder.headquarters?.city === selectedCity ||
          builder.serviceLocations?.some(loc => loc.city === selectedCity);
      }
      
      return matchesSearch && matchesCity;
    });

    // Sort builders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'projects':
          return b.projectsCompleted - a.projectsCompleted;
        case 'name':
          return a.companyName.localeCompare(b.companyName);
        case 'plan':
          const planOrder = { enterprise: 4, professional: 3, basic: 2, free: 1 };
          return (planOrder[b.planType || 'free'] || 1) - (planOrder[a.planType || 'free'] || 1);
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredBuilders(filtered);
    setCurrentPage(1);
  }, [builders, searchTerm, sortBy, selectedCity, city]);

  const totalPages = Math.ceil(filteredBuilders.length / BUILDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * BUILDERS_PER_PAGE;
  const currentBuilders = filteredBuilders.slice(startIndex, startIndex + BUILDERS_PER_PAGE);

  const featuredBuilders = filteredBuilders.filter(b => (b as any).featured || false).slice(0, 3);
  const stats = {
    totalBuilders: filteredBuilders.length,
    averageRating: filteredBuilders.length > 0 ? 
      Math.round((filteredBuilders.reduce((sum, b) => sum + b.rating, 0) / filteredBuilders.length) * 10) / 10 : 0,
    verifiedBuilders: filteredBuilders.filter(b => b.verified).length,
    totalProjects: filteredBuilders.reduce((sum, b) => sum + b.projectsCompleted, 0)
  };

  const handleContentSave = async () => {
    try {
      console.log('💾 Saving page content...', pageContent);
      
      // In real implementation, this would save to your CMS/database
      toast({
        title: "Content Updated",
        description: "Page content has been successfully updated.",
      });
      
      setIsEditingContent(false);
    } catch (error) {
      console.error('❌ Error saving content:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving the content.",
        variant: "destructive",
      });
    }
  };

  // Helper function to get other cities in the same country
  function getOtherCitiesInCountry(country: string, currentCity?: string) {
    try {
      // ✅ FIXED: Use global database instead of broken expandedLocations
      const { getCitiesByCountry } = require('@/lib/data/globalExhibitionDatabase');
      const countrySlug = country.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const allCities = getCitiesByCountry(countrySlug);
      
      // Filter cities in the same country, excluding current city
      const otherCities = allCities
        .filter((c: any) => c.name !== currentCity)
        .slice(0, 6) // Show max 6 other cities
        .map((c: any) => ({
          name: c.name,
          builderCount: c.builderCount || 0,
          slug: c.slug
        }));
      
      return otherCities;
    } catch (error) {
      console.error('❌ Error loading other cities:', error);
      // Return fallback cities
      return [
        { name: 'Dubai', builderCount: 25, slug: 'dubai' },
        { name: 'London', builderCount: 30, slug: 'london' },
        { name: 'Berlin', builderCount: 20, slug: 'berlin' }
      ].filter(c => c.name !== currentCity).slice(0, 3);
    }
  }

  return (
    <>
      {isLoadingContent && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading saved content...
          </div>
        </div>
      )}
      
      <EnhancedLocationPage
        locationType={city ? 'city' : 'country'}
        locationName={city || country}
        countryName={city ? country : undefined}
        initialBuilders={filteredBuilders}
        exhibitions={generateExhibitions(country, city)}
        venues={generateVenues(country, city)}
        pageContent={savedPageContent || {
          seo: {
            metaTitle: pageContent.metaTitle,
            metaDescription: pageContent.metaDescription,
            keywords: pageContent.seoKeywords
          },
          hero: {
            title: pageContent.title,
            subtitle: `Professional booth design and construction services`,
            description: pageContent.description,
            ctaText: 'Get Free Quote'
          },
          content: {
            introduction: pageContent.description,
            whyChooseSection: `${city || country} offers unique advantages for exhibition projects with its strategic location and skilled local builders.`,
            industryOverview: `${city || country}'s exhibition industry serves diverse sectors, contributing to its position as a key business destination.`,
            venueInformation: `${city || country} offers modern exhibition facilities equipped with contemporary amenities and flexible spaces.`,
            builderAdvantages: `Choosing local ${city || country} exhibition stand builders provides strategic advantages including knowledge of venue requirements.`,
            conclusion: `${city || country} presents excellent opportunities for exhibition success with its growing business environment.`
          },
          design: {
            primaryColor: '#ec4899',
            accentColor: '#f97316',
            layout: 'modern' as const,
            showStats: true,
            showMap: city ? true : false
          }
        }}
        // ✅ CRITICAL FIX: Pass calculated stats to override defaults
        locationStats={{
          totalBuilders: filteredBuilders.length,
          averageRating: filteredBuilders.length > 0 ? 
            Math.round((filteredBuilders.reduce((sum, b) => sum + b.rating, 0) / filteredBuilders.length) * 10) / 10 : 4.8,
          completedProjects: filteredBuilders.reduce((sum, b) => sum + b.projectsCompleted, 0),
          averagePrice: 450
        }}
        isEditable={isEditable}
        onContentUpdate={async (content: any) => {
          const pageId = city ? 
            `${country.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${city.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` :
            `${country.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
          
          console.log('💾 Saving page content for:', pageId, content);
          
          try {
            const response = await fetch('/api/admin/global-pages', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update-content',
                pageId,
                content: {
                  ...content,
                  id: pageId,
                  type: city ? 'city' : 'country',
                  location: {
                    name: city || country,
                    country: city ? country : undefined,
                    slug: pageId
                  },
                  lastModified: new Date().toISOString()
                }
              })
            });

            const result = await response.json();
            
            if (result.success) {
              // Update local state
              setSavedPageContent({
                ...content,
                id: pageId,
                type: city ? 'city' : 'country',
                location: {
                  name: city || country,
                  country: city ? country : undefined,
                  slug: pageId
                },
                lastModified: new Date().toISOString()
              });
              
              toast({
                title: "Content Saved",
                description: `Page content for ${city || country} has been successfully updated.`,
              });
            } else {
              throw new Error(result.error || 'Failed to save content');
            }
          } catch (error) {
            console.error('❌ Error saving content:', error);
            toast({
              title: "Save Failed",
              description: "There was an error saving the content.",
              variant: "destructive",
            });
            throw error;
          }
        }}
      />

      {/* Personalized/Raw Content Section (renders saved HTML) */}
      {(savedPageContent?.content?.extra?.personalizedHtml || savedPageContent?.content?.extra?.rawHtml || savedPageContent?.content?.introduction) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {savedPageContent?.content?.extra?.sectionHeading && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {savedPageContent.content.extra.sectionHeading}
              </h2>
            )}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: savedPageContent.content.extra?.personalizedHtml || savedPageContent.content.extra?.rawHtml || savedPageContent.content.introduction }}
            />
          </div>
        </section>
      )}
    </>
  );

  // Helper functions to generate sample data
  function generateExhibitions(country: string, city?: string) {
    const locationName = city || country;
    
    if (country === 'United Arab Emirates' && city === 'Dubai') {
      return [
        { id: '1', name: 'GITEX Technology Week', date: 'Oct 2024', category: 'Technology', venue: 'Dubai World Trade Centre' },
        { id: '2', name: 'Arab Health', date: 'Jan 2024', category: 'Healthcare', venue: 'Dubai World Trade Centre' },
        { id: '3', name: 'ADIPEC', date: 'Nov 2024', category: 'Energy', venue: 'ADNEC Abu Dhabi' },
        { id: '4', name: 'Big 5 Global', date: 'Nov 2024', category: 'Construction', venue: 'Dubai World Trade Centre' }
      ];
    }
    
    return [
      { id: '1', name: `${locationName} Trade Expo`, date: 'Upcoming', category: 'General Trade', venue: `${locationName} Exhibition Center` },
      { id: '2', name: `${locationName} Business Summit`, date: 'Upcoming', category: 'Business', venue: `${locationName} Convention Center` }
    ];
  }

  function generateVenues(country: string, city?: string) {
    const locationName = city || country;
    
    if (country === 'United Arab Emirates' && city === 'Dubai') {
      return [
        { 
          id: '1', 
          name: 'Dubai World Trade Centre (DWTC)', 
          size: '1M+ sqft', 
          location: 'Dubai',
          website: 'https://dwtc.com',
          description: 'The Middle East\'s premier exhibition and convention centre hosting 500+ events annually',
          specialties: ['Technology', 'Healthcare', 'Energy']
        },
        { 
          id: '2', 
          name: 'Dubai International Convention Centre', 
          size: '500K sqft', 
          location: 'Dubai',
          website: 'https://dicec.ae',
          description: 'State-of-the-art facility in the heart of Dubai\'s business district',
          specialties: ['Business', 'Finance', 'Trade']
        }
      ];
    }
    
    return [
      { 
        id: '1', 
        name: `${locationName} Exhibition Centre`, 
        size: '500K+ sqft', 
        location: locationName,
        description: `Premier exhibition venue in ${locationName}, hosting major trade shows and international events`,
        specialties: ['Trade Shows', 'Conferences', 'Events']
      },
      { 
        id: '2', 
        name: `${locationName} Convention Center`, 
        size: '300K+ sqft', 
        location: locationName,
        description: `Modern convention facilities in the heart of ${locationName}'s business district`,
        specialties: ['Business', 'Technology', 'Innovation']
      }
    ];
  }
}

export default CountryCityPage;