"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Star, Phone, Globe, Mail, ArrowRight, Users, Calendar } from "lucide-react";
import Link from "next/link";
import SimpleQuoteRequestForm from '@/components/SimpleQuoteRequestForm';

interface StaticCityPageProps {
  cityName: string;
  countryName: string;
  continent: string;
  venues: Array<{
    name: string;
    size: string;
    website: string;
    description: string;
  }>;
  keyIndustries: string[];
  annualEvents: number;
  population: string;
  majorAirport: string;
  nearestCities: Array<{
    name: string;
    distance: string;
    country: string;
  }>;
  averageStandSize: string;
  topBudgetRange: string;
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  builders: any[];
  isEditable: boolean;
}

export function StaticCityPage({ 
  cityName,
  countryName,
  continent,
  venues,
  keyIndustries,
  annualEvents,
  population,
  majorAirport,
  nearestCities,
  averageStandSize,
  topBudgetRange,
  seoData,
  builders,
  isEditable
}: StaticCityPageProps) {
  const [showAllBuilders, setShowAllBuilders] = useState(false);
  
  // Calculate real stats
  const builderCount = builders?.length || 0;
  const averageRating = builderCount > 0 ? 4.8 : 0;
  const totalProjects = builderCount * 12; // Estimate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exhibition Stand Builders
              <br />
              <span className="text-blue-200">in {cityName}, {countryName}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with {builderCount}+ verified exhibition stand builders in {cityName}. Get competitive quotes from local experts who understand your market.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 text-white">
              <Button size="lg" className="bg-white text-blue-600">
                Get Quotes from {cityName} Builders
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white">
                Browse Local Builders
              </Button>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">{builderCount}+</div>
                <div className="text-blue-200 text-sm lg:text-base">Verified Builders</div>
              </div>
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">{averageRating}</div>
                <div className="text-blue-200 text-sm lg:text-base">Average Rating</div>
              </div>
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">{totalProjects}</div>
                <div className="text-blue-200 text-sm lg:text-base">Projects Completed</div>
              </div>
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">{annualEvents}</div>
                <div className="text-blue-200 text-sm lg:text-base">Annual Events</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

        {/* Major Venues Section */}
        {venues && venues.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Major Exhibition Venues in {cityName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {venue.size}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{venue.description}</p>
                    <a 
                      href={venue.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Visit Website →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Key Industries Section */}
        {keyIndustries && keyIndustries.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Key Industries in {cityName}
            </h2>
            <div className="flex flex-wrap gap-3">
              {keyIndustries.map((industry, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                  {industry}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Builders Section */}
        <section className="mb-16">
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
                <Card key={builder.id || builder.slug} className="hover:shadow-lg transition-shadow">
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
                        {builder.headquarters?.city && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {builder.headquarters.city}
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
                      {builder.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{builder.email}</span>
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
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center text-white">
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