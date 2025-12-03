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

  // --- load builders (sync first, then async); poll if no initial builders ---
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
        setFilteredBuilders(prev => {
          // only update if different
          if (prev.length === initial.length && prev[0] === initial[0]) return prev;
          return normalizeBuilders(initial, sortBy);
        });
        return;
      }

      setIsLoadingBuilders(true);
      try {
        // sync attempt
        const sync = typeof unifiedPlatformAPI?.getBuilders === 'function'
          ? unifiedPlatformAPI.getBuilders(displayLocation)
          : [];
        if (Array.isArray(sync) && sync.length > 0) {
          if (!cancelled) setFilteredBuilders(normalizeBuilders(sync, sortBy));
        } else {
          // async attempt
          const asyncResult = typeof unifiedPlatformAPI?.getBuildersAsync === 'function'
            ? await unifiedPlatformAPI.getBuildersAsync(displayLocation)
            : [];
          if (!cancelled && Array.isArray(asyncResult)) {
            setFilteredBuilders(normalizeBuilders(asyncResult, sortBy));
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
      setCmsData(serverCmsContent);
      setIsLoadingCms(false);
      return;
    }

    const fetchCms = async () => {
      if (!countrySlug) return;
      setIsLoadingCms(true);
      try {
        const url = `/api/admin/pages-editor?action=get-content&path=/exhibition-stands/${encodeURIComponent(countrySlug)}`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && data?.success && data?.data) {
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
      return cmsData?.sections?.cityPages?.[key] || cmsData;
    }
    return cmsData?.sections?.countryPages?.[countrySlug] || cmsData;
  }, [cmsData, isCity, countrySlug, finalLocationName]);

  // --- render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
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
              {resolvedCmsBlock?.heroDescription || resolvedCmsBlock?.hero || `Find trusted exhibition stand builders in ${displayLocation}.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <PublicQuoteRequest
                location={displayLocation}
                buttonText={`Get Quotes from ${displayLocation} Builders`}
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
                {resolvedCmsBlock?.whyChooseHeading || `Why Choose Local Builders in ${displayLocation}?`}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {resolvedCmsBlock?.whyChooseParagraph || `Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {((resolvedCmsBlock?.infoCards) || [
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
              ]).map((card: any, idx: number) => (
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
                {resolvedCmsBlock?.quotesParagraph || `Connect with verified local builders. Quotes within 24 hours.`}
              </p>
              <PublicQuoteRequest location={displayLocation} buttonText="Get Local Quotes Now" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4" />
            </div>

            <div className="mt-10">
              <CountryGallery images={(resolvedCmsBlock?.galleryImages) || []} />
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
                      <PublicQuoteRequest location={displayLocation} buttonText="Get Quote for This Event" className="w-full" />
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{resolvedCmsBlock?.buildersHeading || `Verified Builders in ${displayLocation}`}</h2>
                <div className="text-gray-600">
                  {resolvedCmsBlock?.buildersIntro ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(resolvedCmsBlock?.buildersIntro) }} />
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
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No builders available yet</h3>
                  <p className="text-gray-600 mb-6">We're adding builders in {displayLocation}. Get notified when they're available.</p>
                  <PublicQuoteRequest location={displayLocation} buttonText="Get Quotes from Global Builders" className="bg-blue-600 hover:bg-blue-700" />
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
                <h2 className="text-2xl md:text-3xl font-bold !mb-4">{resolvedCmsBlock?.servicesHeading || `Exhibition Stand Builders in ${displayLocation}: Services, Costs, and Tips`}</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(resolvedCmsBlock?.servicesParagraph) }} />
              </div>
            </div>
          </section>

          <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{resolvedCmsBlock?.finalCtaHeading || `Ready to Find Your Perfect Builder in ${displayLocation}?`}</h2>
                <p className="text-xl text-slate-300 mb-8">{resolvedCmsBlock?.finalCtaParagraph || `Get competitive quotes from verified local builders.`}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <PublicQuoteRequest location={displayLocation} buttonText={resolvedCmsBlock?.finalCtaButtonText || "Start Getting Quotes"} className="text-lg px-8 py-4" />
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/20 hover:text-gray-900 backdrop-blur-sm text-lg px-8 py-4 shadow-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {resolvedCmsBlock?.backToTopButtonText || 'Back to Top'} <ArrowRight className="w-5 h-5 ml-2" />
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

