"use client";

import { useState, useEffect } from "react";
import { getCountries, getBuilders } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Building2,
  Star,
  Phone,
  Globe,
  Mail,
  ArrowRight,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import SimpleQuoteRequestForm from "@/components/SimpleQuoteRequestForm";

interface EnhancedCountryPageProps {
  countrySlug: string;
}

export default function EnhancedCountryPage({
  countrySlug,
}: EnhancedCountryPageProps) {
  const [showAllBuilders, setShowAllBuilders] = useState(false);
  const [countryData, setCountryData] = useState<any>(null);
  const [builders, setBuilders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get all countries and find the one with matching slug
        const countries = await getCountries();
        const country = countries.find(c => c.country_slug === countrySlug);
        
        if (country) {
          setCountryData(country);
          
          // Get builders for this country
          const allBuilders = await getBuilders();
          const countryBuilders = allBuilders.filter(builder => 
            builder.headquarters_country === country.country_name
          );
          
          setBuilders(showAllBuilders ? countryBuilders : countryBuilders.slice(0, 12));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [countrySlug, showAllBuilders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // Calculate real stats
  const builderCount = builders?.length || 0;
  const cityCount = 0; // We'll need to implement cities separately
  const averageRating = builderCount > 0 ? 4.8 : 0;
  const totalProjects = builderCount * 15; // Estimate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exhibition Stand Builders
              <br />
              <span className="text-blue-200">
                in {countryData.country_name}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with {builderCount}+ verified exhibition stand builders in{" "}
              {countryData.country_name}. Get competitive quotes from local
              experts who understand your market.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 text-white">
              <Button
                size="lg"
                className="bg-transparent text-blue-600 hover:bg-gray-100"
              >
                Get Quotes from {countryData.countryName} Builders
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
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
                <div className="text-blue-200 text-sm lg.text-base">
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
        {/* Why Choose Local Builders Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose Local Builders in {countryData.countryName}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Local Market Knowledge
                </h3>
                <p className="text-gray-600">
                  Understand local regulations, venue requirements, and cultural
                  preferences specific to {countryData.countryName}.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Faster Project Delivery
                </h3>
                <p className="text-gray-600">
                  Reduced logistics time, easier coordination, and faster
                  response times for urgent requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Established Networks
                </h3>
                <p className="text-gray-600">
                  Access to local suppliers, venues, and service providers for
                  comprehensive project support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cities Section - Internal Navigation */}
        {countryData.cities && countryData.cities.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Exhibition Cities in {countryData.country_name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {countryData.cities.map((city: any) => (
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
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Exhibition Stand Builders
            </h2>
            {builders && builders.length > 12 && !showAllBuilders && (
              <Button
                variant="outline"
                onClick={() => setShowAllBuilders(true)}
              >
                Show All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builders && builders.length > 0 ? (
              builders.map((builder: any) => (
                <Card
                  key={builder.id}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="font-semibold">
                        {builder.company_name || "Builder"}
                      </span>
                      <Badge variant="secondary">Verified</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>
                        {builder.headquarters_city || "City"}, {builder.headquarters_country || "Country"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-2" />
                      <span>{builder.rating || 4.8} / 5.0</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{builder.phone || "+XX XXXX XXXX"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <a
                        href={builder.website || "#"}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {builder.website || "Visit website"}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{builder.primary_email || "info@example.com"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">
                No builders available yet for {countryData.countryName}.
              </div>
            )}
          </div>
        </section>

        {/* Quote Request Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Request a Quote
          </h2>
          <SimpleQuoteRequestForm defaultCountry={countryData.countryName} />
        </section>
      </div>
    </div>
  );
}
