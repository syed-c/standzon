'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';
import { BuilderCard } from '@/components/BuilderCard';
import {
  MapPin, Building, Users, Star, ArrowRight,
  TrendingUp, Award, CheckCircle, Zap, Globe,
  Calendar, DollarSign, Clock, Shield
} from 'lucide-react';
import { unifiedPlatformAPI } from '@/lib/data/unifiedPlatformData';
import { forcePlatformInitialization } from '@/lib/utils/platformInitializer';

const CountryGallery = dynamic(() => import('@/components/CountryGallery'), { ssr: false });

/**
 * Props: flexible and permissive so this component can be used server-side or client-side.
 */
export interface EnhancedLocationPageProps {
  locationType?: 'country' | 'city' | string;
  locationName?: string;
  countryName?: string;
  country?: string;
  city?: string;
  initialBuilders?: any[];
  builders?: any[];
  exhibitions?: any[];
  venues?: any[];
  pageContent?: any;
  isEditable?: boolean;
  onContentUpdate?: (payload: any) => void;
  searchTerm?: string;
  onSearchTermChange?: (v: string) => void;
  suppressPostBuildersContent?: boolean;
  locationStats?: {
    totalBuilders?: number;
    averageRating?: number;
    completedProjects?: number;
    averagePrice?: number;
  };
  upcomingEvents?: Array<{ name: string; date: string; venue?: string }>;
  serverCmsContent?: any;
}

const DEFAULT_POLL_INTERVAL = 120_000; // 2 minutes

