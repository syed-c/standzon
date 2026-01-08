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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreHorizontal,
  EyeIcon,
  Pencil,
  Copy,
  Share,
  Archive,
  Unarchive,
  Ban,
  Check,
  X,
  Flag,
  Award,
  Package,
  Key,
  Lock,
  Unlock,
  Verified,
  Unverified,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Info,
  HelpCircle,
  UserRound,
  Building,
  Briefcase,
  Handshake,
  ChartNoAxesColumn,
  GanttChart,
  Workflow,
  CircleDashed,
  CircleCheckBig,
  CircleAlert,
  CircleX,
  Archive as ArchiveIcon,
  Tag,
  Hash,
  AtSign,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  RotateCw,
  RefreshCw as RefreshCwIcon,
  Play,
  Pause,
  Square as SquareIcon,
  SkipBack,
  SkipForward,
  VolumeX as VolumeXIcon,
  Volume1 as Volume1Icon,
  Volume2 as Volume2Icon,
  Mic,
  MicOff,
  Webcam,
  WebcamOff,
  Battery,
  BatteryCharging,
  Wifi,
  Bluetooth,
  Signal,
  Cpu,
  MemoryStick,
  Disc,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Network,
  Router,
  Smartphone,
  Tablet,
  Laptop,
  Monitor as MonitorIcon,
  Printer,
  Scan,
  Camera,
  Video as VideoIcon,
  Radio,
  Tv,
  Speaker,
  Headphones,
  Gamepad2,
  Watch,
  Clock as ClockIcon,
  Timer,
  Stopwatch,
  AlarmClock,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  CalendarHeart,
  CalendarPlus,
  CalendarMinus,
  CalendarX,
  CalendarCheck as CalendarCheckIcon,
  CalendarArrowUp,
  CalendarArrowDown,
  Map,
  Navigation,
  Compass,
  Locate,
  LocateFixed,
  LocateOff,
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
  Home as HomeIcon,
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
  Receipt as ReceiptIcon,
  Coins,
  Gem,
  Scale,
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
  BatteryLow,
  BatteryMedium,
  BatteryFull,
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
  Sailboat,
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

interface Integration {
  id: string;
  name: string;
  slug: string;
  type: 'GOOGLE_OAUTH' | 'GOOGLE_GMB' | 'SMTP' | 'SMS_TWILIO' | 'STRIPE' | 'PADDLE' | 'OPENAI' | 'GEMINI' | 'ANTHROPIC' | 'CLOUDFLARE' | 'AWS_ROUTE53' | 'CUSTOM_WEBHOOK';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING_VERIFICATION' | 'RATE_LIMITED';
  tenantId: string;
  tenantName: string;
  config: Record<string, any>;
  credentials: Record<string, any>;
  webhookUrl?: string;
  isActive: boolean;
  rateLimit?: number;
  lastSyncAt?: string;
  lastError?: string;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
  usageStats: {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    last24h: number;
  };
}

interface IntegrationsManagementProps {
  adminId: string;
  permissions: string[];
}

