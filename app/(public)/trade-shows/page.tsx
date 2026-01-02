"use client";

import { useState, useMemo } from "react";
import Navigation from "@/components/client/Navigation";
import Footer from "@/components/client/Footer";
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import { Button } from "@/components/shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { Input } from "@/components/shared/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import Link from "next/link";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiGlobe,
  FiStar,
  FiEye,
} from "react-icons/fi";
import {
  tradeShows,
  industries,
  tradeShowStats,
  TradeShowUtils,
} from "@/lib/data/tradeShows";
import { exhibitions as comprehensiveExhibitions } from "@/lib/data/exhibitions";

export default function TradeShowsDirectory() {
  console.log(
    "Trade Shows Directory: Page loaded with database",
    tradeShowStats
  );
  console.log(
    "Comprehensive Exhibitions loaded:",
    comprehensiveExhibitions.length
  );

  // Combine both tradeShows and comprehensive exhibitions
  const allExhibitions = useMemo(() => {
    // Convert comprehensive exhibitions to tradeShow format for compatibility
    const convertedExhibitions = comprehensiveExhibitions.map((exhibition) => ({
      id: exhibition.id,
      name: exhibition.name,
      slug: exhibition.slug,
      year: exhibition.year,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      venue: {
        name: exhibition.venue.name,
        address: exhibition.venue.address,
        totalSpace: exhibition.venue.totalSpace,
        hallCount: exhibition.venue.totalHalls,
        facilities: exhibition.venue.facilities,
        nearbyHotels: [],
        transportAccess: exhibition.venue.publicTransport,
        parkingSpaces: exhibition.venue.parkingSpaces,
        cateringOptions: [],
        wifiQuality: "Excellent",
        loadingBays: 0,
      },
      city: exhibition.city,
      country: exhibition.country,
      countryCode: exhibition.countryCode,
      industries: exhibition.industry ? [exhibition.industry] : [],
      description: exhibition.description,
      website: exhibition.website,
      expectedVisitors: exhibition.expectedAttendees,
      expectedExhibitors: exhibition.expectedExhibitors,
      standSpace: exhibition.totalSpace,
      ticketPrice: exhibition.registrationInfo?.visitorRegistration?.fee
        ? `${exhibition.registrationInfo.visitorRegistration.currency} ${exhibition.registrationInfo.visitorRegistration.fee}`
        : "Free",
      organizerName: exhibition.organizer.name,
      organizerContact: exhibition.organizer.email,
      isAnnual: true,
      significance: exhibition.featured ? "Major" : "Regional",
      builderRecommendations: [],
      previousEditionStats:
        exhibition.previousEditions?.length > 0
          ? {
              visitors: exhibition.previousEditions[0].attendees,
              exhibitors: exhibition.previousEditions[0].exhibitors,
              countries: exhibition.previousEditions[0].countries,
              feedback: exhibition.organizer.rating,
            }
          : undefined,
      whyExhibit: exhibition.keyFeatures || [],
      keyFeatures: exhibition.keyFeatures || [],
      targetAudience: exhibition.targetAudience || [],
      networkingOpportunities: exhibition.networkingOpportunities || [],
      costs: exhibition.pricing
        ? {
            standRental: {
              min: exhibition.pricing.standardBooth.min,
              max: exhibition.pricing.standardBooth.max,
              unit: exhibition.pricing.standardBooth.unit,
              currency: exhibition.pricing.standardBooth.currency,
            },
            services: {
              basicStand: 0,
              customStand: 0,
              premiumStand: 0,
            },
            additionalCosts: [],
          }
        : {
            standRental: { min: 0, max: 0, unit: "per sqm", currency: "USD" },
            services: { basicStand: 0, customStand: 0, premiumStand: 0 },
            additionalCosts: [],
          },
    }));

    // Combine and remove duplicates based on ID
    const combined = [...tradeShows, ...convertedExhibitions];
    const uniqueExhibitions = combined.filter(
      (exhibition, index, self) =>
        index === self.findIndex((e) => e.id === exhibition.id)
    );

    console.log(
      `Combined exhibitions: ${tradeShows.length} trade shows + ${convertedExhibitions.length} comprehensive exhibitions = ${uniqueExhibitions.length} total unique exhibitions`
    );

    return uniqueExhibitions;
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique countries and years from ALL exhibitions
  const countries = useMemo(() => {
    return Array.from(
      new Set(allExhibitions.map((show) => show.country))
    ).sort();
  }, [allExhibitions]);

  const years = useMemo(() => {
    return Array.from(new Set(allExhibitions.map((show) => show.year))).sort();
  }, [allExhibitions]);

  // Filter exhibitions based on search and filters
  const filteredShows = useMemo(() => {
    return allExhibitions.filter((show) => {
      const matchesSearch =
        searchTerm === "" ||
        show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry =
        selectedCountry === "all" || show.country === selectedCountry;
      const matchesIndustry =
        selectedIndustry === "all" ||
        show.industries.some((industry) => industry.slug === selectedIndustry);
      const matchesYear =
        selectedYear === "all" || show.year.toString() === selectedYear;

      return matchesSearch && matchesCountry && matchesIndustry && matchesYear;
    });
  }, [searchTerm, selectedCountry, selectedIndustry, selectedYear]);

  // Get upcoming shows from ALL exhibitions
  const upcomingShows = useMemo(() => {
    return allExhibitions
      .filter((show) => new Date(show.startDate) > new Date())
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 6);
  }, [allExhibitions]);

  // Get major shows by significance from ALL exhibitions
  const majorShows = useMemo(() => {
    return allExhibitions.filter((show) => show.significance === "Major");
  }, [allExhibitions]);

  // Enhanced statistics for ALL exhibitions (trade shows + comprehensive)
  const enhancedStats = useMemo(() => {
    const totalShows = allExhibitions.length;
    const totalCountries = countries.length;
    const totalIndustries = industries.length;
    const totalExpectedVisitors = allExhibitions.reduce(
      (sum, show) => sum + show.expectedVisitors,
      0
    );
    const totalExpectedExhibitors = allExhibitions.reduce(
      (sum, show) => sum + show.expectedExhibitors,
      0
    );

    return {
      totalShows,
      totalCountries,
      totalCities: Array.from(new Set(allExhibitions.map((show) => show.city)))
        .length,
      totalIndustries,
      totalExpectedVisitors,
      totalExpectedExhibitors,
      averageShowSize: Math.round(totalExpectedVisitors / totalShows),
      upcomingCount: upcomingShows.length,
      majorCount: majorShows.length,
      regionalCount: allExhibitions.filter((s) => s.significance === "Regional")
        .length,
      countryBreakdown: countries.reduce(
        (acc, country) => {
          acc[country] = allExhibitions.filter(
            (s) => s.country === country
          ).length;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }, [allExhibitions, countries, upcomingShows, majorShows]);

  console.log("Enhanced trade show stats with ALL exhibitions:", enhancedStats);

  return (
    <div
      className="font-inter min-h-screen bg-background-gray"
      data-macaly="trade-shows-main-container"
    >
      <Navigation />

      {/* Professional Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-deep-navy via-gray-800 to-primary-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <FiTrendingUp className="w-4 h-4 mr-2 text-industry-green" />
              Professional Trade Show Database
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              data-macaly="hero-title"
            >
              Global Trade Shows
              <span className="block text-primary-blue bg-gradient-to-r from-primary-blue to-industry-green bg-clip-text text-transparent">
                &amp; Exhibitions Directory
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              data-macaly="hero-description"
            >
              Access {enhancedStats.totalShows}+ verified trade shows across{" "}
              {enhancedStats.totalCountries} countries. Connect with exhibition
              stand builders and maximize your ROI at industry-leading events.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-lg mb-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-primary-blue/20 rounded-full flex items-center justify-center">
                  <FiCalendar className="text-primary-blue w-6 h-6" />
                </div>
                <span className="font-semibold">
                  {enhancedStats.totalShows}+
                </span>
                <span className="text-gray-300 text-sm">Trade Shows</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-industry-green/20 rounded-full flex items-center justify-center">
                  <FiMapPin className="text-industry-green w-6 h-6" />
                </div>
                <span className="font-semibold">
                  {enhancedStats.totalCountries}
                </span>
                <span className="text-gray-300 text-sm">Countries</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-warning-orange/20 rounded-full flex items-center justify-center">
                  <FiUsers className="text-warning-orange w-6 h-6" />
                </div>
                <span className="font-semibold">
                  {(enhancedStats.totalExpectedVisitors / 1000000).toFixed(1)}M+
                </span>
                <span className="text-gray-300 text-sm">Visitors</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="text-purple-400 w-6 h-6" />
                </div>
                <span className="font-semibold">
                  {enhancedStats.totalIndustries}
                </span>
                <span className="text-gray-300 text-sm">Industries</span>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            {/* Search removed per request */}
          </div>
        </div>
      </section>

      {/* Professional Statistics Banner */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-primary-blue">
                {enhancedStats.totalShows}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Shows
              </div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-industry-green">
                {enhancedStats.upcomingCount}
              </div>
              <div className="text-sm text-gray-600 font-medium">Upcoming</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-warning-orange">
                {enhancedStats.majorCount}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Major Events
              </div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-deep-navy">
                {enhancedStats.totalCountries}
              </div>
              <div className="text-sm text-gray-600 font-medium">Countries</div>
            </div>
            <div className="border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-purple-600">
                {enhancedStats.totalIndustries}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Industries
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {(enhancedStats.totalExpectedVisitors / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Visitors
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Filters */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
              >
                <FiFilter className="w-4 h-4" />
                Advanced Filters
                {(selectedCountry !== "all" ||
                  selectedIndustry !== "all" ||
                  selectedYear !== "all") && (
                  <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded-full ml-1">
                    {
                      [selectedCountry, selectedIndustry, selectedYear].filter(
                        (f) => f !== "all"
                      ).length
                    }
                  </span>
                )}
              </Button>
              <div className="text-gray-600 font-medium">
                <span className="text-primary-blue font-bold">
                  {filteredShows.length}
                </span>{" "}
                of {allExhibitions.length} exhibitions
              </div>
            </div>

            {(showFilters ||
              selectedCountry !== "all" ||
              selectedIndustry !== "all" ||
              selectedYear !== "all") && (
              <div className="flex flex-wrap gap-4">
                <Select
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Countries ({countries.length})
                    </SelectItem>
                    {countries.map((country) => {
                      const count =
                        enhancedStats.countryBreakdown[country] || 0;
                      return (
                        <SelectItem key={country} value={country}>
                          {country} ({count})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="w-48 border-gray-300">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((industry) => {
                      const count = allExhibitions.filter(
                        (show) =>
                          show.industries &&
                          show.industries.some(
                            (ind) => ind.slug === industry.slug
                          )
                      ).length;
                      return (
                        <SelectItem key={industry.slug} value={industry.slug}>
                          {industry.icon} {industry.name} ({count})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32 border-gray-300">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => {
                      const count = allExhibitions.filter(
                        (s) => s.year === year
                      ).length;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year} ({count})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {(selectedCountry !== "all" ||
                  selectedIndustry !== "all" ||
                  selectedYear !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCountry("all");
                      setSelectedIndustry("all");
                      setSelectedYear("all");
                    }}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Major Upcoming Shows - Enhanced */}
      {searchTerm === "" &&
        selectedCountry === "all" &&
        selectedIndustry === "all" && (
          <section className="py-16 bg-background-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-primary-blue/10 rounded-full text-primary-blue text-sm font-medium mb-4">
                  <FiStar className="w-4 h-4 mr-2" />
                  Premier Exhibitions
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-deep-navy mb-4"
                  data-macaly="major-shows-title"
                >
                  Major International Trade Shows
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Industry-leading exhibitions featuring global audiences, major
                  exhibitors, and exceptional networking opportunities.
                  Featuring {majorShows.length} major events across{" "}
                  {enhancedStats.totalCountries} countries.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {majorShows.slice(0, 6).map((show) => (
                  <Link
                    key={show.id}
                    href={`/trade-shows/${show.slug}`}
                    className="group"
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border-0 shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: show.industries[0]?.color + "15",
                              color: show.industries[0]?.color,
                              border: `1px solid ${show.industries[0]?.color}30`,
                            }}
                            className="font-medium"
                          >
                            {show.industries[0]?.icon}{" "}
                            {show.industries[0]?.name}
                          </Badge>
                          <div className="flex gap-1">
                            <Badge
                              variant="outline"
                              className="bg-warning-orange/10 text-warning-orange border-warning-orange/30"
                            >
                              {show.significance}
                            </Badge>
                            {new Date(show.startDate) > new Date() && (
                              <Badge className="bg-industry-green text-white">
                                Upcoming
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary-blue transition-colors font-bold">
                          {show.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <FiMapPin className="w-4 h-4 mr-3 text-primary-blue" />
                            <span className="font-medium">
                              {show.city}, {show.country}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4 mr-3 text-primary-blue" />
                            <span>
                              {TradeShowUtils.formatDate(show.startDate)} -{" "}
                              {TradeShowUtils.formatDate(show.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiUsers className="w-4 h-4 mr-3 text-primary-blue" />
                            <span className="font-medium">
                              {show.expectedVisitors.toLocaleString()}
                            </span>{" "}
                            expected visitors
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FiEye className="w-4 h-4 mr-3 text-primary-blue" />
                            <span className="font-medium">
                              {show.expectedExhibitors.toLocaleString()}
                            </span>{" "}
                            exhibitors
                          </div>
                          <p className="text-gray-700 text-sm line-clamp-2 mt-3">
                            {show.description}
                          </p>
                          {show.previousEditionStats && (
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <FiStar className="w-4 h-4 mr-2 text-warning-orange" />
                              <span>
                                Previous edition:{" "}
                                <span className="font-medium">
                                  {show.previousEditionStats.feedback}/5
                                </span>{" "}
                                rating
                              </span>
                            </div>
                          )}
                          <div className="pt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue transition-all"
                            >
                              View Exhibition Details
                              <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {majorShows.length > 6 && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCountry("all")}
                    className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
                  >
                    View All {majorShows.length} Major Exhibitions
                    <FiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

      {/* All Trade Shows Grid - Enhanced */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
              {filteredShows.length > 0
                ? `${filteredShows.length} Professional Trade Shows`
                : "No Exhibitions Found"}
            </h2>
            {filteredShows.length > 0 && (
              <p className="text-lg text-gray-600">
                Comprehensive exhibition database with detailed information,
                costs, and builder recommendations.
                {selectedCountry !== "all" &&
                  ` Showing events in ${selectedCountry}.`}
                {selectedIndustry !== "all" &&
                  ` Filtered by ${industries.find((i) => i.slug === selectedIndustry)?.name}.`}
              </p>
            )}
          </div>

          {filteredShows.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredShows.map((show) => {
                  const isUpcoming = new Date(show.startDate) > new Date();
                  const duration = TradeShowUtils.calculateDuration(
                    show.startDate,
                    show.endDate
                  );

                  return (
                    <Link
                      key={show.id}
                      href={`/trade-shows/${show.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor:
                                  show.industries[0]?.color + "15",
                                color: show.industries[0]?.color,
                              }}
                              className="text-xs font-medium"
                            >
                              {show.industries[0]?.icon}{" "}
                              {show.industries[0]?.name}
                            </Badge>
                            <div className="flex gap-1">
                              {show.significance === "Major" && (
                                <FiStar className="w-4 h-4 text-warning-orange" />
                              )}
                              {isUpcoming && (
                                <Badge className="bg-industry-green text-white text-xs">
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary-blue transition-colors font-semibold">
                            {show.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <FiMapPin className="w-3 h-3 mr-2 text-primary-blue" />
                              {show.city}, {show.country}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiCalendar className="w-3 h-3 mr-2 text-primary-blue" />
                              {TradeShowUtils.formatDate(show.startDate)} (
                              {duration}d)
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiUsers className="w-3 h-3 mr-2 text-primary-blue" />
                              {(show.expectedVisitors / 1000).toFixed(0)}K
                              visitors
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiGlobe className="w-3 h-3 mr-2 text-primary-blue" />
                              {show.venue.name}
                            </div>
                            {show.previousEditionStats && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FiStar className="w-3 h-3 mr-2 text-warning-orange" />
                                {show.previousEditionStats.feedback}/5 rating
                              </div>
                            )}
                            <p className="text-gray-700 text-xs line-clamp-2 mt-2">
                              {show.description}
                            </p>
                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs group-hover:bg-primary-blue group-hover:text-white transition-all"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Load more if there are many results */}
              {filteredShows.length > 20 && (
                <div className="text-center mt-12">
                  <p className="text-gray-600 mb-4 font-medium">
                    Showing {Math.min(20, filteredShows.length)} of{" "}
                    {filteredShows.length} exhibitions
                  </p>
                  <Button
                    variant="outline"
                    className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
                  >
                    Load More Exhibitions
                    <FiArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No exhibitions found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find relevant
                trade shows.
                {searchTerm && ` No results for "${searchTerm}".`}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCountry("all");
                  setSelectedIndustry("all");
                  setSelectedYear("all");
                }}
                className="bg-primary-blue hover:bg-blue-dark text-white"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Industry Categories - Professional Enhancement */}
      {searchTerm === "" && selectedIndustry === "all" && (
        <section className="py-16 bg-background-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-industry-green/10 rounded-full text-industry-green text-sm font-medium mb-4">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                Industry Sectors
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
                Browse by Industry Sector
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore exhibitions across {industries.length} major industry
                sectors, featuring {enhancedStats.totalShows}
                international trade shows with detailed market insights and
                growth analytics.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry) => {
                const industryShows = allExhibitions.filter(
                  (show) =>
                    show.industries &&
                    show.industries.some((ind) => ind.slug === industry.slug)
                );
                const majorIndustryShows = industryShows.filter(
                  (s) => s.significance === "Major"
                ).length;
                return (
                  <Card
                    key={industry.id}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:-translate-y-1"
                    onClick={() => setSelectedIndustry(industry.slug)}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: industry.color + "15" }}
                        >
                          {industry.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold text-deep-navy">
                            {industry.name}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            {industryShows.length} exhibitions •{" "}
                            {majorIndustryShows} major events
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {industry.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Annual Growth:</span>
                          <span className="font-semibold text-industry-green">
                            +{industry.annualGrowthRate}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">
                            Avg. Booth Cost:
                          </span>
                          <span className="font-semibold text-deep-navy">
                            €{industry.averageBoothCost}/m²
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-600">Top Markets:</span>
                          <span className="font-semibold text-xs text-right">
                            {industry.popularCountries.slice(0, 2).join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all"
                        >
                          View {industryShows.length} {industry.name} Shows
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Professional Statistics Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-deep-navy/10 rounded-full text-deep-navy text-sm font-medium mb-4">
              <FiGlobe className="w-4 h-4 mr-2" />
              Global Exhibition Network
            </div>
            <h2 className="text-3xl font-bold text-deep-navy mb-4">
              Comprehensive Market Intelligence
            </h2>
            <p className="text-lg text-gray-600">
              Real-time data and analytics from the world's largest trade show
              database
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-primary-blue" />
                </div>
                <div className="text-3xl font-bold text-primary-blue mb-2">
                  {enhancedStats.totalExpectedVisitors.toLocaleString()}
                </div>
                <div className="text-gray-600 font-medium">
                  Total Expected Visitors
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Across all exhibitions
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-industry-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrendingUp className="w-8 h-8 text-industry-green" />
                </div>
                <div className="text-3xl font-bold text-industry-green mb-2">
                  {enhancedStats.totalExpectedExhibitors.toLocaleString()}
                </div>
                <div className="text-gray-600 font-medium">
                  Total Exhibitors
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Global participation
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-warning-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiEye className="w-8 h-8 text-warning-orange" />
                </div>
                <div className="text-3xl font-bold text-warning-orange mb-2">
                  {enhancedStats.averageShowSize.toLocaleString()}
                </div>
                <div className="text-gray-600 font-medium">
                  Average Show Size
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Visitors per event
                </div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiGlobe className="w-8 h-8 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {enhancedStats.totalIndustries}
                </div>
                <div className="text-gray-600 font-medium">
                  Industry Sectors
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Comprehensive coverage
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional CTA Section */}
      <section className="py-16 bg-gradient-to-br from-deep-navy via-gray-800 to-primary-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <FiStar className="w-4 h-4 mr-2" />
            Ready to Exhibit?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Connect with Professional Exhibition Stand Builders
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Access our vetted network of experienced exhibition contractors who
            specialize in your target shows. Get competitive quotes, expert
            guidance, and maximize your exhibition ROI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary-blue hover:bg-blue-dark text-white px-8 py-4 text-lg"
              >
                <FiUsers className="w-5 h-5 mr-2" />
                Find Exhibition Builders
              </Button>
            </Link>
            <Link href="/exhibition-stands">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-deep-navy px-8 py-4 text-lg"
              >
                <FiGlobe className="w-5 h-5 mr-2" />
                Browse by Location
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            Trusted by 10,000+ exhibitors worldwide • 98% customer satisfaction
            rate
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
