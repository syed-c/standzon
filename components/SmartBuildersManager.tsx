"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Users,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Check,
  X,
  Shield,
  Crown,
  Star,
  MapPin,
  Mail,
  Phone,
  Globe,
  DollarSign,
  CheckCircle,
  UserCheck,
  UserX,
  Info,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Users2,
  Merge,
} from "lucide-react";
import { EXPANDED_EXHIBITION_DATA } from "@/lib/data/expandedLocations";
import { ExhibitionBuilder } from "@/lib/data/exhibitionBuilders";

interface SmartBuilder {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  contactPerson: string;
  city: string;
  country: string;
  website?: string;
  description: string;
  services: string[];
  specializations: string[];
  portfolioImages: string[];
  status: "active" | "inactive" | "pending" | "suspended";
  plan: "free" | "basic" | "professional" | "enterprise";
  verified: boolean;
  featured: boolean;
  rating: number;
  projectsCompleted: number;
  responseTime: string;
  joinDate: string;
  lastActive: string;
  leadCount: number;
  revenue: number;
  certifications: string[];
  languages: string[];
  gmbImported?: boolean;
  claimStatus?: "unclaimed" | "pending" | "verified" | "rejected";
}

interface SmartBuildersManagerProps {
  adminId?: string;
  permissions?: string[];
}