const slugify = (s?: string) =>
  (s || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// Unified HTML sanitizer that works on both server and client
function sanitizeHtml(html?: string): string {
  // Handle null, undefined, or non-string values
  if (!html || typeof html !== 'string') return '';
  
  try {
    // Convert line breaks to <br/> tags
    let result = html.replace(/\r?\n/g, '<br/>');
    
    // Simple regex-based sanitizer for consistent server/client behavior
    // Remove script tags and their content
    result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Remove on* event attributes
    result = result.replace(/\s(on\w+)=["'][^"']*["']/gi, '');
    
    // Remove javascript: links
    result = result.replace(/href=["']javascript:[^"']*["']/gi, 'href="#"');
    
    // Whitelist allowed tags and clean attributes
    const allowedTags = ['h2', 'h3', 'h4', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'a'];
    
    // Process opening tags
    result = result.replace(/<([a-zA-Z]+)([^>]*)>/g, (match, tag, attrs) => {
      const lowerTag = tag.toLowerCase();
      if (!allowedTags.includes(lowerTag)) {
        return '';
      }
      
      // For <a> tags, only allow href and add security attributes
      if (lowerTag === 'a') {
        const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
        if (hrefMatch && hrefMatch[1] && !hrefMatch[1].toLowerCase().startsWith('javascript:')) {
          return `<a href="${hrefMatch[1]}" rel="noopener noreferrer" target="_blank">`;
        }
        return '<a>';
      }
      
      // For other tags, remove all attributes
      return `<${lowerTag}>`;
    });
    
    // Process closing tags
    result = result.replace(/<\/([a-zA-Z]+)>/g, (match, tag) => {
      const lowerTag = tag.toLowerCase();
      if (!allowedTags.includes(lowerTag)) {
        return '';
      }
      return `</${lowerTag}>`;
    });
    
    return result;
  } catch (error) {
    // In case of any error, return the original HTML or empty string
    console.warn('HTML sanitization failed:', error);
    return '';
  }
}

export default function EnhancedLocationPage(props: EnhancedLocationPageProps) {
  // --- derive canonical location names ---
  const {
    locationType,
    locationName,
    countryName,
    country,
    city,
    initialBuilders = [],
    builders = [],
    exhibitions = [],
    venues = [],
    pageContent,
    isEditable = false,
    onSearchTermChange,
    searchTerm,
    suppressPostBuildersContent = false,
    locationStats,
    upcomingEvents = [],
    serverCmsContent
  } = props;

  const isCity = locationType === 'city' || Boolean(city);
  const finalLocationName = locationName || city || country || 'Unknown Location';
  const finalCountryName = countryName || (isCity && country) || country || undefined;
  const displayLocation = isCity && finalCountryName ? `${finalLocationName}, ${finalCountryName}` : finalLocationName;
  const countrySlug = useMemo(() => slugify(finalCountryName || finalLocationName), [finalCountryName, finalLocationName]);

  // --- builders state (start from initialBuilders -> fallback to builders prop -> live fetch) ---
  const initial = Array.isArray(initialBuilders) && initialBuilders.length > 0 ? initialBuilders :
    Array.isArray(builders) && builders.length > 0 ? builders : [];

  const [filteredBuilders, setFilteredBuilders] = useState<any[]>(initial);
  const [isLoadingBuilders, setIsLoadingBuilders] = useState<boolean>(false);
  const [isLoadingCms, setIsLoadingCms] = useState<boolean>(false);
  const [cmsData, setCmsData] = useState<any>(serverCmsContent || null);
  const [sortBy, setSortBy] = useState<'rating' | 'projects' | 'price'>('rating');

  // keep a ref to avoid re-creating load functions in intervals
  const mountedRef = useRef(true);
  // Ref to track if initial prop has changed to prevent infinite loops
  const initialRef = useRef(initial);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Helper: dedupe & sort builders
  const normalizeBuilders = (list: any[], sortKey: typeof sortBy) => {
    const map = new Map<string, any>();
    const normalizeName = (n?: string) =>
      (n || '').toLowerCase().replace(/[,./|!@#$%^&*()_+\-]+/g, ' ').replace(/\b(ltd|limited|llc|inc|gmbh|co|company|srl|ag|se)\b/g, '').replace(/\s+/g, ' ').trim();

    list.forEach(b => {
      const name = normalizeName(b.companyName || b.name || '');
      const cityKey = (b.headquarters?.city || '').toLowerCase().trim();
      const countryKey = (b.headquarters?.country || '').toLowerCase().trim();
      const key = isCity ? `${name}|${cityKey}|${countryKey}` : `${name}|${countryKey}`;
      if (!map.has(key)) map.set(key, b);
      else {
        const existing = map.get(key);
        // simple prefer verified/higher rating logic
        const score = (x: any) => (x.verified ? 1000 : 0) + (x.reviewCount || 0) + ((x.rating || 4.5) * 10);
        if (score(b) > score(existing)) map.set(key, b);
      }
    });

    const arr = Array.from(map.values());
    switch (sortKey) {
      case 'rating':
        arr.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'projects':
        arr.sort((a, b) => (b.projectsCompleted || 0) - (a.projectsCompleted || 0));
        break;
      case 'price':
        arr.sort((a, b) => (a.priceRange?.basicStand?.min || 0) - (b.priceRange?.basicStand?.min || 0));
        break;
    }
    return arr;
  };

  // ✅ PRODUCTION FIX: Force initialization on component mount
  useEffect(() => {
    console.log('🔄 EnhancedLocationPage mounted, checking unified platform initialization...');
    
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

  // Main effect for loading builders
  useEffect(() => {
    let intervalId: number | undefined;
    let cancelled = false;

    // Check if initial prop has changed
    const hasInitialChanged = initialRef.current !== initial;
    if (hasInitialChanged) {
      initialRef.current = initial;
    }

    const load = async () => {
      if (!mountedRef.current || cancelled) return;
      // if we already have initial builders passed from server, keep them
      if (initial && initial.length > 0) {
        console.log('🔍 DEBUG: EnhancedLocationPage - Using initial builders, count:', initial.length);
        setFilteredBuilders(prev => {
          // only update if different
          if (prev.length === initial.length && prev[0] === initial[0]) return prev;
          return normalizeBuilders(initial, sortBy);
        });
        return;
      }

      console.log('🔍 DEBUG: EnhancedLocationPage - Loading builders for displayLocation:', displayLocation);
      setIsLoadingBuilders(true);
      try {
        console.log('🔄 Loading builders for location:', displayLocation);
        
        // sync attempt
        const sync = typeof unifiedPlatformAPI?.getBuilders === 'function'
          ? unifiedPlatformAPI.getBuilders(displayLocation)
          : [];
        console.log('📊 Sync getBuilders returned:', sync.length, 'builders');
        
        if (Array.isArray(sync) && sync.length > 0) {
          console.log('✅ Using sync builders data');
          if (!cancelled) setFilteredBuilders(normalizeBuilders(sync, sortBy));
        } else {
          console.log('🔄 Trying async version of getBuilders to ensure proper initialization');
          // Check if unified platform is initialized
          const isInitialized = unifiedPlatformAPI.isInitialized();
          console.log(`📊 Unified platform initialized: ${isInitialized}`);
          
          // async attempt
          const asyncResult = typeof unifiedPlatformAPI?.getBuildersAsync === 'function'
            ? await unifiedPlatformAPI.getBuildersAsync(displayLocation)
            : [];
          console.log('📊 Async getBuilders returned:', asyncResult.length, 'builders');
          
          if (!cancelled && Array.isArray(asyncResult) && asyncResult.length > 0) {
            console.log('✅ Using async builders data');
            setFilteredBuilders(normalizeBuilders(asyncResult, sortBy));
          } else {
            console.log('⚠️ Both sync and async unified platform returned no builders');
            
            // ✅ PRODUCTION FIX: Fallback to direct Supabase fetch when unified platform returns no data
            console.log('🔄 Attempting direct Supabase fetch as fallback...');
            try {
              const { getAllBuilders } = await import('@/lib/supabase/builders');
              const supabaseBuilders = await getAllBuilders();
              console.log(`📊 Direct Supabase fetch returned ${supabaseBuilders.length} builders`);
              
              if (supabaseBuilders.length > 0) {
                // Filter by location if provided
                let filteredBuilders = supabaseBuilders;
                if (displayLocation) {
                  const normalizedLocation = displayLocation.toLowerCase().replace(/-/g, " ").trim();
                  const locationVariations = [normalizedLocation];
                  
                  if (normalizedLocation.includes("united arab emirates")) {
                    locationVariations.push("uae");
                  } else if (normalizedLocation === "uae") {
                    locationVariations.push("united arab emirates");
                  }
                  
                  console.log('🔍 DEBUG: Filtering builders for location variations:', locationVariations);
                  
                  filteredBuilders = supabaseBuilders.filter((builder: any) => {
                    // Check headquarters country
                    const headquartersCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
                    const countryMatch = locationVariations.some(variation => 
                      headquartersCountry.includes(variation)
                    );
                    
                    // Check headquarters city
                    const headquartersCity = (builder.headquarters_city || builder.city || '').toLowerCase().trim();
                    const cityMatch = headquartersCity.includes(normalizedLocation);
                    
                    // Check service locations
                    const serviceLocations = builder.service_locations || builder.serviceLocations || [];
                    const serviceLocationMatch = serviceLocations.some((loc: any) => {
                      const serviceCountry = (loc.country || '').toLowerCase().trim();
                      const serviceCity = (loc.city || '').toLowerCase().trim();
                      return locationVariations.some(variation => 
                        serviceCountry.includes(variation)
                      ) || serviceCity.includes(normalizedLocation);
                    });
                    
                    const match = countryMatch || cityMatch || serviceLocationMatch;
                    
                    // Log first few builders for debugging
                    if (supabaseBuilders.indexOf(builder) < 3) {
                      console.log('🔍 DEBUG: Builder filtering for', builder.company_name || builder.name, {
                        headquartersCountry,
                        headquartersCity,
                        countryMatch,
                        cityMatch,
                        serviceLocationMatch,
                        finalMatch: match
                      });
                    }
                    
                    return match;
                  });
                  console.log(`📍 Filtered to ${filteredBuilders.length} builders for location: ${displayLocation}`);
                }
                
                if (!cancelled && filteredBuilders.length > 0) {
                  console.log('✅ Using fallback Supabase builders data');
                  // Transform to match ExhibitionBuilder interface like in unifiedPlatformData
                  const transformedBuilders = filteredBuilders.map((builder: any) => ({
                    // Basic fields
                    id: builder.id || '',
                    companyName: builder.company_name || builder.name || 'Unknown Builder',
                    slug: builder.slug || builder.id || '',
                    logo: builder.logo || '/images/builders/default-logo.png',
                    establishedYear: builder.established_year || new Date().getFullYear(),
                    
                    // Headquarters
                    headquarters: {
                      city: builder.headquarters_city || builder.city || 'Unknown',
                      country: builder.headquarters_country || builder.country || 'Unknown',
                      countryCode: builder.headquarters_country_code || builder.country_code || 'XX',
                      address: builder.headquarters_address || builder.address || '',
                      latitude: builder.headquarters_latitude || builder.latitude || 0,
                      longitude: builder.headquarters_longitude || builder.longitude || 0,
                      isHeadquarters: true
                    },
                    
                    // Service locations
                    serviceLocations: builder.service_locations || [
                      {
                        city: builder.headquarters_city || builder.city || 'Unknown',
                        country: builder.headquarters_country || builder.country || 'Unknown',
                        countryCode: builder.headquarters_country_code || builder.country_code || 'XX',
                        address: builder.headquarters_address || builder.address || '',
                        latitude: builder.headquarters_latitude || builder.latitude || 0,
                        longitude: builder.headquarters_longitude || builder.longitude || 0,
                        isHeadquarters: false
                      }
                    ],
                    
                    // Contact info
                    contactInfo: {
                      primaryEmail: builder.primary_email || builder.email || '',
                      phone: builder.phone || '',
                      website: builder.website || '',
                      contactPerson: builder.contact_person || builder.contact_name || '',
                      position: builder.position || ''
                    },
                    
                    // Services and specializations (empty arrays as defaults)
                    services: builder.services || [],
                    specializations: builder.specializations || [],
                    certifications: builder.certifications || [],
                    awards: builder.awards || [],
                    portfolio: builder.portfolio || [],
                    
                    // Stats
                    teamSize: builder.team_size || 0,
                    projectsCompleted: builder.projects_completed || builder.completed_projects || 0,
                    rating: builder.rating || 0,
                    reviewCount: builder.review_count || 0,
                    
                    // Response info
                    responseTime: builder.response_time || '24 hours',
                    languages: builder.languages || ['English'],
                    
                    // Status flags
                    verified: builder.verified || false,
                    premiumMember: builder.premium_member || builder.premiumMember || false,
                    
                    // Additional fields
                    tradeshowExperience: builder.tradeshow_experience || [],
                    priceRange: builder.price_range || { min: 0, max: 0, currency: 'USD' },
                    companyDescription: builder.description || builder.company_description || '',
                    whyChooseUs: builder.why_choose_us || [],
                    clientTestimonials: builder.client_testimonials || [],
                    socialMedia: builder.social_media || {},
                    businessLicense: builder.business_license || '',
                    insurance: builder.insurance || {},
                    sustainability: builder.sustainability || {},
                    keyStrengths: builder.key_strengths || [],
                    recentProjects: builder.recent_projects || [],
                    
                    // Claim system
                    claimed: builder.claimed || false,
                    claimStatus: builder.claim_status || "unclaimed",
                    planType: builder.plan_type || "free",
                    gmbImported: builder.gmb_imported || builder.gmbImported || false,
                    importedFromGMB: builder.imported_from_gmb || false,
                    source: builder.source || '',
                    importedAt: builder.imported_at || '',
                    lastUpdated: builder.last_updated || builder.updated_at || new Date().toISOString(),
                    
                    // Lead routing
                    status: builder.status || "active",
                    plan: builder.plan || "free",
                    contactEmail: builder.contact_email || builder.primary_email || builder.email || ''
                  }));
                  
                  if (!cancelled) setFilteredBuilders(normalizeBuilders(transformedBuilders, sortBy));
                } else {
                  console.log('⚠️ Fallback also returned no builders for location:', displayLocation);
                }
              } else {
                console.log('⚠️ Supabase fetch returned no builders at all');
              }
            } catch (fallbackError) {
              console.error('❌ Error in Supabase fallback fetch:', fallbackError);
            }
          }
        }
      } catch (err) {
        // swallow - we log to console for developer
        // eslint-disable-next-line no-console
        console.error('Error loading builders', err);
      } finally {
        if (!cancelled) setIsLoadingBuilders(false);
      }
    };

    load();

    // If we don't have initial builders, poll for updates
    if (!initial || initial.length === 0) {
      intervalId = window.setInterval(() => {
        if (!cancelled) load();
      }, DEFAULT_POLL_INTERVAL);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
    // intentionally exclude normalizeBuilders from deps; rely on displayLocation & sortBy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayLocation, sortBy]); // Removed initial from dependencies to prevent infinite loop

  // Update filteredBuilders when initial prop actually changes
  useEffect(() => {
    const hasInitialChanged = initialRef.current !== initial;
    if (hasInitialChanged && initial && initial.length > 0) {
      initialRef.current = initial;
      setFilteredBuilders(normalizeBuilders(initial, sortBy));
    }
  }, [initial, sortBy]);

  // When sort changes, re-normalize current builders
  useEffect(() => {
    setFilteredBuilders(prev => {
      const normalized = normalizeBuilders(prev, sortBy);
      // Only update if the normalized array is actually different
      if (JSON.stringify(prev) !== JSON.stringify(normalized)) {
        return normalized;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // --- Load CMS data (use serverCmsContent if provided; else fetch once per countrySlug) ---
  useEffect(() => {
    let cancelled = false;
    if (serverCmsContent) {
      console.log('🔍 DEBUG: Using serverCmsContent');
      console.log('🔍 DEBUG: serverCmsContent keys:', serverCmsContent ? Object.keys(serverCmsContent) : 'null');
      setCmsData(serverCmsContent);
      setIsLoadingCms(false);
      return;
    }

    console.log('🔍 DEBUG: Fetching CMS data from API');
    const fetchCms = async () => {
      if (!countrySlug) return;
      setIsLoadingCms(true);
      try {
        const url = `/api/admin/pages-editor?action=get-content&path=/exhibition-stands/${encodeURIComponent(countrySlug)}`;
        console.log('🔍 DEBUG: Fetching CMS from URL:', url);
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        console.log('🔍 DEBUG: CMS fetch response:', data);
        if (!cancelled && data?.success && data?.data) {
          console.log('🔍 DEBUG: Setting CMS data from API');
          setCmsData(data.data);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('CMS fetch failed', err);
      } finally {
        if (!cancelled) setIsLoadingCms(false);
      }
    };

    fetchCms();
    return () => { cancelled = true; };
  }, [countrySlug, serverCmsContent]);

  // --- computed/stats ---
  const stats = useMemo(() => {
    const total = filteredBuilders.length || (locationStats?.totalBuilders ?? 0);
    const avgRating = locationStats?.averageRating ?? (filteredBuilders.length > 0
      ? Math.round((filteredBuilders.reduce((s, b) => s + (b.rating || 4.5), 0) / filteredBuilders.length) * 10) / 10
      : 4.8);
    const completed = locationStats?.completedProjects ?? filteredBuilders.reduce((s, b) => s + (b.projectsCompleted || 0), 0);
    const price = locationStats?.averagePrice ?? 450;
    return { totalBuilders: total, averageRating: avgRating, completedProjects: completed, averagePrice: price };
  }, [filteredBuilders.length, locationStats]); // Use filteredBuilders.length instead of filteredBuilders array

  // --- helpers to resolve CMS block for page (country or city) ---
  const resolvedCmsBlock = useMemo(() => {
    if (!cmsData) return null;
    if (isCity) {
      const citySlug = slugify(finalLocationName);
      const key = `${countrySlug}-${citySlug}`;
      
      // NEW: Handle the specific nested structure for city pages
      // content.sections.cityPages[country-city].countryPages.city
      if (cmsData?.sections?.cityPages?.[key]?.countryPages?.[citySlug]) {
        console.log('✅ Found specific nested structure content:', key, citySlug);
        return cmsData.sections.cityPages[key].countryPages[citySlug];
      }
      
      // NEW: Also check for variations in the nested structure
      const citySlugClean = citySlug.replace(/[^a-z0-9-]/g, "");
      if (cmsData?.sections?.cityPages?.[key]?.countryPages?.[citySlugClean]) {
        console.log('✅ Found specific nested structure content with clean slug:', key, citySlugClean);
        return cmsData.sections.cityPages[key].countryPages[citySlugClean];
      }
      
      // Try multiple paths to find the city content
      let cityContent = cmsData?.sections?.cityPages?.[key] || cmsData;
      
      // If we have a direct match, use it
      if (cmsData?.sections?.cityPages?.[key]) {
        console.log('✅ Found direct city content match for key:', key);
        return cityContent;
      }
      
      // Otherwise, try to find content in nested structures
      if (cmsData?.sections?.cityPages) {
        // Look for any city content that might match our location
        const cityPages = cmsData.sections.cityPages;
        for (const pageKey of Object.keys(cityPages)) {
          if (pageKey.includes(countrySlug) && pageKey.includes(citySlug)) {
            console.log('✅ Found city content by pattern matching:', pageKey);
            // NEW: Check if this page has nested countryPages structure
            const nestedCountryPages = cityPages[pageKey]?.countryPages;
            if (nestedCountryPages && nestedCountryPages[citySlug]) {
              console.log('✅ Found nested countryPages content in pattern match:', pageKey, citySlug);
              return nestedCountryPages[citySlug];
            }
            return cityPages[pageKey];
          }
        }
      }
      
      // Try another approach - look for nested countryPages within cityPages
      if (cmsData?.sections?.cityPages) {
        const cityPages = cmsData.sections.cityPages;
        for (const pageKey of Object.keys(cityPages)) {
          // Check if this city page has nested countryPages with our city
          if (cityPages[pageKey]?.countryPages?.[citySlug]) {
            console.log('✅ Found nested countryPages content:', pageKey, citySlug);
            return cityPages[pageKey].countryPages[citySlug];
          }
          
          // Check for deeper nesting: cityPages -> cityPages -> countryPages
          if (cityPages[pageKey]?.cityPages?.[key]?.countryPages?.[citySlug]) {
            console.log('✅ Found deeply nested content:', pageKey, key, citySlug);
            return cityPages[pageKey].cityPages[key].countryPages[citySlug];
          }
        }
      }
      
      // Debug: Check if we can find hero description in the nested structure
      console.log('🔍 DEBUG: Looking for hero description in nested structure');
      if (cmsData?.sections?.cityPages) {
        const cityPageKeys = Object.keys(cmsData.sections.cityPages);
        console.log('🔍 DEBUG: City page keys:', cityPageKeys);
        for (const pageKey of cityPageKeys) {
          const countryPages = cmsData.sections.cityPages[pageKey]?.countryPages;
          if (countryPages) {
            const countryPageKeys = Object.keys(countryPages);
            console.log('🔍 DEBUG: Country page keys:', countryPageKeys);
            for (const countryKey of countryPageKeys) {
              const countryPage = countryPages[countryKey];
              if (countryPage && countryPage.heroDescription) {
                console.log('✅ DEBUG: Found hero description in nested structure');
                // Return the country page content which contains the hero description
                return countryPage;
              }
            }
          }
        }
      }
      
      console.log('ℹ️ Returning default city content');
      return cityContent;
    }
    return cmsData?.sections?.countryPages?.[countrySlug] || cmsData;
  }, [cmsData, isCity, countrySlug, finalLocationName]);
  // --- render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/*
        DEBUG: Log the pageContent prop
        {console.log("🔍 DEBUG: EnhancedLocationPage pageContent prop:", JSON.stringify(pageContent, null, 2))}
      */}
      
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pt-24 pb-20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10" />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
                <MapPin className="w-5 h-5 mr-2 inline-block align-middle" />
                <span className="align-middle">{displayLocation}</span>
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Exhibition Stand Builders</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                in {displayLocation}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              {(() => {
                // Debug log to see what resolvedCmsBlock contains
                console.log('🔍 DEBUG: resolvedCmsBlock keys:', resolvedCmsBlock ? Object.keys(resolvedCmsBlock) : 'null');
                console.log('🔍 DEBUG: resolvedCmsBlock.heroDescription:', resolvedCmsBlock?.heroDescription);
                
                // First try to get hero description from CMS - prioritize heroDescription field over hero.description
                let heroContent = resolvedCmsBlock?.heroDescription || 
                                 resolvedCmsBlock?.hero?.description || 
                                 resolvedCmsBlock?.hero;
                
                // If we still don't have content, try other common fields
                if (!heroContent && resolvedCmsBlock) {
                  heroContent = resolvedCmsBlock.description || 
                               resolvedCmsBlock.content?.introduction || 
                               resolvedCmsBlock.heroContent ||
                               resolvedCmsBlock.content?.hero?.description ||
                               pageContent?.hero?.description ||
                               pageContent?.content?.introduction;
                }
                
                // Handle nested structure for hero description
                // content.countryPages.city.heroDescription
                if (!heroContent && resolvedCmsBlock?.countryPages) {
                  console.log('🔍 DEBUG: Checking countryPages for heroDescription');
                  console.log('🔍 DEBUG: countryPages keys:', Object.keys(resolvedCmsBlock.countryPages));
                  // Try to find hero description in nested country pages
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    console.log('🔍 DEBUG: Checking countryPage key:', key);
                    const countryPage = resolvedCmsBlock.countryPages[key];
                    console.log('🔍 DEBUG: countryPage keys:', countryPage ? Object.keys(countryPage) : 'null');
                    console.log('🔍 DEBUG: countryPage.heroDescription:', countryPage?.heroDescription);
                    if (countryPage && countryPage.heroDescription) {
                      heroContent = countryPage.heroDescription;
                      console.log('✅ DEBUG: Found heroDescription in countryPages');
                      break;
                    }
                  }
                }
                
                // Handle the specific nested structure for hero description
                // Check if we have serverCmsContent with the nested structure
                if (!heroContent && cmsData?.sections?.cityPages) {
                  const cityPageKeys = Object.keys(cmsData.sections.cityPages);
                  for (const pageKey of cityPageKeys) {
                    const countryPages = cmsData.sections.cityPages[pageKey]?.countryPages;
                    if (countryPages) {
                      const countryPageKeys = Object.keys(countryPages);
                      for (const countryKey of countryPageKeys) {
                        const countryPage = countryPages[countryKey];
                        if (countryPage && countryPage.heroDescription) {
                          heroContent = countryPage.heroDescription;
                          console.log('✅ DEBUG: Found heroDescription in deeply nested structure');
                          break;
                        }
                      }
                      if (heroContent) break;
                    }
                  }
                }
                
                // Handle case where content might be in nested structure
                if (!heroContent && resolvedCmsBlock?.countryPages) {
                  // Try to find hero content in nested country pages
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    const countryPage = resolvedCmsBlock.countryPages[key];
                    if (countryPage) {
                      heroContent = countryPage.heroDescription || 
                                   countryPage.hero || 
                                   countryPage.description || 
                                   countryPage.content?.introduction;
                      if (heroContent) break;
                    }
                  }
                }
                
                // Handle even deeper nested structure
                if (!heroContent && resolvedCmsBlock?.countryPages) {
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                    if (nestedCountryPages) {
                      const nestedKeys = Object.keys(nestedCountryPages);
                      for (const nestedKey of nestedKeys) {
                        const nestedPage = nestedCountryPages[nestedKey];
                        if (nestedPage) {
                          heroContent = nestedPage.heroDescription || 
                                       nestedPage.hero || 
                                       nestedPage.description || 
                                       nestedPage.content?.introduction;
                          if (heroContent) break;
                        }
                      }
                      if (heroContent) break;
                    }
                  }
                }
                
                // Handle the specific structure we saw in the logs:
                // sections.cityPages[country-city].cityPages[country-city].countryPages.city
                if (!heroContent && resolvedCmsBlock?.cityPages) {
                  const cityPageKeys = Object.keys(resolvedCmsBlock.cityPages);
                  for (const key of cityPageKeys) {
                    const nestedCityPages = resolvedCmsBlock.cityPages[key]?.countryPages;
                    if (nestedCityPages) {
                      const nestedKeys = Object.keys(nestedCityPages);
                      for (const nestedKey of nestedKeys) {
                        const nestedPage = nestedCityPages[nestedKey];
                        if (nestedPage) {
                          heroContent = nestedPage.heroDescription || 
                                       nestedPage.hero || 
                                       nestedPage.description || 
                                       nestedPage.content?.introduction;
                          if (heroContent) break;
                        }
                      }
                      if (heroContent) break;
                    }
                  }
                }
                
                // Handle even more specific nested structure for hero description
                // content.sections.cityPages[country-city].countryPages.city.heroDescription
                if (!heroContent && cmsData?.sections?.cityPages) {
                  const cityPageKeys = Object.keys(cmsData.sections.cityPages);
                  for (const key of cityPageKeys) {
                    const countryPages = cmsData.sections.cityPages[key]?.countryPages;
                    if (countryPages) {
                      const countryPageKeys = Object.keys(countryPages);
                      for (const countryKey of countryPageKeys) {
                        const countryPage = countryPages[countryKey];
                        if (countryPage && countryPage.heroDescription) {
                          heroContent = countryPage.heroDescription;
                          console.log('✅ DEBUG: Found heroDescription in deeply nested structure');
                          break;
                        }
                      }
                      if (heroContent) break;
                    }
                  }
                }
                
                // NEW: Handle the specific structure we identified in the test script
                // sections.cityPages["united-arab-emirates-dubai"].countryPages.dubai.heroDescription
                if (!heroContent && cmsData?.sections?.cityPages) {
                  const cityPageKeys = Object.keys(cmsData.sections.cityPages);
                  console.log('🔍 DEBUG: Looking for heroDescription in cityPages structure');
                  console.log('🔍 DEBUG: cityPageKeys:', cityPageKeys);
                  
                  for (const pageKey of cityPageKeys) {
                    console.log('🔍 DEBUG: Checking pageKey:', pageKey);
                    const countryPages = cmsData.sections.cityPages[pageKey]?.countryPages;
                    if (countryPages) {
                      console.log('🔍 DEBUG: Found countryPages in:', pageKey);
                      const countryPageKeys = Object.keys(countryPages);
                      console.log('🔍 DEBUG: countryPageKeys:', countryPageKeys);
                      
                      for (const countryKey of countryPageKeys) {
                        console.log('🔍 DEBUG: Checking countryKey:', countryKey);
                        const countryPage = countryPages[countryKey];
                        if (countryPage && countryPage.heroDescription) {
                          heroContent = countryPage.heroDescription;
                          console.log('✅ DEBUG: Found heroDescription in specific structure:', pageKey, countryKey);
                          break;
                        }
                      }
                      if (heroContent) break;
                    }
                  }
                }
                
                // Handle object content properly
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
                
                heroContent = extractText(heroContent);
                
                // Return the content or fallback
                return heroContent || `Find trusted exhibition stand builders in ${displayLocation}.`;
              })()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 text-white">
              <PublicQuoteRequest
                location={displayLocation}
                buttonText={
                  (() => {
                    const content = `Get Quotes from ${displayLocation} Builders`;
                    // This is always a string, so no need to check for object
                    return content;
                  })()
                }
                className="text-lg px-8 py-4"
              />
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/20 hover:text-gray-900 backdrop-blur-sm text-lg px-8 py-4 shadow-lg"
                onClick={() => document.getElementById('builders-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Local Builders
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2"><Building className="w-6 h-6 text-blue-400" /></div>
                <div className="text-xl font-bold">{stats.totalBuilders}+</div>
                <div className="text-slate-300 text-xs">Verified Builders</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2"><Star className="w-6 h-6 text-yellow-400" /></div>
                <div className="text-xl font-bold">{stats.averageRating}</div>
                <div className="text-slate-300 text-xs">Average Rating</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2"><Award className="w-6 h-6 text-green-400" /></div>
                <div className="text-xl font-bold">{stats.completedProjects.toLocaleString()}</div>
                <div className="text-slate-300 text-xs">Projects Completed</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center mb-2"><DollarSign className="w-6 h-6 text-purple-400" /></div>
                <div className="text-xl font-bold">${stats.averagePrice}</div>
                <div className="text-slate-300 text-xs">Avg. Price/sqm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE LOCAL */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {(() => {
                  let content = resolvedCmsBlock?.whyChooseHeading;
                  
                  // Handle nested structure for whyChooseHeading
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      if (resolvedCmsBlock.countryPages[key]?.whyChooseHeading) {
                        content = resolvedCmsBlock.countryPages[key].whyChooseHeading;
                        break;
                      }
                    }
                  }
                  
                  // Handle deeper nested structure
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                      if (nestedCountryPages) {
                        const nestedKeys = Object.keys(nestedCountryPages);
                        for (const nestedKey of nestedKeys) {
                          if (nestedCountryPages[nestedKey]?.whyChooseHeading) {
                            content = nestedCountryPages[nestedKey].whyChooseHeading;
                            break;
                          }
                        }
                        if (content) break;
                      }
                    }
                  }
                  
                  if (typeof content === 'object' && content !== null) {
                    return content.heading || content.title || JSON.stringify(content);
                  }
                  return content || `Why Choose Local Builders in ${displayLocation}?`;
                })()}
              </h2>              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {(() => {
                  let content = resolvedCmsBlock?.whyChooseParagraph;
                  
                  // Handle nested structure for whyChooseParagraph
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      if (resolvedCmsBlock.countryPages[key]?.whyChooseParagraph) {
                        content = resolvedCmsBlock.countryPages[key].whyChooseParagraph;
                        break;
                      }
                    }
                  }
                  
                  // Handle deeper nested structure
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                      if (nestedCountryPages) {
                        const nestedKeys = Object.keys(nestedCountryPages);
                        for (const nestedKey of nestedKeys) {
                          if (nestedCountryPages[nestedKey]?.whyChooseParagraph) {
                            content = nestedCountryPages[nestedKey].whyChooseParagraph;
                            break;
                          }
                        }
                        if (content) break;
                      }
                    }
                  }
                  
                  if (typeof content === 'object' && content !== null) {
                    return content.description || content.text || JSON.stringify(content);
                  }
                  return content || `Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`;
                })()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {(() => {
                let infoCards = resolvedCmsBlock?.infoCards;
                
                // Handle nested structure for infoCards
                if (!infoCards && resolvedCmsBlock?.countryPages) {
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    if (resolvedCmsBlock.countryPages[key]?.infoCards) {
                      infoCards = resolvedCmsBlock.countryPages[key].infoCards;
                      break;
                    }
                  }
                }
                
                // Handle deeper nested structure
                if (!infoCards && resolvedCmsBlock?.countryPages) {
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                    if (nestedCountryPages) {
                      const nestedKeys = Object.keys(nestedCountryPages);
                      for (const nestedKey of nestedKeys) {
                        if (nestedCountryPages[nestedKey]?.infoCards) {
                          infoCards = nestedCountryPages[nestedKey].infoCards;
                          break;
                        }
                      }
                      if (infoCards) break;
                    }
                  }
                }
                
                let cards = [
                  {
                    title: 'Local Market Knowledge',
                    text: `Understand local regulations, venue requirements and cultural preferences specific to ${displayLocation}.`
                  },
                  {
                    title: 'Faster Project Delivery',
                    text: 'Reduced logistics time and faster response for urgent modifications.'
                  },
                  {
                    title: 'Cost-Effective Solutions',
                    text: 'Lower transport costs and local supplier networks.'
                  }
                ];
                
                // Handle case where infoCards is an object instead of array
                if (Array.isArray(infoCards)) {
                  cards = infoCards.map(card => {
                    if (typeof card === 'object' && card !== null) {
                      return {
                        title: typeof card.title === 'object' ? 
                          (card.title.heading || card.title.title || JSON.stringify(card.title)) : 
                          card.title,
                        text: typeof card.text === 'object' ? 
                          (card.text.description || card.text.text || JSON.stringify(card.text)) : 
                          card.text
                      };
                    }
                    return card;
                  });
                }
                
                return cards;
              })().map((card: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${idx === 0 ? 'bg-blue-100' : idx === 1 ? 'bg-green-100' : 'bg-purple-100'}`}>
                    {idx === 0 ? <MapPin className="w-6 h-6 text-blue-600" /> : idx === 1 ? <Clock className="w-6 h-6 text-green-600" /> : <DollarSign className="w-6 h-6 text-purple-600" />}
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Get Quotes from {displayLocation} Experts</h3>
              <p className="text-lg mb-6 opacity-90">
                {(() => {
                  let content = resolvedCmsBlock?.quotesParagraph;
                  
                  // Handle nested structure for quotesParagraph
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      if (resolvedCmsBlock.countryPages[key]?.quotesParagraph) {
                        content = resolvedCmsBlock.countryPages[key].quotesParagraph;
                        break;
                      }
                    }
                  }
                  
                  // Handle deeper nested structure
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                      if (nestedCountryPages) {
                        const nestedKeys = Object.keys(nestedCountryPages);
                        for (const nestedKey of nestedKeys) {
                          if (nestedCountryPages[nestedKey]?.quotesParagraph) {
                            content = nestedCountryPages[nestedKey].quotesParagraph;
                            break;
                          }
                        }
                        if (content) break;
                      }
                    }
                  }
                  
                  if (typeof content === 'object' && content !== null) {
                    return content.description || content.text || JSON.stringify(content);
                  }
                  return content || `Connect with verified local builders. Quotes within 24 hours.`;
                })()}
              </p>
              <PublicQuoteRequest location={displayLocation} buttonText={
                (() => {
                  const content = "Get Local Quotes Now";
                  // This is always a string, so no need to check for object
                  return content;
                })()
              } className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4" />
            </div>

            <div className="mt-10">
              <CountryGallery images={(() => {
                // First try to get gallery images from the resolved CMS block directly
                let galleryImages = resolvedCmsBlock?.galleryImages;
                
                // If not found, check for nested structure (common in city pages)
                if (!galleryImages && resolvedCmsBlock?.countryPages) {
                  // Try to find gallery images in any country page nested content
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    if (resolvedCmsBlock.countryPages[key]?.galleryImages) {
                      galleryImages = resolvedCmsBlock.countryPages[key].galleryImages;
                      break;
                    }
                  }
                }
                
                // If still not found, check for deeper nested structure
                if (!galleryImages && resolvedCmsBlock?.countryPages) {
                  // Check for cityPages -> countryPages -> city -> galleryImages structure
                  const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                  for (const key of countryPageKeys) {
                    const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                    if (nestedCountryPages) {
                      const nestedKeys = Object.keys(nestedCountryPages);
                      for (const nestedKey of nestedKeys) {
                        if (nestedCountryPages[nestedKey]?.galleryImages) {
                          galleryImages = nestedCountryPages[nestedKey].galleryImages;
                          break;
                        }
                      }
                      if (galleryImages) break;
                    }
                  }
                }
                
                // Ensure we return an array
                if (Array.isArray(galleryImages)) {
                  return galleryImages;
                }
                return [];
              })() || []} />
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      {Array.isArray(upcomingEvents) && upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Exhibitions in {displayLocation}</h2>
                <p className="text-xl text-gray-600">Plan ahead for these trade shows and exhibitions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((ev, i) => (
                  <Card key={i} className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />{ev.name}</CardTitle>
                      <CardDescription>{ev.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 mb-4">{ev.venue}</p>
                      <PublicQuoteRequest location={displayLocation} buttonText={
                        (() => {
                          const content = "Get Quote for This Event";
                          // This is always a string, so no need to check for object
                          return content;
                        })()
                      } className="w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BUILDERS GRID */}
      {filteredBuilders.length > 0 && (
        <section id="builders-grid" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {(() => {
                    let content = resolvedCmsBlock?.buildersHeading;
                    
                    // Handle nested structure for buildersHeading
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        if (resolvedCmsBlock.countryPages[key]?.buildersHeading) {
                          content = resolvedCmsBlock.countryPages[key].buildersHeading;
                          break;
                        }
                      }
                    }
                    
                    // Handle deeper nested structure
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                        if (nestedCountryPages) {
                          const nestedKeys = Object.keys(nestedCountryPages);
                          for (const nestedKey of nestedKeys) {
                            if (nestedCountryPages[nestedKey]?.buildersHeading) {
                              content = nestedCountryPages[nestedKey].buildersHeading;
                              break;
                            }
                          }
                          if (content) break;
                        }
                      }
                    }
                    
                    if (typeof content === 'object' && content !== null) {
                      return content.heading || content.title || JSON.stringify(content);
                    }
                    return content || `Verified Builders in ${displayLocation}`;
                  })()}
                </h2>
                <div className="text-gray-600">
                  {resolvedCmsBlock?.buildersIntro ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml((() => {
                      let content = resolvedCmsBlock?.buildersIntro;
                      
                      // Handle nested structure for buildersIntro
                      if (!content && resolvedCmsBlock?.countryPages) {
                        const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                        for (const key of countryPageKeys) {
                          if (resolvedCmsBlock.countryPages[key]?.buildersIntro) {
                            content = resolvedCmsBlock.countryPages[key].buildersIntro;
                            break;
                          }
                        }
                      }
                      
                      // Handle deeper nested structure
                      if (!content && resolvedCmsBlock?.countryPages) {
                        const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                        for (const key of countryPageKeys) {
                          const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                          if (nestedCountryPages) {
                            const nestedKeys = Object.keys(nestedCountryPages);
                            for (const nestedKey of nestedKeys) {
                              if (nestedCountryPages[nestedKey]?.buildersIntro) {
                                content = nestedCountryPages[nestedKey].buildersIntro;
                                break;
                              }
                            }
                            if (content) break;
                          }
                        }
                      }
                      
                      if (typeof content === 'object' && content !== null) {
                        return content.description || content.text || JSON.stringify(content);
                      }
                      return content;
                    })()) }} />
                  ) : (
                    <p>{filteredBuilders.length} professional exhibition stand builders available</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full flex-wrap mb-8">
                <div className="w-full md:w-64 flex-grow">
                  <Input
                    value={searchTerm ?? ''}
                    onChange={(e) => onSearchTermChange && onSearchTermChange(e.target.value)}
                    placeholder={`Search builders in ${displayLocation}...`}
                    className="bg-white border-gray-300 w-full"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant={sortBy === 'rating' ? 'default' : 'outline'} onClick={() => setSortBy('rating')} className="text-sm whitespace-nowrap">
                    <Star className="w-4 h-4 mr-1" /> Rating
                  </Button>
                  <Button variant={sortBy === 'projects' ? 'default' : 'outline'} onClick={() => setSortBy('projects')} className="text-sm whitespace-nowrap">
                    <Award className="w-4 h-4 mr-1" /> Experience
                  </Button>
                  <Button variant={sortBy === 'price' ? 'default' : 'outline'} onClick={() => setSortBy('price')} className="text-sm whitespace-nowrap">
                    <DollarSign className="w-4 h-4 mr-1" /> Price
                  </Button>
                </div>
              </div>

              {isLoadingBuilders ? (
                <div className="py-16 text-center">Loading builders...</div>
              ) : filteredBuilders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBuilders.map((b) => (
                    <div key={b.id || b.slug || b.companyName} className="flex flex-col h-full">
                      <BuilderCard
                        builder={b}
                        location={displayLocation}
                        currentPageLocation={{ country: finalCountryName || '', city: isCity ? finalLocationName : undefined }}
                        showLeadForm
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No builders available yet</h3>
                  <p className="text-gray-600 mb-6">We're adding builders in {displayLocation}. Get notified when they're available.</p>
                  <PublicQuoteRequest location={displayLocation} buttonText={
                    (() => {
                      const content = "Get Quotes from Global Builders";
                      // This is always a string, so no need to check for object
                      return content;
                    })()
                  } className="bg-blue-600 hover:bg-blue-700" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* POST-BUILDERS SEO CONTENT */}
      {!suppressPostBuildersContent && (
        <>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto prose prose-slate leading-relaxed space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold !mb-4">
                  {(() => {
                    let content = resolvedCmsBlock?.servicesHeading;
                    
                    // Handle nested structure for servicesHeading
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        if (resolvedCmsBlock.countryPages[key]?.servicesHeading) {
                          content = resolvedCmsBlock.countryPages[key].servicesHeading;
                          break;
                        }
                      }
                    }
                    
                    // Handle deeper nested structure
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                        if (nestedCountryPages) {
                          const nestedKeys = Object.keys(nestedCountryPages);
                          for (const nestedKey of nestedKeys) {
                            if (nestedCountryPages[nestedKey]?.servicesHeading) {
                              content = nestedCountryPages[nestedKey].servicesHeading;
                              break;
                            }
                          }
                          if (content) break;
                        }
                      }
                    }
                    
                    if (typeof content === 'object' && content !== null) {
                      return content.heading || content.title || JSON.stringify(content);
                    }
                    return content || `Exhibition Stand Builders in ${displayLocation}: Services, Costs, and Tips`;
                  })()}
                </h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml((() => {
                  let content = resolvedCmsBlock?.servicesParagraph;
                  
                  // Handle nested structure for servicesParagraph
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      if (resolvedCmsBlock.countryPages[key]?.servicesParagraph) {
                        content = resolvedCmsBlock.countryPages[key].servicesParagraph;
                        break;
                      }
                    }
                  }
                  
                  // Handle deeper nested structure
                  if (!content && resolvedCmsBlock?.countryPages) {
                    const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                    for (const key of countryPageKeys) {
                      const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                      if (nestedCountryPages) {
                        const nestedKeys = Object.keys(nestedCountryPages);
                        for (const nestedKey of nestedKeys) {
                          if (nestedCountryPages[nestedKey]?.servicesParagraph) {
                            content = nestedCountryPages[nestedKey].servicesParagraph;
                            break;
                          }
                        }
                        if (content) break;
                      }
                    }
                  }
                  
                  if (typeof content === 'object' && content !== null) {
                    return content.description || content.text || JSON.stringify(content);
                  }
                  return content;
                })()) }} />
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {(() => {
                    let content = resolvedCmsBlock?.finalCtaHeading;
                    
                    // Handle nested structure for finalCtaHeading
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        if (resolvedCmsBlock.countryPages[key]?.finalCtaHeading) {
                          content = resolvedCmsBlock.countryPages[key].finalCtaHeading;
                          break;
                        }
                      }
                    }
                    
                    // Handle deeper nested structure
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                        if (nestedCountryPages) {
                          const nestedKeys = Object.keys(nestedCountryPages);
                          for (const nestedKey of nestedKeys) {
                            if (nestedCountryPages[nestedKey]?.finalCtaHeading) {
                              content = nestedCountryPages[nestedKey].finalCtaHeading;
                              break;
                            }
                          }
                          if (content) break;
                        }
                      }
                    }
                    
                    if (typeof content === 'object' && content !== null) {
                      return content.heading || content.title || JSON.stringify(content);
                    }
                    return content || `Ready to Find Your Perfect Builder in ${displayLocation}?`;
                  })()}
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  {(() => {
                    let content = resolvedCmsBlock?.finalCtaParagraph;
                    
                    // Handle nested structure for finalCtaParagraph
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        if (resolvedCmsBlock.countryPages[key]?.finalCtaParagraph) {
                          content = resolvedCmsBlock.countryPages[key].finalCtaParagraph;
                          break;
                        }
                      }
                    }
                    
                    // Handle deeper nested structure
                    if (!content && resolvedCmsBlock?.countryPages) {
                      const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                      for (const key of countryPageKeys) {
                        const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                        if (nestedCountryPages) {
                          const nestedKeys = Object.keys(nestedCountryPages);
                          for (const nestedKey of nestedKeys) {
                            if (nestedCountryPages[nestedKey]?.finalCtaParagraph) {
                              content = nestedCountryPages[nestedKey].finalCtaParagraph;
                              break;
                            }
                          }
                          if (content) break;
                        }
                      }
                    }
                    
                    if (typeof content === 'object' && content !== null) {
                      return content.description || content.text || JSON.stringify(content);
                    }
                    return content || `Get competitive quotes from verified local builders.`;
                  })()}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <PublicQuoteRequest location={displayLocation} buttonText={
                    (() => {
                      let content = resolvedCmsBlock?.finalCtaButtonText;
                      
                      // Handle nested structure for finalCtaButtonText
                      if (!content && resolvedCmsBlock?.countryPages) {
                        const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                        for (const key of countryPageKeys) {
                          if (resolvedCmsBlock.countryPages[key]?.finalCtaButtonText) {
                            content = resolvedCmsBlock.countryPages[key].finalCtaButtonText;
                            break;
                          }
                        }
                      }
                      
                      // Handle deeper nested structure
                      if (!content && resolvedCmsBlock?.countryPages) {
                        const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                        for (const key of countryPageKeys) {
                          const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                          if (nestedCountryPages) {
                            const nestedKeys = Object.keys(nestedCountryPages);
                            for (const nestedKey of nestedKeys) {
                              if (nestedCountryPages[nestedKey]?.finalCtaButtonText) {
                                content = nestedCountryPages[nestedKey].finalCtaButtonText;
                                break;
                              }
                            }
                            if (content) break;
                          }
                        }
                      }
                      
                      if (typeof content === 'object' && content !== null) {
                        return content.text || content.title || JSON.stringify(content);
                      }
                      return content || "Start Getting Quotes";
                    })()
                  } className="text-lg px-8 py-4" />
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/20 hover:text-gray-900 backdrop-blur-sm text-lg px-8 py-4 shadow-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {(() => {
                      let content = resolvedCmsBlock?.backToTopButtonText;
                      
                      // Handle nested structure for backToTopButtonText
                      if (!content && resolvedCmsBlock?.countryPages) {
                        const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                        for (const key of countryPageKeys) {
                          if (resolvedCmsBlock.countryPages[key]?.backToTopButtonText) {
                            content = resolvedCmsBlock.countryPages[key].backToTopButtonText;
                            break;
                          }
                        }
                      }
                      
                      // Handle deeper nested structure
                      if (!content && resolvedCmsBlock?.countryPages) {
                        const countryPageKeys = Object.keys(resolvedCmsBlock.countryPages);
                        for (const key of countryPageKeys) {
                          const nestedCountryPages = resolvedCmsBlock.countryPages[key]?.countryPages;
                          if (nestedCountryPages) {
                            const nestedKeys = Object.keys(nestedCountryPages);
                            for (const nestedKey of nestedKeys) {
                              if (nestedCountryPages[nestedKey]?.backToTopButtonText) {
                                content = nestedCountryPages[nestedKey].backToTopButtonText;
                                break;
                              }
                            }
                            if (content) break;
                          }
                        }
                      }
                      
                      if (typeof content === 'object' && content !== null) {
                        return content.text || content.title || JSON.stringify(content);
                      }
                      return content || 'Back to Top';
                    })()} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

