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

// Add null checks for icons to prevent runtime errors
const SafeIcon = ({ IconComponent, ...props }: { IconComponent: any } & React.SVGProps<SVGSVGElement>) => {
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...props} />;
};

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
      } catch (error) {
        console.warn("Failed to load CMS data for builders page:", error);
      }
    })();
  }, []);

  const [realTimeBuilders, setRealTimeBuilders] = useState<
    BuilderTransformed[]
  >([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalBuilders: 0,
    verifiedBuilders: 0,
    totalCountries: 0,
    totalCities: 0,
    averageRating: 0,
    totalProjectsCompleted: 0,
    importedFromGMB: 0,
    totalReviews: 0,
  });
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
          // Reset stats to zero when no builders found
          setRealTimeStats({
            totalBuilders: 0,
            verifiedBuilders: 0,
            totalCountries: 0,
            totalCities: 0,
            averageRating: 0,
            totalProjectsCompleted: 0,
            importedFromGMB: 0,
            totalReviews: 0,
          });
        }
      } catch (error) {
        console.error("❌ Error loading builder data:", error);
        setRealTimeBuilders([]);
        // Reset stats to zero on error
        setRealTimeStats({
          totalBuilders: 0,
          verifiedBuilders: 0,
          totalCountries: 0,
          totalCities: 0,
          averageRating: 0,
          totalProjectsCompleted: 0,
          importedFromGMB: 0,
          totalReviews: 0,
        });
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
      } else {
        setRealTimeBuilders([]);
        // Reset stats to zero when no builders found
        setRealTimeStats({
          totalBuilders: 0,
          verifiedBuilders: 0,
          totalCountries: 0,
          totalCities: 0,
          averageRating: 0,
          totalProjectsCompleted: 0,
          importedFromGMB: 0,
          totalReviews: 0,
        });
      }
    } catch (error) {
      console.error("❌ Error refreshing builder data:", error);
      // Reset stats to zero on error
      setRealTimeStats({
        totalBuilders: 0,
        verifiedBuilders: 0,
        totalCountries: 0,
        totalCities: 0,
        averageRating: 0,
        totalProjectsCompleted: 0,
        importedFromGMB: 0,
        totalReviews: 0,
      });
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
                  <SafeIcon IconComponent={FiUsers} className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.totalBuilders}</div>
                <div className="text-slate-300 text-sm">Total Builders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <SafeIcon IconComponent={FiShield} className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.verifiedBuilders}</div>
                <div className="text-slate-300 text-sm">Verified Builders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <SafeIcon IconComponent={FiGlobe} className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl font-bold">{realTimeStats.totalCountries}</div>
                <div className="text-slate-300 text-sm">Countries</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <SafeIcon IconComponent={FiStar} className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold">
                  {realTimeStats.averageRating.toFixed(1)}
                </div>
                <div className="text-slate-300 text-sm">Avg Rating</div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="max-w-2xl mx-auto">
              <Link href="/quote">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200">
                  <SafeIcon IconComponent={FiArrowRight} className="w-5 h-5 mr-2" />
                  Get Free Quote from Verified Builders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Browse Exhibition Builders
            </h2>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <SafeIcon IconComponent={FiFilter} className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Search and Filters */}
          {showFilters && (
            <Card className="mb-6 border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <SafeIcon IconComponent={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search builders, services, locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>
                  
                  {/* Country Filter */}
                  <div>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="border-slate-300 focus:ring-pink-500 focus:border-pink-500">
                        <SelectValue placeholder="Country" />
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
                  
                  {/* City Filter */}
                  <div>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="border-slate-300 focus:ring-pink-500 focus:border-pink-500">
                        <SelectValue placeholder="City" />
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
                  
                  {/* Rating Filter */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Min Rating</span>
                      <span className="text-sm font-bold text-pink-600">{minRating[0]}+</span>
                    </div>
                    <Slider
                      value={minRating}
                      onValueChange={setMinRating}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading exhibition builders...</p>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && currentBuilders.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <SafeIcon IconComponent={FiUsers} className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No builders found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("all");
                setSelectedCity("all");
                setMinRating([0]);
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Builders Grid */}
        {!loading && currentBuilders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentBuilders.map((builder) => (
                <Card 
                  key={builder.id} 
                  className="border-slate-200 hover:border-pink-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Header with logo and verification */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {builder.companyName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 line-clamp-1">
                              {builder.companyName}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <SafeIcon IconComponent={FiMapPin} className="w-3 h-3 text-slate-500" />
                              <span className="text-xs text-slate-600">
                                {builder.headquarters.city}, {builder.headquarters.country}
                              </span>
                            </div>
                          </div>
                        </div>
                        {builder.verified && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <SafeIcon IconComponent={FiShield} className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      {/* Rating and Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <SafeIcon 
                                key={i} 
                                IconComponent={FiStar} 
                                className={`w-4 h-4 ${i < Math.floor(builder.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {builder.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {builder.reviewCount} reviews
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {builder.companyDescription || "Professional exhibition stand builder with years of experience."}
                      </p>
                      
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <div className="text-xs text-slate-600 mb-1">Projects</div>
                          <div className="font-bold text-slate-900">
                            {builder.projectsCompleted}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                          <div className="text-xs text-slate-600 mb-1">Est. Year</div>
                          <div className="font-bold text-slate-900">
                            {builder.establishedYear}
                          </div>
                        </div>
                      </div>
                      
                      {/* Key Strengths */}
                      {builder.keyStrengths && builder.keyStrengths.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {builder.keyStrengths.slice(0, 3).map((strength, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                            {builder.keyStrengths.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{builder.keyStrengths.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="border-t border-slate-100 p-4 bg-slate-50">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/builders/${builder.slug}`} 
                          className="flex-1"
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                          >
                            <SafeIcon IconComponent={FiEye} className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </Link>
                        <Link 
                          href={`/quote?builder=${builder.id}`}
                          className="flex-1"
                        >
                          <Button 
                            size="sm" 
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                          >
                            <SafeIcon IconComponent={FiArrowRight} className="w-4 h-4 mr-1" />
                            Quote
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <div className="text-sm text-slate-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredBuilders.length)} of {filteredBuilders.length} builders
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum 
                            ? "bg-pink-500 hover:bg-pink-600 text-white" 
                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        {currentPage > 3 && (
                          <span className="text-slate-400 px-2">...</span>
                        )}
                        {currentPage > 3 && currentPage < totalPages - 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage)}
                            className="border-slate-300 text-slate-700 hover:bg-slate-100"
                          >
                            {currentPage}
                          </Button>
                        )}
                        {currentPage < totalPages - 2 && (
                          <span className="text-slate-400 px-2">...</span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Featured Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose Our Verified Builders?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Our platform connects you with pre-vetted exhibition stand builders who deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon IconComponent={FiShield} className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Professionals</h3>
              <p className="text-slate-300">
                Every builder undergoes a rigorous verification process to ensure quality and reliability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon IconComponent={FiAward} className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Award-Winning Work</h3>
              <p className="text-slate-300">
                Our builders have won industry recognition for innovative designs and exceptional craftsmanship.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon IconComponent={FiClock} className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">On-Time Delivery</h3>
              <p className="text-slate-300">
                Guaranteed project completion within agreed timelines with transparent communication throughout.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Ready to Find Your Perfect Builder?
            </h2>
            <p className="text-xl text-slate-700 mb-8">
              Get matched with verified exhibition stand builders who meet your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200">
                  <SafeIcon IconComponent={FiArrowRight} className="w-5 h-5 mr-2" />
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/builders">
                <Button variant="outline" className="border-slate-300 text-slate-700 px-8 py-4 text-lg font-semibold rounded-xl">
                  <SafeIcon IconComponent={FiUsers} className="w-5 h-5 mr-2" />
                  Browse All Builders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <WhatsAppFloat />
      <TradeStyleBanner 
        mainHeading="Find Exhibition Stand"
        highlightHeading="Builders Worldwide"
        description="Connect with verified professionals who specialize in creating stunning exhibition stands for trade shows and events."
      />
    </div>
  );
}