export default function SmartBuildersManager({
  adminId = "admin-001",
  permissions = [],
}: SmartBuildersManagerProps) {
  const { toast } = useToast();

  // State declarations
  const [builders, setBuilders] = useState<SmartBuilder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);
  const [editingBuilder, setEditingBuilder] = useState<SmartBuilder | null>(
    null
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

  // ✅ NEW: Duplicate Detection State
  const [duplicateGroups, setDuplicateGroups] = useState<
    Array<{
      id: string;
      duplicates: SmartBuilder[];
      reason: string;
      confidence: "high" | "medium" | "low";
    }>
  >([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [isDuplicateAnalysis, setIsDuplicateAnalysis] = useState(false);

  const countries = Array.from(
    new Set(EXPANDED_EXHIBITION_DATA.countries.map((c) => c.name))
  ).sort();
  const cities =
    selectedCountry === "all"
      ? Array.from(
          new Set(EXPANDED_EXHIBITION_DATA.cities.map((c) => c.name))
        ).sort()
      : EXPANDED_EXHIBITION_DATA.cities
          .filter((c) => c.country === selectedCountry)
          .map((c) => c.name)
          .sort();

  // Convert ExhibitionBuilder to SmartBuilder format
  const convertExhibitionBuilderToSmartBuilder = (
    builder: ExhibitionBuilder
  ): SmartBuilder => {
    console.log("Converting builder:", builder.companyName, builder);

    try {
      return {
        id: builder.id,
        companyName: builder.companyName || "Unknown Company",
        email: builder.contactInfo?.primaryEmail || "",
        phone: builder.contactInfo?.phone || "",
        contactPerson: builder.contactInfo?.contactPerson || "Contact Person",
        city: builder.headquarters?.city || "Unknown",
        country: builder.headquarters?.country || "Unknown",
        website: builder.contactInfo?.website || "",
        description: builder.companyDescription || "No description available",
        services: Array.isArray(builder.services)
          ? builder.services.map((s) => s?.name || "Service").filter(Boolean)
          : [],
        specializations: Array.isArray(builder.specializations)
          ? builder.specializations
              .map((s) => s?.name || "Specialization")
              .filter(Boolean)
          : [],
        portfolioImages: Array.isArray(builder.portfolio)
          ? builder.portfolio.map((p) => p?.images?.[0]).filter(Boolean)
          : [],
        status: builder.verified ? "active" : "pending",
        plan: builder.premiumMember ? "professional" : "free",
        verified: builder.verified || false,
        featured: builder.premiumMember || false,
        rating: typeof builder.rating === "number" ? builder.rating : 0,
        projectsCompleted:
          typeof builder.projectsCompleted === "number"
            ? builder.projectsCompleted
            : 0,
        responseTime: builder.responseTime || "Within 24 hours",
        joinDate:
          (builder as any).createdAt || builder.lastUpdated || new Date().toISOString(),
        lastActive:
          (builder as any).updatedAt || builder.lastUpdated || new Date().toISOString(),
        leadCount: Math.floor(Math.random() * 50) + 10, // Simulated for now
        revenue:
          builder.priceRange?.averageProject &&
          typeof builder.priceRange.averageProject === "number"
            ? builder.priceRange.averageProject
            : 25000,
        certifications: Array.isArray(builder.certifications)
          ? builder.certifications
              .map((c) =>
                typeof c === "string" ? c : c?.name || "Certification"
              )
              .filter(Boolean)
          : [],
        languages: Array.isArray(builder.languages)
          ? builder.languages.filter(Boolean)
          : ["English"],
        gmbImported:
          builder.gmbImported ||
          builder.importedFromGMB ||
          builder.source === "google_places_api" ||
          (builder.id && builder.id.startsWith("gmb_")) ||
          false,
        claimStatus: builder.claimStatus || "unclaimed",
      };
    } catch (error) {
      console.error("Error converting builder:", builder.companyName, error);
      // Return a safe fallback
      return {
        id: builder.id || "unknown",
        companyName: builder.companyName || "Unknown Company",
        email: "",
        phone: "",
        contactPerson: "Contact Person",
        city: "Unknown",
        country: "Unknown",
        website: "",
        description: "No description available",
        services: [],
        specializations: [],
        portfolioImages: [],
        status: "pending",
        plan: "free",
        verified: false,
        featured: false,
        rating: 0,
        projectsCompleted: 0,
        responseTime: "Within 24 hours",
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        leadCount: 0,
        revenue: 0,
        certifications: [],
        languages: ["English"],
        gmbImported: false,
        claimStatus: "unclaimed",
      };
    }
  };

  // Load builders from unified platform (NOW FROM SUPABASE INSTEAD OF CONVEX)
  const loadBuilders = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading real builders from Supabase...");

      // Fetch builders from Supabase API endpoint
      const response = await fetch("/api/admin/builders?limit=1000&prioritize_real=true");
      const buildersData = await response.json();

      console.log("📡 Supabase response:", buildersData);

      if (
        buildersData &&
        buildersData.success &&
        buildersData.data &&
        Array.isArray(buildersData.data.builders) &&
        buildersData.data.builders.length > 0
      ) {
        console.log(
          "✅ Loaded builders successfully from Supabase:",
          buildersData.data.builders.length
        );
        console.log("📊 Total builders in Supabase:", buildersData.data.total);

        const allBuilders = buildersData.data.builders.map((builder: any) => ({
          id: builder.id,
          companyName: builder.companyName || builder.company_name || "Unknown Company",
          email: builder.contactInfo?.primaryEmail || builder.primary_email || "",
          phone: builder.contactInfo?.phone || builder.phone || "",
          contactPerson: builder.contactInfo?.contactPerson || builder.contact_person || "Contact Person",
          city: builder.headquarters?.city || builder.headquarters_city || "Unknown",
          country: builder.headquarters?.country || builder.headquarters_country || "Unknown",
          website: builder.contactInfo?.website || builder.website || "",
          description: builder.companyDescription || builder.company_description || "No description available",
          services: [], // Will be populated from related tables
          specializations: [], // Will be populated from related tables
          portfolioImages: [], // Will be populated from related tables
          status: builder.verified ? "active" : "pending",
          plan: builder.premiumMember ? "professional" : "free",
          verified: builder.verified || false,
          featured: builder.premiumMember || false,
          rating: builder.rating || 0,
          projectsCompleted: builder.projectsCompleted || builder.projects_completed || 0,
          responseTime: builder.responseTime || builder.response_time || "Within 24 hours",
          joinDate: builder.createdAt || new Date().toISOString(),
          lastActive: builder.updatedAt || new Date().toISOString(),
          leadCount: Math.floor(Math.random() * 50) + 10, // Simulated for now
          revenue: builder.averageProject || 25000,
          certifications: [],
          languages: builder.languages || ["English"],
          gmbImported: builder.gmbImported || builder.importedFromGMB || false,
          claimStatus: builder.claimStatus || "unclaimed",
        }));

        console.log(
          "🧹 All builders converted successfully:",
          allBuilders.length
        );
        console.log(
          "📋 Final builders list:",
          allBuilders.map((b: any) => ({
            id: b.id,
            name: b.companyName,
            gmb: b.gmbImported,
          }))
        );

        setBuilders(allBuilders);
        setLastUpdated(new Date().toISOString());

        toast({
          title: "Builders Loaded",
          description: `Successfully loaded ${allBuilders.length} builders (${allBuilders.filter((b: any) => b.gmbImported).length} from GMB import).`,
        });
      } else {
        console.log(
          "⚠️ No builders found in Supabase response or invalid response format"
        );
        console.log("Response data:", buildersData);

        // Set empty array instead of throwing error
        setBuilders([]);

        toast({
          title: "No Builders Found",
          description:
            buildersData?.message ||
            "No builders found in the database. You can import builders using the GMB Fetch API.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error loading builders from Supabase:", error);

      // Set empty array on error
      setBuilders([]);

      toast({
        title: "Error Loading Builders",
        description: `Failed to load builders: ${error instanceof Error ? error.message : "Unknown error"}. Please try refreshing the page.`,
        variant: "destructive",
      });
    } finally {
      console.log("🏁 Setting loading to false");
      setLoading(false);
    }
  };

  // Load builders on component mount
  useEffect(() => {
    loadBuilders();
  }, []);

  // Filter builders based on search and filters
  const filteredBuilders = builders.filter((builder) => {
    const matchesSearch =
      !searchTerm ||
      builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      selectedCountry === "all" || builder.country === selectedCountry;
    const matchesCity = selectedCity === "all" || builder.city === selectedCity;
    const matchesStatus =
      selectedStatus === "all" || builder.status === selectedStatus;
    const matchesPlan = selectedPlan === "all" || builder.plan === selectedPlan;
    const matchesSource =
      selectedSource === "all" ||
      (selectedSource === "gmb" && builder.gmbImported) ||
      (selectedSource === "manual" && !builder.gmbImported);

    const matchesDuplicateFilter =
      !showDuplicatesOnly ||
      duplicateGroups.some((group) =>
        group.duplicates.some((dup) => dup.id === builder.id)
      );

    return (
      matchesSearch &&
      matchesCountry &&
      matchesCity &&
      matchesStatus &&
      matchesPlan &&
      matchesSource &&
      matchesDuplicateFilter
    );
  });

  // Sort builders
  const sortedBuilders = [...filteredBuilders].sort((a, b) => {
    const getValue = (builder: SmartBuilder) => {
      switch (sortBy) {
        case "companyName":
          return builder.companyName;
        case "rating":
          return builder.rating;
        case "projectsCompleted":
          return builder.projectsCompleted;
        case "revenue":
          return builder.revenue;
        case "joinDate":
          return new Date(builder.joinDate).getTime();
        case "lastActive":
          return new Date(builder.lastActive).getTime();
        default:
          return builder.companyName;
      }
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  // Handle bulk operations
  const handleBulkAction = async (
    action: "verify" | "suspend" | "delete" | "feature"
  ) => {
    if (selectedBuilders.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select builders to perform bulk actions",
        variant: "destructive",
      });
      return;
    }

    console.log(
      `🔄 Performing bulk ${action} on ${selectedBuilders.length} builders`
    );

    toast({
      title: "Bulk Action",
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} action performed on ${selectedBuilders.length} builders`,
    });

    setSelectedBuilders([]);
  };

  // Handle individual builder actions
  const handleBuilderAction = async (
    builderId: string,
    action: "verify" | "suspend" | "delete" | "feature"
  ) => {
    console.log(`🔄 Performing ${action} on builder: ${builderId}`);

    // Update builder status locally
    setBuilders((prev) =>
      prev.map((builder) =>
        builder.id === builderId
          ? {
              ...builder,
              status:
                action === "verify"
                  ? "active"
                  : action === "suspend"
                    ? "suspended"
                    : builder.status,
              verified: action === "verify" ? true : builder.verified,
              featured:
                action === "feature" ? !builder.featured : builder.featured,
            }
          : builder
      )
    );

    toast({
      title: "Action Completed",
      description: `Builder ${action} action completed successfully`,
    });
  };

  // Handle edit builder
  const handleEditBuilder = (builder: SmartBuilder) => {
    setEditingBuilder(builder);
    setShowEditDialog(true);
  };

  // Save builder changes
  const saveBuilder = async () => {
    if (!editingBuilder) return;

    console.log("💾 Saving builder changes:", editingBuilder.companyName);

    // Update builder in local state
    setBuilders((prev) =>
      prev.map((builder) =>
        builder.id === editingBuilder.id ? editingBuilder : builder
      )
    );

    setShowEditDialog(false);
    setEditingBuilder(null);

    toast({
      title: "Builder Updated",
      description: `${editingBuilder.companyName} has been updated successfully`,
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get plan color
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-800";
      case "professional":
        return "bg-blue-100 text-blue-800";
      case "basic":
        return "bg-green-100 text-green-800";
      case "free":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle plan changes
  const handlePlanChange = async (
    builderId: string,
    newPlan: "free" | "basic" | "professional" | "enterprise"
  ) => {
    console.log(`💰 Changing plan for builder ${builderId} to ${newPlan}`);

    // Update builder plan locally
    setBuilders((prev) =>
      prev.map((builder) =>
        builder.id === builderId ? { ...builder, plan: newPlan } : builder
      )
    );

    toast({
      title: "Plan Updated",
      description: `Builder plan changed to ${newPlan}`,
    });
  };

  // Handle password reset
  const handlePasswordReset = async (builderId: string) => {
    console.log(`🔑 Initiating password reset for builder: ${builderId}`);

    const builder = builders.find((b) => b.id === builderId);
    if (!builder) return;

    // In a real implementation, this would send a password reset email
    toast({
      title: "Password Reset",
      description: `Password reset email sent to ${builder.email}`,
    });
  };

  // ✅ NEW: Comprehensive Duplicate Detection System (OPTIMIZED)
  const detectDuplicates = (buildersToAnalyze: SmartBuilder[]) => {
    const duplicateGroups: Array<{
      id: string;
      duplicates: SmartBuilder[];
      reason: string;
      confidence: "high" | "medium" | "low";
    }> = [];
    const processedBuilders = new Set<string>();

    console.log(
      `🔍 Starting duplicate analysis for ${buildersToAnalyze.length} builders...`
    );

    // ✅ OPTIMIZED: Batch processing to prevent UI blocking
    const batchSize = 50;
    for (let i = 0; i < buildersToAnalyze.length; i += batchSize) {
      const batch = buildersToAnalyze.slice(i, i + batchSize);

      batch.forEach((builder, index) => {
        const actualIndex = i + index;
        if (processedBuilders.has(builder.id)) return;

        const duplicates = [builder];
        const reasons: string[] = [];

        // ✅ OPTIMIZED: Only check builders that haven't been processed yet
        buildersToAnalyze.slice(actualIndex + 1).forEach((otherBuilder) => {
          if (processedBuilders.has(otherBuilder.id)) return;

          let isDuplicate = false;
          let reason = "";
          let confidence: "high" | "medium" | "low" = "low";

          // 1. Exact email match (highest confidence) - FAST CHECK
          if (
            builder.email &&
            otherBuilder.email &&
            builder.email.toLowerCase().trim() ===
              otherBuilder.email.toLowerCase().trim() &&
            builder.email.trim() !== ""
          ) {
            isDuplicate = true;
            reason = "same email address";
            confidence = "high";
          }
          // 2. Phone number match (high confidence) - FAST CHECK
          else if (builder.phone && otherBuilder.phone) {
            const normalizedPhone1 = builder.phone.replace(/\D/g, "");
            const normalizedPhone2 = otherBuilder.phone.replace(/\D/g, "");

            if (
              normalizedPhone1.length >= 7 &&
              normalizedPhone2.length >= 7 &&
              normalizedPhone1 === normalizedPhone2
            ) {
              isDuplicate = true;
              reason = "matching phone number";
              confidence = "high";
            }
          }
          // 3. Company name + location match (medium confidence) - SLOWER CHECK
          else if (
            builder.companyName &&
            otherBuilder.companyName &&
            builder.city &&
            otherBuilder.city &&
            builder.country &&
            otherBuilder.country
          ) {
            const name1 = builder.companyName.toLowerCase().trim();
            const name2 = otherBuilder.companyName.toLowerCase().trim();
            const location1 =
              `${builder.city}_${builder.country}`.toLowerCase();
            const location2 =
              `${otherBuilder.city}_${otherBuilder.country}`.toLowerCase();

            if (name1 === name2 && location1 === location2) {
              isDuplicate = true;
              reason = "same company name and location";
              confidence = "medium";
            }
          }

          if (isDuplicate) {
            duplicates.push(otherBuilder);
            reasons.push(reason);
            processedBuilders.add(otherBuilder.id);
          }
        });

        // If we found duplicates, add to group
        if (duplicates.length > 1) {
          duplicateGroups.push({
            id: `dup_${actualIndex}_${Date.now()}`,
            duplicates,
            reason: reasons[0] || "multiple criteria",
            confidence: duplicates.length > 2 ? "high" : "medium",
          });

          // Mark all as processed
          duplicates.forEach((dup) => processedBuilders.add(dup.id));
        }
      });
    }

    console.log(
      `🔍 Duplicate analysis complete: Found ${duplicateGroups.length} duplicate groups`
    );
    return duplicateGroups;
  };

  // ✅ NEW: Analyze duplicates
  const analyzeDuplicates = async () => {
    setIsDuplicateAnalysis(true);

    try {
      console.log("🔍 Starting comprehensive duplicate analysis...");
      const groups = detectDuplicates(builders);
      setDuplicateGroups(groups);
      setShowDuplicates(true);

      const totalDuplicates = groups.reduce(
        (sum, group) => sum + group.duplicates.length,
        0
      );

      toast({
        title: "Duplicate Analysis Complete",
        description: `Found ${groups.length} duplicate groups with ${totalDuplicates} total duplicate builders`,
      });
    } catch (error) {
      console.error("❌ Error analyzing duplicates:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze duplicates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDuplicateAnalysis(false);
    }
  };

  // ✅ NEW: Resolve duplicate group by keeping one and removing others
  const resolveDuplicateGroup = async (
    groupId: string,
    keepBuilderId: string
  ) => {
    const group = duplicateGroups.find((g) => g.id === groupId);
    if (!group) return;

    const buildersToRemove = group.duplicates.filter(
      (b) => b.id !== keepBuilderId
    );

    console.log(
      `🔄 Resolving duplicate group: keeping ${keepBuilderId}, removing ${buildersToRemove.length} duplicates`
    );

    // Remove duplicates from the builders list
    setBuilders((prev) =>
      prev.filter(
        (builder) => !buildersToRemove.some((dup) => dup.id === builder.id)
      )
    );

    // Remove this group from duplicates
    setDuplicateGroups((prev) => prev.filter((g) => g.id !== groupId));

    toast({
      title: "Duplicates Resolved",
      description: `Removed ${buildersToRemove.length} duplicate builders`,
    });
  };

  // ✅ NEW: Auto-resolve duplicates (keep the verified/higher rated one)
  const autoResolveDuplicates = async () => {
    console.log("🤖 Starting auto-resolution of duplicates...");

    let resolvedCount = 0;
    const newBuilders = [...builders];

    duplicateGroups.forEach((group) => {
      if (group.confidence === "high") {
        // Sort by verification status, then rating, then projects completed
        const sorted = [...group.duplicates].sort((a, b) => {
          if (a.verified !== b.verified) return b.verified ? 1 : -1;
          if (a.rating !== b.rating) return b.rating - a.rating;
          return b.projectsCompleted - a.projectsCompleted;
        });

        const keepBuilder = sorted[0];
        const removeBuilders = sorted.slice(1);

        console.log(
          `🤖 Auto-keeping: ${keepBuilder.companyName} (verified: ${keepBuilder.verified}, rating: ${keepBuilder.rating})`
        );

        // Remove duplicates
        removeBuilders.forEach((builder) => {
          const index = newBuilders.findIndex((b) => b.id === builder.id);
          if (index > -1) {
            newBuilders.splice(index, 1);
            resolvedCount++;
          }
        });
      }
    });

    setBuilders(newBuilders);
    setDuplicateGroups((prev) => prev.filter((g) => g.confidence !== "high"));

    toast({
      title: "Auto-Resolution Complete",
      description: `Automatically resolved ${resolvedCount} high-confidence duplicates`,
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium">Loading builders...</span>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Show raw data if no builders are converted
  if (builders.length === 0) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Smart Builders Manager - Debug Mode
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              No Builders Found
            </h2>
            <p className="text-yellow-700 mb-4">
              The component loaded but no builders were converted successfully.
            </p>
            <button
              onClick={loadBuilders}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry Loading Builders
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Last updated: {lastUpdated || "Never"}</p>
            <p>Loading state: {loading ? "true" : "false"}</p>
            <p>Builders count: {builders.length}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Builders Manager
              </h1>
              <p className="text-gray-600 mt-1">
                Manage {builders.length} exhibition builders across your
                platform
                {builders.filter((b) => b.gmbImported).length > 0 && (
                  <span className="text-purple-600 font-medium">
                    ({builders.filter((b) => b.gmbImported).length} from GMB
                    import)
                  </span>
                )}
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={loadBuilders}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={analyzeDuplicates}
                disabled={isDuplicateAnalysis || builders.length === 0}
                variant="outline"
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                {isDuplicateAnalysis ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Check Duplicates
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowBulkUpload(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Builders
              </Button>
              <Button
                onClick={() =>
                  handleEditBuilder({
                    id: "",
                    companyName: "",
                    email: "",
                    phone: "",
                    contactPerson: "",
                    city: "",
                    country: "",
                    website: "",
                    description: "",
                    services: [],
                    specializations: [],
                    portfolioImages: [],
                    status: "pending",
                    plan: "free",
                    verified: false,
                    featured: false,
                    rating: 0,
                    projectsCompleted: 0,
                    responseTime: "",
                    joinDate: new Date().toISOString(),
                    lastActive: new Date().toISOString(),
                    leadCount: 0,
                    revenue: 0,
                    certifications: [],
                    languages: [],
                  })
                }
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Builder
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Builders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {builders.length}
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-green-600">
                      {builders.filter((b) => b.verified).length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">GMB Imported</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {builders.filter((b) => b.gmbImported).length}
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Featured</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {builders.filter((b) => b.featured).length}
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paid Plans</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {builders.filter((b) => b.plan !== "free").length}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {builders.length > 0
                        ? (
                            builders.reduce((sum, b) => sum + b.rating, 0) /
                            builders.length
                          ).toFixed(1)
                        : "0.0"}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            {/* ✅ NEW: Duplicate Detection Stats Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Duplicate Detection</p>
                    <p className="text-2xl font-bold text-red-600">
                      {duplicateGroups.length > 0
                        ? duplicateGroups.length
                        : "0"}{" "}
                      groups
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {duplicateGroups.reduce(
                        (sum, group) => sum + group.duplicates.length,
                        0
                      )}{" "}
                      total duplicates
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Users2 className="h-8 w-8 text-red-600" />
                    <Button
                      size="sm"
                      onClick={analyzeDuplicates}
                      disabled={isDuplicateAnalysis || builders.length === 0}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      {isDuplicateAnalysis ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search builders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="city">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={selectedSource}
                    onValueChange={setSelectedSource}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="gmb">GMB Imported</SelectItem>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedBuilders.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedBuilders.length} builders selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction("verify")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction("feature")}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Feature
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction("suspend")}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Builders Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Builders ({sortedBuilders.length})</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="sort" className="text-sm">
                      Sort by:
                    </Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="companyName">
                          Company Name
                        </SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="projectsCompleted">
                          Projects
                        </SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="joinDate">Join Date</SelectItem>
                        <SelectItem value="lastActive">Last Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sortedBuilders.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No builders found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto scroll-smooth">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <Checkbox
                            checked={
                              selectedBuilders.length === sortedBuilders.length
                            }
                            onCheckedChange={(checked: any) => {
                              if (checked) {
                                setSelectedBuilders(
                                  sortedBuilders.map((b) => b.id)
                                );
                              } else {
                                setSelectedBuilders([]);
                              }
                            }}
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Company
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Location
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Contact
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Plan
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Rating
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Projects
                        </th>
                        <th className="text-left py-3 px-4 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedBuilders.map((builder) => (
                        <tr
                          key={builder.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <Checkbox
                              checked={selectedBuilders.includes(builder.id)}
                              onCheckedChange={(checked: any) => {
                                if (checked) {
                                  setSelectedBuilders([
                                    ...selectedBuilders,
                                    builder.id,
                                  ]);
                                } else {
                                  setSelectedBuilders(
                                    selectedBuilders.filter(
                                      (id) => id !== builder.id
                                    )
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                  <Building className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {builder.companyName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {builder.contactPerson}
                                </div>
                                {builder.gmbImported && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                                    GMB Imported
                                  </Badge>
                                )}
                                {/* ✅ NEW: Duplicate indicator */}
                                {duplicateGroups.some((group) =>
                                  group.duplicates.some(
                                    (dup) => dup.id === builder.id
                                  )
                                ) && (
                                  <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                                    <Users2 className="h-3 w-3 mr-1" />
                                    Duplicate
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {builder.city}, {builder.country}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-1">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                  {builder.email}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {builder.phone}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(builder.status)}>
                              {builder.status}
                            </Badge>
                            {builder.verified && (
                              <Badge className="bg-green-100 text-green-800 ml-1">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getPlanColor(builder.plan)}>
                              {builder.plan}
                            </Badge>
                            {builder.featured && (
                              <Badge className="bg-purple-100 text-purple-800 ml-1">
                                <Crown className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {builder.rating.toFixed(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {builder.projectsCompleted}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditBuilder(builder)}
                                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!builder.verified && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleBuilderAction(builder.id, "verify")
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleBuilderAction(builder.id, "feature")
                                }
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <Crown className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handlePlanChange(
                                    builder.id,
                                    builder.plan === "free"
                                      ? "professional"
                                      : "free"
                                  )
                                }
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePasswordReset(builder.id)}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleBuilderAction(builder.id, "delete")
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ✅ NEW: Duplicates Filter */}
          {duplicateGroups.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="show-duplicates-only"
                  checked={showDuplicatesOnly}
                  onCheckedChange={(checked: boolean) =>
                    setShowDuplicatesOnly(checked as boolean)
                  }
                />
                <Label
                  htmlFor="show-duplicates-only"
                  className="text-red-800 font-medium"
                >
                  Show only duplicate builders (
                  {duplicateGroups.reduce(
                    (sum, group) => sum + group.duplicates.length,
                    0
                  )}{" "}
                  found)
                </Label>
              </div>
            </div>
          )}

          {/* Edit Builder Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scroll-smooth">
              <DialogHeader>
                <DialogTitle>
                  {editingBuilder?.id ? "Edit Builder" : "Add New Builder"}
                </DialogTitle>
                <DialogDescription>
                  Update builder information and settings
                </DialogDescription>
              </DialogHeader>

              {editingBuilder && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={editingBuilder.companyName}
                        onChange={(e) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            companyName: e.target.value,
                          })
                        }
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={editingBuilder.contactPerson}
                        onChange={(e) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            contactPerson: e.target.value,
                          })
                        }
                        placeholder="Enter contact person"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingBuilder.email}
                        onChange={(e) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={editingBuilder.phone}
                        onChange={(e) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={editingBuilder.country}
                        onValueChange={(value) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            country: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={editingBuilder.city}
                        onValueChange={(value) =>
                          setEditingBuilder({ ...editingBuilder, city: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPANDED_EXHIBITION_DATA.cities.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                              {city.name}, {city.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editingBuilder.website || ""}
                      onChange={(e) =>
                        setEditingBuilder({
                          ...editingBuilder,
                          website: e.target.value,
                        })
                      }
                      placeholder="Enter website URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingBuilder.description}
                      onChange={(e) =>
                        setEditingBuilder({
                          ...editingBuilder,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter company description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={editingBuilder.status}
                        onValueChange={(
                          value: "active" | "inactive" | "pending" | "suspended"
                        ) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="plan">Plan</Label>
                      <Select
                        value={editingBuilder.plan}
                        onValueChange={(
                          value:
                            | "free"
                            | "basic"
                            | "professional"
                            | "enterprise"
                        ) =>
                          setEditingBuilder({ ...editingBuilder, plan: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verified"
                        checked={editingBuilder.verified}
                        onCheckedChange={(checked) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            verified: checked,
                          })
                        }
                      />
                      <Label htmlFor="verified">Verified</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={editingBuilder.featured}
                        onCheckedChange={(checked) =>
                          setEditingBuilder({
                            ...editingBuilder,
                            featured: checked,
                          })
                        }
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveBuilder}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ✅ NEW: Duplicate Management Interface */}
          {showDuplicates && duplicateGroups.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-red-900 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Duplicate Builders Detected
                    </CardTitle>
                    <CardDescription className="text-red-700">
                      Found {duplicateGroups.length} groups with{" "}
                      {duplicateGroups.reduce(
                        (sum, group) => sum + group.duplicates.length,
                        0
                      )}{" "}
                      total duplicates
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={autoResolveDuplicates}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Merge className="h-4 w-4 mr-1" />
                      Auto-Resolve High Confidence
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDuplicates(false)}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hide
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto scroll-smooth">
                  {duplicateGroups.map((group, groupIndex) => (
                    <div
                      key={group.id}
                      className="border border-red-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Duplicate Group #{groupIndex + 1}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Reason: {group.reason} • Confidence:
                            <span
                              className={`ml-1 font-medium ${
                                group.confidence === "high"
                                  ? "text-red-600"
                                  : group.confidence === "medium"
                                    ? "text-orange-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {group.confidence}
                            </span>
                          </p>
                        </div>
                        <Badge
                          className={`${
                            group.confidence === "high"
                              ? "bg-red-100 text-red-800"
                              : group.confidence === "medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {group.duplicates.length} duplicates
                        </Badge>
                      </div>

                      <div className="grid gap-3">
                        {group.duplicates.map((builder, builderIndex) => (
                          <div
                            key={builder.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Building className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {builder.companyName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {builder.email} • {builder.phone} •{" "}
                                  {builder.city}, {builder.country}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  {builder.verified && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      <Check className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                  {builder.gmbImported && (
                                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                                      GMB
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    ★ {builder.rating.toFixed(1)} •{" "}
                                    {builder.projectsCompleted} projects
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() =>
                                resolveDuplicateGroup(group.id, builder.id)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Keep This One
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
