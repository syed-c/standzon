




"use client";

import { useState, useEffect } from 'react';
import { usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Star, Phone, Globe, Mail, ArrowLeft, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { Preloaded } from "convex/react";
import { generateLocationStructuredData, generateOrganizationStructuredData } from "@/lib/seo/structuredData";
import PublicQuoteRequest from "@/components/PublicQuoteRequest";

interface EnhancedCityPageClientProps {
  countrySlug: string;
  citySlug: string;
  preloadedCityData: Preloaded<typeof api.locations.getCityBySlug>;
  preloadedBuildersData: Preloaded<typeof api.locations.getBuildersForLocation>;
}

export default function EnhancedCityPageClient({ 
  countrySlug, 
  citySlug,
  preloadedCityData, 
  preloadedBuildersData 
}: EnhancedCityPageClientProps) {
  const [showAllBuilders, setShowAllBuilders] = useState(false);
  
  // Use preloaded data for SSR
  const cityData = usePreloadedQuery(preloadedCityData);
  const builders = usePreloadedQuery(preloadedBuildersData);

  if (!cityData || !cityData.country) {
    console.log('❌ City data or country data missing in client component');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-8">The requested city could not be found.</p>
          <Link href="/exhibition-stands">
            <Button>Browse All Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cityBuilders = builders || [];
  const countryName = cityData.country.countryName;
  const cityName = cityData.cityName;

  console.log('🏙️ Rendering city page:', { cityName, countryName, builderCount: cityBuilders.length });

  // Generate structured data
  const locationStructuredData = generateLocationStructuredData({
    name: `Exhibition Stands in ${cityName}`,
    description: `Professional exhibition stand builders in ${cityName}, ${countryName}`,
    address: {
      addressLocality: cityName,
      addressCountry: countryName
    },
    url: `https://standszone.com/exhibition-stands/${countrySlug}/${citySlug}`,
    aggregateRating: cityBuilders.length > 0 ? {
      ratingValue: cityBuilders.reduce((acc, builder) => acc + (builder.rating || 4.5), 0) / cityBuilders.length,
      reviewCount: cityBuilders.reduce((acc, builder) => acc + (builder.reviewCount || 0), 0)
    } : undefined
  });

  const organizationStructuredData = cityBuilders.slice(0, 5).map(builder => 
    generateOrganizationStructuredData({
      name: builder.companyName,
      description: `Professional exhibition stand builder in ${cityName}`,
      url: builder.website || `https://standszone.com/builders/${builder.slug}`,
      telephone: builder.phone,
      email: builder.primaryEmail,
      address: {
        addressLocality: builder.headquartersCity || cityName,
        addressCountry: countryName
      },
      aggregateRating: builder.rating ? {
        ratingValue: builder.rating,
        reviewCount: builder.reviewCount || 1
      } : undefined
    })
  );

  // Track page view and generate structured data
  useEffect(() => {
    if (cityData && cityData.country) {
      // Analytics tracking will be added later when the module is implemented
      console.log('City page viewed:', {
        country: countryName,
        city: cityName,
        builderCount: cityData.stats?.builderCount || 0,
        pageType: 'city'
      });
    }
  }, [cityData, cityName, countryName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationStructuredData)
        }}
      />
      {organizationStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href={`/exhibition-stands/${countrySlug}`}
              className="inline-flex items-center text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {countryName}
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exhibition Stands in {cityName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Professional exhibition stand builders in {cityName}, {countryName}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>{cityData.stats?.builderCount || 0} Local Builders</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{cityData.stats?.tradeShowCount || 0} Trade Shows</span>
              </div>
              {cityData.population && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{cityData.population.toLocaleString()} Population</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* City Info Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About {cityName}
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  {cityName} stands as a key exhibition destination in {countryName}, 
                  hosting dynamic trade shows and business events. Our verified exhibition stand builders 
                  combine innovative design with exceptional craftsmanship to create memorable brand 
                  experiences in this vibrant market.
                </p>
                <p>
                  {cityName} offers unique advantages for exhibition projects with its strategic 
                  location, skilled local builders, and growing business infrastructure. Local builders 
                  provide unmatched expertise in navigating venue requirements and regional preferences, 
                  ensuring cost-effective solutions and successful project execution.
                </p>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>City Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Local Builders</span>
                    <span className="font-semibold">{cityData.stats?.builderCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trade Shows</span>
                    <span className="font-semibold">{cityData.stats?.tradeShowCount || 0}</span>
                  </div>
                  {cityData.population && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population</span>
                      <span className="font-semibold">{cityData.population.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country</span>
                    <span className="font-semibold">{countryName}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Other Cities in Country Section - For Internal Linking */}
        {cityData.country.cities && cityData.country.cities.length > 1 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other Cities in {countryName}
            </h2>
            <p className="text-gray-600 mb-8">
              Explore exhibition stand builders in other major cities across {countryName}. 
              Each city offers unique advantages and local expertise for your trade show needs.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {cityData.country.cities
                .filter(city => city.citySlug !== citySlug) // Exclude current city
                .map((city) => (
                <Link
                  key={city._id}
                  href={`/exhibition-stands/${countrySlug}/${city.citySlug}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300">
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-5 w-5 mx-auto mb-2 text-blue-600 group-hover:text-blue-700" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 text-sm">
                        {city.cityName}
                      </h3>
                      {city.builderCount && city.builderCount > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          {city.builderCount} builders
                        </p>
                      )}
                      <p className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* SEO-friendly text links for other cities */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Exhibition Stand Services Across {countryName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cityData.country.cities
                  .filter(city => city.citySlug !== citySlug)
                  .map((city, index) => (
                  <span key={city._id}>
                    <Link
                      href={`/exhibition-stands/${countrySlug}/${city.citySlug}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {city.cityName} Exhibition Stands
                    </Link>
                    {index < cityData.country.cities.filter(c => c.citySlug !== citySlug).length - 1 && (
                      <span className="text-gray-400 ml-2">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trade Shows Section */}
        {cityData.tradeShows && cityData.tradeShows.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Trade Shows in {cityName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityData.tradeShows.slice(0, 6).map((tradeShow) => (
                <Card key={tradeShow._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{tradeShow.name}</CardTitle>
                    {tradeShow.venue && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {tradeShow.venue}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {tradeShow.description && (
                      <p className="text-sm text-gray-600 mb-4">{tradeShow.description}</p>
                    )}
                    {tradeShow.industry && (
                      <Badge variant="outline" className="mb-2">
                        {tradeShow.industry}
                      </Badge>
                    )}
                    {tradeShow.website && (
                      <div className="mt-4">
                        <a 
                          href={tradeShow.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Builders Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Exhibition Stand Builders in {cityName}
            </h2>
            {cityBuilders && cityBuilders.length > 12 && !showAllBuilders && (
              <Button 
                onClick={() => setShowAllBuilders(true)}
                variant="outline"
              >
                View All {cityBuilders.length} Builders
              </Button>
            )}
          </div>

          {!cityBuilders || cityBuilders.length === 0 ? (
            <Card className="p-8 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on adding exhibition stand builders specifically for {cityName}. 
                In the meantime, you can browse builders from {countryName}.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href={`/exhibition-stands/${countrySlug}`}>
                  <Button variant="outline">
                    Browse {countryName} Builders
                  </Button>
                </Link>
                <Button>Contact Us</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityBuilders.slice(0, showAllBuilders ? undefined : 12).map((builder) => (
                <Card key={builder._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          <Link 
                            href={`/builders/${builder.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {builder.companyName}
                          </Link>
                        </CardTitle>
                        {builder.headquartersCity && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {builder.headquartersCity}
                            {builder.headquartersCity !== cityName && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                                Serves {cityName}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      {builder.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {builder.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-medium">{builder.rating}</span>
                        </div>
                        {builder.reviewCount && (
                          <span className="text-sm text-gray-600">
                            ({builder.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      {builder.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{builder.phone}</span>
                        </div>
                      )}
                      {builder.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={builder.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      {builder.primaryEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{builder.primaryEmail}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/builders/${builder.slug}`}>
                        <Button className="w-full" size="sm">
                          View Profile & Get Quote
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need a Custom Exhibition Stand in {cityName}?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get quotes from multiple verified builders and compare prices instantly
          </p>
          <div className="flex gap-4 justify-center">
            <PublicQuoteRequest 
              location={countryName}
              countryCode={cityData.country.countryCode}
              cityName={cityName}
              buttonText="Get Local Quotes"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            />
            <Link href={`/exhibition-stands/${countrySlug}`}>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                Browse All {countryName} Builders
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