export default function IntegrationsManagement({
  adminId,
  permissions,
}: IntegrationsManagementProps) {
  const { theme } = useTheme();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for integrations
  useEffect(() => {
    const mockIntegrations: Integration[] = [
      {
        id: "int-001",
        name: "Google OAuth",
        slug: "google-oauth",
        type: "GOOGLE_OAUTH",
        status: "CONNECTED",
        tenantId: "tenant-001",
        tenantName: "ExpoBuild Solutions",
        config: { clientId: "client123", scopes: ["email", "profile"] },
        credentials: {},
        isActive: true,
        rateLimit: 1000,
        lastSyncAt: "2024-01-07 14:30:00",
        errorCount: 0,
        createdAt: "2023-01-15",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 12456,
          successRate: 99.8,
          avgResponseTime: 125,
          last24h: 42
        }
      },
      {
        id: "int-002",
        name: "Google GMB",
        slug: "google-gmb",
        type: "GOOGLE_GMB",
        status: "CONNECTED",
        tenantId: "tenant-002",
        tenantName: "TradeShow Experts",
        config: { apiKey: "api123", locationId: "loc123" },
        credentials: {},
        webhookUrl: "https://webhook.example.com/gmb",
        isActive: true,
        rateLimit: 500,
        lastSyncAt: "2024-01-07 12:15:00",
        errorCount: 2,
        createdAt: "2023-02-20",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 8934,
          successRate: 98.5,
          avgResponseTime: 210,
          last24h: 31
        }
      },
      {
        id: "int-003",
        name: "SMTP Service",
        slug: "smtp-service",
        type: "SMTP",
        status: "ERROR",
        tenantId: "tenant-003",
        tenantName: "Global Exhibitions",
        config: { host: "smtp.gmail.com", port: 587 },
        credentials: {},
        isActive: true,
        lastError: "Authentication failed",
        errorCount: 15,
        createdAt: "2023-03-10",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 5678,
          successRate: 85.2,
          avgResponseTime: 450,
          last24h: 12
        }
      },
      {
        id: "int-004",
        name: "Twilio SMS",
        slug: "twilio-sms",
        type: "SMS_TWILIO",
        status: "PENDING_VERIFICATION",
        tenantId: "tenant-004",
        tenantName: "Exhibition Masters",
        config: { accountSid: "acc123", authToken: "token123" },
        credentials: {},
        isActive: true,
        rateLimit: 100,
        errorCount: 0,
        createdAt: "2023-04-15",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 2345,
          successRate: 0,
          avgResponseTime: 0,
          last24h: 0
        }
      },
      {
        id: "int-005",
        name: "Stripe Payments",
        slug: "stripe-payments",
        type: "STRIPE",
        status: "CONNECTED",
        tenantId: "tenant-005",
        tenantName: "ShowStands Pro",
        config: { publishableKey: "pk_test_123", secretKey: "sk_test_123" },
        credentials: {},
        webhookUrl: "https://webhook.example.com/stripe",
        isActive: true,
        rateLimit: 100,
        lastSyncAt: "2024-01-07 16:45:00",
        errorCount: 1,
        createdAt: "2023-05-20",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 15678,
          successRate: 99.9,
          avgResponseTime: 95,
          last24h: 67
        }
      },
      {
        id: "int-006",
        name: "OpenAI API",
        slug: "openai-api",
        type: "OPENAI",
        status: "RATE_LIMITED",
        tenantId: "tenant-006",
        tenantName: "Design & Build Expo",
        config: { model: "gpt-4", temperature: 0.7 },
        credentials: {},
        isActive: true,
        rateLimit: 1000,
        lastSyncAt: "2024-01-07 11:30:00",
        errorCount: 8,
        createdAt: "2023-06-05",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 9876,
          successRate: 92.1,
          avgResponseTime: 1800,
          last24h: 45
        }
      },
      {
        id: "int-007",
        name: "Cloudflare DNS",
        slug: "cloudflare-dns",
        type: "CLOUDFLARE",
        status: "CONNECTED",
        tenantId: "tenant-007",
        tenantName: "TradeShow Innovations",
        config: { zoneId: "zone123", email: "admin@example.com" },
        credentials: {},
        isActive: true,
        rateLimit: 1200,
        lastSyncAt: "2024-01-07 09:15:00",
        errorCount: 0,
        createdAt: "2023-07-12",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 11234,
          successRate: 99.95,
          avgResponseTime: 80,
          last24h: 23
        }
      },
      {
        id: "int-008",
        name: "Custom Webhook",
        slug: "custom-webhook",
        type: "CUSTOM_WEBHOOK",
        status: "DISCONNECTED",
        tenantId: "tenant-008",
        tenantName: "Expo Creations",
        config: { url: "https://myapi.example.com/webhook", method: "POST" },
        credentials: {},
        webhookUrl: "https://myapi.example.com/webhook",
        isActive: false,
        errorCount: 5,
        lastError: "Connection timeout",
        createdAt: "2023-08-20",
        updatedAt: "2024-01-07",
        usageStats: {
          totalCalls: 456,
          successRate: 75.5,
          avgResponseTime: 1200,
          last24h: 0
        }
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      setIntegrations(mockIntegrations);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter integrations based on search and filters
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || integration.status === statusFilter;
    const matchesType = typeFilter === "all" || integration.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIntegrations = filteredIntegrations.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>;
      case 'DISCONNECTED':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Disconnected</Badge>;
      case 'ERROR':
        return <Badge variant="secondary" className="bg-red-700/20 text-red-500 border-red-700/30">Error</Badge>;
      case 'PENDING_VERIFICATION':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'RATE_LIMITED':
        return <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">Rate Limited</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Type badge component
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'GOOGLE_OAUTH':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Google OAuth</Badge>;
      case 'GOOGLE_GMB':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Google GMB</Badge>;
      case 'SMTP':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">SMTP</Badge>;
      case 'SMS_TWILIO':
        return <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">SMS Twilio</Badge>;
      case 'STRIPE':
        return <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 border-pink-500/30">Stripe</Badge>;
      case 'OPENAI':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">OpenAI</Badge>;
      case 'CLOUDFLARE':
        return <Badge variant="secondary" className="bg-sky-500/20 text-sky-400 border-sky-500/30">Cloudflare</Badge>;
      default:
        return <Badge variant="secondary">{type.replace(/_/g, ' ')}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrations Management</h1>
          <p className="text-gray-400">Manage third-party integrations and API connections</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="CONNECTED">Connected</SelectItem>
                  <SelectItem value="DISCONNECTED">Disconnected</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="PENDING_VERIFICATION">Pending</SelectItem>
                  <SelectItem value="RATE_LIMITED">Rate Limited</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="GOOGLE_OAUTH">Google OAuth</SelectItem>
                  <SelectItem value="GOOGLE_GMB">Google GMB</SelectItem>
                  <SelectItem value="SMTP">SMTP</SelectItem>
                  <SelectItem value="SMS_TWILIO">SMS Twilio</SelectItem>
                  <SelectItem value="STRIPE">Stripe</SelectItem>
                  <SelectItem value="OPENAI">OpenAI</SelectItem>
                  <SelectItem value="CLOUDFLARE">Cloudflare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Integrations', value: integrations.length, icon: <Globe className="w-5 h-5" />, color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30' },
          { title: 'Active Connections', value: integrations.filter(i => i.status === 'CONNECTED').length, icon: <CheckCircle className="w-5 h-5" />, color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30' },
          { title: 'Errors', value: integrations.filter(i => i.status === 'ERROR').length, icon: <AlertTriangle className="w-5 h-5" />, color: 'from-red-500/30 via-orange-500/30 to-amber-500/30' },
          { title: 'Avg. Success Rate', value: `${Math.round(integrations.reduce((sum, i) => sum + i.usageStats.successRate, 0) / integrations.length)}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30' },
        ].map((stat, index) => (
          <Card 
            key={index} 
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <CardHeader className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-700/50 text-white shadow-lg">
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Integrations Table */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Integration Directory</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredIntegrations.length} integrations found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">Integration</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Tenant</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Rate Limit</TableHead>
                  <TableHead className="text-gray-300">Success Rate</TableHead>
                  <TableHead className="text-gray-300">Last Sync</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedIntegrations.map((integration) => (
                  <TableRow key={integration.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">
                      <div>
                        <div className="text-white font-medium">{integration.name}</div>
                        <div className="text-gray-400 text-sm">{integration.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(integration.type)}
                    </TableCell>
                    <TableCell className="text-gray-300">{integration.tenantName}</TableCell>
                    <TableCell>
                      {getStatusBadge(integration.status)}
                    </TableCell>
                    <TableCell className="text-gray-300">{integration.rateLimit ? `${integration.rateLimit}/min` : 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span>{integration.usageStats.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800/90 border-gray-700 text-white">
                          <DropdownMenuItem 
                            onClick={() => setSelectedIntegration(integration)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Integration
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reconnect
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="cursor-pointer text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Integration
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredIntegrations.length)} of {filteredIntegrations.length} integrations
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              >
                Previous
              </Button>
              <div className="flex gap-1">
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
                      variant={currentPage === pageNum ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`${
                        currentPage === pageNum 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Integration Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Comprehensive view of {selectedIntegration.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedIntegration && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-gray-800/50">
                  <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                  <TabsTrigger value="configuration" className="text-gray-300 data-[state=active]:bg-blue-600">Configuration</TabsTrigger>
                  <TabsTrigger value="credentials" className="text-gray-300 data-[state=active]:bg-blue-600">Credentials</TabsTrigger>
                  <TabsTrigger value="usage" className="text-gray-300 data-[state=active]:bg-blue-600">Usage</TabsTrigger>
                  <TabsTrigger value="logs" className="text-gray-300 data-[state=active]:bg-blue-600">Logs</TabsTrigger>
                  <TabsTrigger value="metrics" className="text-gray-300 data-[state=active]:bg-blue-600">Metrics</TabsTrigger>
                  <TabsTrigger value="actions" className="text-gray-300 data-[state=active]:bg-blue-600">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Integration Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{selectedIntegration.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Slug</span>
                          <span className="text-white">{selectedIntegration.slug}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type</span>
                          <span className="text-white">{getTypeBadge(selectedIntegration.type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tenant</span>
                          <span className="text-white">{selectedIntegration.tenantName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-white">{getStatusBadge(selectedIntegration.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Active</span>
                          <span className="text-white">{selectedIntegration.isActive ? 'Yes' : 'No'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Connection Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rate Limit</span>
                          <span className="text-white">{selectedIntegration.rateLimit ? `${selectedIntegration.rateLimit}/min` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Sync</span>
                          <span className="text-white">{selectedIntegration.lastSyncAt ? new Date(selectedIntegration.lastSyncAt).toLocaleString() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Error Count</span>
                          <span className="text-white">{selectedIntegration.errorCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Error</span>
                          <span className="text-white">{selectedIntegration.lastError || 'None'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created</span>
                          <span className="text-white">{selectedIntegration.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Updated</span>
                          <span className="text-white">{selectedIntegration.updatedAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Webhook Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedIntegration.webhookUrl ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white">{selectedIntegration.webhookUrl}</div>
                            <div className="text-gray-400 text-sm">Webhook URL</div>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy URL
                          </Button>
                        </div>
                      ) : (
                        <p className="text-gray-400">No webhook configured for this integration</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="configuration" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Configuration Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(selectedIntegration.config).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400">{key}</span>
                            <span className="text-white">{JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="credentials" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Credentials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.keys(selectedIntegration.credentials).length > 0 ? (
                          Object.entries(selectedIntegration.credentials).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400">{key}</span>
                              <span className="text-white">••••••••</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400">No credentials stored for this integration</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="usage" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Usage Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedIntegration.usageStats.totalCalls.toLocaleString()}</div>
                          <div className="text-gray-400 text-sm">Total Calls</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedIntegration.usageStats.successRate}%</div>
                          <div className="text-gray-400 text-sm">Success Rate</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedIntegration.usageStats.avgResponseTime}ms</div>
                          <div className="text-gray-400 text-sm">Avg Response Time</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedIntegration.usageStats.last24h}</div>
                          <div className="text-gray-400 text-sm">Last 24h</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="logs" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Recent logs for this integration would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="metrics" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Performance metrics for this integration would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="actions" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Integration Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reconnect
                        </Button>
                        <Button variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/20">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}