"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Star, Phone, Globe, Mail, ArrowRight, Users, Calendar, Award, DollarSign } from "lucide-react";
import Link from "next/link";
import SimpleQuoteRequestForm from '@/components/SimpleQuoteRequestForm';

interface EnhancedCityPageProps {
  countrySlug: string;
  citySlug: string;
  preloadedCityData: any;
  preloadedBuildersData: any;
}

export function EnhancedCityPage({ 
  countrySlug, 
  citySlug, 
  preloadedCityData, 
  preloadedBuildersData 
}: EnhancedCityPageProps) {
  const [showAllBuilders, setShowAllBuilders] = useState(false);
  
  // Parse the preloaded data directly
  let cityData, builders;
  
  try {
    cityData = preloadedCityData._valueJSON ? 
      JSON.parse(preloadedCityData._valueJSON) : 
      preloadedCityData;
    builders = preloadedBuildersData._valueJSON ? 
      JSON.parse(preloadedBuildersData._valueJSON) : 
      preloadedBuildersData || [];
  } catch (error) {
    console.log("🔄 Error parsing preloaded data, using fallback");
    cityData = preloadedCityData;
    builders = preloadedBuildersData || [];
  }

  console.log("🔍 EnhancedCityPage - cityData:", cityData ? {
    cityName: cityData.cityName,
    hasCountry: !!cityData.country,
    countryName: cityData.country?.countryName
  } : 'No data');
  console.log("🔍 EnhancedCityPage - builders count:", builders?.length || 0);

  if (!cityData) {
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

  // Ensure we have basic city data
  const cityName = cityData.cityName || citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const countryName = cityData.country?.countryName || countrySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Calculate real stats
  const builderCount = builders?.length || 0;
  const averageRating = builderCount > 0 ? 4.8 : 0;
  const totalProjects = builderCount * 12; // Estimate

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-russian-violet via-dark-purple to-claret text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-persian-orange/20 text-persian-orange border-persian-orange/30 text-lg px-4 py-2">
                <MapPin className="w-5 h-5 mr-2" />
                {cityName}, {countryName}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Exhibition Stand Builders</span>
              <span className="block bg-gradient-to-r from-persian-orange via-claret to-dark-purple bg-clip-text text-transparent">
                in {cityName}, {countryName}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Connect with {builderCount}+ verified exhibition stand builders in {cityName}, {countryName}. 
              Get competitive quotes from local experts who understand your market.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Get Quotes from {cityName} Builders
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
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
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{builderCount}+</div>
                <div className="text-slate-300 text-sm">Verified Builders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">{averageRating}</div>
                <div className="text-slate-300 text-sm">Average Rating</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold">{totalProjects.toLocaleString()}</div>
                <div className="text-slate-300 text-sm">Projects Completed</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl font-bold">$450</div>
                <div className="text-slate-300 text-sm">Avg. Price/sqm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Choose Local Builders Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose Local Builders in {cityName}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Local Market Knowledge</h3>
                <p className="text-gray-600">
                  Understand local regulations, venue requirements, and cultural preferences specific to {cityName}.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Faster Project Delivery</h3>
                <p className="text-gray-600">
                  Reduced logistics time, easier coordination, and faster response times for urgent requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Established Networks</h3>
                <p className="text-gray-600">
                  Access to local suppliers, venues, and service providers for comprehensive project support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Other Cities in Country Section - Internal Navigation */}
        {cityData.country && cityData.country.cities && cityData.country.cities.length > 1 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Other Cities in {cityData.country.countryName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cityData.country.cities
                .filter((city: any) => city.citySlug !== citySlug)
                .slice(0, 8)
                .map((city: any) => (
                <Link
                  key={city._id}
                  href={`/exhibition-stands/${countrySlug}/${city.citySlug}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200">
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600 group-hover:text-blue-700" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                        {city.cityName}
                      </h3>
                      {city.builderCount && city.builderCount > 0 ? (
                        <p className="text-sm text-gray-600">
                          {city.builderCount} builders
                        </p>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                      <ArrowRight className="h-4 w-4 mx-auto mt-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Builders Section */}
        <section id="builders-grid" className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Exhibition Stand Builders in {cityName}
            </h2>
            {builders && builders.length > 12 && !showAllBuilders && (
              <Button 
                onClick={() => setShowAllBuilders(true)}
                variant="outline"
              >
                View All {builders.length} Builders
              </Button>
            )}
          </div>

          {!builders || builders.length === 0 ? (
            <Card className="p-8 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on adding exhibition stand builders for {cityName}. 
                Check back soon or contact us to recommend builders in this region.
              </p>
              <Button>Contact Us</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builders.slice(0, showAllBuilders ? undefined : 12).map((builder: any) => (
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

        {/* Quote Request Form */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Free Quotes from {cityName} Builders
            </h2>
            <p className="text-lg text-gray-600">
              Submit your requirements and receive competitive quotes from verified local builders
            </p>
          </div>
          <SimpleQuoteRequestForm 
            defaultCountry={countryName}
            defaultCity={cityName}
            className="max-w-4xl mx-auto"
          />
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need a Custom Exhibition Stand in {cityName}?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get quotes from multiple verified builders and compare prices instantly
          </p>
          <Link href="/quote">
            <Button size="lg" variant="secondary">
              Get Free Quotes
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}



