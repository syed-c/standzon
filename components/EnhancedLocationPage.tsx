'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BuilderCard } from '@/components/BuilderCard';
import PublicQuoteRequest from '@/components/PublicQuoteRequest';
import { 
  MapPin, Building, Users, Star, ArrowRight, 
  TrendingUp, Award, CheckCircle, Zap, Globe,
  Calendar, DollarSign, Clock, Shield
} from 'lucide-react';

interface LocationPageProps {
  country?: string;
  city?: string;
  builders?: any[];
  locationStats?: {
    totalBuilders: number;
    averageRating: number;
    completedProjects: number;
    averagePrice: number;
  };
  upcomingEvents?: Array<{
    name: string;
    date: string;
    venue: string;
  }>;
  // Add server CMS content prop
  serverCmsContent?: any;
}

export function EnhancedLocationPage({ 
  // New flexible props (optional to avoid TS conflicts)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...props
}: any) {
  const {
    locationType,
    locationName,
    countryName,
    initialBuilders = [],
    exhibitions = [],
    venues = [],
    pageContent,
    isEditable = false,
    onContentUpdate,
    country,
    city,
    builders = [],
    locationStats,
    upcomingEvents = [],
    serverCmsContent
  } = props;
  // Optional UI control props from parent
  const searchTerm: string | undefined = props.searchTerm;
  const onSearchTermChange: ((value: string) => void) | undefined = props.onSearchTermChange;
  const suppressPostBuildersContent: boolean = Boolean(props.suppressPostBuildersContent);
  // Use new props if available, fallback to legacy props
  const finalBuilders = initialBuilders.length > 0 ? initialBuilders : builders;
  const finalLocationName = locationName || city || country || 'Unknown Location';
  const finalCountryName = countryName || (city ? country : undefined);
  const isCity = locationType === 'city' || !!city;
  
  const [filteredBuilders, setFilteredBuilders] = useState(finalBuilders);
  const [sortBy, setSortBy] = useState<'rating' | 'projects' | 'price'>('rating');
  const [cmsData, setCmsData] = useState<any>(null);
  const [isLoadingCms, setIsLoadingCms] = useState(false);

  // Stabilize effect dependency on builders to avoid infinite update loops
  const buildersDepKey = useMemo(() => {
    try {
      return (finalBuilders || [])
        .map((b: any) => b?.id || b?.slug || b?.companyName || '')
        .join('|');
    } catch {
      return String((finalBuilders || []).length);
    }
  }, [finalBuilders]);

  const displayLocation = isCity && finalCountryName ? 
    `${finalLocationName}, ${finalCountryName}` : 
    finalLocationName;
    
  const pageTitle = isCity ? 
    `Exhibition Stand Builders in ${finalLocationName}` : 
    `Exhibition Stand Builders in ${finalLocationName}`;

  // ✅ Enhanced stats with proper calculation
  const stats = {
    totalBuilders: finalBuilders.length,
    averageRating: finalBuilders.length > 0 ? 
      Math.round((finalBuilders.reduce((sum: number, b: any) => sum + (b.rating || 4.5), 0) / finalBuilders.length) * 10) / 10 : 4.8,
    completedProjects: finalBuilders.reduce((acc: number, b: any) => acc + (b.projectsCompleted || 50), 0),
    averagePrice: 450,
    // Merge with locationStats but prioritize calculated values
    ...(locationStats && {
      averageRating: locationStats.averageRating,
      averagePrice: locationStats.averagePrice
    })
  };

  // Generate consistent country slug for CMS data access
  const countrySlug = useMemo(() => {
    return finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
           finalLocationName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }, [finalCountryName, finalLocationName]);

  useEffect(() => {
    // De-duplicate builders by normalized key (prefer verified, higher reviews)
    const pickPreferred = (a: any, b: any) => {
      if ((a.verified ? 1 : 0) !== (b.verified ? 1 : 0)) return (a.verified ? -1 : 1);
      if ((a.reviewCount || 0) !== (b.reviewCount || 0)) return (b.reviewCount || 0) - (a.reviewCount || 0);
      if ((a.rating || 0) !== (b.rating || 0)) return (b.rating || 0) - (a.rating || 0);
      return (a.createdAt || 0) - (b.createdAt || 0);
    };
    const normalizeCompany = (name: string) =>
      (name || '')
        .toLowerCase()
        .replace(/[,./|!@#$%^&*()_+\-]+/g, ' ')
        .replace(/\b(ltd|limited|llc|l\.l\.c\.|inc|inc\.|gmbh|co\.|company|srl|s\.r\.l\.|ag|se)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    const map = new Map<string, any>();
    (finalBuilders || []).forEach((b: any) => {
      const normalizedName = normalizeCompany(b.companyName || '');
      const cityKey = (b.headquarters?.city || '').toLowerCase().trim();
      const countryKey = (b.headquarters?.country || '').toLowerCase().trim();
      // Country pages: collapse by name+country; City pages: keep city in the key
      const key = isCity
        ? `${normalizedName}|${cityKey}|${countryKey}`
        : `${normalizedName}|${countryKey}`;
      if (!map.has(key)) {
        map.set(key, b);
      } else {
        const existing = map.get(key);
        map.set(key, pickPreferred(existing, b) <= 0 ? existing : b);
      }
    });
    let sorted = Array.from(map.values());
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'projects':
        sorted.sort((a, b) => (b.projectsCompleted || 25) - (a.projectsCompleted || 25));
        break;
      case 'price':
        sorted.sort((a, b) => (a.priceRange?.basicStand?.min || 300) - (b.priceRange?.basicStand?.min || 300));
        break;
    }

    // Only update state when content actually changes to prevent re-render loops
    setFilteredBuilders((prev: any[]) => {
      if (prev === sorted) return prev;
      if (!prev || prev.length !== sorted.length) return sorted;
      // shallow compare by stable keys
      let identical = true;
      for (let i = 0; i < sorted.length; i++) {
        const a = prev[i];
        const b = sorted[i];
        const aKey = a?.id || a?.slug || a?.companyName;
        const bKey = b?.id || b?.slug || b?.companyName;
        if (aKey !== bKey) { identical = false; break; }
      }
      return identical ? prev : sorted;
    });
  }, [sortBy, buildersDepKey]);

  // Initialize CMS data with server-side content if available
  useEffect(() => {
    if (serverCmsContent) {
      console.log("✅ Using server-side CMS content:", serverCmsContent);
      setCmsData({
        sections: {
          countryPages: {
            [countrySlug]: serverCmsContent
          }
        }
      });
      setIsLoadingCms(false);
      return;
    }

    // Fetch CMS data for country pages only if no server content
    const fetchCmsData = async () => {
      if (!finalCountryName && !isCity) return; // Only fetch for country pages
      
      setIsLoadingCms(true);
      try {
        console.log("🔍 Fetching CMS data for country:", countrySlug);
        
        const res = await fetch(
          `/api/admin/pages-editor?action=get-content&path=/exhibition-stands/${countrySlug}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        console.log("📡 CMS API response:", data);
        
        if (data?.success && data?.data) {
          console.log("✅ Loaded CMS data for country:", countrySlug, data.data);
          console.log("🏳️ Country pages data:", data.data?.sections?.countryPages);
          console.log("🌍 Available country data keys:", Object.keys(data.data?.sections?.countryPages || {}));
          
          // Check if we have the specific country data
          const countryData = data.data?.sections?.countryPages?.[countrySlug];
          if (countryData) {
            console.log("✅ Found country-specific data for:", countrySlug, countryData);
          } else {
            console.warn("⚠️ No country-specific data found for:", countrySlug);
            console.log("🔍 Available countries:", Object.keys(data.data?.sections?.countryPages || {}));
          }
          
          setCmsData(data.data);
        } else {
          console.warn("⚠️ No CMS data found for country:", countrySlug);
        }
      } catch (error) {
        console.error("❌ Error loading CMS data:", error);
      } finally {
        setIsLoadingCms(false);
      }
    };

    fetchCmsData();
  }, [finalCountryName, finalLocationName, isCity, serverCmsContent, countrySlug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
                <MapPin className="w-5 h-5 mr-2" />
                {displayLocation}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Exhibition Stand Builders</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                in {displayLocation}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Connect with {stats.totalBuilders}+ verified exhibition stand builders in {displayLocation}. 
              Get competitive quotes from local experts who understand your market.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <PublicQuoteRequest 
                location={displayLocation}
                buttonText={`Get Quotes from ${displayLocation} Builders`}
                className="text-lg px-8 py-4"
              />
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4"
                onClick={() => document.getElementById('builders-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Local Builders
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Location Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Building className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{stats.totalBuilders}+</div>
                <div className="text-slate-300 text-sm">Verified Builders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">{stats.averageRating}</div>
                <div className="text-slate-300 text-sm">Average Rating</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold">{stats.completedProjects.toLocaleString()}</div>
                <div className="text-slate-300 text-sm">Projects Completed</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl font-bold">${stats.averagePrice}</div>
                <div className="text-slate-300 text-sm">Avg. Price/sqm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Local Builders */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {cmsData?.sections?.countryPages?.[countrySlug]?.whyChooseHeading || 
                 `Why Choose Local Builders in ${displayLocation}?`}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {cmsData?.sections?.countryPages?.[countrySlug]?.whyChooseParagraph || 
                 `Local builders offer unique advantages including market knowledge, 
                 logistical expertise, and established vendor relationships.`}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {(cmsData?.sections?.countryPages?.[countrySlug]?.infoCards || [
                {
                  title: "Local Market Knowledge",
                  text: `Understand local regulations, venue requirements, and cultural preferences specific to ${displayLocation}.`
                },
                {
                  title: "Faster Project Delivery",
                  text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support."
                },
                {
                  title: "Cost-Effective Solutions",
                  text: "Lower transportation costs, established supplier networks, and competitive local pricing structures."
                }
              ]).map((card: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                    index === 0 ? 'bg-blue-100' : 
                    index === 1 ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {index === 0 ? <MapPin className="w-8 h-8 text-blue-600" /> :
                     index === 1 ? <Clock className="w-8 h-8 text-green-600" /> :
                     <DollarSign className="w-8 h-8 text-purple-600" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                  <p className="text-gray-600">{card.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Quote CTA */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">
                Get Quotes from {displayLocation} Experts
              </h3>
              <p className="text-lg mb-6 opacity-90">
                {cmsData?.sections?.countryPages?.[countrySlug]?.quotesParagraph || 
                 `Connect with 3-5 verified local builders who understand your market. 
                 No registration required, quotes within 24 hours.`}
              </p>
              <PublicQuoteRequest 
                location={displayLocation}
                buttonText="Get Local Quotes Now"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Upcoming Exhibitions in {displayLocation}
                </h2>
                <p className="text-xl text-gray-600">
                  Plan ahead for these major trade shows and exhibitions
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {upcomingEvents.map((event: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        {event.name}
                      </CardTitle>
                      <CardDescription>{event.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.venue}</p>
                      <PublicQuoteRequest 
                        location={displayLocation}
                        buttonText="Get Quote for This Event"
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Builders Grid */}
      <section id="builders-grid" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verified Builders in {displayLocation}
                </h2>
                <p className="text-gray-600">
                  {filteredBuilders.length} professional exhibition stand builders available
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                {/* Search box placed before filters */}
                <div className="w-full sm:w-64">
                  <Input
                    value={searchTerm ?? ''}
                    onChange={(e) => onSearchTermChange && onSearchTermChange(e.target.value)}
                    placeholder={`Search builders in ${displayLocation}...`}
                    className="bg-white border-gray-300"
                  />
                </div>
                <Button 
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  onClick={() => setSortBy('rating')}
                  className="text-sm"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Rating
                </Button>
                <Button 
                  variant={sortBy === 'projects' ? 'default' : 'outline'}
                  onClick={() => setSortBy('projects')}
                  className="text-sm"
                >
                  <Award className="w-4 h-4 mr-1" />
                  Experience
                </Button>
                <Button 
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  onClick={() => setSortBy('price')}
                  className="text-sm"
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Price
                </Button>
              </div>
            </div>

            {filteredBuilders.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                {filteredBuilders.map((builder: any) => (
                  <BuilderCard 
                    key={builder.id} 
                    builder={builder} 
                    location={displayLocation}
                    showLeadForm={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No builders available yet
                </h3>
                <p className="text-gray-600 mb-6">
                  We're adding builders in {displayLocation}. Get notified when they're available.
                </p>
                <PublicQuoteRequest 
                  location={displayLocation}
                  buttonText="Get Quotes from Global Builders"
                  className="bg-blue-600 hover:bg-blue-700"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Slot for Cities section rendered by parent directly after builders */}

      {/* Post-builders content is optionally suppressed; parent may render sections in custom order */}
      {!suppressPostBuildersContent && (
        <>
          {/* SEO Content Section (between builders grid and bottom CTA) */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto prose prose-slate">
                <h2 className="text-2xl md:text-3xl font-bold !mb-4">
                  {cmsData?.sections?.countryPages?.[countrySlug]?.servicesHeading || 
                   `Exhibition Stand Builders in ${displayLocation}: Services, Costs, and Tips`}
                </h2>
                <p>
                  {cmsData?.sections?.countryPages?.[countrySlug]?.servicesParagraph || 
                   `Finding the right exhibition stand partner in ${displayLocation} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`}
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {cmsData?.sections?.countryPages?.[countrySlug]?.finalCtaHeading || 
                   `Ready to Find Your Perfect Builder in ${displayLocation}?`}
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  {cmsData?.sections?.countryPages?.[countrySlug]?.finalCtaParagraph || 
                   `Get competitive quotes from verified local builders. Compare proposals and choose the best fit for your exhibition needs.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <PublicQuoteRequest 
                    location={displayLocation}
                    buttonText={cmsData?.sections?.countryPages?.[countrySlug]?.finalCtaButtonText || "Start Getting Quotes"}
                    className="text-lg px-8 py-4"
                  />
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    {cmsData?.sections?.countryPages?.[countrySlug]?.backToTopButtonText || "Back to Top"}
                    <ArrowRight className="w-5 h-5 ml-2" />
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

export default EnhancedLocationPage;