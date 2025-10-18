"use client";

import { useState } from "react";
import { usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Star, Phone, Globe, Mail } from "lucide-react";
import Link from "next/link";
import { Preloaded } from "convex/react";
import PublicQuoteRequest from "@/components/PublicQuoteRequest";

interface EnhancedCountryPageClientProps {
  countrySlug: string;
  preloadedCountryData: Preloaded<typeof api.locations.getCountryBySlug>;
  preloadedBuildersData: Preloaded<typeof api.locations.getBuildersForLocation>;
}

export default function EnhancedCountryPageClient({
  countrySlug,
  preloadedCountryData,
  preloadedBuildersData,
}: EnhancedCountryPageClientProps) {
  const [showAllBuilders, setShowAllBuilders] = useState(false);

  // Use preloaded data for SSR
  const countryData = usePreloadedQuery(preloadedCountryData);
  const initialBuilders = usePreloadedQuery(preloadedBuildersData);

  if (!countryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Country Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The requested country could not be found.
          </p>
          <Link href="/exhibition-stands">
            <Button>Browse All Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const builders = initialBuilders || [];
  const builderCount = builders.length;
  const averageRating =
    builderCount > 0
      ? Math.round(
          (builders.reduce(
            (sum: number, b: any) => sum + (b.rating || 4.8),
            0
          ) /
            builderCount) *
            10
        ) / 10
      : 4.8;
  const totalProjects = builderCount * 15; // stable estimate to avoid locale formatting drift

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section - align with city/country unified style */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exhibition Stand Builders
              <br />
              <span className="text-blue-200">
                in {countryData.countryName}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with {builderCount}+ verified exhibition stand builders in{" "}
              {countryData.countryName}. Get competitive quotes from local
              experts who understand your market.
            </p>
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <PublicQuoteRequest
                location={countryData.countryName}
                countryCode={countryData.countryCode}
                buttonText={`Get Quotes from ${countryData.countryName} Builders`}
                className="text-lg px-8 py-4"
              />
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                onClick={() =>
                  document
                    .getElementById("country-builders-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse Local Builders
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">
                  {builderCount}+
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Verified Builders
                </div>
              </div>
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">
                  {averageRating}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Average Rating
                </div>
              </div>
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">
                  {totalProjects}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Projects Completed
                </div>
              </div>
              <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl lg:text-4xl font-bold text-white">
                  $450
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Avg. Price/sqm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cities Section - Enhanced for SEO */}
        {countryData.cities && countryData.cities.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exhibition Stand Builders by City in {countryData.countryName}
            </h2>
            <p className="text-gray-600 mb-8">
              Find verified exhibition stand builders in major cities across{" "}
              {countryData.countryName}. Click on any city to view local
              builders and get competitive quotes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Filter out Düsseldorf but keep Dusseldorf */}
              {countryData.cities
                .filter((city: any) => {
                  // Keep "Dusseldorf" but remove "Düsseldorf" (with umlaut)
                  return city.cityName !== "Düsseldorf";
                })
                .filter(
                  (city: any, index: number, self: any[]) =>
                    index ===
                    self.findIndex((c: any) => c.citySlug === city.citySlug)
                )
                .map((city: any) => (
                  <Link
                    key={city._id}
                    href={`/exhibition-stands/${countrySlug}/${city.citySlug}`}
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300">
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600 group-hover:text-blue-700" />
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

            {/* SEO-friendly text links */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Cities for Exhibition Stands in{" "}
                {countryData.countryName}
              </h3>
              <div className="flex flex-wrap gap-2">
                {countryData.cities
                  .filter((city: any) => city.cityName !== "Düsseldorf")
                  .filter(
                    (city: any, index: number, self: any[]) =>
                      index ===
                      self.findIndex((c: any) => c.citySlug === city.citySlug)
                  )
                  .map((city: any, index: number, filteredCities: any[]) => (
                    <span key={city._id}>
                      <Link
                        href={`/exhibition-stands/${countrySlug}/${city.citySlug}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Exhibition Stands in {city.cityName}
                      </Link>
                      {index < filteredCities.length - 1 && (
                        <span className="text-gray-400 ml-2">•</span>
                      )}
                    </span>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Builders Section */}
        <section id="country-builders-grid">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Exhibition Stand Builders
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
                We're working on adding exhibition stand builders for{" "}
                {countryData.countryName}. Check back soon or contact us to
                recommend builders in this region.
              </p>
              <Button>Contact Us</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builders
                .slice(0, showAllBuilders ? undefined : 12)
                .map((builder) => (
                  <Card
                    key={builder._id}
                    className="hover:shadow-lg transition-shadow"
                  >
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
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
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
                            <span className="ml-1 font-medium">
                              {builder.rating}
                            </span>
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
            Need a Custom Exhibition Stand in {countryData.countryName}?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get quotes from multiple verified builders and compare prices
            instantly
          </p>
          <div className="flex gap-4 justify-center">
            <PublicQuoteRequest
              location={countryData.countryName}
              countryCode={countryData.countryCode}
              buttonText="Get Local Quotes"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            />
            <Link href="/quote">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
              >
                Browse All Options
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
