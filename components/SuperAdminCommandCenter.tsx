"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from '@/components/ThemeProvider';
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Users,
  Building2,
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
  Server,
  Server as ServerIcon,
  Wifi,
  Cpu,
  MemoryStick,
  HardDrive as HardDriveIcon,
  Database as DatabaseIcon,
  Network,
  Cloud,
  Cloud as CloudIcon,
  Mail as MailIcon,
  Lock,
  Key,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  BarChart as BarChartIcon,
  Activity as ActivityIcon,
  Bell as BellIcon,
  Volume2,
  VolumeX,
  Wifi as WifiIcon,
  Bluetooth,
  Signal,
  Battery,
  BatteryCharging,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHaze,
  CloudSun,
  CloudMoon,
  Cloudy,
  SunDim,
  SunMedium,
  SunBright,
  MoonStar,
  Stars,
  Sparkles,
  Wind,
  Tornado,
  Hurricane,
  Snowflake,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Droplets,
  Umbrella,
  Rainbow,
  Flower,
  Leaf,
  Sprout,
  Seedling,
  TreeDeciduous,
  TreePine,
  Waves,
  Anchor,
  Sailboat,
  Anchor as AnchorIcon,
  Compass,
  Navigation,
  Route,
  Mountain,
  TreePalm,
  Castle,
  Historic,
  Museum,
  Library,
  Hospital,
  Store,
  Factory,
  Home,
  House,
  Building as BuildingIcon,
  School,
  University,
  Church,
  Mosque,
  Synagogue,
  Temple,
  Landmark,
  Landmark as LandmarkIcon,
  Banknote,
  PiggyBank,
  Wallet,
  CreditCard as CreditCardIcon,
  Receipt,
  Receipt as ReceiptIcon,
  Coins,
  Gem,
  Scale,
  Package,
  Package as PackageIcon,
  Truck,
  Ship,
  Plane,
  Train,
  Bus,
  Car,
  Bike,
  Scooter,
  Fuel,
  GasStation,
  ChargingStation,
  BatteryWarning,
  BatteryCritical,
  Power,
  Zap as ZapIcon,
  ZapOff,
  LightningBolt,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHaze,
  CloudSun,
  CloudMoon,
  Cloudy,
  SunDim,
  SunMedium,
  SunBright,
  MoonStar,
  Stars,
  Sparkles,
  Wind,
  Tornado,
  Hurricane,
  Snowflake,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Droplets,
  Umbrella,
  UmbrellaClosed,
  Rainbow,
  Flower,
  Leaf,
  Sprout,
  Seedling,
  TreeDeciduous,
  TreePine,
  Waves as WavesIcon,
  Anchor as AnchorIcon,
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  MapPin as MapPinIcon,
  Pin,
  PinOff,
  Crosshair,
  Crosshair as CrosshairIcon,
  Target as TargetIcon,
  Crosshair2,
  Crosshair2 as Crosshair2Icon,
  Crosshair3,
  Crosshair3 as Crosshair3Icon,
  Crosshair4,
  Crosshair4 as Crosshair4Icon,
  Crosshair5,
  Crosshair5 as Crosshair5Icon,
  Crosshair6,
  Crosshair6 as Crosshair6Icon,
  Crosshair7,
  Crosshair7 as Crosshair7Icon,
  Crosshair8,
  Crosshair8 as Crosshair8Icon,
  Crosshair9,
  Crosshair9 as Crosshair9Icon,
  Crosshair10,
  Crosshair10 as Crosshair10Icon,
  Crosshair11,
  Crosshair11 as Crosshair11Icon,
  Crosshair12,
  Crosshair12 as Crosshair12Icon,
  Crosshair13,
  Crosshair13 as Crosshair13Icon,
  Crosshair14,
  Crosshair14 as Crosshair14Icon,
  Crosshair15,
  Crosshair15 as Crosshair15Icon,
  Crosshair16,
  Crosshair16 as Crosshair16Icon,
  Crosshair17,
  Crosshair17 as Crosshair17Icon,
  Crosshair18,
  Crosshair18 as Crosshair18Icon,
  Crosshair19,
  Crosshair19 as Crosshair19Icon,
  Crosshair20,
  Crosshair20 as Crosshair20Icon,
  Crosshair21,
  Crosshair21 as Crosshair21Icon,
  Crosshair22,
  Crosshair22 as Crosshair22Icon,
  Crosshair23,
  Crosshair23 as Crosshair23Icon,
  Crosshair24,
  Crosshair24 as Crosshair24Icon,
  Crosshair25,
  Crosshair25 as Crosshair25Icon,
  Crosshair26,
  Crosshair26 as Crosshair26Icon,
  Crosshair27,
  Crosshair27 as Crosshair27Icon,
  Crosshair28,
  Crosshair28 as Crosshair28Icon,
  Crosshair29,
  Crosshair29 as Crosshair29Icon,
  Crosshair30,
  Crosshair30 as Crosshair30Icon,
  Crosshair31,
  Crosshair31 as Crosshair31Icon,
  Crosshair32,
  Crosshair32 as Crosshair32Icon,
  Crosshair33,
  Crosshair33 as Crosshair33Icon,
  Crosshair34,
  Crosshair34 as Crosshair34Icon,
  Crosshair35,
  Crosshair35 as Crosshair35Icon,
  Crosshair36,
  Crosshair36 as Crosshair36Icon,
  Crosshair37,
  Crosshair37 as Crosshair37Icon,
  Crosshair38,
  Crosshair38 as Crosshair38Icon,
  Crosshair39,
  Crosshair39 as Crosshair39Icon,
  Crosshair40,
  Crosshair40 as Crosshair40Icon,
  Crosshair41,
  Crosshair41 as Crosshair41Icon,
  Crosshair42,
  Crosshair42 as Crosshair42Icon,
  Crosshair43,
  Crosshair43 as Crosshair43Icon,
  Crosshair44,
  Crosshair44 as Crosshair44Icon,
  Crosshair45,
  Crosshair45 as Crosshair45Icon,
  Crosshair46,
  Crosshair46 as Crosshair46Icon,
  Crosshair47,
  Crosshair47 as Crosshair47Icon,
  Crosshair48,
  Crosshair48 as Crosshair48Icon,
  Crosshair49,
  Crosshair49 as Crosshair49Icon,
  Crosshair50,
  Crosshair50 as Crosshair50Icon,
} from "lucide-react";
import { adminAPI } from "@/lib/api/admin";

