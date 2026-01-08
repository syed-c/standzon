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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_MEMBER' | 'USER';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED';
  tenantId?: string;
  tenantName?: string;
  lastLogin: string;
  registrationDate: string;
  loginCount: number;
  permissions: string[];
  profileComplete: number;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  riskScore: number;
  sessionCount: number;
  lastActivity: string;
  timezone: string;
  language: string;
}

interface UsersManagementProps {
  adminId: string;
  permissions: string[];
}

export default function UsersManagement({
  adminId,
  permissions,
}: UsersManagementProps) {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for users
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "user-001",
        name: "Alex Johnson",
        email: "alex@standzon.com",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        lastLogin: "2024-01-07 14:30:00",
        registrationDate: "2023-01-15",
        loginCount: 124,
        permissions: ["users.manage", "content.manage", "payments.manage", "analytics.view"],
        profileComplete: 95,
        twoFactorEnabled: true,
        emailVerified: true,
        phoneVerified: true,
        riskScore: 0.1,
        sessionCount: 1,
        lastActivity: "2024-01-07 14:30:00",
        timezone: "UTC",
        language: "en",
      },
      {
        id: "user-002",
        name: "Maria Garcia",
        email: "maria@tenant1.com",
        role: "TENANT_ADMIN",
        status: "ACTIVE",
        tenantId: "tenant-001",
        tenantName: "ExpoBuild Solutions",
        lastLogin: "2024-01-07 12:15:00",
        registrationDate: "2023-02-20",
        loginCount: 89,
        permissions: ["users.manage", "content.manage"],
        profileComplete: 85,
        twoFactorEnabled: true,
        emailVerified: true,
        phoneVerified: false,
        riskScore: 0.2,
        sessionCount: 2,
        lastActivity: "2024-01-07 12:15:00",
        timezone: "EST",
        language: "en",
      },
      {
        id: "user-003",
        name: "David Chen",
        email: "david@tenant2.com",
        role: "TENANT_MEMBER",
        status: "ACTIVE",
        tenantId: "tenant-002",
        tenantName: "TradeShow Experts",
        lastLogin: "2024-01-06 09:45:00",
        registrationDate: "2023-03-10",
        loginCount: 67,
        permissions: ["content.view"],
        profileComplete: 70,
        twoFactorEnabled: false,
        emailVerified: true,
        phoneVerified: false,
        riskScore: 0.3,
        sessionCount: 1,
        lastActivity: "2024-01-06 09:45:00",
        timezone: "PST",
        language: "en",
      },
      {
        id: "user-004",
        name: "Sarah Williams",
        email: "sarah@standzon.com",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        lastLogin: "2024-01-07 16:20:00",
        registrationDate: "2023-01-20",
        loginCount: 98,
        permissions: ["users.manage", "content.manage", "payments.manage", "analytics.view", "settings.manage"],
        profileComplete: 100,
        twoFactorEnabled: true,
        emailVerified: true,
        phoneVerified: true,
        riskScore: 0.05,
        sessionCount: 1,
        lastActivity: "2024-01-07 16:20:00",
        timezone: "UTC",
        language: "en",
      },
      {
        id: "user-005",
        name: "James Wilson",
        email: "james@tenant3.com",
        role: "TENANT_ADMIN",
        status: "PENDING",
        tenantId: "tenant-003",
        tenantName: "Global Exhibitions",
        lastLogin: "2024-01-05 11:30:00",
        registrationDate: "2023-04-15",
        loginCount: 34,
        permissions: ["users.manage", "content.manage"],
        profileComplete: 60,
        twoFactorEnabled: false,
        emailVerified: true,
        phoneVerified: false,
        riskScore: 0.4,
        sessionCount: 1,
        lastActivity: "2024-01-05 11:30:00",
        timezone: "GMT",
        language: "en",
      },
      {
        id: "user-006",
        name: "Emma Thompson",
        email: "emma@tenant4.com",
        role: "USER",
        status: "SUSPENDED",
        tenantId: "tenant-004",
        tenantName: "Exhibition Masters",
        lastLogin: "2023-12-15 10:15:00",
        registrationDate: "2023-05-20",
        loginCount: 12,
        permissions: ["content.view"],
        profileComplete: 45,
        twoFactorEnabled: false,
        emailVerified: true,
        phoneVerified: false,
        riskScore: 0.7,
        sessionCount: 0,
        lastActivity: "2023-12-15 10:15:00",
        timezone: "CET",
        language: "en",
      },
      {
        id: "user-007",
        name: "Michael Brown",
        email: "michael@tenant5.com",
        role: "TENANT_MEMBER",
        status: "ACTIVE",
        tenantId: "tenant-005",
        tenantName: "ShowStands Pro",
        lastLogin: "2024-01-07 08:45:00",
        registrationDate: "2023-06-05",
        loginCount: 78,
        permissions: ["content.view"],
        profileComplete: 75,
        twoFactorEnabled: true,
        emailVerified: true,
        phoneVerified: true,
        riskScore: 0.15,
        sessionCount: 1,
        lastActivity: "2024-01-07 08:45:00",
        timezone: "IST",
        language: "en",
      },
      {
        id: "user-008",
        name: "Olivia Davis",
        email: "olivia@tenant6.com",
        role: "TENANT_ADMIN",
        status: "ACTIVE",
        tenantId: "tenant-006",
        tenantName: "Design & Build Expo",
        lastLogin: "2024-01-06 15:20:00",
        registrationDate: "2023-07-12",
        loginCount: 56,
        permissions: ["users.manage", "content.manage", "payments.manage"],
        profileComplete: 80,
        twoFactorEnabled: true,
        emailVerified: true,
        phoneVerified: false,
        riskScore: 0.25,
        sessionCount: 1,
        lastActivity: "2024-01-06 15:20:00",
        timezone: "AEST",
        language: "en",
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'SUSPENDED':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Suspended</Badge>;
      case 'BANNED':
        return <Badge variant="secondary" className="bg-red-700/20 text-red-500 border-red-700/30">Banned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Role badge component
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">Super Admin</Badge>;
      case 'TENANT_ADMIN':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Tenant Admin</Badge>;
      case 'TENANT_MEMBER':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Tenant Member</Badge>;
      case 'USER':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">User</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400">Manage platform users and their permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
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
                  placeholder="Search users..."
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="TENANT_ADMIN">Tenant Admin</SelectItem>
                  <SelectItem value="TENANT_MEMBER">Tenant Member</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: users.length, icon: <Users className="w-5 h-5" />, color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30' },
          { title: 'Active Users', value: users.filter(u => u.status === 'ACTIVE').length, icon: <Activity className="w-5 h-5" />, color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30' },
          { title: 'Super Admins', value: users.filter(u => u.role === 'SUPER_ADMIN').length, icon: <Shield className="w-5 h-5" />, color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30' },
          { title: 'Avg. Profile Completion', value: `${Math.round(users.reduce((sum, u) => sum + u.profileComplete, 0) / users.length)}%`, icon: <UserCheck className="w-5 h-5" />, color: 'from-amber-500/30 via-orange-500/30 to-red-500/30' },
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

      {/* Users Table */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Directory</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredUsers.length} users found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Tenant</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Last Login</TableHead>
                  <TableHead className="text-gray-300">Profile</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-300">{user.tenantName || 'N/A'}</TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={user.profileComplete} className="h-2 w-20" />
                        <span className="text-sm text-gray-400">{user.profileComplete}%</span>
                      </div>
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
                            onClick={() => setSelectedUser(user)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="cursor-pointer text-red-400">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

      {/* User Detail Modal */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">User Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Comprehensive view of {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-gray-800/50">
                  <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                  <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:bg-blue-600">Profile</TabsTrigger>
                  <TabsTrigger value="permissions" className="text-gray-300 data-[state=active]:bg-blue-600">Permissions</TabsTrigger>
                  <TabsTrigger value="sessions" className="text-gray-300 data-[state=active]:bg-blue-600">Sessions</TabsTrigger>
                  <TabsTrigger value="security" className="text-gray-300 data-[state=active]:bg-blue-600">Security</TabsTrigger>
                  <TabsTrigger value="activity" className="text-gray-300 data-[state=active]:bg-blue-600">Activity</TabsTrigger>
                  <TabsTrigger value="logs" className="text-gray-300 data-[state=active]:bg-blue-600">Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">User Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{selectedUser.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{selectedUser.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">User ID</span>
                          <span className="text-white">{selectedUser.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tenant</span>
                          <span className="text-white">{selectedUser.tenantName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Role</span>
                          <span className="text-white">{getRoleBadge(selectedUser.role)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-white">{getStatusBadge(selectedUser.status)}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Registration Date</span>
                          <span className="text-white">{selectedUser.registrationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Login</span>
                          <span className="text-white">{selectedUser.lastLogin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Login Count</span>
                          <span className="text-white">{selectedUser.loginCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Session Count</span>
                          <span className="text-white">{selectedUser.sessionCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk Score</span>
                          <span className="text-white">{selectedUser.riskScore.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Profile Completion</span>
                          <span className="text-white">{selectedUser.profileComplete}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Account Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${selectedUser.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-medium">Email Verified</div>
                            <div className="text-sm text-gray-400">{selectedUser.emailVerified ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${selectedUser.phoneVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-medium">Phone Verified</div>
                            <div className="text-sm text-gray-400">{selectedUser.phoneVerified ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${selectedUser.twoFactorEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-medium">2FA Enabled</div>
                            <div className="text-sm text-gray-400">{selectedUser.twoFactorEnabled ? 'Yes' : 'No'}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="profile" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">User Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Profile information for this user would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="permissions" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">User Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Permissions</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.permissions.map((permission, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sessions" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Active sessions for this user would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Security settings for this user would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Recent activity for this user would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="logs" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">User Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">User logs would be displayed here.</p>
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