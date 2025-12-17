"use client";

import React, { useState, useEffect, useRef } from "react";
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
import EnhancedLocationPage from "./EnhancedLocationPage";
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
import { forcePlatformInitialization } from "@/lib/utils/platformInitializer";
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
  onContentUpdate?: (content: any) => void;
  hideCitiesSection?: boolean;
  cities?: any[];
  showQuoteForm?: boolean;
  cmsContent?: any;
}

const BUILDERS_PER_PAGE = 6;

const CountryCityPage: React.FC<CountryCityPageProps> = ({
  country,
  city,
  initialBuilders = [],
  initialContent,
  isEditable = false,
  onContentUpdate,
  hideCitiesSection = false,
  cities = [],
  showQuoteForm = true,
  cmsContent,
}) => {
  const [builders, setBuilders] = useState<Builder[]>(initialBuilders);
  const [filteredBuilders, setFilteredBuilders] = useState<Builder[]>(initialBuilders);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "projects" | "name" | "plan">("rating");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageContent, setPageContent] = useState<any>(initialContent || {});
  const [savedPageContent, setSavedPageContent] = useState<any>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const buildersRef = useRef<Builder[]>(initialBuilders);
  const { toast } = useToast();

  // ✅ PRODUCTION FIX: Force initialization on component mount (removed duplicate)
  useEffect(() => {
    console.log('🔄 CountryCityPage mounted, checking unified platform initialization...');
    
    // Force initialization check
    const checkInitialization = async () => {
      try {
        const isInitialized = unifiedPlatformAPI.isInitialized();
        console.log('📊 Unified platform initialized status:', isInitialized);
        
        if (!isInitialized) {
          console.log('🔄 Forcing unified platform initialization...');
          // Try to trigger initialization with retries
          const success = await forcePlatformInitialization(3);
          console.log('📊 Initialization result:', success ? 'Success' : 'Failed');
        }
      } catch (initError) {
        console.error('❌ Error during initialization check:', initError);
      }
    };
    
    checkInitialization();
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadBuilders = async () => {
      if (!isMounted) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 Loading builders for country:', country);
        
        // Load from unified platform API (includes all builders: GMB imports, manual additions, etc.)
        // Add safety check to prevent "Cannot read properties of undefined" error
        const allBuilders = unifiedPlatformAPI?.getBuilders?.(country) || []; // Pass country for filtering
        console.log('📊 Sync getBuilders returned:', allBuilders.length, 'builders');
        
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
            console.log('✅ Using async builders data');
            // Create a new array instead of trying to modify the existing one
            const newBuilders = [...asyncBuilders];
            // Replace allBuilders reference
            // We can't directly assign to allBuilders because it's const, but we can use it differently
            if (isMounted) {
              setBuilders(newBuilders);
              setFilteredBuilders(newBuilders);
              setIsLoading(false);
              return;
            }
          } else {
            console.log('⚠️ Both sync and async unified platform returned no builders');
            
            // ✅ PRODUCTION FIX: Fallback to direct Supabase fetch when unified platform returns no data
            console.log('🔄 Attempting direct Supabase fetch as fallback...');
            try {
              const { getAllBuilders } = await import('@/lib/supabase/builders');
              const supabaseBuilders = await getAllBuilders();
              console.log(`📊 Direct Supabase fetch returned ${supabaseBuilders.length} builders`);
              
              if (supabaseBuilders.length > 0) {
                // Filter by country
                const normalizedCountry = country.toLowerCase().replace(/-/g, " ").trim();
                const countryVariations = [normalizedCountry];
                
                if (normalizedCountry.includes("united arab emirates")) {
                  countryVariations.push("uae");
                } else if (normalizedCountry === "uae") {
                  countryVariations.push("united arab emirates");
                }
                
                console.log('🔍 DEBUG: Filtering builders for country variations:', countryVariations);
                
                const filteredBuilders = supabaseBuilders.filter((builder: any) => {
                  // Check headquarters country
                  const headquartersCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
                  const countryMatch = countryVariations.some(variation => 
                    headquartersCountry.includes(variation)
                  );
                  
                  // Check service locations
                  const serviceLocations = builder.service_locations || builder.serviceLocations || [];
                  const serviceLocationMatch = serviceLocations.some((loc: any) => {
                    const serviceCountry = (loc.country || '').toLowerCase().trim();
                    return countryVariations.some(variation => 
                      serviceCountry.includes(variation)
                    );
                  });
                  
                  const match = countryMatch || serviceLocationMatch;
                  
                  // Log first few builders for debugging
                  if (supabaseBuilders.indexOf(builder) < 3) {
                    console.log('🔍 DEBUG: Builder filtering for', builder.company_name || builder.name, {
                      headquartersCountry,
                      countryMatch,
                      serviceLocationMatch,
                      finalMatch: match
                    });
                  }
                  
                  return match;
                });
                console.log(`📍 Filtered to ${filteredBuilders.length} builders for country: ${country}`);
                
                if (isMounted && filteredBuilders.length > 0) {
                  console.log('✅ Using fallback Supabase builders data');
                  // Transform to match Builder interface (simpler than ExhibitionBuilder)
                  const transformedBuilders = filteredBuilders.map((builder: any) => ({
                    id: builder.id || '',
                    companyName: builder.company_name || builder.name || 'Unknown Builder',
                    slug: builder.slug || builder.id || '',
                    headquarters: {
                      city: builder.headquarters_city || builder.city || 'Unknown',
                      country: builder.headquarters_country || builder.country || 'Unknown'
                    },
                    serviceLocations: builder.service_locations || [{
                      city: builder.headquarters_city || builder.city || 'Unknown',
                      country: builder.headquarters_country || builder.country || 'Unknown'
                    }],
                    rating: builder.rating || 0,
                    reviewCount: builder.review_count || 0,
                    projectsCompleted: builder.projects_completed || builder.completed_projects || 0,
                    responseTime: builder.response_time || '24 hours',
                    verified: builder.verified || false,
                    premiumMember: builder.premium_member || builder.premiumMember || false,
                    planType: builder.plan_type || "free",
                    services: builder.services || [],
                    specializations: builder.specializations || [],
                    companyDescription: builder.description || builder.company_description || '',
                    keyStrengths: builder.key_strengths || [],
                    featured: builder.featured || false
                  }));
                  
                  if (isMounted) {
                    setBuilders(transformedBuilders);
                    setFilteredBuilders(transformedBuilders);
                    setIsLoading(false);
                    return;
                  }
                } else {
                  console.log('⚠️ Fallback also returned no builders for country:', country);
                }
              } else {
                console.log('⚠️ Supabase fetch returned no builders at all');
              }
            } catch (fallbackError) {
              console.error('❌ Error in Supabase fallback fetch:', fallbackError);
            }
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
  }, [country, city]); // Removed initialBuilders from dependencies to prevent infinite loop

  // Update filteredBuilders when builders actually change
  useEffect(() => {
    // Check if builders have actually changed
    const haveBuildersChanged = buildersRef.current !== builders;
    if (haveBuildersChanged) {
      buildersRef.current = builders;
      setFilteredBuilders(builders);
    }
  }, [builders]);
  
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
        default:
          return b.rating - a.rating;
      }
    });
    
    console.log('🔍 DEBUG: Secondary filter resulted in', filtered.length, 'builders');

    setFilteredBuilders(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy, selectedCity, city]); // Removed builders from dependencies to prevent infinite loop

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
        pageContent={          // Fix: Ensure we're not passing objects directly where strings are expected
          (() => {
            const baseContent = savedPageContent || {
              seo: {
                metaTitle: pageContent.metaTitle,
                metaDescription: pageContent.metaDescription,
                keywords: pageContent.seoKeywords,
              },
              hero: {
                title: pageContent.title,
                subtitle: `Professional booth design and construction services`,
                description: pageContent.heroContent || pageContent.description,
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
            };
            
            // If we have CMS content with the proper structure, use it directly
            if (cmsContent && typeof cmsContent === 'object') {
              // For city pages, the content might be nested in sections.cityPages
              const cityPageContent = cmsContent?.sections?.cityPages?.[`${country.toLowerCase()}-${city?.toLowerCase()}`] || cmsContent;
              
              // Extract content properly from various possible structures
              const extractText = (content: any): string => {
                if (typeof content === 'string') return content;
                if (typeof content === 'object' && content !== null) {
                  // Try common properties in order of preference
                  return content.description || 
                         content.text || 
                         content.heading || 
                         content.title || 
                         content.content ||
                         JSON.stringify(content);
                }
                return String(content);
              };
              
              // Extract array or return as array
              const extractArray = (content: any): string[] => {
                if (Array.isArray(content)) return content;
                if (typeof content === 'string') return [content];
                if (typeof content === 'object' && content !== null) {
                  // If it's an object with keywords property
                  if (Array.isArray(content.keywords)) return content.keywords;
                  if (typeof content.keywords === 'string') return [content.keywords];
                }
                return [];
              };
              
              return {
                seo: {
                  metaTitle: extractText(cityPageContent?.seo?.metaTitle) || baseContent.seo.metaTitle,
                  metaDescription: extractText(cityPageContent?.seo?.metaDescription) || baseContent.seo.metaDescription,
                  keywords: extractArray(cityPageContent?.seo?.keywords) || baseContent.seo.keywords,
                },
                hero: {
                  title: extractText(cityPageContent?.hero?.title) || extractText(cityPageContent?.hero?.heading) || baseContent.hero.title,
                  description: extractText(cityPageContent?.heroDescription) || extractText(cityPageContent?.hero?.description) || extractText(cityPageContent?.hero?.text) || baseContent.hero.description,
                  ctaText: extractText(cityPageContent?.hero?.ctaText) || baseContent.hero.ctaText,
                  subtitle: extractText(cityPageContent?.hero?.subtitle) || baseContent.hero.subtitle,
                },
                content: {
                  introduction: extractText(cityPageContent?.heroDescription) || extractText(cityPageContent?.heroContent) || extractText(cityPageContent?.content?.introduction) || extractText(cityPageContent?.hero?.description) || baseContent.content.introduction,
                  whyChooseSection: extractText(cityPageContent?.content?.whyChooseSection) || extractText(cityPageContent?.whyChooseSection) || baseContent.content.whyChooseSection,
                  industryOverview: extractText(cityPageContent?.content?.industryOverview) || baseContent.content.industryOverview,
                  venueInformation: extractText(cityPageContent?.content?.venueInformation) || baseContent.content.venueInformation,
                  builderAdvantages: extractText(cityPageContent?.content?.builderAdvantages) || baseContent.content.builderAdvantages,
                  conclusion: extractText(cityPageContent?.content?.conclusion) || baseContent.content.conclusion,
                },
                design: {
                  ...baseContent.design,
                  ...cityPageContent?.design,
                },
              };
            }
            
            // Fallback: Ensure all content properties are strings, not objects
            const safeExtractText = (content: any): string => {
              if (typeof content === 'string') return content;
              if (typeof content === 'object' && content !== null) {
                return content.description || 
                       content.text || 
                       content.heading || 
                       content.title || 
                       JSON.stringify(content);
              }
              return String(content);
            };
            
            return {
              ...baseContent,
              seo: baseContent.seo ? {
                ...baseContent.seo,
                metaTitle: safeExtractText(baseContent.seo.metaTitle),
                metaDescription: safeExtractText(baseContent.seo.metaDescription),
                keywords: Array.isArray(baseContent.seo.keywords) ? baseContent.seo.keywords : 
                  (typeof baseContent.seo.keywords === 'string' ? [baseContent.seo.keywords] : [])
              } : {},
              hero: baseContent.hero ? {
                ...baseContent.hero,
                title: safeExtractText(baseContent.hero.title),
                description: safeExtractText(pageContent?.heroContent) || safeExtractText(baseContent.hero.description),
              } : {},
              content: baseContent.content ? {
                ...baseContent.content,
                introduction: safeExtractText(pageContent?.heroContent) || safeExtractText(baseContent.content.introduction),
                whyChooseSection: safeExtractText(baseContent.content.whyChooseSection),
                industryOverview: safeExtractText(baseContent.content.industryOverview),
                venueInformation: safeExtractText(baseContent.content.venueInformation),
                builderAdvantages: safeExtractText(baseContent.content.builderAdvantages),
                conclusion: safeExtractText(baseContent.content.conclusion),
              } : {}
            };
          })()
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
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}-${city
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")}`
            : `${country
                .toLowerCase()
                .replace(/\s+/g, "-")
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
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-900 border-gray-300 min-w-[80px]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="flex flex-wrap gap-2 justify-center">
                {[...Array(Math.min(totalPages, 10))].map((_, i) => {
                  // Show first, last, current, and nearby pages
                  const pageNum = i + 1;
                  if (totalPages > 10) {
                    if (pageNum === 1 || pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <Button
                          key={i}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={
                            currentPage === pageNum 
                              ? "min-w-[40px]" 
                              : "text-gray-900 border-gray-300 min-w-[40px]"
                          }
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span key={i} className="px-2 py-1 text-gray-500">...</span>
                      );
                    }
                    return null;
                  }
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === pageNum 
                          ? "min-w-[40px]" 
                          : "text-gray-900 border-gray-300 min-w-[40px]"
                      }
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-900 border-gray-300 min-w-[80px]"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </section>
      )}

      {/* Cities Section placed after builders + pagination - hidden on city pages and specific countries */}
      {(() => {
        // DEBUG: Log cities section evaluation
        console.log('🔍 DEBUG: Cities section evaluation:', {
          hasCities: cities && cities.length > 0,
          citiesCount: cities?.length || 0,
          hideCitiesSection,
          isSpecialCountry: ['jordan', 'lebanon', 'israel'].includes(country.toLowerCase()),
          shouldRender: cities && cities.length > 0 && !hideCitiesSection && 
                       !['jordan', 'lebanon', 'israel'].includes(country.toLowerCase())
        });
        
        // For city pages, we want to hide the cities section completely
        // For country pages, show the cities section as usual
        const shouldShowCitiesSection = !city && cities && cities.length > 0 && !hideCitiesSection && 
               !['jordan', 'lebanon', 'israel'].includes(country.toLowerCase());
               
        return shouldShowCitiesSection && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities.map((c, index) => {
                  // Import and use the utility function for consistent slug generation
                  const cityUrl = `/exhibition-stands/${normalizeCountrySlug(country)}/${normalizeCitySlug(c.name)}`;
                  return (
                    <a key={`${c.slug || c.name}-${index}`} href={cityUrl} className="group">
                      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-all h-full">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                            {c.name}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
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
        );
      })()}
      {/* Country Services Section (H2 + paragraph) sourced from CMS */}
      {!city && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {(() => {
                // Extract content from CMS structure
                let heading = `Professional Exhibition Stand Builders in ${country}`;
                
                // Try to get from savedPageContent first
                if (savedPageContent) {
                  const countrySlug = country
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                    
                  // Check nested structure in savedPageContent
                  if (savedPageContent?.sections?.countryPages?.[countrySlug]?.servicesHeading) {
                    const headingRaw = savedPageContent.sections.countryPages[countrySlug].servicesHeading;
                    heading = typeof headingRaw === 'object' ? 
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) : 
                      headingRaw;
                  }
                }
                
                // Fallback to cmsContent
                if (cmsContent && heading === `Professional Exhibition Stand Builders in ${country}`) {
                  const countrySlug = country
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  
                  // Check various possible structures in cmsContent
                  if (cmsContent?.sections?.countryPages?.[countrySlug]?.servicesHeading) {
                    const headingRaw = cmsContent.sections.countryPages[countrySlug].servicesHeading;
                    heading = typeof headingRaw === 'object' ? 
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) : 
                      headingRaw;
                  } else if (cmsContent?.content?.sections?.countryPages?.[countrySlug]?.servicesHeading) {
                    const headingRaw = cmsContent.content.sections.countryPages[countrySlug].servicesHeading;
                    heading = typeof headingRaw === 'object' ? 
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) : 
                      headingRaw;
                  } else if (cmsContent?.servicesHeading) {
                    const headingRaw = cmsContent.servicesHeading;
                    heading = typeof headingRaw === 'object' ? 
                      (headingRaw.heading || headingRaw.title || JSON.stringify(headingRaw)) : 
                      headingRaw;
                  }
                }
                
                return heading;
              })()}
            </h2>
            <div
              className="prose max-w-none leading-relaxed text-gray-900"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  // Extract content from CMS structure
                  let paragraph = `<p>${country} offers exceptional exhibition stand building services with skilled craftsmen and innovative designers. Our local builders understand regional market dynamics and can create stunning displays that attract visitors and generate leads.</p>
                     <p>With expertise in various industries including technology, healthcare, automotive, and consumer goods, ${country}'s exhibition stand builders deliver customized solutions that align with your brand identity and marketing objectives.</p>`;
                  
                  // Try to get from savedPageContent first
                  if (savedPageContent) {
                    const countrySlug = country
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                      
                    // Check nested structure in savedPageContent
                    if (savedPageContent?.sections?.countryPages?.[countrySlug]?.servicesParagraph) {
                      const paragraphRaw = savedPageContent.sections.countryPages[countrySlug].servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ? 
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) : 
                        paragraphRaw;
                    }
                  }
                  
                  // Fallback to cmsContent
                  if (cmsContent && paragraph === `<p>${country} offers exceptional exhibition stand building services with skilled craftsmen and innovative designers. Our local builders understand regional market dynamics and can create stunning displays that attract visitors and generate leads.</p>
                     <p>With expertise in various industries including technology, healthcare, automotive, and consumer goods, ${country}'s exhibition stand builders deliver customized solutions that align with your brand identity and marketing objectives.</p>`) {
                    const countrySlug = country
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    
                    // Check various possible structures in cmsContent
                    if (cmsContent?.sections?.countryPages?.[countrySlug]?.servicesParagraph) {
                      const paragraphRaw = cmsContent.sections.countryPages[countrySlug].servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ? 
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) : 
                        paragraphRaw;
                    } else if (cmsContent?.content?.sections?.countryPages?.[countrySlug]?.servicesParagraph) {
                      const paragraphRaw = cmsContent.content.sections.countryPages[countrySlug].servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ? 
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) : 
                        paragraphRaw;
                    } else if (cmsContent?.servicesParagraph) {
                      const paragraphRaw = cmsContent.servicesParagraph;
                      paragraph = typeof paragraphRaw === 'object' ? 
                        (paragraphRaw.description || paragraphRaw.text || JSON.stringify(paragraphRaw)) : 
                        paragraphRaw;
                    }
                  }
                  
                  return paragraph.replace(/\r?\n/g, "<br/>");
                })()
              }}
            />
          </div>
        </section>
      )}      {/* City Services Section (H2 + paragraph) sourced from CMS */}
      {city && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {(() => {
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
                
                // Fix: Ensure we're not passing objects directly to JSX
                const headingRaw =
                  nested?.servicesHeading ||
                  (cmsContent as any)?.sections?.cityPages?.[key]?.servicesHeading ||
                  (cmsContent as any)?.servicesHeading;
                
                // Ensure heading is a string, not an object
                const heading = typeof headingRaw === 'object' ? headingRaw?.heading || `Expert Exhibition Stand Builders in ${city}, ${country}` : headingRaw || `Expert Exhibition Stand Builders in ${city}, ${country}`;
                return heading;
              })()}
            </h2>
            <div
              className="prose max-w-none leading-relaxed text-gray-900"
              dangerouslySetInnerHTML={{
                __html: (() => {
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
                  
                  // Fix: Ensure we're not passing objects directly to JSX
                  const paragraphRaw =
                    nested?.servicesParagraph ||
                    (cmsContent as any)?.sections?.cityPages?.[key]
                      ?.servicesParagraph ||
                    (cmsContent as any)?.servicesParagraph;
                  
                  // Ensure paragraph is a string, not an object
                  const paragraph = typeof paragraphRaw === 'object' ? paragraphRaw?.description || 
                    `<p>${city}, ${country} provides access to top-tier exhibition stand builders who specialize in creating impactful displays for trade shows and exhibitions. Our local experts combine creativity with technical excellence to deliver solutions that exceed expectations.</p>
                     <p>Whether you need a modular booth, custom island display, or specialty activation, ${city}'s exhibition stand builders offer comprehensive services from concept to installation, ensuring your brand stands out in competitive environments.</p>` 
                    : paragraphRaw || 
                    `<p>${city}, ${country} provides access to top-tier exhibition stand builders who specialize in creating impactful displays for trade shows and exhibitions. Our local experts combine creativity with technical excellence to deliver solutions that exceed expectations.</p>
                     <p>Whether you need a modular booth, custom island display, or specialty activation, ${city}'s exhibition stand builders offer comprehensive services from concept to installation, ensuring your brand stands out in competitive environments.</p>`;
                  return paragraph.replace(/\r?\n/g, "<br/>");
                })()
              }}
            />
          </div>
        </section>
      )}
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
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
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
                
                // Fix: Ensure we're not passing objects directly to JSX
                const headingRaw =
                  (block as any)?.finalCtaHeading ||
                  `Ready to Find Your Perfect Builder in ${city || country}?`;
                
                // Ensure values are strings, not objects
                const heading = typeof headingRaw === 'object' ? headingRaw?.heading || headingRaw : headingRaw;
                return heading;
              })()}
            </h2>
            <p className="text-xl text-slate-300 mb-8">
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
                
                // Fix: Ensure we're not passing objects directly to JSX
                const paragraphRaw =
                  (block as any)?.finalCtaParagraph ||
                  "Get competitive quotes from verified local builders. Compare proposals and choose the best fit for your exhibition needs.";
                
                // Ensure values are strings, not objects
                const paragraph = typeof paragraphRaw === 'object' ? paragraphRaw?.description || paragraphRaw : paragraphRaw;
                return paragraph;
              })()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="text-lg px-8 py-4 text-black">
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
                  
                  // Fix: Ensure we're not passing objects directly to JSX
                  const buttonTextRaw =
                    (block as any)?.finalCtaButtonText || "Start Getting Quotes";
                  
                  // Ensure values are strings, not objects
                  const buttonText = typeof buttonTextRaw === 'object' ? buttonTextRaw?.text || buttonTextRaw : buttonTextRaw;
                  return buttonText;
                })()}
              </Button>
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
      {/* Cities section was moved to top */}
    </>
  );
};

export default CountryCityPage;