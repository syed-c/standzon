"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from '@/components/client/ThemeProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Badge } from "@/components/shared/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shared/avatar";
import { Progress } from "@/components/shared/progress";
import { Input } from "@/components/shared/input";
import { Textarea } from "@/components/shared/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
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
import SimpleSmartBuilders from "@/components/client/SimpleSmartBuilders";
import AdminClaimsManager from '@/components/client/AdminClaimsManager';
import SystemSettingsPanel from '@/components/client/SystemSettingsPanel';
import AdminManagementSystem from '@/components/client/AdminManagementSystem';
import { SuperAdminLeadsManager } from "@/components/client/SuperAdminLeadsManager";
import { GlobalPagesManager } from "@/components/client/GlobalPagesManager";
import LogoutButton from "@/components/client/LogoutButton";
import DataAuditSystem from '@/components/client/DataAuditSystem';
import DataCompletenessDashboard from '@/components/client/DataCompletenessDashboard';
import DataPersistenceMonitor from '@/components/client/DataPersistenceMonitor';
import FinalAuditReport from "@/components/client/FinalAuditReport";
import BulkUploadSystem from '@/components/client/BulkUploadSystem';
import BulkBuilderImporter from '@/components/client/BulkBuilderImporter';
import GMBAPIFetchTool from "@/components/client/GMBAPIFetchTool";
import RealTimeBuilderManager from '@/components/client/RealTimeBuilderManager';
import FeaturedBuildersManager from '@/components/client/FeaturedBuildersManager';
import TradeShowManagement from '@/components/client/TradeShowManagement';
import WebsitePagesManager from '@/components/client/WebsitePagesManager';
import RealTimeContentEditor from "@/components/client/RealTimeContentEditor";
import AdvancedAnalytics from '@/components/client/AdvancedAnalytics';
import RealTimePlatformAnalytics from "@/components/client/RealTimePlatformAnalytics";
import SuperAdminLocationManager from '@/components/client/SuperAdminLocationManager';
import UserManagement from '@/components/client/UserManagement';
import EnhancedSuperAdminControls from '@/components/client/EnhancedSuperAdminControls';
import { TestLocationBuilders } from "@/components/client/TestLocationBuilders";

interface SuperAdminDashboardProps {
  adminId: string;
  permissions: string[];
  hideSidebar?: boolean;
}

