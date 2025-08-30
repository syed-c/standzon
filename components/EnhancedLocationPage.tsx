'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    upcomingEvents = []
  } = props;
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

  useEffect(() => {
    let sorted = [...finalBuilders];
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

  // Fetch CMS data for country pages
  useEffect(() => {
    const fetchCmsData = async () => {
      if (!finalCountryName && !isCity) return; // Only fetch for country pages
      
      setIsLoadingCms(true);
      try {
        const countrySlug = finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
                           finalLocationName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        const res = await fetch(
          `/api/admin/pages-editor?action=get-content&path=%2Fexhibition-stands%2F${countrySlug}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          console.log("Loaded CMS data for country:", countrySlug, data.data);
          setCmsData(data.data);
        }
      } catch (error) {
        console.error("Error loading CMS data:", error);
      } finally {
        setIsLoadingCms(false);
      }
    };

    fetchCmsData();
  }, [finalCountryName, finalLocationName, isCity]);

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
                {cmsData?.sections?.countryPages?.[finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')]?.whyChooseHeading || 
                 `Why Choose Local Builders in ${displayLocation}?`}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {cmsData?.sections?.countryPages?.[finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')]?.whyChooseParagraph || 
                 `Local builders offer unique advantages including market knowledge, 
                 logistical expertise, and established vendor relationships.`}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {(cmsData?.sections?.countryPages?.[finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')]?.infoCards || [
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
                {cmsData?.sections?.countryPages?.[finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')]?.quotesParagraph || 
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
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verified Builders in {displayLocation}
                </h2>
                <p className="text-gray-600">
                  {filteredBuilders.length} professional exhibition stand builders available
                </p>
              </div>
              
              <div className="flex gap-2">
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

      {/* SEO Content Section (between builders grid and bottom CTA) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h2 className="text-2xl md:text-3xl font-bold !mb-4">
              {cmsData?.sections?.countryPages?.[finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')]?.servicesHeading || 
               `Exhibition Stand Builders in ${displayLocation}: Services, Costs, and Tips`}
            </h2>
            <p>
              {cmsData?.sections?.countryPages?.[finalCountryName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')]?.servicesParagraph || 
               `Finding the right exhibition stand partner in ${displayLocation} can dramatically improve your event ROI. Local builders offer`}
              end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand
              presents a professional, high‑impact presence on the show floor.
            </p>
            <h3 className="!mt-6">What You Can Expect</h3>
            <ul>
              <li><strong>Custom design</strong> that aligns with your brand strategy and visitor journey.</li>
              <li><strong>Modular or rental options</strong> to optimize budget and reusability across shows.</li>
              <li><strong>Project management</strong> covering approvals, venue coordination, and timelines.</li>
              <li><strong>On‑site services</strong> including installation, dismantle, and show support.</li>
            </ul>
            <h3 className="!mt-6">Typical Budget Ranges</h3>
            <p>
              Pricing varies by size, materials, and scope. As a broad reference, 9–18 sqm booths often start from budget‑friendly builds,
              while 24–36+ sqm custom stands require higher investment. Request multiple quotes from verified builders in {displayLocation}
              to compare concepts, materials, and timelines.
            </p>
            <h3 className="!mt-6">How to Choose a Builder</h3>
            <ol>
              <li>Review recent projects and case studies relevant to your industry.</li>
              <li>Validate certifications, insurance, and familiarity with local venue regulations.</li>
              <li>Assess timelines, warranty, and post‑show support.</li>
              <li>Prioritize transparent quotes that itemize design, build, logistics, and services.</li>
            </ol>
            <p>
              With the right partner, your trade show presence in {displayLocation} can attract qualified leads, strengthen customer
              relationships, and elevate brand perception.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Builder in {displayLocation}?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get competitive quotes from verified local builders. 
              Compare proposals and choose the best fit for your exhibition needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PublicQuoteRequest 
                location={displayLocation}
                buttonText="Start Getting Quotes"
                className="text-lg px-8 py-4"
              />
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnhancedLocationPage;