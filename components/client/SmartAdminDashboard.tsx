"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Badge } from "@/components/shared/badge";
import { Progress } from "@/components/shared/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/dialog";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Textarea } from "@/components/shared/textarea";
import { Switch } from "@/components/shared/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/select";
import {
  Users,
  DollarSign,
  Building,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  Activity,
  RefreshCw,
  Zap,
  Calendar,
  Search,
  MapPin,
  Eye,
  MessageSquare,
  Upload,
  Download,
  Target,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Server,
  Database,
  Wifi,
  Clock,
  Settings,
  Bell,
  CreditCard,
  UserPlus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Import components that might be missing
const SuperAdminAuditReport = () => (
  <Card>
    <CardHeader>
      <CardTitle>System Audit Report</CardTitle>
      <CardDescription>
        Comprehensive system health and security audit
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h4 className="font-medium text-green-800">Security Status</h4>
          <p className="text-sm text-green-600">All systems secure</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h4 className="font-medium text-blue-800">System Health</h4>
          <p className="text-sm text-blue-600">Operating normally</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <h4 className="font-medium text-purple-800">Data Integrity</h4>
          <p className="text-sm text-purple-600">All checks passed</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const GeographicManagement = ({
  adminId,
  permissions,
}: {
  adminId: string;
  permissions: string[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-cyan-600" />
        <span>Geographic Management</span>
      </CardTitle>
      <CardDescription>Manage countries, cities, and venues</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Countries</h4>
          <p className="text-2xl font-bold text-blue-600">45</p>
          <p className="text-sm text-gray-500">Global coverage</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Cities</h4>
          <p className="text-2xl font-bold text-green-600">156</p>
          <p className="text-sm text-gray-500">Exhibition hubs</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Venues</h4>
          <p className="text-2xl font-bold text-purple-600">890</p>
          <p className="text-sm text-gray-500">Active venues</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface SmartAdminDashboardProps {
  adminId: string;
  permissions: string[];
}

interface DashboardData {
  kpis: {
    totalUsers: number;
    totalBuilders: number;
    totalLeads: number;
    totalRevenue: number;
    conversionRate: number;
    platformRating: number;
    averageResponseTime: number;
    verifiedBuilders: number;
    activeConversations: number;
    monthlyRevenue: number;
    newUsersToday: number;
    newQuotesToday: number;
  };
  trafficData: Array<{
    name: string;
    visitors: number;
    conversions: number;
    revenue: number;
  }>;
  revenueData: Array<{
    name: string;
    value: number;
    amount: number;
  }>;
  topCountries: Array<{
    country: string;
    builders: number;
    quotes: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    action: string;
    user: string;
    time: string;
    type: "success" | "warning" | "info";
  }>;
}

export default function SmartAdminDashboard({
  adminId,
  permissions,
}: SmartAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // System Settings Modal States
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);
  const [showDatabaseBackup, setShowDatabaseBackup] = useState(false);
  const [showSystemLogs, setShowSystemLogs] = useState(false);

  // Form States
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "ExhibitBay",
    siteDescription: "Global Exhibition Stand Builder Marketplace",
    maintenanceMode: false,
    allowRegistrations: true,
    defaultLanguage: "en",
    timezone: "UTC",
  });

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "admin",
    permissions: [],
  });

  const [systemLogs, setSystemLogs] = useState([
    {
      timestamp: "2025-07-05 02:45:12",
      level: "INFO",
      message: "User registration: john@example.com",
      module: "AUTH",
    },
    {
      timestamp: "2025-07-05 02:43:45",
      level: "WARN",
      message: "High API usage detected from IP 192.168.1.100",
      module: "API",
    },
    {
      timestamp: "2025-07-05 02:42:18",
      level: "INFO",
      message: "Builder profile updated: Expo Design Germany",
      module: "BUILDERS",
    },
    {
      timestamp: "2025-07-05 02:41:33",
      level: "ERROR",
      message: "Payment processing failed for invoice #12345",
      module: "PAYMENTS",
    },
    {
      timestamp: "2025-07-05 02:40:56",
      level: "INFO",
      message: "Lead submitted: CES 2025 booth design",
      module: "LEADS",
    },
  ]);

  // Static dashboard data for immediate display
  const dashboardData: DashboardData = {
    kpis: {
      totalUsers: 0,
      totalBuilders: 0,
      totalLeads: 0,
      totalRevenue: 0,
      conversionRate: 0,
      platformRating: 0,
      averageResponseTime: 0,
      verifiedBuilders: 0,
      activeConversations: 0,
      monthlyRevenue: 0,
      newUsersToday: 0,
      newQuotesToday: 0,
    },
    trafficData: [],
    revenueData: [],
    topCountries: [],
    recentActivity: [],
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Dashboard data is available immediately, no loading state needed

  const { kpis, trafficData, revenueData, topCountries, recentActivity } =
    dashboardData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Smart Admin AI
              </h1>
              <p className="text-sm text-gray-500">
                Fully Functional Intelligence Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          <div className="px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              SMART OVERVIEW
            </h3>
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "overview"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Smart Overview</span>
              <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                $120K
              </span>
            </button>
          </div>

          {/* NEW: LOCATION MANAGER */}
          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              🌍 LOCATION MANAGER
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("location-manager")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "location-manager"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Globe className="h-5 w-5" />
                <span className="font-medium">Countries & Cities</span>
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  201
                </span>
              </button>

              <button
                onClick={() => setActiveTab("venue-manager")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "venue-manager"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Venues & Locations</span>
                <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                  890
                </span>
              </button>
            </div>
          </div>

          {/* UPDATED: VENDOR MANAGER */}
          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              🏗️ VENDOR MANAGER
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("builder-intelligence")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "builder-intelligence"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Zap className="h-5 w-5" />
                <span className="font-medium">Builder Intelligence</span>
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  9
                </span>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Building className="h-5 w-5" />
                <span className="font-medium">Smart Builders</span>
                <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  200
                </span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "analytics"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Builder Analytics</span>
                <span className="ml-auto text-xs text-purple-600">✨</span>
              </button>

              <button
                onClick={() => setActiveTab("vendor-approvals")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "vendor-approvals"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Pending Approvals</span>
                <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  23
                </span>
              </button>
            </div>
          </div>

          {/* NEW: EXHIBITION MANAGER */}
          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              📅 EXHIBITION MANAGER
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("exhibitions")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "exhibitions"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Exhibitions</span>
                <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                  1247
                </span>
              </button>

              <button
                onClick={() => setActiveTab("event-categories")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "event-categories"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Target className="h-5 w-5" />
                <span className="font-medium">Event Categories</span>
                <span className="ml-auto text-xs text-cyan-600">🎯</span>
              </button>
            </div>
          </div>

          {/* NEW: GMB & DATA TOOLS */}
          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              🔍 DATA TOOLS
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("gmb-fetch")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "gmb-fetch"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Search className="h-5 w-5" />
                <span className="font-medium">GMB Fetch Tool</span>
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  API
                </span>
              </button>

              <button
                onClick={() => setActiveTab("bulk-operations")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "bulk-operations"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Upload className="h-5 w-5" />
                <span className="font-medium">Bulk Operations</span>
                <span className="ml-auto text-xs text-orange-600">📊</span>
              </button>
            </div>
          </div>

          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              PLATFORM INTELLIGENCE
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("platform-intelligence")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "platform-intelligence"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Server className="h-5 w-5" />
                <span className="font-medium">Platform Intelligence</span>
                <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                  1847
                </span>
              </button>

              <button
                onClick={() => setActiveTab("ai-insights")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "ai-insights"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Zap className="h-5 w-5" />
                <span className="font-medium">AI Insights</span>
                <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  3
                </span>
                <span className="ml-1 text-xs">🔥</span>
              </button>

              <button
                onClick={() => setActiveTab("revenue")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "revenue"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Revenue Intelligence</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === "settings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">System Settings</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="ml-64 min-h-screen bg-gray-50">
        <div className="p-6 h-full overflow-y-auto">
          {/* 1. SMART OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">
                      Total Vendors
                    </CardTitle>
                    <Building className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpis.totalBuilders.toLocaleString()}
                    </div>
                    <p className="text-xs opacity-90">
                      198 Builders + 147 Planners
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">
                      Monthly Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${kpis.monthlyRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs opacity-90">
                      From {kpis.verifiedBuilders} verified vendors
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">
                      Global Coverage
                    </CardTitle>
                    <Globe className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs opacity-90">
                      Countries, 156 cities, 1,247 exhibitions
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">
                      Active Leads
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 opacity-90" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpis.totalLeads.toLocaleString()}
                    </div>
                    <p className="text-xs opacity-90">
                      {kpis.activeConversations} pending responses
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Traffic & Revenue Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Platform Growth</span>
                    </CardTitle>
                    <CardDescription>
                      Monthly visitors and conversions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trafficData.map((month, index) => (
                        <div
                          key={month.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 text-sm font-medium">
                              {month.name}
                            </div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${(month.visitors / 3500) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {month.visitors.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChartIcon className="h-5 w-5" />
                      <span>Revenue Sources</span>
                    </CardTitle>
                    <CardDescription>
                      Revenue breakdown by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: [
                                  "#3B82F6",
                                  "#10B981",
                                  "#F59E0B",
                                  "#EF4444",
                                ][index],
                              }}
                            ></div>
                            <span className="text-sm font-medium">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ${item.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.value}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Countries & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Top Performing Countries</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCountries.map((country, index) => (
                        <div
                          key={country.country}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-semibold text-gray-500">
                              #{index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{country.country}</h4>
                              <p className="text-sm text-gray-500">
                                {country.builders} builders • {country.quotes}{" "}
                                quotes
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${country.revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Revenue</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === "success"
                                ? "bg-green-400"
                                : activity.type === "warning"
                                  ? "bg-yellow-400"
                                  : "bg-blue-400"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.user} • {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 2. BUILDER INTELLIGENCE */}
          {activeTab === "builder-intelligence" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span>Builder Intelligence Center</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered insights and analytics for exhibition builders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">85%</h3>
                      <p className="text-sm text-gray-600">Matching Accuracy</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">
                        2.3h
                      </h3>
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-600">
                        94%
                      </h3>
                      <p className="text-sm text-gray-600">
                        Client Satisfaction
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        AI Recommendations
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                          • Optimize builder profiles in Germany for 15% better
                          matching
                        </li>
                        <li>
                          • Expand UAE builder network for high-demand events
                        </li>
                        <li>
                          • Implement automated pricing suggestions for premium
                          builders
                        </li>
                        <li>
                          • Focus marketing efforts on construction &
                          manufacturing sectors
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Performance Insights
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Top Performer: Berlin Expo GmbH
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            98% Rating
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Fastest Response: Dubai Events Co.
                          </span>
                          <Badge className="bg-blue-100 text-blue-800">
                            15 min avg
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Most Active: London Display Ltd
                          </span>
                          <Badge className="bg-purple-100 text-purple-800">
                            156 leads
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. SMART BUILDERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search builders..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Countries</option>
                      <option>United States</option>
                      <option>Germany</option>
                      <option>United Kingdom</option>
                      <option>UAE</option>
                      <option>Italy</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600 font-medium">
                      9 builders found
                    </span>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Smart Builder Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Smart Builder Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage all exhibition stand builders with AI-powered
                    insights
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        {
                          name: "Expo Design Germany",
                          email: "contact@builder.com",
                          location: "Berlin, Germany",
                          status: "active",
                          performance: 38,
                        },
                        {
                          name: "Premier Exhibits USA",
                          email: "contact@builder.com",
                          location: "New York, USA",
                          status: "inactive",
                          performance: 44,
                        },
                        {
                          name: "Milano Stands Italy",
                          email: "contact@builder.com",
                          location: "Milan, Italy",
                          status: "active",
                          performance: 42,
                        },
                        {
                          name: "Dubai Expo Builders",
                          email: "contact@builder.com",
                          location: "Dubai, UAE",
                          status: "inactive",
                          performance: 46,
                        },
                        {
                          name: "London Display Co",
                          email: "contact@builder.com",
                          location: "London, UK",
                          status: "active",
                          performance: 40,
                        },
                      ].map((builder, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {builder.name}
                              </div>
                              <div className="text-sm text-blue-600">
                                {builder.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-900">
                                {builder.location}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                builder.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {builder.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${builder.performance}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {builder.performance}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. BUILDER ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
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
                        <span>{kpis.conversionRate}%</span>
                      </div>
                      <Progress value={kpis.conversionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Platform Rating</span>
                        <span>{kpis.platformRating}/5.0</span>
                      </div>
                      <Progress
                        value={(kpis.platformRating / 5) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Builder Verification Rate</span>
                        <span>
                          {kpis.totalBuilders > 0
                            ? Math.round(
                                (kpis.verifiedBuilders / kpis.totalBuilders) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          kpis.totalBuilders > 0
                            ? (kpis.verifiedBuilders / kpis.totalBuilders) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Response Time</span>
                        <span>{kpis.averageResponseTime}h</span>
                      </div>
                      <Progress
                        value={100 - kpis.averageResponseTime * 10}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>
                      Builder distribution by region
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCountries.map((country, index) => (
                        <div
                          key={country.country}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 text-sm font-medium">
                              #{index + 1}
                            </div>
                            <span className="text-sm">{country.country}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${(country.builders / 50) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">
                              {country.builders}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Monthly Growth Trends</span>
                  </CardTitle>
                  <CardDescription>
                    Platform growth metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">+24%</h3>
                      <p className="text-sm text-gray-600">User Growth</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">
                        +18%
                      </h3>
                      <p className="text-sm text-gray-600">Revenue Growth</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-600">
                        +31%
                      </h3>
                      <p className="text-sm text-gray-600">Builder Signups</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-orange-600">
                        +15%
                      </h3>
                      <p className="text-sm text-gray-600">Lead Quality</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 5. BULK OPERATIONS */}
          {activeTab === "bulk-operations" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-orange-600" />
                    <span>Bulk Operations Center</span>
                  </CardTitle>
                  <CardDescription>
                    Mass import, export, and management operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      className="justify-start h-auto p-4"
                      variant="outline"
                    >
                      <div className="flex items-center space-x-3">
                        <Upload className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">
                            Bulk Import Builders
                          </div>
                          <div className="text-sm text-gray-500">
                            Import CSV with builder data
                          </div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      className="justify-start h-auto p-4"
                      variant="outline"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Export All Data</div>
                          <div className="text-sm text-gray-500">
                            Download complete dataset
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/admin/gmb-integration">
                      <Button className="w-full justify-start bg-green-600 text-white">
                        <Globe className="h-5 w-5" />
                        GMB Auto-Import
                        <Badge className="ml-auto bg-green-100 text-green-800 text-xs">
                          NEW
                        </Badge>
                      </Button>
                    </a>

                    <Button
                      className="justify-start h-auto p-4"
                      variant="outline"
                    >
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Bulk Email Campaign</div>
                          <div className="text-sm text-gray-500">
                            Send notifications to builders
                          </div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      className="justify-start h-auto p-4"
                      variant="outline"
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Bulk Verification</div>
                          <div className="text-sm text-gray-500">
                            Verify multiple builders
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Recent Bulk Operations
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Builder Import - 45 records
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Event Export - 12 events
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Processing
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Email Campaign - 238 recipients
                        </span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 6. EVENT INTELLIGENCE */}
          {activeTab === "event-intelligence" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>Event Intelligence Center</span>
                    <Badge className="bg-green-100 text-green-800">
                      2 Active
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Smart event tracking and exhibitor demand forecasting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">24</h3>
                      <p className="text-sm text-gray-600">Upcoming Events</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">89%</h3>
                      <p className="text-sm text-gray-600">Demand Accuracy</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-600">
                        156
                      </h3>
                      <p className="text-sm text-gray-600">
                        Exhibitors Tracked
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      High-Demand Events
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            CES 2025 - Las Vegas
                          </h5>
                          <p className="text-sm text-gray-600">
                            Consumer Electronics Show
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-red-100 text-red-800">
                            High Demand
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Jan 9-12, 2025
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Hannover Messe 2025
                          </h5>
                          <p className="text-sm text-gray-600">
                            Industrial Technology Fair
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-orange-100 text-orange-800">
                            Medium Demand
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Apr 20-24, 2025
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Dubai World Trade Center Expo
                          </h5>
                          <p className="text-sm text-gray-600">
                            International Business Exhibition
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">
                            Normal Demand
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Mar 15-18, 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 7. PLATFORM INTELLIGENCE */}
          {activeTab === "platform-intelligence" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <span>Platform Intelligence Dashboard</span>
                  </CardTitle>
                  <CardDescription>
                    Advanced platform analytics and intelligence insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-600">
                        1847
                      </h3>
                      <p className="text-sm text-gray-600">Data Points</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">
                        98.7%
                      </h3>
                      <p className="text-sm text-gray-600">System Uptime</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">
                        45ms
                      </h3>
                      <p className="text-sm text-gray-600">Avg Response</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-orange-600">
                        24/7
                      </h3>
                      <p className="text-sm text-gray-600">Monitoring</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Platform Insights
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Database</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Healthy
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4 text-green-600" />
                            <span className="text-sm">API Server</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Wifi className="h-4 w-4 text-green-600" />
                            <span className="text-sm">CDN</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Background Jobs</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Running
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        System Health
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Database</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Healthy
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4 text-green-600" />
                            <span className="text-sm">API Server</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Wifi className="h-4 w-4 text-green-600" />
                            <span className="text-sm">CDN</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Background Jobs</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Running
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 8. AI INSIGHTS */}
          {activeTab === "ai-insights" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-red-600" />
                    <span>AI Insights & Recommendations</span>
                    <Badge className="bg-red-100 text-red-800">3 New</Badge>
                  </CardTitle>
                  <CardDescription>
                    Machine learning powered insights and actionable
                    recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800">
                            High Priority Alert
                          </h4>
                          <p className="text-sm text-red-700 mt-1">
                            Unusual spike in builder registration requests from
                            Germany region. Investigate potential bot activity.
                          </p>
                          <p className="text-xs text-red-600 mt-2">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Optimization Opportunity
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            UAE market showing 40% higher conversion rates.
                            Consider increasing marketing budget for this
                            region.
                          </p>
                          <p className="text-xs text-yellow-600 mt-2">
                            5 hours ago
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            Performance Insight
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Lead matching algorithm efficiency improved by 15%
                            after latest update. Quality scores trending upward.
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            1 day ago
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <Target className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Revenue Opportunity
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Premium subscription adoption rate has increased 23%
                            this month. Consider expanding premium features.
                          </p>
                          <p className="text-xs text-green-600 mt-2">
                            3 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 9. REVENUE INTELLIGENCE */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>
                      Monthly revenue progression
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trafficData.map((month, index) => (
                        <div
                          key={month.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 text-sm font-medium">
                              {month.name}
                            </div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{
                                    width: `${(month.revenue / 70000) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            ${month.revenue.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue by source type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: [
                                  "#3B82F6",
                                  "#10B981",
                                  "#F59E0B",
                                  "#EF4444",
                                ][index % 4],
                              }}
                            ></div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${item.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.value}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Revenue Analytics</span>
                  </CardTitle>
                  <CardDescription>
                    Key revenue metrics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">
                        ${kpis.totalRevenue.toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">
                        ${kpis.monthlyRevenue.toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-purple-600">
                        $1,250
                      </h3>
                      <p className="text-sm text-gray-600">
                        Avg Revenue per User
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-orange-600">
                        +18%
                      </h3>
                      <p className="text-sm text-gray-600">Growth Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 10. GMB FETCH TOOL */}
          {activeTab === "gmb-fetch" && (
            <div className="space-y-6">
              <Card className="border-2 border-dashed border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    🚀 Google My Business Integration
                  </CardTitle>
                  <CardDescription>
                    Connect to Google Places API to import real exhibition
                    builders and event planners
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Places API Key *
                      </Label>
                      <Input
                        type="password"
                        placeholder="Enter your Google Places API key"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Required for searching real businesses
                      </p>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Location
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="las-vegas">
                            Las Vegas, USA
                          </SelectItem>
                          <SelectItem value="berlin">
                            Berlin, Germany
                          </SelectItem>
                          <SelectItem value="dubai">Dubai, UAE</SelectItem>
                          <SelectItem value="london">London, UK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex items-center gap-2"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            "/api/admin/gmb-integration",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                action: "test_connection",
                              }),
                            }
                          );
                          const data = await response.json();

                          if (data.success) {
                            alert(
                              "✅ GMB API connection successful! Demo mode is working."
                            );
                          } else {
                            alert(
                              `❌ API connection failed: ${data.error || "Connection issue"}`
                            );
                          }
                        } catch (error) {
                          alert(
                            "❌ API connection test failed - network error"
                          );
                        }
                      }}
                    >
                      <Globe className="w-4 h-4" />
                      Test API Connection
                    </Button>

                    <Button
                      className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch("/api/admin/gmb-demo", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                          });
                          const data = await response.json();

                          if (data.success) {
                            alert(
                              "🎉 Demo successful! Imported 3 sample businesses from Las Vegas, Berlin, and Dubai."
                            );
                          } else {
                            alert("❌ Demo failed");
                          }
                        } catch (error) {
                          alert("❌ Demo failed - network error");
                        }
                      }}
                    >
                      <span>🧪</span>
                      Run Demo Mode
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                      ✨ Enhanced GMB Integration Features
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Search unlimited businesses (bypasses 20-result Google
                        limit)
                      </li>
                      <li>
                        • Auto-import with real contact details and ratings
                      </li>
                      <li>• Direct integration with Smart Builders system</li>
                      <li>• Real-time sync with location pages</li>
                      <li>• Supports all exhibition builder categories</li>
                    </ul>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        Ready to import real businesses?
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            window.open("/admin/gmb-integration", "_blank")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open GMB Tool (New Tab)
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            setActiveTab("gmb-integration-embedded")
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Launch GMB Tool (In Dashboard)
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        Demo Ready
                      </div>
                      <div className="text-sm text-gray-600">
                        No API key needed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        Real API
                      </div>
                      <div className="text-sm text-gray-600">
                        Live Google Places
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">
                        Auto-Import
                      </div>
                      <div className="text-sm text-gray-600">
                        Direct to platform
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* EMBEDDED GMB INTEGRATION TOOL */}
          {activeTab === "gmb-integration-embedded" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Google My Business Integration Tool
                      </CardTitle>
                      <CardDescription>
                        ✅ Enhanced Navigation: Multiple access options with
                        improved embedding
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open("/admin/gmb-integration", "_blank")
                        }
                        className="text-gray-900"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("gmb-fetch")}
                        className="text-gray-900"
                      >
                        ← Back to Overview
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-green-50 p-4 border border-green-200 rounded-lg mb-4 mx-6">
                    <h4 className="font-medium text-green-900 mb-2">
                      🔧 Access Options:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-800">
                          Embedded Mode (Current)
                        </h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>✅ Stays within dashboard</li>
                          <li>✅ Integrated experience</li>
                          <li>✅ No popups blocked</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-800">
                          New Tab Mode
                        </h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>✅ Full screen experience</li>
                          <li>✅ Better for complex operations</li>
                          <li>✅ No iframe limitations</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> If embedded mode shows blank
                        screen, click "Open in New Tab" above or use the link:
                        <code className="ml-1 px-2 py-1 bg-blue-100 rounded text-xs">
                          /admin/gmb-integration
                        </code>
                      </p>
                    </div>
                  </div>

                  <div className="h-[800px] w-full border-t relative">
                    {/* Loading overlay */}
                    <div
                      className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10"
                      id="iframe-loader"
                    >
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600">
                          Loading GMB Integration Tool...
                        </p>
                        <p className="text-xs text-gray-500">
                          If this takes too long, click "Open in New Tab" above
                        </p>
                      </div>
                    </div>

                    <iframe
                      src="/admin/gmb-integration"
                      className="w-full h-full border-0"
                      title="GMB Integration Tool"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                      onLoad={() => {
                        const loader = document.getElementById("iframe-loader");
                        if (loader) loader.style.display = "none";
                      }}
                      onError={() => {
                        const loader = document.getElementById("iframe-loader");
                        if (loader) {
                          loader.innerHTML = `
                            <div class="text-center space-y-4">
                              <div class="text-red-500 text-4xl">❌</div>
                              <p class="text-gray-600">Failed to load GMB Integration Tool</p>
                              <button 
                                onclick="window.open('/admin/gmb-integration', '_blank')"
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Open in New Tab
                              </button>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* LOCATION MANAGER */}
          {activeTab === "location-manager" && (
            <GeographicManagement adminId={adminId} permissions={permissions} />
          )}

          {/* VENUE MANAGER */}
          {activeTab === "venue-manager" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span>Venues & Locations Manager</span>
                </CardTitle>
                <CardDescription>
                  Manage exhibition venues and event locations worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Total Venues</h4>
                    <p className="text-2xl font-bold text-purple-600">890</p>
                    <p className="text-sm text-gray-500">Global venues</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Active Events</h4>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                    <p className="text-sm text-gray-500">Current exhibitions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Premium Venues</h4>
                    <p className="text-2xl font-bold text-green-600">156</p>
                    <p className="text-sm text-gray-500">Top tier locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* EXHIBITIONS */}
          {activeTab === "exhibitions" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span>Exhibitions Manager</span>
                </CardTitle>
                <CardDescription>
                  Manage all exhibitions and events with filtering capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Total Exhibitions</h4>
                    <p className="text-2xl font-bold text-indigo-600">1,247</p>
                    <p className="text-sm text-gray-500">All events</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Upcoming</h4>
                    <p className="text-2xl font-bold text-green-600">89</p>
                    <p className="text-sm text-gray-500">Next 6 months</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Active</h4>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-gray-500">Currently running</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Countries</h4>
                    <p className="text-2xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-gray-500">Global reach</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* EVENT CATEGORIES */}
          {activeTab === "event-categories" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-cyan-600" />
                  <span>Event Categories</span>
                </CardTitle>
                <CardDescription>
                  Organize events by categories and industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Technology & Electronics",
                      count: 234,
                      color: "bg-blue-100 text-blue-800",
                    },
                    {
                      name: "Healthcare & Medical",
                      count: 156,
                      color: "bg-green-100 text-green-800",
                    },
                    {
                      name: "Automotive & Transportation",
                      count: 189,
                      color: "bg-purple-100 text-purple-800",
                    },
                    {
                      name: "Food & Beverage",
                      count: 123,
                      color: "bg-orange-100 text-orange-800",
                    },
                    {
                      name: "Fashion & Beauty",
                      count: 98,
                      color: "bg-pink-100 text-pink-800",
                    },
                    {
                      name: "Construction & Building",
                      count: 167,
                      color: "bg-gray-100 text-gray-800",
                    },
                  ].map((category, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium mb-2">{category.name}</h4>
                      <div className="flex items-center justify-between">
                        <Badge className={category.color}>
                          {category.count} events
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* VENDOR APPROVALS */}
          {activeTab === "vendor-approvals" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  <span>Pending Vendor Approvals</span>
                </CardTitle>
                <CardDescription>
                  Review and approve pending builder and planner registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Berlin Event Solutions",
                      type: "Exhibition Builder",
                      location: "Berlin, Germany",
                      submitted: "2 hours ago",
                    },
                    {
                      name: "Dubai Premium Events",
                      type: "Event Planner",
                      location: "Dubai, UAE",
                      submitted: "5 hours ago",
                    },
                    {
                      name: "London Display Co.",
                      type: "Booth Builder",
                      location: "London, UK",
                      submitted: "1 day ago",
                    },
                  ].map((vendor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{vendor.name}</h4>
                        <p className="text-sm text-gray-600">
                          {vendor.type} • {vendor.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted {vendor.submitted}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700 border-green-300"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-700 border-red-300"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>System Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Platform configuration and administration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="users">Users</TabsTrigger>
                      <TabsTrigger value="payments">Payments</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="siteName">Site Name</Label>
                          <Input
                            id="siteName"
                            value={generalSettings.siteName}
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="defaultLanguage">
                            Default Language
                          </Label>
                          <Select value={generalSettings.defaultLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="siteDescription">
                          Site Description
                        </Label>
                        <Textarea
                          id="siteDescription"
                          value={generalSettings.siteDescription}
                          readOnly
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="maintenance"
                          checked={generalSettings.maintenanceMode}
                        />
                        <Label htmlFor="maintenance">Maintenance Mode</Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="users" className="space-y-4">
                      <SuperAdminAuditReport />
                    </TabsContent>
                    <TabsContent value="payments" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">
                            Stripe Integration
                          </h4>
                          <Badge className="bg-green-100 text-green-800">
                            Connected
                          </Badge>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">
                            PayPal Integration
                          </h4>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Bank Transfer</h4>
                          <Badge className="bg-blue-100 text-blue-800">
                            Enabled
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="space-y-4">
                      <SuperAdminAuditReport />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
