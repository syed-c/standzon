"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PublicQuoteRequest } from "@/components/PublicQuoteRequest";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BuilderCard } from "./BuilderCard";
import { EnhancedLocationPage } from "./EnhancedLocationPage";
import LocationPageEditor from "./LocationPageEditor";
import { normalizeCountrySlug, normalizeCitySlug } from "@/lib/utils/slugUtils";
import {
  MapPin,
  Users,
  Building2,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Save,
  Eye,
  Globe,
  FileText,
  Settings,
  Star,
  Award,
  Calendar,
  Tag,
  Building,
} from "lucide-react";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import {
  storageAPI,
  PageContent as SavedPageContent,
} from "@/lib/data/storage";

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
  planType?: "free" | "basic" | "professional" | "enterprise";
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
  // Add CMS content prop for server-side rendered content
  cmsContent?: any;
  // Flag to indicate if the quote form should be shown separately
  showQuoteForm?: boolean;
  // Flag to hide the cities section on city pages
  hideCitiesSection?: boolean;
}

const BUILDERS_PER_PAGE = 6;

export function CountryCityPage({
  country,
  city,
  initialBuilders = [],
  initialContent,
  isEditable = false,
  cityData,
  showComingSoon = false,
  cmsContent,
  showQuoteForm = false,
  hideCitiesSection = false,
}: CountryCityPageProps) {
  // DEBUG: Log incoming props
  console.log('🔍 DEBUG: CountryCityPage props:', {
    country,
    city,
    initialBuildersCount: initialBuilders.length,
    hasInitialContent: !!initialContent,
    isEditable,
    hasCityData: !!cityData,
    showComingSoon,
    hasCmsContent: !!cmsContent
  });
  
  // Transform initial builders to ensure they have the correct structure
  const transformedInitialBuilders = initialBuilders.map((builder: any) => {
    // If builder already has the nested headquarters structure, return as is
    if (builder.headquarters && typeof builder.headquarters === 'object') {
      return builder;
    }
    
    // Otherwise, create the nested structure from flat fields
    return {
      ...builder,
      headquarters: {
        city: builder.headquarters_city || builder.headquarters?.city || 'Unknown City',
        country: builder.headquarters_country || builder.headquarters?.country || 'Unknown Country'
      }
    };
  });
  
  const [builders, setBuilders] = useState<Builder[]>(transformedInitialBuilders);
  const [filteredBuilders, setFilteredBuilders] =
    useState<Builder[]>(transformedInitialBuilders);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debug logging
  console.log('🔍 CountryCityPage received initialBuilders:', initialBuilders.length);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(city || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [savedPageContent, setSavedPageContent] =
    useState<SavedPageContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [pageContent, setPageContent] = useState<LocalPageContent>(
    initialContent || {
      id: `${country}-${city || "main"}`,
      title: city
        ? `Exhibition Stand Builders in ${city}, ${country}`
        : `Exhibition Stand Builders in ${country}`,
      metaTitle: city
        ? `${city} Exhibition Stand Builders | ${country}`
        : `${country} Exhibition Stand Builders`,
      metaDescription: city
        ? `Professional exhibition stand builders in ${city}, ${country}. Get custom trade show displays and booth design services.`
        : `Leading exhibition stand builders across ${country}. Custom trade show displays and professional booth construction.`,
      description: city
        ? `Discover professional exhibition stand builders in ${city}, ${country}. Our verified contractors specialize in custom trade show displays, booth design, and comprehensive exhibition services.`
        : `Find the best exhibition stand builders across ${country}. Connect with experienced professionals who create stunning custom displays for trade shows and exhibitions.`,
      heroContent: city
        ? `Connect with ${city}'s leading exhibition stand builders for your next trade show project.`
        : `Discover ${country}'s premier exhibition stand builders and booth designers.`,
      seoKeywords: city
        ? [
            `${city} exhibition stands`,
            `${city} trade show builders`,
            `${city} booth design`,
          ]
        : [
            `${country} exhibition stands`,
            `${country} trade show builders`,
            `${country} booth design`,
          ],
    }
  );

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
                  We're expanding our network to {city}! Exhibition stand
                  builders will be available here soon.
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
                          {cityData?.population || "2.5M+"}
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
                          {cityData?.statistics?.annualEvents || "200+"}
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
                  {(
                    cityData?.keyIndustries || [
                      "Technology",
                      "Healthcare",
                      "Manufacturing",
                      "Finance",
                      "Tourism",
                      "Construction",
                    ]
                  ).map((industry: string, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-sm border"
                    >
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium text-gray-900">
                          {industry}
                        </span>
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
                    {(cityData?.majorVenues || [])
                      .slice(0, 3)
                      .map((venue: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 shadow-sm border"
                        >
                          <div className="flex items-start">
                            <Building2 className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {venue.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {venue.description}
                              </p>
                              <p className="text-sm text-blue-600 mt-2">
                                {venue.size}
                              </p>
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
              Be the first to know when exhibition stand builders become
              available in {city}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-purple-600 font-semibold shadow-lg">
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
              {getOtherCitiesInCountry(country, city).map(
                (otherCity: any, index: number) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <MapPin className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold">
                          {otherCity.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {otherCity.builderCount || 0} builders available
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const countrySlug = country
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          const citySlug = otherCity.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          window.location.href = `/exhibition-stands/${countrySlug}/${citySlug}`;
                        }}
                      >
                        View Builders
                      </Button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Load saved page content
  useEffect(() => {
    let isMounted = true;
    
    const loadSavedContent = async () => {
      if (!isMounted) return;
      
      setIsLoadingContent(true);
      try {
        const countrySlug = country
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const path = city
          ? `/exhibition-stands/${countrySlug}/${city
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")}`
          : `/exhibition-stands/${countrySlug}`;

        // Special handling for Jordan, Lebanon, and Israel
        const isSpecialCountry = ['jordan', 'lebanon', 'israel'].includes(countrySlug);
        
        // Add cache-busting parameter for special countries to ensure fresh content
        const cacheBuster = isSpecialCountry ? `&_t=${Date.now()}` : '';
        
        const response = await fetch(
          `/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(path)}${cacheBuster}`,
          { 
            cache: "no-store",
            headers: {
              'Pragma': 'no-cache',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
          }
        );
        const data = await response.json();

        if (isMounted && data.success && data.data) {
          setSavedPageContent(data.data);
        } else if (isMounted) {
          // For special countries, try an alternative API endpoint if the first one fails
          if (isSpecialCountry) {
            try {
              const altResponse = await fetch(
                `/api/admin/global-pages?action=get-content&id=${countrySlug}${city ? `-${city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}` : ''}`,
                { cache: "no-store" }
              );
              const altData = await altResponse.json();
              
              if (isMounted && altData.success && altData.data) {
                setSavedPageContent(altData.data);
              }
            } catch (altError) {
              // Silently handle alternative content source errors
            }
          }
        }
      } catch (error) {
        // Silently handle errors to prevent infinite loops
      } finally {
        if (isMounted) {
          setIsLoadingContent(false);
        }
      }
    };

    loadSavedContent();
    
    return () => {
      isMounted = false;
    };
  }, [country, city]);

  // Listen for admin updates and refetch saved content in real-time
  useEffect(() => {
    let isMounted = true;
    
    // Add safety check for window object
    if (typeof window === 'undefined') {
      return;
    }
    
    const handler = (e: Event) => {
      if (!isMounted) return;
      
      try {
        const detail = (e as CustomEvent)?.detail as
          | { path?: string }
          | undefined;
        const countrySlug = country
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const currentPath = city
          ? `/exhibition-stands/${countrySlug}/${city
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")}`
          : `/exhibition-stands/${countrySlug}`;
        if (!detail?.path || detail.path === currentPath) {
          // Re-run saved content fetch
          (async () => {
            if (!isMounted) return;
            
            try {
              const resp = await fetch(
                `/api/admin/pages-editor?action=get-content&path=${encodeURIComponent(currentPath)}`,
                { cache: "no-store" }
              );
              const data = await resp.json();
              if (isMounted && data.success && data.data) {
                setSavedPageContent(data.data);
              }
            } catch {
              // Silently handle errors
            }
          })();
        }
      } catch {
        // Silently handle errors
      }
    };
    
    // Add safety check for event listener methods
    if (window?.addEventListener) {
      window.addEventListener("global-pages:updated", handler as EventListener);
    }
    
    return () => {
      isMounted = false;
      // Add safety check for event listener methods
      if (window?.removeEventListener) {
        window.removeEventListener(
          "global-pages:updated",
          handler as EventListener
        );
      }
    };
  }, [country, city]);

  useEffect(() => {
    let isMounted = true;
    
    const loadBuilders = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        // Load from unified platform API (includes all builders: GMB imports, manual additions, etc.)
        // Add safety check to prevent "Cannot read properties of undefined" error
        const allBuilders = unifiedPlatformAPI?.getBuilders?.(country) || []; // Pass country for filtering
        
        // DEBUG: Log builder data
        console.log('🔍 DEBUG: CountryCityPage - Unified platform returned', allBuilders.length, 'builders for country:', country);
        console.log('🔍 DEBUG: CountryCityPage - Initial builders provided', initialBuilders.length);
        
        // If we don't have initial builders and unified platform returned empty, try async version
        if (initialBuilders.length === 0 && allBuilders.length === 0) {
          console.log('🔄 Trying async version of getBuilders to ensure proper initialization');
          // Check if unified platform is initialized
          const isInitialized = unifiedPlatformAPI.isInitialized();
          console.log(`📊 Unified platform initialized: ${isInitialized}`);
          const asyncBuilders = await unifiedPlatformAPI.getBuildersAsync(country); // Pass country for filtering
          console.log(`📊 Async getBuilders returned ${asyncBuilders.length} builders for country:`, country);
          // Use async builders if we got data
          if (asyncBuilders.length > 0) {
            allBuilders.push(...asyncBuilders);
          }
        }
        
        // If we have initialBuilders from server-side, prioritize them and don't override with unified platform data
        if (initialBuilders.length > 0) {
          console.log('🔍 DEBUG: Using server-provided initial builders, count:', initialBuilders.length);
          if (isMounted) {
            setBuilders(initialBuilders);
            setFilteredBuilders(initialBuilders);
            setIsLoading(false);
          }
          return;
        }
        
        // Otherwise use unified platform data
        console.log('🔍 DEBUG: Using unified platform data, count:', allBuilders.length);
        if (isMounted) {
          setBuilders(allBuilders);
          setFilteredBuilders(allBuilders);
        }
      } catch (error) {
        console.error('❌ Error loading builders in CountryCityPage:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBuilders();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [country, city, initialBuilders]); // Add initialBuilders back to dependencies

  useEffect(() => {
    // Filter and sort builders (only for search and sorting, not for city filtering)
    // Only run this if we have builders
    if (builders.length === 0) {
      console.log('🔍 DEBUG: No builders to filter in secondary effect, skipping');
      return;
    }
    
    console.log('🔍 DEBUG: Running secondary filter effect with', builders.length, 'builders');
    
    let filtered = builders.filter((builder) => {
      // Text search filter
      const search = (searchTerm || "").toLowerCase();
      const nameText = (builder.companyName || "").toLowerCase();
      const descText = (builder.companyDescription || "").toLowerCase();
      const specs = builder.specializations || [];
      const matchesSearch = !search
        ? true
        : nameText.includes(search) ||
          descText.includes(search) ||
          specs.some((spec) =>
            (spec?.name || "").toLowerCase().includes(search)
          );

      // City filter (only applies when selectedCity is different from the page city)
      let matchesCity = true;
      if (selectedCity && selectedCity !== city) {
        matchesCity =
          builder.headquarters?.city === selectedCity ||
          builder.serviceLocations?.some((loc) => loc.city === selectedCity);
      }
      
      console.log('🔍 DEBUG: Builder filter result for', builder.companyName, {
        matchesSearch,
        matchesCity,
        finalResult: matchesSearch && matchesCity
      });

      return matchesSearch && matchesCity;
    });

    // Sort builders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "projects":
          return b.projectsCompleted - a.projectsCompleted;
        case "name":
          return a.companyName.localeCompare(b.companyName);
        case "plan":
          const planOrder = {
            enterprise: 4,
            professional: 3,
            basic: 2,
            free: 1,
          };
          return (
            (planOrder[b.planType || "free"] || 1) -
            (planOrder[a.planType || "free"] || 1)
          );
        default:
          return b.rating - a.rating;
      }
    });
    
    console.log('🔍 DEBUG: Secondary filter resulted in', filtered.length, 'builders');

    setFilteredBuilders(filtered);
    setCurrentPage(1);
  }, [builders, searchTerm, sortBy, selectedCity, city]);

  const totalPages = Math.ceil(filteredBuilders.length / BUILDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * BUILDERS_PER_PAGE;
  const currentBuilders = filteredBuilders.slice(
    startIndex,
    startIndex + BUILDERS_PER_PAGE
  );
  
  // DEBUG: Log pagination info
  console.log('🔍 DEBUG: Pagination info:', {
    totalBuilders: filteredBuilders.length,
    currentPage,
    totalPages,
    startIndex,
    endIndex: startIndex + BUILDERS_PER_PAGE,
    currentBuildersCount: currentBuilders.length
  });
  
  // DEBUG: Log what we're passing to EnhancedLocationPage
  console.log('🔍 DEBUG: Passing to EnhancedLocationPage:', {
    initialBuildersCount: currentBuilders.length,
    locationType: city ? "city" : "country",
    locationName: city || country,
    countryName: city ? country : undefined
  });

  const featuredBuilders = filteredBuilders
    .filter((b) => (b as any).featured || false)
    .slice(0, 3);
  const stats = {
    totalBuilders: filteredBuilders.length,
    averageRating:
      filteredBuilders.length > 0
        ? Math.round(
            (filteredBuilders.reduce((sum, b) => sum + b.rating, 0) /
              filteredBuilders.length) *
              10
          ) / 10
        : 0,
    verifiedBuilders: filteredBuilders.filter((b) => b.verified).length,
    totalProjects: filteredBuilders.reduce(
      (sum, b) => sum + b.projectsCompleted,
      0
    ),
  };

  const handleContentSave = async () => {
    try {
      console.log("💾 Saving page content...", pageContent);

      // In real implementation, this would save to your CMS/database
      toast({
        title: "Content Updated",
        description: "Page content has been successfully updated.",
      });

      setIsEditingContent(false);
    } catch (error) {
      console.error("❌ Error saving content:", error);
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
      // Skip cities for Jordan, Lebanon, and Israel
      const countryLower = country.toLowerCase();
      if (countryLower === 'jordan' || countryLower === 'lebanon' || countryLower === 'israel') {
        return [];
      }
      
      // ✅ FIXED: Use global database instead of broken expandedLocations
      const {
        getCitiesByCountry,
      } = require("@/lib/data/globalExhibitionDatabase");
      const countrySlug = country
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const allCities = getCitiesByCountry(countrySlug);

      // Filter cities in the same country, excluding current city
      const otherCities = allCities
        .filter((c: any) => c.name !== currentCity)
        .slice(0, 6) // Show max 6 other cities
        .map((c: any) => ({
          name: c.name,
          builderCount: c.builderCount || 0,
          slug: c.slug,
        }));

      return otherCities;
    } catch (error) {
      console.error("❌ Error loading other cities:", error);
      // Return fallback cities
      return [
        { name: "Dubai", builderCount: 25, slug: "dubai" },
        { name: "London", builderCount: 30, slug: "london" },
        { name: "Berlin", builderCount: 20, slug: "berlin" },
      ]
        .filter((c) => c.name !== currentCity)
        .slice(0, 3);
    }
  }

  return (
    <>
      {/* Cities section will be rendered after EnhancedLocationPage */}
      {isLoadingContent && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading saved content...
          </div>
        </div>
      )}

      <EnhancedLocationPage
        locationType={city ? "city" : "country"}
        locationName={city || country}
        countryName={city ? country : undefined}
        initialBuilders={currentBuilders}
        // pass search value to inner toolbar search next to Rating
        searchTerm={searchTerm}
        onSearchTermChange={(val: string) => setSearchTerm(val)}
        // we will render Cities + SEO + CTA in this parent below pagination
        suppressPostBuildersContent
        exhibitions={generateExhibitions(country, city)}
        venues={generateVenues(country, city)}
        pageContent={
          savedPageContent || {
            seo: {
              metaTitle: pageContent.metaTitle,
              metaDescription: pageContent.metaDescription,
              keywords: pageContent.seoKeywords,
            },
            hero: {
              title: pageContent.title,
              subtitle: `Professional booth design and construction services`,
              description: pageContent.description,
              ctaText: "Get Free Quote",
            },
            content: {
              introduction: pageContent.description,
              whyChooseSection: `${city || country} offers unique advantages for exhibition projects with its strategic location and skilled local builders.`,
              industryOverview: `${city || country}'s exhibition industry serves diverse sectors, contributing to its position as a key business destination.`,
              venueInformation: `${city || country} offers modern exhibition facilities equipped with contemporary amenities and flexible spaces.`,
              builderAdvantages: `Choosing local ${city || country} exhibition stand builders provides strategic advantages including knowledge of venue requirements.`,
              conclusion: `${city || country} presents excellent opportunities for exhibition success with its growing business environment.`,
            },
            design: {
              primaryColor: "#ec4899",
              accentColor: "#f97316",
              layout: "modern" as const,
              showStats: true,
              showMap: city ? true : false,
            },
          }
        }
        // ✅ CRITICAL FIX: Pass calculated stats to override defaults
        locationStats={{
          totalBuilders: filteredBuilders.length,
          averageRating:
            filteredBuilders.length > 0
              ? Math.round(
                  (filteredBuilders.reduce((sum, b) => sum + b.rating, 0) /
                    filteredBuilders.length) *
                    10
                ) / 10
              : 4.8,
          completedProjects: filteredBuilders.reduce(
            (sum, b) => sum + b.projectsCompleted,
            0
          ),
          averagePrice: 450,
        }}
        // ✅ NEW: Pass server-side CMS content for immediate rendering
        serverCmsContent={cmsContent}
        isEditable={isEditable}
        onContentUpdate={async (content: any) => {
          const pageId = city
            ? `${country
                .toLowerCase()
                .replace(/\\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}-${city
                .toLowerCase()
                .replace(/\\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}`
            : `${country
                .toLowerCase()
                .replace(/\\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}`;

          console.log("💾 Saving page content for:", pageId, content);

          try {
            const response = await fetch("/api/admin/global-pages", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "update-content",
                pageId,
                content: {
                  ...content,
                  id: pageId,
                  type: city ? "city" : "country",
                  location: {
                    name: city || country,
                    country: city ? country : undefined,
                    slug: pageId,
                  },
                  lastModified: new Date().toISOString(),
                },
              }),
            });

            const result = await response.json();

            if (result.success) {
              // Update local state
              setSavedPageContent({
                ...content,
                id: pageId,
                type: city ? "city" : "country",
                location: {
                  name: city || country,
                  country: city ? country : undefined,
                  slug: pageId,
                },
                lastModified: new Date().toISOString(),
              });

              toast({
                title: "Content Saved",
                description: `Page content for ${city || country} has been successfully updated.`,
              });
            } else {
              throw new Error(result.error || "Failed to save content");
            }
          } catch (error) {
            console.error("❌ Error saving content:", error);
            toast({
              title: "Save Failed",
              description: "There was an error saving the content.",
              variant: "destructive",
            });
            throw error;
          }
        }}
      />

      {/* Pagination Controls (immediately after builders) */}
      {totalPages > 1 && (
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-900 border-gray-300"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className={
                    currentPage === i + 1 ? "" : "text-gray-900 border-gray-300"
                  }
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-900 border-gray-300"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Cities Section placed after builders + pagination - hidden on city pages and specific countries */}
      {cities && cities.length > 0 && !hideCitiesSection && 
       !['jordan', 'lebanon', 'israel'].includes(country.toLowerCase()) && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Cities in {country}
              </h2>
              <p className="text-gray-600 mt-2">
                Browse local pages for major cities across {country}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((c, index) => {
                // Import and use the utility function for consistent slug generation
                const cityUrl = `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(c.name)}`;
                return (
                  <a key={`${c.slug || c.name}-${index}`} href={cityUrl} className="group">
                    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                          {c.name}
                        </div>
                        <span className="text-xs text-gray-500">
                          {c.builderCount || 0} builders
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Country Services Section (H2 + paragraph) sourced from CMS */}
      {!city &&
        (() => {
          const slug = country
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const servicesFromSaved = (savedPageContent as any)?.sections
            ?.countryPages?.[slug];
          const heading =
            servicesFromSaved?.servicesHeading ||
            (cmsContent as any)?.servicesHeading;
          const paragraph =
            servicesFromSaved?.servicesParagraph ||
            (cmsContent as any)?.servicesParagraph;
          if (!heading && !paragraph) return null;
          return (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {heading && (
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {heading}
                  </h2>
                )}
                {paragraph && (
                  <div
                    className="prose max-w-none leading-relaxed text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\r?\n/g, "<br/>"),
                    }}
                  />
                )}
              </div>
            </section>
          );
        })()}

      {/* Removed extra SEO content block after cities; services are rendered inside EnhancedLocationPage */}

      {/* City Services Section (H2 + paragraph) sourced from CMS */}
      {city &&
        (() => {
          const countrySlug = country
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const citySlug = city
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
          const key = `${countrySlug}-${citySlug}`;
          const raw = (savedPageContent as any)?.sections?.cityPages?.[key];
          const nested = (raw as any)?.countryPages?.[citySlug] || raw;
          const heading =
            nested?.servicesHeading ||
            (cmsContent as any)?.sections?.cityPages?.[key]?.servicesHeading ||
            (cmsContent as any)?.servicesHeading;
          const paragraph =
            nested?.servicesParagraph ||
            (cmsContent as any)?.sections?.cityPages?.[key]
              ?.servicesParagraph ||
            (cmsContent as any)?.servicesParagraph;
          if (!heading && !paragraph) return null;
          return (
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {heading && (
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {heading}
                  </h2>
                )}
                {paragraph && (
                  <div
                    className="prose max-w-none leading-relaxed text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\r?\n/g, "<br/>"),
                    }}
                  />
                )}
              </div>
            </section>
          );
        })()}

      {/* Quote Request Form placed just above the final CTA (only for city pages) */}
      {Boolean(city) && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {`Get Free Quotes from ${city} Builders`}
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Submit your requirements and receive competitive quotes from
                verified local builders
              </p>
            </div>
            <div className="max-w-4xl mx-auto flex justify-center">
              <PublicQuoteRequest
                location={country}
                countryCode={country === 'Germany' ? 'DE' : 
                           country === 'United Arab Emirates' ? 'AE' :
                           country === 'United Kingdom' ? 'GB' :
                           country === 'France' ? 'FR' :
                           country === 'Spain' ? 'ES' :
                           country === 'Italy' ? 'IT' :
                           country === 'Netherlands' ? 'NL' :
                           country === 'Switzerland' ? 'CH' :
                           country === 'Australia' ? 'AU' :
                           country === 'India' ? 'IN' :
                           country === 'Singapore' ? 'SG' :
                           country === 'China' ? 'CN' : 'US'}
                cityName={city}
                buttonText="Get Free Quote"
                size="lg"
                className=""
              />
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA moved to the very bottom - now sourced from CMS/Supabase */}
      {(() => {
        const countrySlug = country
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const citySlug = city
          ? city
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          : "";
        const key = city ? `${countrySlug}-${citySlug}` : "";
        const countryBlock =
          (savedPageContent as any)?.sections?.countryPages?.[countrySlug] ||
          (cmsContent as any)?.sections?.countryPages?.[countrySlug] ||
          (cmsContent as any) ||
          {};
        const rawCity = city
          ? (savedPageContent as any)?.sections?.cityPages?.[key]
          : null;
        const nestedCity = city
          ? (rawCity as any)?.countryPages?.[citySlug] || rawCity
          : null;
        const cityBlock = city
          ? nestedCity ||
            (cmsContent as any)?.sections?.cityPages?.[key] ||
            (cmsContent as any) ||
            {}
          : null;
        const block = city ? cityBlock || {} : countryBlock || {};
        const heading =
          (block as any)?.finalCtaHeading ||
          `Ready to Find Your Perfect Builder in ${city || country}?`;
        const paragraph =
          (block as any)?.finalCtaParagraph ||
          "Get competitive quotes from verified local builders. Compare proposals and choose the best fit for your exhibition needs.";
        const buttonText =
          (block as any)?.finalCtaButtonText || "Start Getting Quotes";
        return (
          <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {heading}
                </h2>
                <p className="text-xl text-slate-300 mb-8">{paragraph}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="text-lg px-8 py-4 text-black">{buttonText}</Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/20 hover:text-gray-900 backdrop-blur-sm text-lg px-8 py-4 shadow-lg"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Back to Top
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Cities section was moved to top */}
    </>
  );

  // Helper functions to generate sample data
  function generateExhibitions(country: string, city?: string) {
    const locationName = city || country;

    if (country === "United Arab Emirates" && city === "Dubai") {
      return [
        {
          id: "1",
          name: "GITEX Technology Week",
          date: "Oct 2024",
          category: "Technology",
          venue: "Dubai World Trade Centre",
        },
        {
          id: "2",
          name: "Arab Health",
          date: "Jan 2024",
          category: "Healthcare",
          venue: "Dubai World Trade Centre",
        },
        {
          id: "3",
          name: "ADIPEC",
          date: "Nov 2024",
          category: "Energy",
          venue: "ADNEC Abu Dhabi",
        },
        {
          id: "4",
          name: "Big 5 Global",
          date: "Nov 2024",
          category: "Construction",
          venue: "Dubai World Trade Centre",
        },
      ];
    }

    return [
      {
        id: "1",
        name: `${locationName} Trade Expo`,
        date: "Upcoming",
        category: "General Trade",
        venue: `${locationName} Exhibition Center`,
      },
      {
        id: "2",
        name: `${locationName} Business Summit`,
        date: "Upcoming",
        category: "Business",
        venue: `${locationName} Convention Center`,
      },
    ];
  }

  function generateVenues(country: string, city?: string) {
    const locationName = city || country;

    if (country === "United Arab Emirates" && city === "Dubai") {
      return [
        {
          id: "1",
          name: "Dubai World Trade Centre (DWTC)",
          size: "1M+ sqft",
          location: "Dubai",
          website: "https://dwtc.com",
          description:
            "The Middle East's premier exhibition and convention centre hosting 500+ events annually",
          specialties: ["Technology", "Healthcare", "Energy"],
        },
        {
          id: "2",
          name: "Dubai International Convention Centre",
          size: "500K sqft",
          location: "Dubai",
          website: "https://dicec.ae",
          description:
            "State-of-the-art facility in the heart of Dubai's business district",
          specialties: ["Business", "Finance", "Trade"],
        },
      ];
    }

    return [
      {
        id: "1",
        name: `${locationName} Exhibition Centre`,
        size: "500K+ sqft",
        location: locationName,
        description: `Premier exhibition venue in ${locationName}, hosting major trade shows and international events`,
        specialties: ["Trade Shows", "Conferences", "Events"],
      },
      {
        id: "2",
        name: `${locationName} Convention Center`,
        size: "300K+ sqft",
        location: locationName,
        description: `Modern convention facilities in the heart of ${locationName}'s business district`,
        specialties: ["Business", "Technology", "Innovation"],
      },
    ];
  }
}

export default CountryCityPage;
