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

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  tradeShowName: string;
  eventDate: string;
  venue: string;
  city: string;
  country: string;
  standSize: number;
  budget: string;
  timeline: string;
  standType: string;
  leadScore: number;
  estimatedValue: number;
  status: 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'QUOTED' | 'CONVERTED' | 'LOST' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  source: string;
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
  builderId?: string;
  builderName?: string;
  assignedAt?: string;
  viewedAt?: string;
  contactedAt?: string;
  quotedAt?: string;
  declinedAt?: string;
  notes: string;
  specialRequests?: string;
  needsInstallation: boolean;
  needsTransportation: boolean;
  needsStorage: boolean;
  needsAVEquipment: boolean;
  needsLighting: boolean;
  needsFurniture: boolean;
  needsGraphics: boolean;
}

interface LeadsManagementProps {
  adminId: string;
  permissions: string[];
}

export default function LeadsManagement({
  adminId,
  permissions,
}: LeadsManagementProps) {
  const { theme } = useTheme();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for leads
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: "lead-001",
        companyName: "Global Tech Expo",
        contactName: "John Smith",
        contactEmail: "john@globaltech.com",
        contactPhone: "+1 (555) 123-4567",
        tradeShowName: "TechCon 2024",
        eventDate: "2024-05-15",
        venue: "Convention Center",
        city: "San Francisco",
        country: "USA",
        standSize: 400,
        budget: "$50,000 - $75,000",
        timeline: "Immediate",
        standType: "Modular",
        leadScore: 92,
        estimatedValue: 65000,
        status: "CONVERTED",
        priority: "HIGH",
        source: "Website",
        createdAt: "2024-01-05",
        updatedAt: "2024-01-07",
        convertedAt: "2024-01-07",
        builderId: "builder-001",
        builderName: "ExpoBuild Solutions",
        assignedAt: "2024-01-05",
        viewedAt: "2024-01-05",
        contactedAt: "2024-01-06",
        quotedAt: "2024-01-07",
        notes: "High-value client with tight timeline",
        specialRequests: "Custom lighting and AV equipment",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: false,
        needsAVEquipment: true,
        needsLighting: true,
        needsFurniture: false,
        needsGraphics: true,
      },
      {
        id: "lead-002",
        companyName: "Innovate Industries",
        contactName: "Sarah Johnson",
        contactEmail: "sarah@innovate.com",
        contactPhone: "+1 (555) 987-6543",
        tradeShowName: "Innovation Summit",
        eventDate: "2024-06-20",
        venue: "Exhibition Hall",
        city: "New York",
        country: "USA",
        standSize: 200,
        budget: "$25,000 - $40,000",
        timeline: "Flexible",
        standType: "Custom",
        leadScore: 85,
        estimatedValue: 32000,
        status: "QUOTED",
        priority: "MEDIUM",
        source: "Referral",
        createdAt: "2024-01-04",
        updatedAt: "2024-01-06",
        builderId: "builder-002",
        builderName: "TradeShow Experts",
        assignedAt: "2024-01-04",
        viewedAt: "2024-01-04",
        contactedAt: "2024-01-05",
        quotedAt: "2024-01-06",
        notes: "Looking for sustainable materials",
        specialRequests: "Eco-friendly materials preferred",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: true,
        needsAVEquipment: false,
        needsLighting: true,
        needsFurniture: true,
        needsGraphics: true,
      },
      {
        id: "lead-003",
        companyName: "Digital Solutions Ltd",
        contactName: "Michael Chen",
        contactEmail: "michael@digitalsolutions.com",
        contactPhone: "+1 (555) 456-7890",
        tradeShowName: "Digital Expo Asia",
        eventDate: "2024-04-10",
        venue: "International Center",
        city: "Singapore",
        country: "Singapore",
        standSize: 300,
        budget: "$40,000 - $60,000",
        timeline: "Urgent",
        standType: "Modular",
        leadScore: 78,
        estimatedValue: 50000,
        status: "CONTACTED",
        priority: "HIGH",
        source: "Trade Show",
        createdAt: "2024-01-03",
        updatedAt: "2024-01-06",
        builderId: "builder-003",
        builderName: "Global Exhibitions",
        assignedAt: "2024-01-03",
        viewedAt: "2024-01-03",
        contactedAt: "2024-01-06",
        notes: "Interested in interactive displays",
        specialRequests: "Touch screen displays required",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: false,
        needsAVEquipment: true,
        needsLighting: true,
        needsFurniture: false,
        needsGraphics: true,
      },
      {
        id: "lead-004",
        companyName: "Future Manufacturing",
        contactName: "Emma Rodriguez",
        contactEmail: "emma@futuremanu.com",
        contactPhone: "+1 (555) 234-5678",
        tradeShowName: "Manufacturing Expo",
        eventDate: "2024-07-15",
        venue: "Industrial Complex",
        city: "Houston",
        country: "USA",
        standSize: 600,
        budget: "$75,000 - $100,000",
        timeline: "Flexible",
        standType: "Custom",
        leadScore: 95,
        estimatedValue: 85000,
        status: "NEW",
        priority: "URGENT",
        source: "Website",
        createdAt: "2024-01-07",
        updatedAt: "2024-01-07",
        notes: "Large scale project with complex requirements",
        specialRequests: "Heavy machinery display needed",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: true,
        needsAVEquipment: true,
        needsLighting: true,
        needsFurniture: true,
        needsGraphics: true,
      },
      {
        id: "lead-005",
        companyName: "Healthcare Innovators",
        contactName: "David Kim",
        contactEmail: "david@healthcare.com",
        contactPhone: "+1 (555) 345-6789",
        tradeShowName: "Medical Conference",
        eventDate: "2024-03-22",
        venue: "Convention Center",
        city: "Boston",
        country: "USA",
        standSize: 150,
        budget: "$20,000 - $30,000",
        timeline: "Immediate",
        standType: "Modular",
        leadScore: 70,
        estimatedValue: 25000,
        status: "ASSIGNED",
        priority: "MEDIUM",
        source: "Event",
        createdAt: "2024-01-02",
        updatedAt: "2024-01-06",
        builderId: "builder-004",
        builderName: "Exhibition Masters",
        assignedAt: "2024-01-02",
        notes: "Medical equipment display",
        specialRequests: "Sterile environment required",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: false,
        needsAVEquipment: false,
        needsLighting: true,
        needsFurniture: true,
        needsGraphics: true,
      },
      {
        id: "lead-006",
        companyName: "Retail Excellence",
        contactName: "Olivia Williams",
        contactEmail: "olivia@retail.com",
        contactPhone: "+1 (555) 567-8901",
        tradeShowName: "Retail Summit",
        eventDate: "2024-08-05",
        venue: "Exhibition Park",
        city: "Chicago",
        country: "USA",
        standSize: 250,
        budget: "$30,000 - $45,000",
        timeline: "Flexible",
        standType: "Custom",
        leadScore: 65,
        estimatedValue: 38000,
        status: "NEW",
        priority: "LOW",
        source: "Referral",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        notes: "Focus on customer engagement",
        specialRequests: "Interactive demo stations",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: true,
        needsAVEquipment: true,
        needsLighting: true,
        needsFurniture: true,
        needsGraphics: true,
      },
      {
        id: "lead-007",
        companyName: "Energy Solutions Inc",
        contactName: "James Wilson",
        contactEmail: "james@energy.com",
        contactPhone: "+1 (555) 678-9012",
        tradeShowName: "Energy Expo",
        eventDate: "2024-05-30",
        venue: "Convention Center",
        city: "Austin",
        country: "USA",
        standSize: 500,
        budget: "$60,000 - $80,000",
        timeline: "Immediate",
        standType: "Modular",
        leadScore: 88,
        estimatedValue: 70000,
        status: "CONVERTED",
        priority: "HIGH",
        source: "Website",
        createdAt: "2024-01-04",
        updatedAt: "2024-01-06",
        convertedAt: "2024-01-06",
        builderId: "builder-005",
        builderName: "ShowStands Pro",
        assignedAt: "2024-01-04",
        viewedAt: "2024-01-04",
        contactedAt: "2024-01-05",
        quotedAt: "2024-01-06",
        notes: "Sustainable energy focus",
        specialRequests: "Solar panel displays",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: false,
        needsAVEquipment: true,
        needsLighting: true,
        needsFurniture: false,
        needsGraphics: true,
      },
      {
        id: "lead-008",
        companyName: "Fashion Forward",
        contactName: "Sophia Garcia",
        contactEmail: "sophia@fashion.com",
        contactPhone: "+1 (555) 789-0123",
        tradeShowName: "Fashion Week",
        eventDate: "2024-04-25",
        venue: "Fashion Center",
        city: "Los Angeles",
        country: "USA",
        standSize: 100,
        budget: "$15,000 - $25,000",
        timeline: "Urgent",
        standType: "Modular",
        leadScore: 60,
        estimatedValue: 20000,
        status: "LOST",
        priority: "MEDIUM",
        source: "Event",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-05",
        declinedAt: "2024-01-05",
        notes: "Budget constraints",
        needsInstallation: true,
        needsTransportation: true,
        needsStorage: false,
        needsAVEquipment: false,
        needsLighting: true,
        needsFurniture: true,
        needsGraphics: true,
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setLeads(mockLeads);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.tradeShowName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">New</Badge>;
      case 'ASSIGNED':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Assigned</Badge>;
      case 'CONTACTED':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">Contacted</Badge>;
      case 'QUOTED':
        return <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Quoted</Badge>;
      case 'CONVERTED':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Converted</Badge>;
      case 'LOST':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Lost</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Priority badge component
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Low</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium</Badge>;
      case 'HIGH':
        return <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>;
      case 'URGENT':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Urgent</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads Management</h1>
          <p className="text-gray-400">Manage incoming leads and their pipeline status</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
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
                  placeholder="Search leads..."
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
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Leads', value: leads.length, icon: <MessageSquare className="w-5 h-5" />, color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30' },
          { title: 'New Leads', value: leads.filter(l => l.status === 'NEW').length, icon: <UserPlus className="w-5 h-5" />, color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30' },
          { title: 'Converted', value: leads.filter(l => l.status === 'CONVERTED').length, icon: <CheckCircle className="w-5 h-5" />, color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30' },
          { title: 'Avg. Lead Score', value: Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length), icon: <Target className="w-5 h-5" />, color: 'from-amber-500/30 via-orange-500/30 to-red-500/30' },
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

      {/* Leads Table */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lead Pipeline</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredLeads.length} leads found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">Company</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Trade Show</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Priority</TableHead>
                  <TableHead className="text-gray-300">Value</TableHead>
                  <TableHead className="text-gray-300">Score</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">
                      <div>
                        <div className="text-white font-medium">{lead.companyName}</div>
                        <div className="text-gray-400 text-sm">{lead.city}, {lead.country}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div>
                        <div>{lead.contactName}</div>
                        <div className="text-gray-400 text-sm">{lead.contactEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{lead.tradeShowName}</TableCell>
                    <TableCell>
                      {getStatusBadge(lead.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(lead.priority)}
                    </TableCell>
                    <TableCell className="text-gray-300">${lead.estimatedValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span>{lead.leadScore}</span>
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
                            onClick={() => setSelectedLead(lead)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem className="cursor-pointer text-red-400">
                            <Ban className="mr-2 h-4 w-4" />
                            Mark as Lost
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
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

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Lead Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Comprehensive view of {selectedLead.companyName}
              </DialogDescription>
            </DialogHeader>
            
            {selectedLead && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-gray-800/50">
                  <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                  <TabsTrigger value="requirements" className="text-gray-300 data-[state=active]:bg-blue-600">Requirements</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-gray-300 data-[state=active]:bg-blue-600">Timeline</TabsTrigger>
                  <TabsTrigger value="builder" className="text-gray-300 data-[state=active]:bg-blue-600">Builder</TabsTrigger>
                  <TabsTrigger value="quotes" className="text-gray-300 data-[state=active]:bg-blue-600">Quotes</TabsTrigger>
                  <TabsTrigger value="communications" className="text-gray-300 data-[state=active]:bg-blue-600">Communications</TabsTrigger>
                  <TabsTrigger value="notes" className="text-gray-300 data-[state=active]:bg-blue-600">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Lead Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Company Name</span>
                          <span className="text-white">{selectedLead.companyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contact Person</span>
                          <span className="text-white">{selectedLead.contactName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white">{selectedLead.contactEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Phone</span>
                          <span className="text-white">{selectedLead.contactPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Trade Show</span>
                          <span className="text-white">{selectedLead.tradeShowName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Venue</span>
                          <span className="text-white">{selectedLead.venue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Event Date</span>
                          <span className="text-white">{selectedLead.eventDate}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Lead Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-white">{getStatusBadge(selectedLead.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Priority</span>
                          <span className="text-white">{getPriorityBadge(selectedLead.priority)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lead Score</span>
                          <span className="text-white">{selectedLead.leadScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimated Value</span>
                          <span className="text-white">${selectedLead.estimatedValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Source</span>
                          <span className="text-white">{selectedLead.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created At</span>
                          <span className="text-white">{selectedLead.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Updated At</span>
                          <span className="text-white">{selectedLead.updatedAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Lead Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{selectedLead.notes}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="requirements" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Requirements & Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Stand Requirements</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Stand Size</span>
                              <span className="text-white">{selectedLead.standSize} sq ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Budget Range</span>
                              <span className="text-white">{selectedLead.budget}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Stand Type</span>
                              <span className="text-white">{selectedLead.standType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Timeline</span>
                              <span className="text-white">{selectedLead.timeline}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Special Requirements</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsInstallation ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">Installation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsTransportation ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">Transportation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsStorage ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">Storage</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsAVEquipment ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">AV Equipment</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsLighting ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">Lighting</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsFurniture ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">Furniture</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${selectedLead.needsGraphics ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                <Check className="w-4 h-4" />
                              </div>
                              <span className="text-gray-400">Graphics</span>
                            </div>
                          </div>
                          
                          {selectedLead.specialRequests && (
                            <div className="mt-4">
                              <h4 className="text-md font-medium text-white mb-2">Special Requests</h4>
                              <p className="text-gray-300">{selectedLead.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="timeline" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Lead Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white">Lead Created</div>
                            <div className="text-gray-400 text-sm">{selectedLead.createdAt}</div>
                          </div>
                        </div>
                        {selectedLead.assignedAt && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white">Assigned to Builder</div>
                              <div className="text-gray-400 text-sm">{selectedLead.assignedAt}</div>
                            </div>
                          </div>
                        )}
                        {selectedLead.viewedAt && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                              <Eye className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white">Viewed by Builder</div>
                              <div className="text-gray-400 text-sm">{selectedLead.viewedAt}</div>
                            </div>
                          </div>
                        )}
                        {selectedLead.contactedAt && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white">Contacted</div>
                              <div className="text-gray-400 text-sm">{selectedLead.contactedAt}</div>
                            </div>
                          </div>
                        )}
                        {selectedLead.quotedAt && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                              <DollarSign className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white">Quoted</div>
                              <div className="text-gray-400 text-sm">{selectedLead.quotedAt}</div>
                            </div>
                          </div>
                        )}
                        {selectedLead.convertedAt && (
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-green-600/20 text-green-500">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white">Converted</div>
                              <div className="text-gray-400 text-sm">{selectedLead.convertedAt}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="builder" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Assigned Builder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedLead.builderName ? (
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder-avatar.jpg" alt={selectedLead.builderName} />
                            <AvatarFallback>{selectedLead.builderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white font-medium">{selectedLead.builderName}</div>
                            <div className="text-gray-400">{selectedLead.builderId}</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400">No builder assigned yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="quotes" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Quotes & Proposals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Quotes for this lead would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="communications" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Communications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Communication history for this lead would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{selectedLead.notes}</p>
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