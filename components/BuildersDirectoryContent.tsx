"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SlidingHeroSection from "@/components/SlidingHeroSection";
import TradeStyleBanner from "@/components/TradeStyleBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import {
  FiMapPin,
  FiStar,
  FiUsers,
  FiClock,
  FiSearch,
  FiFilter,
  FiArrowRight,
  FiShield,
  FiAward,
  FiEye,
  FiPhone,
  FiMail,
  FiGlobe,
} from "react-icons/fi";
import { builderStats } from "@/lib/data/exhibitionBuilders";
import { unifiedPlatformAPI } from "@/lib/data/unifiedPlatformData";
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export default function BuildersDirectoryContent() {
  console.log(
    "🚀 Builders Directory: Page loaded, initializing with database connection"
  );

  // Load saved content for /builders
  const [saved, setSaved] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/pages-editor?action=get-content&path=%2Fbuilders', { cache: 'no-store' });
        const data = await res.json();
        if (data?.success && data?.data) setSaved(data.data);
      } catch {}
    })();
  }, []);

  // Get real-time data from unified platform
  const [realTimeBuilders, setRealTimeBuilders] = useState<any[]>([]);
  const [realTimeStats, setRealTimeStats] = useState(builderStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial real-time data
    const loadRealTimeData = async () => {
      setLoading(true);
      try {
        console.log("🔄 Loading real-time builder data from Convex...");

        // Import Convex client and API
        const { ConvexHttpClient } = await import("convex/browser");
        const { api } = await import("@/convex/_generated/api");

        const convexUrl =
          process.env.NEXT_PUBLIC_CONVEX_URL ||
          "https://tame-labrador-80.convex.cloud";
        const convex = new ConvexHttpClient(convexUrl);

        // Fetch builders from Convex
        const buildersData = await convex.query(api.builders.getAllBuilders, {
          limit: 1000,
          offset: 0,
        });

        console.log("📡 Raw Convex response:", buildersData);
        console.log("📊 Response structure:", {
          hasData: !!buildersData,
          hasBuilders: !!buildersData?.builders,
          isArray: Array.isArray(buildersData?.builders),
          length: buildersData?.builders?.length,
          total: buildersData?.total,
        });

        if (
          buildersData &&
          buildersData.builders &&
          Array.isArray(buildersData.builders) &&
          buildersData.builders.length > 0
        ) {
          const allBuilders = buildersData.builders;
          console.log(`✅ Loaded ${allBuilders.length} builders from Convex`);
          console.log(
            "🔍 First 3 builders:",
            allBuilders.slice(0, 3).map((b) => ({
              id: b._id,
              name: b.companyName,
              city: b.headquartersCity,
              country: b.headquartersCountry,
              source: b.source,
              gmbImported: b.gmbImported || b.importedFromGMB,
            }))
          );

          // Convert to public display format - SHOW ALL BUILDERS INCLUDING GMB IMPORTED
          const publicBuilders = allBuilders.map((builder: any) => ({
            id: builder._id,
            companyName: builder.companyName,
            slug:
              builder.slug ||
              builder.companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            logo: builder.logo || "/images/builders/default-logo.png",
            establishedYear: builder.establishedYear || 2020,
            headquarters: {
              city: builder.headquartersCity || "Unknown",
              country: builder.headquartersCountry || "Unknown",
              countryCode: builder.headquartersCountryCode || "XX",
              address: builder.headquartersAddress || "",
              latitude: builder.headquartersLatitude || 0,
              longitude: builder.headquartersLongitude || 0,
              isHeadquarters: true,
            },
            serviceLocations: [
              {
                // Default service location based on headquarters
                city: builder.headquartersCity || "Unknown",
                country: builder.headquartersCountry || "Unknown",
                countryCode: builder.headquartersCountryCode || "XX",
                address: builder.headquartersAddress || "",
                latitude: builder.headquartersLatitude || 0,
                longitude: builder.headquartersLongitude || 0,
                isHeadquarters: false,
              },
            ],
            contactInfo: {
              primaryEmail: builder.primaryEmail || "",
              phone: builder.phone || "",
              website: builder.website || "",
              contactPerson: builder.contactPerson || "Contact Person",
              position: builder.position || "Manager",
            },
            services: [
              {
                // Default service
                id: "main-service",
                name: "Exhibition Services",
                description: "Professional exhibition services",
                category: "Design",
                priceFrom: 300,
                currency: "USD",
                unit: "per sqm",
                popular: true,
                turnoverTime: "4-6 weeks",
              },
            ],
            specializations: [
              {
                // Default specialization
                id: "general",
                name: "Exhibition Builder",
                slug: "general",
                description: "Professional services",
                subcategories: [],
                color: "#3B82F6",
                icon: "🏗️",
                annualGrowthRate: 8.5,
                averageBoothCost: 450,
                popularCountries: [],
              },
            ],
            certifications: [],
            awards: [],
            portfolio: [],
            teamSize: builder.teamSize || 10,
            projectsCompleted: builder.projectsCompleted || 25,
            rating: builder.rating || 4.0,
            reviewCount: builder.reviewCount || 50,
            responseTime: builder.responseTime || "Within 24 hours",
            languages: builder.languages || ["English"],
            verified: builder.verified || false,
            premiumMember: builder.premiumMember || false,
            tradeshowExperience: [],
            priceRange: {
              basicStand: {
                min: builder.basicStandMin || 200,
                max: builder.basicStandMax || 300,
                currency: builder.currency || "USD",
                unit: "per sqm",
              },
              customStand: {
                min: builder.customStandMin || 400,
                max: builder.customStandMax || 600,
                currency: builder.currency || "USD",
                unit: "per sqm",
              },
              premiumStand: {
                min: builder.premiumStandMin || 700,
                max: builder.premiumStandMax || 1000,
                currency: builder.currency || "USD",
                unit: "per sqm",
              },
              averageProject: builder.averageProject || 25000,
              currency: builder.currency || "USD",
            },
            companyDescription:
              builder.companyDescription ||
              "Professional exhibition services provider",
            whyChooseUs: [
              "Experienced team",
              "Quality service",
              "Competitive pricing",
            ],
            clientTestimonials: [],
            socialMedia: {},
            businessLicense: builder.businessLicense || builder._id,
            insurance: {
              liability: 1000000,
              currency: "USD",
              validUntil: "2025-12-31",
              insurer: "Professional Insurance",
            },
            sustainability: {
              certifications: [],
              ecoFriendlyMaterials: false,
              wasteReduction: false,
              carbonNeutral: false,
              sustainabilityScore: 50,
            },
            keyStrengths: [
              "Professional Service",
              "Quality Work",
              "Local Expertise",
            ],
            recentProjects: [],
            // Add GMB import flag for display
            gmbImported:
              builder.gmbImported ||
              builder.importedFromGMB ||
              builder.source === "GMB_API" ||
              false,
          }));

          console.log(
            `🎯 Converted ${publicBuilders.length} builders for display`
          );
          console.log(
            "📋 Sample converted builders:",
            publicBuilders.slice(0, 3).map((b) => ({
              name: b.companyName,
              city: b.headquarters.city,
              country: b.headquarters.country,
              gmb: b.gmbImported,
            }))
          );

          // Get real-time stats - Calculate from all builder data
          const calculatedStats = {
            totalBuilders: allBuilders.length,
            verifiedBuilders: allBuilders.filter((b) => b.verified).length,
            totalCountries: Array.from(
              new Set(
                allBuilders.map((b) => b.headquartersCountry || "Unknown")
              )
            ).length,
            totalCities: Array.from(
              new Set(allBuilders.map((b) => b.headquartersCity || "Unknown"))
            ).length,
            averageRating:
              allBuilders.length > 0
                ? allBuilders.reduce((sum, b) => sum + (b.rating || 0), 0) /
                  allBuilders.length
                : 0,
            totalProjectsCompleted: allBuilders.reduce(
              (sum, b) => sum + (b.projectsCompleted || 0),
              0
            ),
            importedFromGMB: allBuilders.filter(
              (b) =>
                b.importedFromGMB || b.gmbImported || b.source === "GMB_API"
            ).length,
          };

          setRealTimeStats(calculatedStats);
          console.log("✅ Real-time stats calculated:", calculatedStats);
          // Use the converted builders for display
          setRealTimeBuilders(publicBuilders);
          console.log(
            `🎉 SUCCESS: Public builders page loaded with ${publicBuilders.length} total builders from Convex (${calculatedStats.importedFromGMB} from GMB)`
          );
        } else {
          console.log(
            "⚠️ No builders found in Convex or invalid response, using static fallback"
          );
          console.log("Response details:", {
            buildersData,
            hasBuilders: buildersData?.builders,
            isArray: Array.isArray(buildersData?.builders),
            length: buildersData?.builders?.length,
          });
          setRealTimeBuilders([]);
          setRealTimeStats({
            ...builderStats,
            totalBuilders: 0,
            verifiedBuilders: 0,
            totalCountries: 0,
            totalCities: 0,
            averageRating: 0,
          });
        }
      } catch (error) {
        console.error("❌ Error loading builder data from Convex:", error);
        // Fallback to static data
        setRealTimeBuilders([]);
        setRealTimeStats({
          ...builderStats,
          totalBuilders: 0,
          verifiedBuilders: 0,
          totalCountries: 0,
          totalCities: 0,
          averageRating: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadRealTimeData();

    // Set up real-time updates by polling every 30 seconds
    const interval = setInterval(loadRealTimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [minRating, setMinRating] = useState([0]);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("rating");

  // Initialize from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sort = params.get("sort");
    const verified = params.get("verified");
    if (sort) setSortBy(sort);
    if (verified === "true") {
      // Filter to verified by setting minimum rating and using verified flag in filter
      setMinRating([0]);
    }
  }, []);

  // Get unique countries and cities from global data instead of just builders
  const countries = useMemo(() => {
    return GLOBAL_EXHIBITION_DATA.countries
      .map((country) => country.name)
      .sort();
  }, []);

  const cities = useMemo(() => {
    const allCities = GLOBAL_EXHIBITION_DATA.cities;
    if (selectedCountry === "all") {
      return Array.from(new Set(allCities.map((city) => city.name))).sort();
    } else {
      return Array.from(
        new Set(
          allCities
            .filter((city) => city.country === selectedCountry)
            .map((city) => city.name)
        )
      ).sort();
    }
  }, [selectedCountry]);

  // Filter and sort builders (using real-time data)
  const filteredBuilders = useMemo(() => {
    let filtered = realTimeBuilders.filter((builder) => {
      const matchesSearch =
        searchTerm === "" ||
        builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.companyDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        builder.headquarters.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        builder.headquarters.country
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        builder.keyStrengths.some((strength: string) =>
          strength.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCountry =
        selectedCountry === "all" ||
        builder.serviceLocations.some(
          (loc: any) => loc.country === selectedCountry
        ) ||
        builder.headquarters.country === selectedCountry;

      const matchesCity =
        selectedCity === "all" ||
        selectedCity === "" ||
        builder.serviceLocations.some(
          (loc: any) => loc.city === selectedCity
        ) ||
        builder.headquarters.city === selectedCity;

      const matchesRating = builder.rating >= minRating[0];
      const matchesVerified =
        new URLSearchParams(window.location.search).get("verified") === "true"
          ? builder.verified
          : true;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesCity &&
        matchesRating &&
        matchesVerified
      );
    });

    // Sort builders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "projects":
          return b.projectsCompleted - a.projectsCompleted;
        case "experience":
          return b.establishedYear - a.establishedYear;
        case "name":
          return a.companyName.localeCompare(b.companyName);
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [
    realTimeBuilders,
    searchTerm,
    selectedCountry,
    selectedCity,
    minRating,
    sortBy,
  ]);

  // No demo top builders in production

  const buildersHeroHeadings = [
    "Find Expert Exhibition Stand",
    "Connect with Verified",
    "Discover Professional",
    "Browse Top-Rated",
  ];

  const buildersStats = [
    { value: `${realTimeStats.totalBuilders}+`, label: "Builders" },
    { value: `${realTimeStats.totalCountries}`, label: "Countries" },
    {
      value: `${realTimeStats.averageRating?.toFixed(1) || builderStats.averageRating.toFixed(1)}`,
      label: "Avg Rating",
    },
    {
      value: `${realTimeStats.verifiedBuilders || builderStats.verifiedBuilders}`,
      label: "Verified",
    },
  ];

  const buildersButtons = [
    {
      text: "Request Quote",
      isQuoteButton: true,
      className:
        "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl border-2 border-transparent transition-all duration-300 hover:shadow-2xl transform hover:scale-105 shadow-lg",
    },
    {
      text: "Find Your Trade Show",
      href: "/trade-shows",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="font-inter min-h-screen bg-gray-50">
      <Navigation />

      {/* Render saved raw HTML if available */}
      {saved?.content?.extra?.rawHtml && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: saved.content.extra.rawHtml }} />
          </div>
        </section>
      )}

      {/* Trade Shows style banner */}
      <TradeStyleBanner
        badgeText="Professional Trade Show Database"
        mainHeading="Global Builders"
        highlightHeading="& Contractors Directory"
        description={`Access ${realTimeStats.totalBuilders}+ verified builders across ${realTimeStats.totalCountries} countries. Connect with specialists for your industry and venue.`}
        stats={[
          { icon: 'calendar', value: '500+', label: 'Projects', color: '#2ec4b6' },
          { icon: 'map-pin', value: String(realTimeStats.totalCountries || 0), label: 'Countries', color: '#3dd598' },
          { icon: 'users', value: (realTimeStats.averageRating || builderStats.averageRating).toFixed(1), label: 'Avg Rating', color: '#f4a261' },
          { icon: 'chart-line', value: String(realTimeStats.verifiedBuilders || builderStats.verifiedBuilders), label: 'Verified', color: '#a06cd5' }
        ]}
        showSearch={true}
        searchPlaceholder="Search builders, cities, or services..."
      />

      {/* Search Bar Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search builders, locations, or specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-900 border-gray-300"
              >
                <FiFilter className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <span className="text-gray-600">
                {filteredBuilders.length} of {realTimeBuilders.length} builders
              </span>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="name">Company Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters - Now visible by default */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Country
                  </label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    City
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Minimum Rating: {minRating[0].toFixed(1)}
                  </label>
                  <Slider
                    value={minRating}
                    onValueChange={setMinRating}
                    max={5}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCountry("all");
                      setSelectedCity("all");
                      setMinRating([0]);
                    }}
                    className="w-full text-gray-900 border-gray-300"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Builders removed for production */}

      {/* All Builders Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              {filteredBuilders.length > 0
                ? `${filteredBuilders.length} Exhibition Builders Found`
                : "No Builders Found"}
            </h2>
            {filteredBuilders.length > 0 && (
              <p className="text-lg text-gray-600">
                Professional exhibition stand builders ready for your next
                project
              </p>
            )}
          </div>

          {filteredBuilders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBuilders.map((builder) => (
                <Link
                  key={builder.id}
                  href={`/builders/${builder.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{builder.rating}</span>
                          <span className="text-sm text-gray-500">
                            ({builder.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {builder.verified && (
                            <FiShield className="w-4 h-4 text-green-500" />
                          )}
                          {builder.premiumMember && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-primary transition-colors line-clamp-1">
                        {builder.companyName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMapPin className="w-3 h-3 mr-2" />
                          {builder.headquarters.city},{" "}
                          {builder.headquarters.country}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiEye className="w-3 h-3 mr-2" />
                          {builder.projectsCompleted} projects
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiClock className="w-3 h-3 mr-2" />
                          {builder.responseTime}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {builder.specializations
                          .slice(0, 1)
                          .map((spec: any) => (
                            <Badge
                              key={spec.id}
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: spec.color + "20",
                                color: spec.color,
                              }}
                            >
                              {spec.icon} {spec.name}
                            </Badge>
                          ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs group-hover:bg-blue-primary group-hover:text-white text-gray-900 border-gray-300"
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-primary hover:bg-blue-dark text-white px-3"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = '/contact'; }}
                        >
                          Request Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No builders found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCountry("all");
                  setSelectedCity("all");
                  setMinRating([0]);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              Builder Network Statistics
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive coverage of the global exhibition market
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-primary mb-2">
                  {(
                    realTimeStats.totalProjectsCompleted ||
                    builderStats.totalProjectsCompleted ||
                    0
                  ).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Projects Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {realTimeStats.verifiedBuilders ||
                    builderStats.verifiedBuilders}
                </div>
                <div className="text-gray-600">Verified Builders</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {realTimeStats.totalCities || builderStats.totalCities}
                </div>
                <div className="text-gray-600">Cities Covered</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {(
                    realTimeStats.averageRating || builderStats.averageRating
                  ).toFixed(1)}
                  /5
                </div>
                <div className="text-gray-600">Average Rating</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Exhibition Stand?
          </h2>
          <p className="text-xl mb-8 text-blue-light">
            Connect with verified exhibition stand builders who understand your
            industry. Get competitive quotes and professional guidance for your
            next trade show.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-primary hover:bg-blue-dark text-white px-8 py-3"
            >
              <FiMail className="w-4 h-4 mr-2" />
              Request Quote
            </Button>
            <Link href="/trade-shows">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3"
              >
                <FiGlobe className="w-4 h-4 mr-2" />
                Find Your Trade Show
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
