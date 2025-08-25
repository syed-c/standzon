"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Building,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Star,
  Globe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  UserPlus,
  Activity,
  FileText,
  CreditCard,
  Settings,
  Shield,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Zap,
  Trash2,
  Upload,
  Edit,
  Plus,
  Save,
  ExternalLink,
  Database,
  HardDrive,
  UserCheck,
  Mail,
  Target,
  CheckSquare,
  User,
  UserPlus as UserPlusIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { adminAPI } from "@/lib/api/admin";
import { toast } from "sonner";

// Colors for pie chart
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];
import SimpleSmartBuilders from "@/components/SimpleSmartBuilders";
import AdminClaimsManager from "@/components/AdminClaimsManager";
import SystemSettingsPanel from "@/components/SystemSettingsPanel";
import AdminManagementSystem from "@/components/AdminManagementSystem";
import { SuperAdminLeadsManager } from "@/components/SuperAdminLeadsManager";
import { GlobalPagesManager } from "@/components/GlobalPagesManager";
import LogoutButton from "@/components/LogoutButton";
import DataAuditSystem from "@/components/DataAuditSystem";
import DataCompletenessDashboard from "@/components/DataCompletenessDashboard";
import DataPersistenceMonitor from "@/components/DataPersistenceMonitor";
import FinalAuditReport from "@/components/FinalAuditReport";
import BulkUploadSystem from "@/components/BulkUploadSystem";
import BulkBuilderImporter from "@/components/BulkBuilderImporter";
import GMBAPIFetchTool from "@/components/GMBAPIFetchTool";
import RealTimeBuilderManager from "@/components/RealTimeBuilderManager";
import FeaturedBuildersManager from "@/components/FeaturedBuildersManager";
import TradeShowManagement from "@/components/TradeShowManagement";
import WebsitePagesManager from "@/components/WebsitePagesManager";
import RealTimeContentEditor from "@/components/RealTimeContentEditor";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import RealTimePlatformAnalytics from "@/components/RealTimePlatformAnalytics";
import SuperAdminLocationManager from "@/components/SuperAdminLocationManager";
import UserManagement from "@/components/UserManagement";
import EnhancedSuperAdminControls from "@/components/EnhancedSuperAdminControls";

interface SuperAdminDashboardProps {
  adminId: string;
  permissions: string[];
}

