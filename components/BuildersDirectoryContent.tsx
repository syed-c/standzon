"use client";

import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
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
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";
import PublicQuoteRequest from "@/components/PublicQuoteRequest";

interface BuilderRaw {
  id: string;
  company_name?: string;
  companyName?: string;
  description?: string;
  companyDescription?: string;
  headquarters_city?: string;
  headquartersCountry?: string;
  headquarters_country?: string;
  headquarters?: {
    city?: string;
    country?: string;
    countryCode?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  keyStrengths?: string[];
  verified?: boolean;
  isVerified?: boolean;
  rating?: number;
  projectsCompleted?: number;
  projects_completed?: number;
  importedFromGMB?: boolean;
  gmbImported?: boolean;
  logo?: string;
  establishedYear?: number;
  established_year?: number;
  teamSize?: number;
  reviewCount?: number;
  responseTime?: string;
  languages?: string[];
  premiumMember?: boolean;
  premium_member?: boolean;
  slug?: string;
  primary_email?: string;
  primaryEmail?: string;
  phone?: string;
  website?: string;
  contact_person?: string;
  contactPerson?: string;
  position?: string;
  services?: any[];
  service_locations?: any[];
  serviceLocations?: any[];
  basicStandMin?: number;
  basicStandMax?: number;
  customStandMin?: number;
  customStandMax?: number;
  premiumStandMin?: number;
  premiumStandMax?: number;
  currency?: string;
  averageProject?: number;
  businessLicense?: string;
  _id?: string;
  source?: string;
}

interface BuilderTransformed {
  id: string;
  companyName: string;
  companyDescription: string;
  headquarters: {
    city: string;
    country: string;
    countryCode: string;
    address: string;
    latitude: number;
    longitude: number;
    isHeadquarters: boolean;
  };
  serviceLocations: any[];
  keyStrengths: string[];
  verified: boolean;
  rating: number;
  projectsCompleted: number;
  importedFromGMB: boolean;
  logo: string;
  establishedYear: number;
  teamSize: number;
  reviewCount: number;
  responseTime: string;
  languages: string[];
  premiumMember: boolean;
  slug: string;
  primary_email: string;
  phone: string;
  website: string;
  contact_person: string;
  position: string;
  gmbImported: boolean;
  [key: string]: any;
}

export default function BuildersDirectoryContent() {
  console.log("🚀 Builders Directory: Page loaded, initializing");

  const [saved, setSaved] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "/api/admin/pages-editor?action=get-content&path=%2Fbuilders",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data?.success && data?.data) setSaved(data.data);
      } catch {}
    })();
  }, []);

  const [realTimeBuilders, setRealTimeBuilders] = useState<
    BuilderTransformed[]
  >([]);
  const [realTimeStats, setRealTimeStats] = useState(builderStats);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadRealTimeData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "/api/admin/builders?limit=500&prioritize_real=true&include_all_countries=true"
        );
        const buildersData = await response.json();

        if (
          buildersData &&
          buildersData.data &&
          Array.isArray(buildersData.data.builders)
        ) {
          const allBuilders: BuilderRaw[] = buildersData.data.builders;

          const transformedBuilders: BuilderTransformed[] = allBuilders.map(
            (b: BuilderRaw) => ({
              id: b.id,
              companyName: b.company_name || b.companyName || "",
              companyDescription: (() => {
                let desc = b.description || b.companyDescription || "";
                // Remove SERVICE_LOCATIONS JSON from description more aggressively
                desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
                desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
                desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
                desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
                desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
                // Remove any remaining raw data patterns
                desc = desc.replace(/sdfghjl.*$/g, '');
                desc = desc.replace(/testing.*$/g, '');
                desc = desc.replace(/sdfghj.*$/g, '');
                desc = desc.trim();
                return desc || "";
              })(),
              headquarters: {
                city: b.headquarters_city || b.headquarters?.city || "Unknown",
                country:
                  b.headquarters_country ||
                  b.headquartersCountry ||
                  b.headquarters?.country ||
                  "Unknown",
                countryCode: b.headquarters?.countryCode || "XX",
                address: b.headquarters?.address || "",
                latitude: b.headquarters?.latitude || 0,
                longitude: b.headquarters?.longitude || 0,
                isHeadquarters: true,
              },
              serviceLocations: b.serviceLocations || b.service_locations || [],
              keyStrengths: b.keyStrengths || [],
              verified: b.verified || b.isVerified || false,
              rating: b.rating || 0,
              projectsCompleted:
                b.projectsCompleted || b.projects_completed || 0,
              importedFromGMB: b.importedFromGMB || b.gmbImported || false,
              logo: b.logo || "/images/builders/default-logo.png",
              establishedYear: b.establishedYear || b.established_year || 2020,
              teamSize: b.teamSize || 10,
              reviewCount: b.reviewCount || 0,
              responseTime: b.responseTime || "Within 24 hours",
              languages: b.languages || ["English"],
              premiumMember: b.premiumMember || b.premium_member || false,
              slug:
                b.slug ||
                (b.company_name || b.companyName || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "-"),
              primary_email: b.primary_email || b.primaryEmail || "",
              phone: b.phone || "",
              website: b.website || "",
              contact_person: b.contact_person || b.contactPerson || "",
              position: b.position || "",
              gmbImported:
                b.gmbImported ||
                b.importedFromGMB ||
                b.source === "GMB_API" ||
                false,
            })
          );

          setRealTimeBuilders(transformedBuilders);

          const calculatedStats = {
            totalBuilders: allBuilders.length,
            verifiedBuilders: allBuilders.filter((b) => b.verified).length,
            totalCountries: Array.from(
              new Set(
                allBuilders.map((b) => b.headquartersCountry || "Unknown")
              )
            ).length,
            totalCities: Array.from(
              new Set(allBuilders.map((b) => b.headquarters_city || "Unknown"))
            ).length,
            averageRating:
              allBuilders.length > 0
                ? allBuilders.reduce(
                    (sum, builder) => sum + (builder.rating || 0),
                    0
                  ) / allBuilders.length
                : 0,
            totalProjectsCompleted: allBuilders.reduce(
              (sum, builder) =>
                sum +
                (builder.projectsCompleted || builder.projects_completed || 0),
              0
            ),
            importedFromGMB: allBuilders.filter(
              (builder) =>
                builder.importedFromGMB ||
                builder.gmbImported ||
                builder.source === "GMB_API"
            ).length,
            totalReviews: allBuilders.reduce(
              (sum, builder) => sum + (builder.reviewCount || 0),
              0
            ),
          };

          setRealTimeStats(calculatedStats);
        } else {
          setRealTimeBuilders([]);
        }
      } catch (error) {
        console.error("❌ Error loading builder data:", error);
        setRealTimeBuilders([]);
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    };

    // Load data once on mount only
    loadRealTimeData();
    
    // Removed auto-refresh to prevent unwanted page reloads
    // Data will refresh when user navigates back to this page
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        "/api/admin/builders?limit=500&prioritize_real=true&include_all_countries=true"
      );
      const buildersData = await response.json();

      if (
        buildersData &&
        buildersData.data &&
        Array.isArray(buildersData.data.builders)
      ) {
        const allBuilders: BuilderRaw[] = buildersData.data.builders;
        const transformedBuilders: BuilderTransformed[] = allBuilders.map(
          (b: BuilderRaw) => ({
            id: b.id,
            companyName: b.company_name || b.companyName || "",
            companyDescription: (() => {
              let desc = b.description || b.companyDescription || "";
              desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
              desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
              desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
              desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
              desc = desc.replace(/sdfghjl.*$/g, '');
              desc = desc.replace(/testing.*$/g, '');
              desc = desc.replace(/sdfghj.*$/g, '');
              desc = desc.trim();
              return desc || "";
            })(),
            headquarters: {
              city: b.headquarters_city || b.headquarters?.city || "Unknown",
              country:
                b.headquarters_country ||
                b.headquartersCountry ||
                b.headquarters?.country ||
                "Unknown",
              countryCode: b.headquarters?.countryCode || "XX",
              address: b.headquarters?.address || "",
              latitude: b.headquarters?.latitude || 0,
              longitude: b.headquarters?.longitude || 0,
              isHeadquarters: true,
            },
            serviceLocations: b.serviceLocations || b.service_locations || [],
            keyStrengths: b.keyStrengths || [],
            verified: b.verified || b.isVerified || false,
            rating: b.rating || 0,
            projectsCompleted:
              b.projectsCompleted || b.projects_completed || 0,
            importedFromGMB: b.importedFromGMB || b.gmbImported || false,
            logo: b.logo || "/images/builders/default-logo.png",
            establishedYear: b.establishedYear || b.established_year || 2020,
            teamSize: b.teamSize || 10,
            reviewCount: b.reviewCount || 0,
            responseTime: b.responseTime || "Within 24 hours",
            languages: b.languages || ["English"],
            premiumMember: b.premiumMember || b.premium_member || false,
            slug:
              b.slug ||
              (b.company_name || b.companyName || "")
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-"),
            primary_email: b.primary_email || b.primaryEmail || "",
            phone: b.phone || "",
            website: b.website || "",
            contact_person: b.contact_person || b.contactPerson || "",
            position: b.position || "",
            gmbImported:
              b.gmbImported ||
              b.importedFromGMB ||
              b.source === "GMB_API" ||
              false,
          })
        );

        setRealTimeBuilders(transformedBuilders);

        const calculatedStats = {
          totalBuilders: allBuilders.length,
          verifiedBuilders: allBuilders.filter((b) => b.verified).length,
          totalCountries: Array.from(
            new Set(
              allBuilders.map((b) => b.headquartersCountry || "Unknown")
            )
          ).length,
          totalCities: Array.from(
            new Set(allBuilders.map((b) => b.headquarters_city || "Unknown"))
          ).length,
          averageRating:
            allBuilders.length > 0
              ? allBuilders.reduce(
                  (sum, builder) => sum + (builder.rating || 0),
                  0
                ) / allBuilders.length
              : 0,
          totalProjectsCompleted: allBuilders.reduce(
            (sum, builder) =>
              sum +
              (builder.projectsCompleted || builder.projects_completed || 0),
            0
          ),
          importedFromGMB: allBuilders.filter(
            (builder) =>
              builder.importedFromGMB ||
              builder.gmbImported ||
              builder.source === "GMB_API"
          ).length,
          totalReviews: allBuilders.reduce(
            (sum, builder) => sum + (builder.reviewCount || 0),
            0
          ),
        };

        setRealTimeStats(calculatedStats);
      }
    } catch (error) {
      console.error("❌ Error refreshing builder data:", error);
    } finally {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }
  };

  // Filters and sorting states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [minRating, setMinRating] = useState([0]);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("rating");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [buildersPerPage] = useState(12);

  const countries = useMemo(
    () => Array.from(new Set(GLOBAL_EXHIBITION_DATA.countries.map((c) => c.name))).sort(),
    []
  );

  const cities = useMemo(() => {
    const allCities = GLOBAL_EXHIBITION_DATA.cities;
    if (selectedCountry === "all")
      return Array.from(new Set(allCities.map((c) => c.name))).sort();
    return Array.from(
      new Set(
        allCities
          .filter((c) => c.country === selectedCountry)
          .map((c) => c.name)
      )
    ).sort();
  }, [selectedCountry]);

  const filteredBuilders = useMemo(() => {
    const filtered = realTimeBuilders.filter((builder) => {
      const matchesSearch =
        searchTerm === "" ||
        builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        builder.companyDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCountry =
        selectedCountry === "all" ||
        builder.headquarters.country === selectedCountry ||
        (builder.serviceLocations && builder.serviceLocations.some(loc => loc.country === selectedCountry));
      const matchesCity =
        selectedCity === "all" || 
        builder.headquarters.city === selectedCity ||
        (builder.serviceLocations && builder.serviceLocations.some(loc => loc.cities.includes(selectedCity)));
      const matchesRating = builder.rating >= minRating[0];
      return matchesSearch && matchesCountry && matchesCity && matchesRating;
    });

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredBuilders.length / buildersPerPage);
  const startIndex = (currentPage - 1) * buildersPerPage;
  const endIndex = startIndex + buildersPerPage;
  const currentBuilders = filteredBuilders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCountry, selectedCity, minRating, sortBy]);

  return (
    <div className="font-inter min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Navigation />
      
      {/* Hero Section - Matching location pages style */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pt-24 pb-20">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
                <FiUsers className="w-5 h-5 mr-2" />
                Global Directory
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Exhibition Stand Builders</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              Find verified exhibition stand builders worldwide. Connect with professionals who deliver exceptional results.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <FiUsers className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.totalBuilders}</div>
                <div className="text-slate-300 text-sm">Total Builders</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <FiShield className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.verifiedBuilders}</div>
                <div className="text-slate-300 text-sm">Verified</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <FiMapPin className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.totalCountries}</div>
                <div className="text-slate-300 text-sm">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <FiAward className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.totalCities}</div>
                <div className="text-slate-300 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Find Your Perfect Builder
              </h2>
              <p className="text-gray-600">
                Use filters to narrow down your search and find builders that match your needs
              </p>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search builders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Refresh Button */}
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  {isRefreshing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </Button>
                
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-48 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select Country" />
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

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-48 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Select City" />
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

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 border-gray-200"
                >
                  <FiFilter />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Minimum Rating: {minRating[0].toFixed(1)} ⭐
                    </label>
                    <Slider
                      value={minRating}
                      onValueChange={setMinRating}
                      max={5}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Builders Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading builders...</h3>
                <p className="text-gray-600">Please wait while we fetch the latest builder data</p>
              </div>
            ) : filteredBuilders.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Found {filteredBuilders.length} Builders
                  </h2>
                  <p className="text-lg text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredBuilders.length)} of {filteredBuilders.length} builders
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 sm:gap-8">
                  {currentBuilders.map((builder) => (
                    <Card key={builder.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                      <CardHeader className="pb-4 sm:pb-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors">
                              {builder.companyName}
                            </CardTitle>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm font-semibold text-yellow-700">
                                  {builder.rating.toFixed(1)}
                                </span>
                              </div>
                              <Badge 
                                variant={builder.verified ? "default" : "secondary"}
                                className={builder.verified ? "bg-green-100 text-green-800 border-green-200" : ""}
                              >
                                {builder.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                          </div>
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <FiAward className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4 sm:space-y-5">
                          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <FiMapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                            <div className="flex flex-wrap gap-1">
                              {builder.serviceLocations && builder.serviceLocations.length > 0 ? (
                                builder.serviceLocations.map((location, index) => (
                                  <span key={index} className="font-medium">
                                    {location.country} ({location.cities.join(', ')})
                                    {index < builder.serviceLocations.length - 1 && <span>, </span>}
                                  </span>
                                ))
                              ) : (
                                <span className="font-medium">{builder.headquarters.city}, {builder.headquarters.country}</span>
                              )}
                            </div>
                          </div>
                          
                          {builder.companyDescription && (
                            <p className="text-sm text-gray-600 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                              {builder.companyDescription}
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                            <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                              <FiUsers className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                              <span className="font-medium">{builder.projectsCompleted} projects</span>
                            </div>
                            <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
                              <FiClock className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                              <span className="font-medium">{builder.responseTime}</span>
                            </div>
                          </div>

                          {builder.keyStrengths && builder.keyStrengths.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {builder.keyStrengths.slice(0, 3).map((strength, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Link href={`/builders/${builder.slug}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full border-gray-200 hover:border-blue-300 hover:text-blue-600 min-h-[40px]">
                                View Profile
                              </Button>
                            </Link>
                            <PublicQuoteRequest 
                              builderId={builder.id}
                              location={`${builder.headquarters.city}, ${builder.headquarters.country}`}
                              buttonText="Get Quote"
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white min-h-[40px]"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 sm:mt-16 flex justify-center">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="border-gray-200 min-h-[40px] w-full sm:w-auto touch-active no-tap-highlight"
                      >
                        <FiArrowRight className="w-4 h-4 mr-1 rotate-180" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`${currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : "border-gray-200"} min-h-[40px] min-w-[40px] touch-active no-tap-highlight`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="border-gray-200 min-h-[40px] w-full sm:w-auto touch-active no-tap-highlight"
                      >
                        Next
                        <FiArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No builders found
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more builders
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCountry("all");
                    setSelectedCity("all");
                    setMinRating([0]);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 touch-active no-tap-highlight"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
