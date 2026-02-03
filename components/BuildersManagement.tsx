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

interface Builder {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'pending' | 'suspended' | 'verified' | 'unverified';
  plan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE' | 'PREMIUM';
  registrationDate: string;
  lastLogin: string;
  rating: number;
  projectsCompleted: number;
  leadsReceived: number;
  monthlyRevenue: number;
  riskScore: number;
  aiInsights: number;
  integrations: number;
  storageUsed: number;
  storageLimit: number;
  verified: boolean;
  featured: boolean;
  trialEndsAt?: string;
}

interface BuildersManagementProps {
  adminId: string;
  permissions: string[];
}

export default function BuildersManagement({
  adminId,
  permissions,
}: BuildersManagementProps) {
  const { theme } = useTheme();
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for builders
  useEffect(() => {
    const mockBuilders: Builder[] = [
      {
        id: "builder-001",
        name: "John Smith",
        companyName: "ExpoBuild Solutions",
        email: "john@expobuild.com",
        phone: "+1 (555) 123-4567",
        location: "New York, USA",
        status: "verified",
        plan: "ENTERPRISE",
        registrationDate: "2023-01-15",
        lastLogin: "2024-01-07",
        rating: 4.8,
        projectsCompleted: 124,
        leadsReceived: 89,
        monthlyRevenue: 12450,
        riskScore: 0.2,
        aiInsights: 12,
        integrations: 5,
        storageUsed: 2457600000,
        storageLimit: 10737418240,
        verified: true,
        featured: true,
      },
      {
        id: "builder-002",
        name: "Sarah Johnson",
        companyName: "TradeShow Experts",
        email: "sarah@tradeshows.com",
        phone: "+1 (555) 987-6543",
        location: "London, UK",
        status: "active",
        plan: "PROFESSIONAL",
        registrationDate: "2023-03-22",
        lastLogin: "2024-01-06",
        rating: 4.5,
        projectsCompleted: 78,
        leadsReceived: 56,
        monthlyRevenue: 8900,
        riskScore: 0.1,
        aiInsights: 8,
        integrations: 3,
        storageUsed: 1879048192,
        storageLimit: 5368709120,
        verified: true,
        featured: false,
      },
      {
        id: "builder-003",
        name: "Michael Chen",
        companyName: "Global Exhibitions",
        email: "michael@globalx.com",
        phone: "+1 (555) 456-7890",
        location: "Singapore",
        status: "pending",
        plan: "FREE",
        registrationDate: "2023-06-10",
        lastLogin: "2024-01-05",
        rating: 0,
        projectsCompleted: 0,
        leadsReceived: 0,
        monthlyRevenue: 0,
        riskScore: 0.8,
        aiInsights: 0,
        integrations: 0,
        storageUsed: 104857600,
        storageLimit: 1073741824,
        verified: false,
        featured: false,
      },
      {
        id: "builder-004",
        name: "Emma Rodriguez",
        companyName: "Exhibition Masters",
        email: "emma@exhibitionmasters.com",
        phone: "+1 (555) 234-5678",
        location: "Madrid, Spain",
        status: "suspended",
        plan: "ENTERPRISE",
        registrationDate: "2023-02-18",
        lastLogin: "2023-12-15",
        rating: 4.2,
        projectsCompleted: 92,
        leadsReceived: 71,
        monthlyRevenue: 11200,
        riskScore: 0.9,
        aiInsights: 15,
        integrations: 7,
        storageUsed: 3221225472,
        storageLimit: 10737418240,
        verified: true,
        featured: true,
      },
      {
        id: "builder-005",
        name: "David Kim",
        companyName: "ShowStands Pro",
        email: "david@showstandspro.com",
        phone: "+1 (555) 345-6789",
        location: "Seoul, South Korea",
        status: "verified",
        plan: "PROFESSIONAL",
        registrationDate: "2023-04-05",
        lastLogin: "2024-01-07",
        rating: 4.7,
        projectsCompleted: 65,
        leadsReceived: 48,
        monthlyRevenue: 7600,
        riskScore: 0.3,
        aiInsights: 9,
        integrations: 4,
        storageUsed: 1610612736,
        storageLimit: 5368709120,
        verified: true,
        featured: false,
      },
      {
        id: "builder-006",
        name: "Olivia Williams",
        companyName: "Design & Build Expo",
        email: "olivia@designbuild.com",
        phone: "+1 (555) 567-8901",
        location: "Toronto, Canada",
        status: "active",
        plan: "FREE",
        registrationDate: "2023-05-12",
        lastLogin: "2024-01-06",
        rating: 0,
        projectsCompleted: 5,
        leadsReceived: 3,
        monthlyRevenue: 0,
        riskScore: 0.4,
        aiInsights: 2,
        integrations: 1,
        storageUsed: 524288000,
        storageLimit: 1073741824,
        verified: false,
        featured: false,
      },
      {
        id: "builder-007",
        name: "James Wilson",
        companyName: "TradeShow Innovations",
        email: "james@tradeshowsinnovations.com",
        phone: "+1 (555) 678-9012",
        location: "Sydney, Australia",
        status: "verified",
        plan: "ENTERPRISE",
        registrationDate: "2023-01-30",
        lastLogin: "2024-01-07",
        rating: 4.9,
        projectsCompleted: 156,
        leadsReceived: 124,
        monthlyRevenue: 18700,
        riskScore: 0.1,
        aiInsights: 18,
        integrations: 8,
        storageUsed: 4294967296,
        storageLimit: 10737418240,
        verified: true,
        featured: true,
      },
      {
        id: "builder-008",
        name: "Sophia Garcia",
        companyName: "Expo Creations",
        email: "sophia@expocreations.com",
        phone: "+1 (555) 789-0123",
        location: "Mexico City, Mexico",
        status: "active",
        plan: "PROFESSIONAL",
        registrationDate: "2023-07-20",
        lastLogin: "2024-01-05",
        rating: 4.4,
        projectsCompleted: 42,
        leadsReceived: 31,
        monthlyRevenue: 6200,
        riskScore: 0.2,
        aiInsights: 6,
        integrations: 2,
        storageUsed: 1288490188,
        storageLimit: 5368709120,
        verified: true,
        featured: false,
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setBuilders(mockBuilders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter builders based on search and filters
  const filteredBuilders = builders.filter(builder => {
    const matchesSearch = 
      builder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      builder.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || builder.status === statusFilter;
    const matchesPlan = planFilter === "all" || builder.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBuilders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBuilders = filteredBuilders.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'verified':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Verified</Badge>;
      case 'unverified':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unverified</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Plan badge component
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'FREE':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Free</Badge>;
      case 'PROFESSIONAL':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Professional</Badge>;
      case 'ENTERPRISE':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">Enterprise</Badge>;
      case 'PREMIUM':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Premium</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading builders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Builders Management</h1>
          <p className="text-gray-400">Manage platform builders and their accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Builder
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
                  placeholder="Search builders..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Builders', value: builders.length, icon: <Users className="w-5 h-5" />, color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30' },
          { title: 'Verified', value: builders.filter(b => b.verified).length, icon: <CheckCircle className="w-5 h-5" />, color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30' },
          { title: 'Active Subscriptions', value: builders.filter(b => b.plan !== 'FREE').length, icon: <CreditCard className="w-5 h-5" />, color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30' },
          { title: 'Avg. Rating', value: builders.length > 0 ? (builders.reduce((sum, b) => sum + b.rating, 0) / builders.length).toFixed(1) : '0.0', icon: <Star className="w-5 h-5" />, color: 'from-amber-500/30 via-orange-500/30 to-red-500/30' },
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

      {/* Builders Table */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Builder Directory</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredBuilders.length} builders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">Builder</TableHead>
                  <TableHead className="text-gray-300">Company</TableHead>
                  <TableHead className="text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Plan</TableHead>
                  <TableHead className="text-gray-300">Rating</TableHead>
                  <TableHead className="text-gray-300">Projects</TableHead>
                  <TableHead className="text-gray-300">Revenue</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBuilders.map((builder) => (
                  <TableRow key={builder.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={builder.name} />
                          <AvatarFallback>{builder.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{builder.name}</div>
                          <div className="text-gray-400 text-sm">{builder.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{builder.companyName}</TableCell>
                    <TableCell className="text-gray-300">{builder.location}</TableCell>
                    <TableCell>
                      {getStatusBadge(builder.status)}
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(builder.plan)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-white">{builder.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{builder.projectsCompleted}</TableCell>
                    <TableCell className="text-gray-300">${builder.monthlyRevenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800/90 border-gray-700 text-white">
                          <DropdownMenuItem 
                            onClick={() => setSelectedBuilder(builder)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Builder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="cursor-pointer text-red-400">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend Account
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBuilders.length)} of {filteredBuilders.length} builders
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

      {/* Builder Detail Modal */}
      {selectedBuilder && (
        <Dialog open={!!selectedBuilder} onOpenChange={() => setSelectedBuilder(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Builder Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Comprehensive view of {selectedBuilder.companyName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedBuilder && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-gray-800/50">
                  <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                  <TabsTrigger value="users" className="text-gray-300 data-[state=active]:bg-blue-600">Users</TabsTrigger>
                  <TabsTrigger value="projects" className="text-gray-300 data-[state=active]:bg-blue-600">Projects</TabsTrigger>
                  <TabsTrigger value="leads" className="text-gray-300 data-[state=active]:bg-blue-600">Leads</TabsTrigger>
                  <TabsTrigger value="deployments" className="text-gray-300 data-[state=active]:bg-blue-600">Deployments</TabsTrigger>
                  <TabsTrigger value="domains" className="text-gray-300 data-[state=active]:bg-blue-600">Domains</TabsTrigger>
                  <TabsTrigger value="payments" className="text-gray-300 data-[state=active]:bg-blue-600">Payments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Company Name</span>
                          <span className="text-white">{selectedBuilder.companyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contact Person</span>
                          <span className="text-white">{selectedBuilder.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{selectedBuilder.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone</span>
                          <span className="text-white">{selectedBuilder.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location</span>
                          <span className="text-white">{selectedBuilder.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Registration Date</span>
                          <span className="text-white">{selectedBuilder.registrationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Login</span>
                          <span className="text-white">{selectedBuilder.lastLogin}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Subscription & Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plan</span>
                          <span className="text-white">{selectedBuilder.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-white">{getStatusBadge(selectedBuilder.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verified</span>
                          <span className="text-white">{selectedBuilder.verified ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Featured</span>
                          <span className="text-white">{selectedBuilder.featured ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk Score</span>
                          <span className="text-white">{selectedBuilder.riskScore.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating</span>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-white">{selectedBuilder.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedBuilder.projectsCompleted}</div>
                          <div className="text-gray-400 text-sm">Projects Completed</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedBuilder.leadsReceived}</div>
                          <div className="text-gray-400 text-sm">Leads Received</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">${selectedBuilder.monthlyRevenue.toLocaleString()}</div>
                          <div className="text-gray-400 text-sm">Monthly Revenue</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedBuilder.aiInsights}</div>
                          <div className="text-gray-400 text-sm">AI Insights</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-white mb-4">Storage Usage</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Used: {(selectedBuilder.storageUsed / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                            <span className="text-gray-400">Limit: {(selectedBuilder.storageLimit / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                          </div>
                          <Progress 
                            value={(selectedBuilder.storageUsed / selectedBuilder.storageLimit) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="users" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Builder Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">User management interface for this builder would go here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="projects" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Builder Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Project management interface for this builder would go here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="leads" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Builder Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Lead management interface for this builder would go here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="deployments" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Builder Deployments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Deployment management interface for this builder would go here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="domains" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Builder Domains</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Domain management interface for this builder would go here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payments" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Builder Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Payment management interface for this builder would go here.</p>
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