export default function SuperAdminDashboard({
  adminId,
  permissions,
  hideSidebar = false,
}: SuperAdminDashboardProps) {
  const { theme } = useTheme();
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
    pendingBuilders: 0,
    newBuildersToday: 0,
  });

  // Load real-time data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setRefreshing(true);
      try {
        console.log("📊 Loading real-time dashboard data...");

        // Load builders data with better error handling
        try {
          const buildersResponse = await fetch("/api/admin/builders?limit=1000&prioritize_real=true", {
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
                pendingBuilders: 0,
                newBuildersToday: builders.length, // Use builders.length as placeholder
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
            pendingBuilders: 0,
            newBuildersToday: 0,
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
          pendingBuilders: 0,
          newBuildersToday: 0,
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
    trafficData: [
      { name: "Jan", visitors: 4000, conversions: 2400 },
      { name: "Feb", visitors: 3000, conversions: 1398 },
      { name: "Mar", visitors: 2000, conversions: 9800 },
      { name: "Apr", visitors: 2780, conversions: 3908 },
      { name: "May", visitors: 1890, conversions: 4800 },
      { name: "Jun", visitors: 2390, conversions: 3800 },
      { name: "Jul", visitors: 3490, conversions: 4300 },
    ],
    revenueData: [
      { name: "Direct", value: 400 },
      { name: "Social", value: 300 },
      { name: "Referral", value: 300 },
      { name: "Email", value: 200 },
    ],
    topCountries: [
      { name: "USA", value: 400 },
      { name: "UK", value: 300 },
      { name: "Canada", value: 300 },
      { name: "Germany", value: 200 },
    ],
    recentActivity: [
      { id: 1, action: "New builder registered", time: "2 min ago" },
      { id: 2, action: "Lead assigned", time: "15 min ago" },
      { id: 3, action: "Payment received", time: "1 hour ago" },
    ],
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
    <div className={`flex min-h-screen w-full overflow-hidden admin-dashboard ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gray-50'}`}>
      {/* Left Sidebar */}
      {!hideSidebar && (
      <div className={`w-[260px] shadow-2xl border-r flex flex-col ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-gray-800' : 'bg-white border-gray-200'}`}>
        {/* Header */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Smart Admin AI</h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Intelligence Center</p>
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
        <nav className={`flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {/* Dashboard Overview */}
          <div className="space-y-2">
            <h3 className={`text-xs font-semibold uppercase tracking-wider px-2 mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              DASHBOARD
            </h3>
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-l-4 border-blue-500 shadow-sm" 
                  : `${theme === 'dark' ? 'hover:bg-gray-800 hover:shadow-sm' : 'hover:bg-gray-100 hover:shadow-sm'}`
              } ${theme === 'dark' ? (activeTab === "overview" ? 'text-blue-400' : 'text-gray-300 hover:text-gray-100') : (activeTab === "overview" ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900')}`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Overview</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 text-xs border-green-400/30">
                {kpis.totalRevenue ? Math.round(kpis.totalRevenue / 1000) : 0}K
              </Badge>
            </button>
          </div>

          {/* Builder Management */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
              BUILDERS
            </h3>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-l-4 border-blue-500 shadow-sm" 
                  : `${theme === 'dark' ? 'hover:bg-gray-800 hover:shadow-sm' : 'hover:bg-gray-100 hover:shadow-sm'}`
              } ${theme === 'dark' ? (activeTab === "users" ? 'text-blue-400' : 'text-gray-300 hover:text-gray-100') : (activeTab === "users" ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900')}`}
            >
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5" />
                <span className="font-medium">Smart Builders</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 text-xs border-blue-400/30">
                {builders.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
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
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Claims & Builder Status</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 text-xs border-orange-400/30">
                {kpis.pendingBuilders || 0}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("leads-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "leads-management"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Leads Management</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 text-xs border-green-400/30">
                {kpis.totalQuoteRequests || 0}
              </Badge>
            </button>
          </div>

          {/* Platform Intelligence Section */}
          <div className="space-y-1 bg-gray-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              PLATFORM INTELLIGENCE
            </h3>

            <button
              onClick={() => setActiveTab("global-pages")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "global-pages"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Global Pages Manager</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 text-xs border-purple-400/30">
                247
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5" />
                <span className="font-medium">System Settings</span>
              </div>
            </button>
          </div>

          {/* Data Management & Import Section */}
          <div className="space-y-1 bg-gray-900 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              DATA MANAGEMENT & IMPORT
            </h3>

            <button
              onClick={() => setActiveTab("bulk-upload")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "bulk-upload"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5" />
                <span className="font-medium">Bulk Upload System</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 text-xs border-green-400/30">
                CSV
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("bulk-import")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "bulk-import"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5" />
                <span className="font-medium">Bulk Builder Import</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 text-xs border-orange-400/30">
                FIX
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("data-audit")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "data-audit"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
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
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
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
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
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
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Final Audit Report</span>
              </div>
            </button>
          </div>

          {/* GMB Integration Section */}
          <div className="space-y-1 bg-gray-800 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              GMB INTEGRATION
            </h3>

            <button
              onClick={() => setActiveTab("gmb-api-tool")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "gmb-api-tool"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" />
                <span className="font-medium">GMB API Fetch Tool</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs border-yellow-400/30">
                API
              </Badge>
            </button>
          </div>

          {/* Advanced Management Section */}
          <div className="space-y-1 bg-gray-800 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              ADVANCED MANAGEMENT
            </h3>

            <button
              onClick={() => setActiveTab("real-time-builders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "real-time-builders"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
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
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5" />
                <span className="font-medium">Featured Builders</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 text-xs border-purple-400/30">
                42
              </Badge>
            </button>
          </div>

          {/* User Management Section */}
          <div className="space-y-1 bg-gray-800 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              USER MANAGEMENT
            </h3>

            <button
              onClick={() => setActiveTab("user-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "user-management"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5" />
                <span className="font-medium">User Management</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 text-xs border-blue-400/30">
                {kpis.totalUsers || 0}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("admin-management")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "admin-management"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Admin Management</span>
              </div>
            </button>
          </div>

          {/* System Tools */}
          <div className="space-y-1 bg-gray-800 p-2 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              SYSTEM TOOLS
            </h3>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "logs"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <span className="font-medium">System Logs</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("backup")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "backup"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <HardDrive className="h-5 w-5" />
                <span className="font-medium">Backup & Restore</span>
              </div>
            </button>
          </div>
          
          {/* Diagnostics Section */}
          <div className="space-y-1 bg-gray-900 p-2 rounded-lg mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 bg-gray-800">
              DIAGNOSTICS
            </h3>

            <button
              onClick={() => setActiveTab("diagnostics")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === "diagnostics"
                  ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border-l-4 border-blue-500 shadow-sm" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5" />
                <span className="font-medium">Diagnostics</span>
              </div>
            </button>
          </div>
        </nav>
      </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800' : 'bg-white border-b border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "Smart Builders"}
              {activeTab === "analytics" && "Builder Analytics"}
              {activeTab === "claims-management" && "Claims Management"}
              {activeTab === "leads-management" && "Leads Management"}
              {activeTab === "global-pages" && "Global Pages Manager"}
              {activeTab === "settings" && "System Settings"}
              {activeTab === "bulk-upload" && "Bulk Upload System"}
              {activeTab === "bulk-import" && "Bulk Builder Import"}
              {activeTab === "data-audit" && "Data Audit System"}
              {activeTab === "data-completeness" && "Data Completeness"}
              {activeTab === "data-persistence" && "Data Persistence Monitor"}
              {activeTab === "final-audit" && "Final Audit Report"}
              {activeTab === "gmb-api-tool" && "GMB API Fetch Tool"}
              {activeTab === "real-time-builders" && "Real-Time Builders"}
              {activeTab === "featured-builders" && "Featured Builders"}
              {activeTab === "user-management" && "User Management"}
              {activeTab === "admin-management" && "Admin Management"}
              {activeTab === "logs" && "System Logs"}
              {activeTab === "backup" && "Backup & Restore"}
              {activeTab === "diagnostics" && "Diagnostics"}
            </h1>
            <Badge className="bg-blue-500/20 text-blue-400">
              {activeTab === "overview" && "Real-time"}
              {activeTab === "users" && "Active"}
              {activeTab === "analytics" && "Live"}
              {activeTab === "claims-management" && "Pending"}
              {activeTab === "leads-management" && "Hot"}
              {activeTab === "global-pages" && "Managed"}
              {activeTab === "settings" && "Configured"}
              {activeTab === "bulk-upload" && "Ready"}
              {activeTab === "bulk-import" && "Processing"}
              {activeTab === "data-audit" && "Auditing"}
              {activeTab === "data-completeness" && "Analyzing"}
              {activeTab === "data-persistence" && "Monitoring"}
              {activeTab === "final-audit" && "Completed"}
              {activeTab === "gmb-api-tool" && "Connected"}
              {activeTab === "real-time-builders" && "Live"}
              {activeTab === "featured-builders" && "Curated"}
              {activeTab === "user-management" && "Active"}
              {activeTab === "admin-management" && "Secure"}
              {activeTab === "logs" && "Updated"}
              {activeTab === "backup" && "Protected"}
              {activeTab === "diagnostics" && "Testing"}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gray-50'}`}>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={`backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Total Builders
                    </CardTitle>
                    <Building className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {(kpis.totalBuilders || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-400">
                      +{kpis.newBuildersToday || 0} today
                    </p>
                  </CardContent>
                </Card>

                <Card className={`backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Verified Builders
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {(kpis.verifiedBuilders || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-400">
                      {kpis.totalBuilders
                        ? Math.round(
                            ((kpis.verifiedBuilders || 0) /
                              (kpis.totalBuilders || 1)) *
                              100
                          )
                        : 0}
                      % verified
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Monthly Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${(kpis.monthlyRevenue || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-400">
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Quote Requests
                    </CardTitle>
                    <FileText className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {(kpis.totalQuoteRequests || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-400">
                      +{kpis.newQuotesToday || 0} today
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Overview */}
                <Card className={`backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <BarChart3 className="h-5 w-5" />
                      <span>Traffic Overview</span>
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Visitors, conversions, and revenue trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#D1D5DB'} />
                        <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
                            borderColor: theme === 'dark' ? '#374151' : '#D1D5DB', 
                            borderRadius: '0.5rem',
                            color: theme === 'dark' ? '#F9FAFB' : '#111827'
                          }} 
                        />
                        <Area
                          type="monotone"
                          dataKey="visitors"
                          stackId="1"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.2}
                        />
                        <Area
                          type="monotone"
                          dataKey="conversions"
                          stackId="2"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card className={`backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <PieChartIcon className="h-5 w-5" />
                      <span>Revenue Sources</span>
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
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
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
                            borderColor: theme === 'dark' ? '#374151' : '#D1D5DB', 
                            borderRadius: '0.5rem',
                            color: theme === 'dark' ? '#F9FAFB' : '#111827'
                          }} 
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Performance</CardTitle>
                    <CardDescription className="text-gray-400">
                      Key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Conversion Rate</span>
                        <span>{kpis.conversionRate || 0}%</span>
                      </div>
                      <Progress
                        value={kpis.conversionRate || 0}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
                        <span>Platform Rating</span>
                        <span>{kpis.platformRating || 0}/5.0</span>
                      </div>
                      <Progress
                        value={((kpis.platformRating || 0) / 5) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 text-gray-300">
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
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Growth</CardTitle>
                    <CardDescription className="text-gray-400">Platform growth metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            borderColor: '#374151', 
                            borderRadius: '0.5rem',
                            color: '#F9FAFB'
                          }} 
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="visitors"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="conversions"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: '#10B981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <SystemSettingsPanel 
                adminId={adminId} 
                permissions={permissions} 
              />
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <SimpleSmartBuilders />
            </div>
          )}

          {activeTab === "claims-management" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <AdminClaimsManager 
                adminId={adminId} 
                permissions={permissions} 
              />
            </div>
          )}

          {activeTab === "leads-management" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <SuperAdminLeadsManager />
            </div>
          )}

          {activeTab === "global-pages" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <GlobalPagesManager />
            </div>
          )}

          {activeTab === "bulk-upload" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <BulkUploadSystem 
                userRole="admin"
              />
            </div>
          )}

          {activeTab === "bulk-import" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <BulkBuilderImporter />
            </div>
          )}

          {activeTab === "data-audit" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <DataAuditSystem />
            </div>
          )}

          {activeTab === "data-completeness" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <DataCompletenessDashboard />
            </div>
          )}

          {activeTab === "data-persistence" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <DataPersistenceMonitor />
            </div>
          )}

          {activeTab === "final-audit" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <FinalAuditReport />
            </div>
          )}

          {activeTab === "gmb-api-tool" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <GMBAPIFetchTool 
                adminId={adminId} 
                permissions={permissions} 
              />
            </div>
          )}

          {activeTab === "real-time-builders" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <RealTimeBuilderManager />
            </div>
          )}

          {activeTab === "featured-builders" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <FeaturedBuildersManager />
            </div>
          )}

          {activeTab === "user-management" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <UserManagement 
                adminId={adminId} 
              />
            </div>
          )}

          {activeTab === "admin-management" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <AdminManagementSystem 
                adminId={adminId} 
                permissions={permissions} 
              />
            </div>
          )}
          
          {activeTab === "diagnostics" && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
              <TestLocationBuilders />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}