export default function SuperAdminDashboard({
  adminId,
  permissions,
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [dashboardData] = useState<any>(true); // Always ready to show dashboard
  const [builders, setBuilders] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  // KPI Data Loading with real-time updates
  const [kpis, setKpis] = useState({
    totalUsers: 0,
    totalBuilders: 0,
    totalQuoteRequests: 0,
    totalRevenue: 0,
    verifiedBuilders: 0,
    newUsersToday: 0,
    newQuotesToday: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    platformRating: 0,
  });

  // Load real-time data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setRefreshing(true);
      try {
        console.log("📊 Loading real-time dashboard data...");

        // Load builders data with better error handling
        try {
          const buildersResponse = await fetch("/api/admin/builders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-cache",
          });

          console.log(
            "📊 Builders API response status:",
            buildersResponse.status
          );

          if (buildersResponse.ok) {
            const buildersData = await buildersResponse.json();
            console.log("📊 Builders API response:", buildersData);

            if (buildersData.success && buildersData.data) {
              const builders = buildersData.data.builders;
              console.log(
                `✅ Loaded ${builders.length} builders for dashboard`
              );

              // Set builders state for sidebar display
              setBuilders(builders);

              // Calculate real-time KPIs
              const realTimeKpis = {
                totalUsers: 0,
                totalBuilders: builders.length,
                totalQuoteRequests: 0,
                totalRevenue: 0,
                verifiedBuilders: builders.filter((b: any) => b.verified)
                  .length,
                newUsersToday: 0,
                newQuotesToday: 0,
                monthlyRevenue: 0,
                conversionRate: 0,
                platformRating: 0,
              };

              setKpis(realTimeKpis);
              console.log("✅ Dashboard KPIs updated:", realTimeKpis);
            } else {
              console.warn(
                "⚠️ Builders API returned unsuccessful response:",
                buildersData
              );
            }
          } else {
            const errorText = await buildersResponse.text();
            console.error(
              "❌ Builders API error response:",
              buildersResponse.status,
              errorText
            );
          }
        } catch (fetchError) {
          console.error("❌ Network error fetching builders:", fetchError);
          // Set fallback data so dashboard still works
          setBuilders([]);
          setKpis({
            totalUsers: 0,
            totalBuilders: 0,
            totalQuoteRequests: 0,
            totalRevenue: 0,
            verifiedBuilders: 0,
            newUsersToday: 0,
            newQuotesToday: 0,
            monthlyRevenue: 0,
            conversionRate: 0,
            platformRating: 0,
          });
        }
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
        // Set fallback data
        setBuilders([]);
        setKpis({
          totalUsers: 0,
          totalBuilders: 0,
          totalQuoteRequests: 0,
          totalRevenue: 0,
          verifiedBuilders: 0,
          newUsersToday: 0,
          newQuotesToday: 0,
          monthlyRevenue: 0,
          conversionRate: 0,
          platformRating: 0,
        });
      } finally {
        setRefreshing(false);
      }
    };

    loadDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add missing handleRefresh function
  const handleRefresh = () => {
    window.location.reload();
  };

  // Static dashboard data for charts
  const staticDashboardData = {
    trafficData: [],
    revenueData: [],
    topCountries: [],
    recentActivity: [],
  };

  const { trafficData, revenueData, topCountries, recentActivity } =
    staticDashboardData;

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 h-screen w-screen">
      {/* Left Sidebar */}
      <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Smart Admin AI</h1>
              <p className="text-sm text-slate-300">Intelligence Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">
              AI Active
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-4 bg-slate-900 overflow-y-auto scroll-smooth">
          {/* Dashboard Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">
              DASHBOARD
            </h3>
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Overview</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 text-xs border-green-400/30">
                {kpis.totalRevenue ? Math.round(kpis.totalRevenue / 1000) : 0}K
              </Badge>
            </button>
          </div>

          {/* Builder Management */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">
              BUILDERS
            </h3>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5" />
                <span className="font-medium">Smart Builders</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 text-xs border-blue-400/30">
                {builders.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Builder Analytics</span>
              </div>
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </button>

            <button
              onClick={() => setActiveTab("claims-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "claims-management"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Claims & Builder Status</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 text-xs border-orange-400/30">
                {kpis.pendingBuilders || 0}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("leads-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "leads-management"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Leads Management</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 text-xs border-green-400/30">
                {kpis.totalQuoteRequests || 0}
              </Badge>
            </button>
          </div>

          {/* Platform Intelligence Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              PLATFORM INTELLIGENCE
            </h3>

            <button
              onClick={() => setActiveTab("global-pages")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "global-pages"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Global Pages Manager</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 text-xs border-purple-400/30">
                247
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5" />
                <span className="font-medium">System Settings</span>
              </div>
            </button>
          </div>

          {/* Data Management & Import Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              DATA MANAGEMENT & IMPORT
            </h3>

            <button
              onClick={() => setActiveTab("bulk-upload")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "bulk-upload"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5" />
                <span className="font-medium">Bulk Upload System</span>
              </div>
              <Badge className="bg-green-500/20 text-green-300 text-xs border-green-400/30">
                CSV
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("bulk-import")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "bulk-import"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5" />
                <span className="font-medium">Bulk Builder Import</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-300 text-xs border-orange-400/30">
                FIX
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("data-audit")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "data-audit"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5" />
                <span className="font-medium">Data Audit System</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("data-completeness")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "data-completeness"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Data Completeness</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("data-persistence")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "data-persistence"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Data Persistence Monitor</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("final-audit")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "final-audit"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Final Audit Report</span>
              </div>
            </button>
          </div>

          {/* GMB Integration Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              GMB INTEGRATION
            </h3>

            <button
              onClick={() => setActiveTab("gmb-api-tool")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "gmb-api-tool"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" />
                <span className="font-medium">GMB API Fetch Tool</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300 text-xs border-yellow-400/30">
                API
              </Badge>
            </button>
          </div>

          {/* Advanced Management Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              ADVANCED MANAGEMENT
            </h3>

            <button
              onClick={() => setActiveTab("real-time-builders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "real-time-builders"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5" />
                <span className="font-medium">Real-Time Builders</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </button>

            <button
              onClick={() => setActiveTab("featured-builders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "featured-builders"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5" />
                <span className="font-medium">Featured Builders</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("tradeshows-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "tradeshows-management"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Trade Shows</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("location-manager")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "location-manager"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Location Manager</span>
              </div>
            </button>
          </div>

          {/* Content & Website Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              CONTENT & WEBSITE
            </h3>

            <button
              onClick={() => setActiveTab("website-pages")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "website-pages"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Website Pages</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("content-editor")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "content-editor"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Edit className="h-5 w-5" />
                <span className="font-medium">Content Editor</span>
              </div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </button>
          </div>

          {/* Analytics & Reports Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              ANALYTICS & REPORTS
            </h3>

            <button
              onClick={() => setActiveTab("advanced-analytics")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "advanced-analytics"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Advanced Analytics</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("platform-analytics")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "platform-analytics"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5" />
                <span className="font-medium">Platform Analytics</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </button>
          </div>

          {/* User Management Section */}
          <div className="space-y-1 bg-slate-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3 bg-slate-900">
              USER MANAGEMENT
            </h3>

            <button
              onClick={() => setActiveTab("user-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "user-management"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">User Management</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("super-admin-controls")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "super-admin-controls"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Super Admin Controls</span>
              </div>
              <Badge className="bg-red-500/20 text-red-300 text-xs border-red-400/30">
                ADMIN
              </Badge>
            </button>
          </div>
        </nav>

        {/* Footer with Logout Button */}
        <div className="p-4 border-t border-slate-700 bg-slate-900 space-y-3">
          <button
            onClick={() => setActiveTab("admin-management")}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                Super Admin
              </p>
              <p className="text-xs text-slate-400 truncate">
                admin@exhibitbay.com
              </p>
            </div>
            <Settings className="h-4 w-4 text-slate-400" />
          </button>

          <div className="pt-2">
            <LogoutButton
              variant="outline"
              size="sm"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500"
              redirectTo="/auth/login"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === "overview" && "Smart Overview"}
                    {activeTab === "users" && "Smart Builders"}
                    {activeTab === "analytics" && "Builder Analytics"}
                    {activeTab === "claims-management" &&
                      "Claims & Builder Status Management"}
                    {activeTab === "leads-management" &&
                      "Leads Management System"}
                    {activeTab === "global-pages" && "Global Pages Manager"}
                    {activeTab === "settings" && "System Settings"}
                    {activeTab === "admin-management" &&
                      "Admin Management System"}
                    {activeTab === "bulk-upload" && "Bulk Upload System"}
                    {activeTab === "bulk-import" &&
                      "Bulk Builder Import System"}
                    {activeTab === "data-audit" && "Data Audit System"}
                    {activeTab === "data-completeness" &&
                      "Data Completeness Dashboard"}
                    {activeTab === "data-persistence" &&
                      "Data Persistence Monitor"}
                    {activeTab === "final-audit" && "Final Audit Report"}
                    {activeTab === "gmb-api-tool" && "GMB API Fetch Tool"}
                    {activeTab === "real-time-builders" &&
                      "Real-Time Builder Manager"}
                    {activeTab === "featured-builders" &&
                      "Featured Builders Manager"}
                    {activeTab === "tradeshows-management" &&
                      "Trade Shows Management"}
                    {activeTab === "location-manager" && "Location Manager"}
                    {activeTab === "website-pages" && "Website Pages Manager"}
                    {activeTab === "content-editor" &&
                      "Real-Time Content Editor"}
                    {activeTab === "advanced-analytics" && "Advanced Analytics"}
                    {activeTab === "platform-analytics" &&
                      "Real-Time Platform Analytics"}
                    {activeTab === "user-management" &&
                      "User Management System"}
                    {activeTab === "super-admin-controls" &&
                      "Super Admin Controls"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeTab === "overview" &&
                      "Comprehensive platform overview and insights"}
                    {activeTab === "users" &&
                      "Real-time AI-powered platform intelligence"}
                    {activeTab === "analytics" &&
                      "Advanced analytics and performance metrics"}
                    {activeTab === "claims-management" &&
                      "Manage profile claims, OTP verifications, and builder status across all sources"}
                    {activeTab === "leads-management" &&
                      "Track and manage all lead submissions from hero forms, contact forms, and quote requests with comprehensive analytics"}
                    {activeTab === "global-pages" &&
                      "Manage all 247 countries and cities exhibition stand pages with automatic GMB builder integration"}
                    {activeTab === "settings" &&
                      "Platform configuration and administration"}
                    {activeTab === "admin-management" &&
                      "Manage admin users, assign role-based permissions, and control access to different platform areas"}
                    {activeTab === "bulk-upload" &&
                      "Upload builders, trade shows, and locations in bulk using CSV files with validation and error reporting"}
                    {activeTab === "bulk-import" &&
                      "Restore missing builders for countries (US, UAE, UK, Australia) with comprehensive data generation and import system"}
                    {activeTab === "data-audit" &&
                      "Comprehensive data completeness analysis, validation, and automated publishing system"}
                    {activeTab === "data-completeness" &&
                      "Monitor data quality, missing fields, and completeness metrics across all platform content"}
                    {activeTab === "data-persistence" &&
                      "Real-time monitoring of data persistence, backups, and recovery systems"}
                    {activeTab === "final-audit" &&
                      "Complete platform audit with system health checks, performance metrics, and compliance reporting"}
                    {activeTab === "gmb-api-tool" &&
                      "Fetch and import exhibition builders from Google My Business API with automated profile creation"}
                    {activeTab === "real-time-builders" &&
                      "Live builder management with real-time updates, bulk operations, and instant synchronization"}
                    {activeTab === "featured-builders" &&
                      "Manage featured builder showcases, priorities, and promotional placements across the platform"}
                    {activeTab === "tradeshows-management" &&
                      "Comprehensive trade show and exhibition management with venue details, dates, and builder assignments"}
                    {activeTab === "location-manager" &&
                      "Global location management for countries, cities, and regions with SEO optimization"}
                    {activeTab === "website-pages" &&
                      "Manage all website pages, SEO settings, meta descriptions, and content structure"}
                    {activeTab === "content-editor" &&
                      "Real-time content editing with live preview, version control, and instant publishing"}
                    {activeTab === "advanced-analytics" &&
                      "Deep analytics with custom reports, conversion tracking, and business intelligence"}
                    {activeTab === "platform-analytics" &&
                      "Real-time platform performance monitoring with live metrics and alert systems"}
                    {activeTab === "user-management" &&
                      "Comprehensive user account management, permissions, and access control across all user types"}
                    {activeTab === "super-admin-controls" &&
                      "Ultimate admin control panel with system-wide management, emergency controls, and platform administration"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNotifications(true)}
                className="relative flex items-center space-x-2 text-gray-900"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </div>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 text-gray-900"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 scroll-smooth">
          <div className="h-full w-full">
            {/* Tab Content */}
            {activeTab === "users" && (
              <div className="h-full overflow-hidden">
                <SimpleSmartBuilders />
              </div>
            )}

            {activeTab === "claims-management" && (
              <div className="h-full overflow-hidden">
                <AdminClaimsManager
                  adminId={adminId}
                  permissions={permissions}
                />
              </div>
            )}

            {activeTab === "leads-management" && (
              <div className="h-full overflow-hidden">
                <SuperAdminLeadsManager />
              </div>
            )}

            {activeTab === "global-pages" && (
              <div className="h-full overflow-hidden">
                <GlobalPagesManager />
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-6 p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(kpis.totalUsers || 0).toLocaleString()}
                      </div>
                      <p className="text-xs opacity-90">
                        +{kpis.newUsersToday || 0} today
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">
                        Total Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${(kpis.totalRevenue || 0).toLocaleString()}
                      </div>
                      <p className="text-xs opacity-90">
                        ${(kpis.monthlyRevenue || 0).toLocaleString()} this
                        month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">
                        Active Builders
                      </CardTitle>
                      <Building className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(kpis.totalBuilders || 0).toLocaleString()}
                      </div>
                      <p className="text-xs opacity-90">
                        {kpis.verifiedBuilders || 0} verified
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">
                        Quote Requests
                      </CardTitle>
                      <FileText className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(kpis.totalQuoteRequests || 0).toLocaleString()}
                      </div>
                      <p className="text-xs opacity-90">
                        +{kpis.newQuotesToday || 0} today
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Traffic Overview</span>
                      </CardTitle>
                      <CardDescription>
                        Visitors, conversions, and revenue trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="visitors"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                          />
                          <Area
                            type="monotone"
                            dataKey="conversions"
                            stackId="2"
                            stroke="#10B981"
                            fill="#10B981"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Revenue Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChartIcon className="h-5 w-5" />
                        <span>Revenue Sources</span>
                      </CardTitle>
                      <CardDescription>
                        Revenue distribution by source
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={revenueData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {revenueData.map((entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                      <CardDescription>
                        Key performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Conversion Rate</span>
                          <span>{kpis.conversionRate || 0}%</span>
                        </div>
                        <Progress
                          value={kpis.conversionRate || 0}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Platform Rating</span>
                          <span>{kpis.platformRating || 0}/5.0</span>
                        </div>
                        <Progress
                          value={((kpis.platformRating || 0) / 5) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Builder Verification Rate</span>
                          <span>
                            {(kpis.totalBuilders || 0) > 0
                              ? Math.round(
                                  ((kpis.verifiedBuilders || 0) /
                                    (kpis.totalBuilders || 1)) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (kpis.totalBuilders || 0) > 0
                              ? ((kpis.verifiedBuilders || 0) /
                                  (kpis.totalBuilders || 1)) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Growth */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Growth</CardTitle>
                      <CardDescription>Platform growth metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="#3B82F6"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="conversions"
                            stroke="#10B981"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <SystemSettingsPanel
                adminId={adminId}
                permissions={permissions}
              />
            )}

            {activeTab === "admin-management" && (
              <AdminManagementSystem
                adminId={adminId}
                permissions={permissions}
              />
            )}

            {/* Data Management & Import Tabs */}
            {activeTab === "bulk-upload" && (
              <div className="h-full overflow-hidden">
                <BulkUploadSystem />
              </div>
            )}

            {activeTab === "bulk-import" && (
              <div className="h-full overflow-y-auto scroll-smooth p-6">
                <BulkBuilderImporter />
              </div>
            )}

            {activeTab === "data-audit" && (
              <div className="h-full overflow-hidden">
                <DataAuditSystem />
              </div>
            )}

            {activeTab === "data-completeness" && (
              <div className="h-full overflow-hidden">
                <DataCompletenessDashboard />
              </div>
            )}

            {activeTab === "data-persistence" && (
              <div className="h-full overflow-hidden">
                <DataPersistenceMonitor />
              </div>
            )}

            {activeTab === "final-audit" && (
              <div className="h-full overflow-hidden">
                <FinalAuditReport />
              </div>
            )}

            {/* GMB Integration Tabs */}
            {activeTab === "gmb-api-tool" && (
              <div className="h-full overflow-y-auto scroll-smooth">
                <GMBAPIFetchTool adminId={adminId} permissions={permissions} />
              </div>
            )}

            {/* Advanced Management Tabs */}
            {activeTab === "real-time-builders" && (
              <div className="h-full overflow-hidden">
                <RealTimeBuilderManager />
              </div>
            )}

            {activeTab === "featured-builders" && (
              <div className="h-full overflow-hidden">
                <FeaturedBuildersManager />
              </div>
            )}

            {activeTab === "tradeshows-management" && (
              <div className="h-full overflow-hidden">
                <TradeShowManagement />
              </div>
            )}

            {activeTab === "location-manager" && (
              <div className="h-full overflow-hidden">
                <SuperAdminLocationManager />
              </div>
            )}

            {/* Content & Website Tabs */}
            {activeTab === "website-pages" && (
              <div className="h-full overflow-hidden">
                <WebsitePagesManager />
              </div>
            )}

            {activeTab === "content-editor" && (
              <div className="h-full overflow-hidden">
                <RealTimeContentEditor userRole="admin" canPublish={true} />
              </div>
            )}

            {/* Analytics & Reports Tabs */}
            {activeTab === "advanced-analytics" && (
              <div className="h-full overflow-hidden">
                <AdvancedAnalytics />
              </div>
            )}

            {activeTab === "platform-analytics" && (
              <div className="h-full overflow-hidden">
                <RealTimePlatformAnalytics />
              </div>
            )}

            {/* User Management Tabs */}
            {activeTab === "user-management" && (
              <div className="h-full overflow-hidden">
                <UserManagement />
              </div>
            )}

            {activeTab === "super-admin-controls" && (
              <div className="h-full overflow-hidden">
                <EnhancedSuperAdminControls
                  adminId={adminId}
                  permissions={permissions}
                  data={staticDashboardData}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