// Colors for charts
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#8B5CF6",
  "#F97316",
  "#14B8A6",
];

interface SuperAdminCommandCenterProps {
  adminId: string;
  permissions: string[];
}

export default function SuperAdminCommandCenter({
  adminId,
  permissions,
}: SuperAdminCommandCenterProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState({
    totalTenants: 0,
    totalBuilders: 0,
    totalProjects: 0,
    totalLeads: 0,
    totalRevenue: 0,
    totalActiveSubscriptions: 0,
    totalDeployments: 0,
    totalDomains: 0,
    newLeadsToday: 0,
    newBuildersToday: 0,
    mrr: 0,
    arr: 0,
    churnRate: 0,
    platformUptime: 0,
    storageUsed: 0,
    storageLimit: 0,
  });

  // Mock data for charts
  const platformMetricsData = [
    { name: 'Jan', tenants: 400, builders: 240, projects: 240, leads: 380 },
    { name: 'Feb', tenants: 300, builders: 138, projects: 198, leads: 290 },
    { name: 'Mar', tenants: 200, builders: 98, projects: 108, leads: 180 },
    { name: 'Apr', tenants: 278, builders: 390, projects: 290, leads: 390 },
    { name: 'May', tenants: 189, builders: 480, projects: 380, leads: 480 },
    { name: 'Jun', tenants: 239, builders: 380, projects: 480, leads: 380 },
    { name: 'Jul', tenants: 349, builders: 430, projects: 530, leads: 430 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
    { name: 'Jul', revenue: 3490, expenses: 4300 },
  ];

  const subscriptionData = [
    { name: 'FREE', value: 400 },
    { name: 'PROFESSIONAL', value: 300 },
    { name: 'ENTERPRISE', value: 300 },
    { name: 'PREMIUM', value: 200 },
  ];

  const locationData = [
    { name: 'USA', value: 400 },
    { name: 'UK', value: 300 },
    { name: 'Canada', value: 300 },
    { name: 'Germany', value: 200 },
    { name: 'Australia', value: 150 },
    { name: 'India', value: 100 },
  ];

  const activityData = [
    { id: 1, action: 'New tenant registered', time: '2 min ago', type: 'success' },
    { id: 2, action: 'Lead assigned', time: '15 min ago', type: 'info' },
    { id: 3, action: 'Payment received', time: '1 hour ago', type: 'success' },
    { id: 4, action: 'System backup completed', time: '3 hours ago', type: 'info' },
    { id: 5, action: 'Profile updated', time: '5 hours ago', type: 'warning' },
    { id: 6, action: 'New builder created', time: '6 hours ago', type: 'success' },
    { id: 7, action: 'Deployment failed', time: '7 hours ago', type: 'error' },
    { id: 8, action: 'Integration connected', time: '8 hours ago', type: 'info' },
  ];

  const integrationsData = [
    { name: 'Google OAuth', status: 'connected', usage: 95 },
    { name: 'Google GMB', status: 'connected', usage: 80 },
    { name: 'SMTP', status: 'connected', usage: 90 },
    { name: 'SMS Twilio', status: 'disconnected', usage: 0 },
    { name: 'Stripe', status: 'connected', usage: 75 },
    { name: 'OpenAI', status: 'connected', usage: 60 },
  ];

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data
      setKpis({
        totalTenants: 1248,
        totalBuilders: 2456,
        totalProjects: 3241,
        totalLeads: 8756,
        totalRevenue: 42567,
        totalActiveSubscriptions: 1248,
        totalDeployments: 1567,
        totalDomains: 1248,
        newLeadsToday: 324,
        newBuildersToday: 12,
        mrr: 12456,
        arr: 149472,
        churnRate: 2.5,
        platformUptime: 99.9,
        storageUsed: 456789,
        storageLimit: 1048576,
      });
      
      setLoading(false);
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  if (loading) {
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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:shadow-2xl transition-all duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, Super Admin</h1>
            <p className="text-gray-400 mt-1">Here's what's happening with the platform today.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last updated: Just now</span>
            </div>
            <button 
              className="px-3 py-1.5 rounded-xl text-sm bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg"
              onClick={handleRefresh}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Total Tenants', 
            value: kpis.totalTenants.toLocaleString(), 
            change: '+8.2%', 
            icon: <Building2 className="w-5 h-5" />, 
            color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30',
            subtitle: 'Active accounts'
          },
          { 
            title: 'Total Builders', 
            value: kpis.totalBuilders.toLocaleString(), 
            change: '+5.7%', 
            icon: <Users className="w-5 h-5" />, 
            color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30',
            subtitle: 'Platform participants'
          },
          { 
            title: 'Total Revenue', 
            value: `$${(kpis.totalRevenue / 1000).toFixed(1)}K`, 
            change: '+12.5%', 
            icon: <DollarSign className="w-5 h-5" />, 
            color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30',
            subtitle: 'Lifetime value'
          },
          { 
            title: 'New Leads', 
            value: kpis.newLeadsToday.toLocaleString(), 
            change: '+3.1%', 
            icon: <MessageSquare className="w-5 h-5" />, 
            color: 'from-amber-500/30 via-orange-500/30 to-red-500/30',
            subtitle: 'Today\'s intake'
          }
        ].map((metric, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700"
          >
            <CardHeader className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{metric.subtitle}</p>
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-700/50 text-white shadow-lg">
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Platform Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'Platform Uptime', 
            value: `${kpis.platformUptime}%`, 
            status: 'operational', 
            icon: <Server className="w-5 h-5" />,
            color: 'text-green-400'
          },
          { 
            title: 'MRR', 
            value: `$${(kpis.mrr / 1000).toFixed(1)}K`, 
            status: 'growing', 
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'text-green-400'
          },
          { 
            title: 'Churn Rate', 
            value: `${kpis.churnRate}%`, 
            status: 'low', 
            icon: <Activity className="w-5 h-5" />,
            color: 'text-green-400'
          },
          { 
            title: 'Storage Used', 
            value: `${((kpis.storageUsed / kpis.storageLimit) * 100).toFixed(1)}%`, 
            status: 'normal', 
            icon: <HardDrive className="w-5 h-5" />,
            color: 'text-blue-400'
          }
        ].map((health, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700"
          >
            <CardHeader className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{health.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${health.color}`}>{health.value}</p>
                  <p className="text-sm text-gray-400 mt-1 capitalize">{health.status}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gray-700/50 ${health.color} shadow-lg`}>
                  {health.icon}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Growth Chart */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <BarChartIcon className="h-5 w-5" />
              <span>Platform Growth</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tenants, builders, projects, and leads over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={platformMetricsData}>
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
                <Area
                  type="monotone"
                  dataKey="tenants"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="builders"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="projects"
                  stackId="3"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stackId="4"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5" />
              <span>Revenue Trends</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Monthly revenue and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Distribution */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <PieChartIcon className="h-5 w-5" />
              <span>Subscription Distribution</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of subscription plans across tenants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <MapPin className="h-5 w-5" />
              <span>Geographic Distribution</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of tenants by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={locationData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="name" stroke="#9CA3AF" />
                <PolarRadiusAxis stroke="#9CA3AF" />
                <Radar
                  name="Tenants"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integration Status */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Globe className="h-5 w-5" />
              <span>Integration Status</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Third-party integration connectivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrationsData.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{integration.name}</p>
                      <p className={`text-xs ${
                        integration.status === 'connected' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {integration.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{integration.usage}%</p>
                    <Progress value={integration.usage} className="h-2 w-24 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <ActivityIcon className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Latest platform events and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activityData.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 pb-4 border-b border-gray-700/50 last:border-0 last:pb-0 hover:bg-gray-700/20 transition-all duration-300 rounded-xl p-2"
                >
                  <div className={`p-2 rounded-xl ${
                    activity.type === 'success' ? 'bg-green-500/30 text-green-400 border border-green-500/50' :
                    activity.type === 'warning' ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50' :
                    activity.type === 'error' ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
                    'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                     activity.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                     activity.type === 'error' ? <ZapIcon className="w-4 h-4" /> :
                     <ActivityIcon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200">{activity.action}</p>
                    <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}