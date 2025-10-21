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
              companyDescription: b.description || b.companyDescription || "",
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
      }
    };

    loadRealTimeData();
    const interval = setInterval(loadRealTimeData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filters and sorting states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [minRating, setMinRating] = useState([0]);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("rating");

  const countries = useMemo(
    () => GLOBAL_EXHIBITION_DATA.countries.map((c) => c.name).sort(),
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
        builder.headquarters.country === selectedCountry;
      const matchesCity =
        selectedCity === "all" || builder.headquarters.city === selectedCity;
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

  return (
    <div className="font-inter min-h-screen bg-gray-50">
      <Navigation />
      {/* Your UI code continues exactly as before */}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
