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
  Package as PackageIcon,
  Code,
  Palette,
  Layers,
  Grid3X3,
  Box,
  Component,
  Square,
  RectangleVertical,
  RectangleHorizontal,
  Layout,
  LayoutTemplate,
  Blocks,
  Blockquote,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Text,
  Type,
  TypeOutline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Unlink,
  Image as ImageIcon,
  Video as VideoIcon,
  Audio,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileJson,
  FileXml,
  FileSpreadsheet,
  FileArchive,
  FileQuestion,
  FileSignature,
  FileStack,
  FileBox,
  Folder,
  FolderOpen,
  FolderClosed,
  FolderRoot,
  FolderInput,
  FolderOutput,
  FolderSearch,
  FolderSearch2,
  FolderArchive,
  FolderHeart,
  FolderCheck,
  FolderClock,
  FolderDot,
  FolderGit,
  FolderKey,
  FolderLock,
  FolderOpenDot,
  FolderPlus,
  FolderSymlink,
  FolderTree,
  FolderUp,
  FolderX,
  FolderArchive as FolderArchiveIcon,
  FolderClock as FolderClockIcon,
  FolderGit as FolderGitIcon,
  FolderKey as FolderKeyIcon,
  FolderLock as FolderLockIcon,
  FolderOpen as FolderOpenIcon,
  FolderPlus as FolderPlusIcon,
  FolderSymlink as FolderSymlinkIcon,
  FolderTree as FolderTreeIcon,
  FolderUp as FolderUpIcon,
  FolderX as FolderXIcon,
  FolderSearch as FolderSearchIcon,
  FolderSearch2 as FolderSearch2Icon,
  FolderHeart as FolderHeartIcon,
  FolderCheck as FolderCheckIcon,
  FolderDot as FolderDotIcon,
  FolderInput as FolderInputIcon,
  FolderOutput as FolderOutputIcon,
  FolderRoot as FolderRootIcon,
  FolderArchive as FolderArchiveIcon,
  FolderClock as FolderClockIcon,
  FolderGit as FolderGitIcon,
  FolderKey as FolderKeyIcon,
  FolderLock as FolderLockIcon,
  FolderOpen as FolderOpenIcon,
  FolderPlus as FolderPlusIcon,
  FolderSymlink as FolderSymlinkIcon,
  FolderTree as FolderTreeIcon,
  FolderUp as FolderUpIcon,
  FolderX as FolderXIcon,
  FolderSearch as FolderSearchIcon,
  FolderSearch2 as FolderSearch2Icon,
  FolderHeart as FolderHeartIcon,
  FolderCheck as FolderCheckIcon,
  FolderDot as FolderDotIcon,
  FolderInput as FolderInputIcon,
  FolderOutput as FolderOutputIcon,
  FolderRoot as FolderRootIcon,
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

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  previewUrl: string;
  jsonConfig: Record<string, any>;
  htmlTemplate: string;
  cssStyles: string;
  jsScripts: string;
  version: string;
  isPublic: boolean;
  isPremium: boolean;
  featured: boolean;
  usageCount: number;
  rating: number;
  reviewCount: number;
  authorId: string;
  authorName: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Component {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  componentType: 'BLOCK' | 'WIDGET' | 'MODULE' | 'LAYOUT' | 'FORM' | 'NAVIGATION';
  jsonSchema: Record<string, any>;
  htmlTemplate: string;
  cssStyles: string;
  jsScripts: string;
  defaultProps: Record<string, any>;
  version: string;
  isPublic: boolean;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  reviewCount: number;
  authorId: string;
  authorName: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MarketplaceProps {
  adminId: string;
  permissions: string[];
}

export default function TemplatesComponentsMarketplace({
  adminId,
  permissions,
}: MarketplaceProps) {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedItem, setSelectedItem] = useState<Template | Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("templates");
  const [marketplaceTab, setMarketplaceTab] = useState("all");

  // Mock data for templates
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: "temp-001",
        name: "Modern Business",
        slug: "modern-business",
        description: "A clean, professional template for business websites with modern design elements.",
        category: "Business",
        tags: ["business", "professional", "clean"],
        thumbnailUrl: "/placeholder-template.jpg",
        previewUrl: "/preview/modern-business",
        jsonConfig: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        version: "1.2.0",
        isPublic: true,
        isPremium: false,
        featured: true,
        usageCount: 1245,
        rating: 4.8,
        reviewCount: 124,
        authorId: "author-001",
        authorName: "Design Studio Pro",
        publishedAt: "2023-01-15",
        createdAt: "2023-01-10",
        updatedAt: "2024-01-07",
      },
      {
        id: "temp-002",
        name: "Creative Portfolio",
        slug: "creative-portfolio",
        description: "Perfect for artists, designers, and creative professionals to showcase their work.",
        category: "Portfolio",
        tags: ["portfolio", "creative", "gallery"],
        thumbnailUrl: "/placeholder-template.jpg",
        previewUrl: "/preview/creative-portfolio",
        jsonConfig: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        version: "1.1.3",
        isPublic: true,
        isPremium: true,
        featured: true,
        usageCount: 892,
        rating: 4.9,
        reviewCount: 89,
        authorId: "author-002",
        authorName: "Creative Labs",
        publishedAt: "2023-02-20",
        createdAt: "2023-02-15",
        updatedAt: "2024-01-06",
      },
      {
        id: "temp-003",
        name: "E-commerce Starter",
        slug: "ecommerce-starter",
        description: "Complete e-commerce solution with product listings, cart, and checkout.",
        category: "E-commerce",
        tags: ["ecommerce", "store", "shop"],
        thumbnailUrl: "/placeholder-template.jpg",
        previewUrl: "/preview/ecommerce-starter",
        jsonConfig: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        version: "2.0.1",
        isPublic: true,
        isPremium: false,
        featured: false,
        usageCount: 2156,
        rating: 4.7,
        reviewCount: 215,
        authorId: "author-003",
        authorName: "Dev Solutions",
        publishedAt: "2023-03-10",
        createdAt: "2023-03-05",
        updatedAt: "2024-01-05",
      },
      {
        id: "temp-004",
        name: "Corporate Hub",
        slug: "corporate-hub",
        description: "Comprehensive corporate website with multiple sections and advanced features.",
        category: "Business",
        tags: ["corporate", "enterprise", "advanced"],
        thumbnailUrl: "/placeholder-template.jpg",
        previewUrl: "/preview/corporate-hub",
        jsonConfig: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        version: "1.4.2",
        isPublic: true,
        isPremium: true,
        featured: true,
        usageCount: 765,
        rating: 4.6,
        reviewCount: 76,
        authorId: "author-004",
        authorName: "Enterprise Themes",
        publishedAt: "2023-04-15",
        createdAt: "2023-04-10",
        updatedAt: "2024-01-04",
      },
      {
        id: "temp-005",
        name: "Agency Showcase",
        slug: "agency-showcase",
        description: "Designed specifically for agencies to showcase their services and portfolio.",
        category: "Agency",
        tags: ["agency", "services", "portfolio"],
        thumbnailUrl: "/placeholder-template.jpg",
        previewUrl: "/preview/agency-showcase",
        jsonConfig: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        version: "1.0.8",
        isPublic: true,
        isPremium: false,
        featured: false,
        usageCount: 543,
        rating: 4.5,
        reviewCount: 54,
        authorId: "author-005",
        authorName: "Agency Templates",
        publishedAt: "2023-05-20",
        createdAt: "2023-05-15",
        updatedAt: "2024-01-03",
      },
      {
        id: "temp-006",
        name: "Blog & News",
        slug: "blog-news",
        description: "Ideal for bloggers and news sites with responsive design and SEO features.",
        category: "Blog",
        tags: ["blog", "news", "articles"],
        thumbnailUrl: "/placeholder-template.jpg",
        previewUrl: "/preview/blog-news",
        jsonConfig: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        version: "1.3.0",
        isPublic: true,
        isPremium: false,
        featured: false,
        usageCount: 987,
        rating: 4.4,
        reviewCount: 98,
        authorId: "author-006",
        authorName: "Content Creators",
        publishedAt: "2023-06-05",
        createdAt: "2023-06-01",
        updatedAt: "2024-01-02",
      },
    ];

    const mockComponents: Component[] = [
      {
        id: "comp-001",
        name: "Hero Banner",
        slug: "hero-banner",
        description: "Eye-catching hero section with call-to-action buttons.",
        category: "Sections",
        tags: ["hero", "banner", "cta"],
        componentType: "BLOCK",
        jsonSchema: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        defaultProps: {},
        version: "1.0.0",
        isPublic: true,
        isPremium: false,
        usageCount: 3456,
        rating: 4.7,
        reviewCount: 345,
        authorId: "author-001",
        authorName: "Design Studio Pro",
        publishedAt: "2023-01-15",
        createdAt: "2023-01-10",
        updatedAt: "2024-01-07",
      },
      {
        id: "comp-002",
        name: "Feature Grid",
        slug: "feature-grid",
        description: "Grid layout for showcasing product features or services.",
        category: "Content",
        tags: ["features", "grid", "cards"],
        componentType: "BLOCK",
        jsonSchema: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        defaultProps: {},
        version: "1.1.0",
        isPublic: true,
        isPremium: false,
        usageCount: 2876,
        rating: 4.6,
        reviewCount: 287,
        authorId: "author-002",
        authorName: "Creative Labs",
        publishedAt: "2023-02-20",
        createdAt: "2023-02-15",
        updatedAt: "2024-01-06",
      },
      {
        id: "comp-003",
        name: "Contact Form",
        slug: "contact-form",
        description: "Fully functional contact form with validation.",
        category: "Forms",
        tags: ["form", "contact", "validation"],
        componentType: "FORM",
        jsonSchema: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        defaultProps: {},
        version: "1.2.0",
        isPublic: true,
        isPremium: false,
        usageCount: 4231,
        rating: 4.8,
        reviewCount: 423,
        authorId: "author-003",
        authorName: "Dev Solutions",
        publishedAt: "2023-03-10",
        createdAt: "2023-03-05",
        updatedAt: "2024-01-05",
      },
      {
        id: "comp-004",
        name: "Testimonial Carousel",
        slug: "testimonial-carousel",
        description: "Rotating carousel for customer testimonials.",
        category: "Content",
        tags: ["testimonials", "carousel", "reviews"],
        componentType: "WIDGET",
        jsonSchema: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        defaultProps: {},
        version: "1.0.5",
        isPublic: true,
        isPremium: true,
        usageCount: 1987,
        rating: 4.9,
        reviewCount: 198,
        authorId: "author-004",
        authorName: "Enterprise Themes",
        publishedAt: "2023-04-15",
        createdAt: "2023-04-10",
        updatedAt: "2024-01-04",
      },
      {
        id: "comp-005",
        name: "Pricing Table",
        slug: "pricing-table",
        description: "Clean pricing table with comparison features.",
        category: "Content",
        tags: ["pricing", "table", "comparison"],
        componentType: "BLOCK",
        jsonSchema: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        defaultProps: {},
        version: "1.1.2",
        isPublic: true,
        isPremium: false,
        usageCount: 2765,
        rating: 4.5,
        reviewCount: 276,
        authorId: "author-005",
        authorName: "Agency Templates",
        publishedAt: "2023-05-20",
        createdAt: "2023-05-15",
        updatedAt: "2024-01-03",
      },
      {
        id: "comp-006",
        name: "Newsletter Signup",
        slug: "newsletter-signup",
        description: "Engaging newsletter signup form with social proof.",
        category: "Forms",
        tags: ["newsletter", "signup", "email"],
        componentType: "FORM",
        jsonSchema: {},
        htmlTemplate: "",
        cssStyles: "",
        jsScripts: "",
        defaultProps: {},
        version: "1.0.3",
        isPublic: true,
        isPremium: false,
        usageCount: 3542,
        rating: 4.6,
        reviewCount: 354,
        authorId: "author-006",
        authorName: "Content Creators",
        publishedAt: "2023-06-05",
        createdAt: "2023-06-01",
        updatedAt: "2024-01-02",
      },
    ];

    // Simulate API call delay
    setTimeout(() => {
      setTemplates(mockTemplates);
      setComponents(mockComponents);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items based on search and filters
  const filteredItems = [...templates, ...components].filter(item => {
    const isTemplate = 'slug' in item && 'previewUrl' in item;
    const isComponent = 'componentType' in item;
    
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesType = true;
    if (typeFilter !== "all") {
      if (typeFilter === "templates" && !isTemplate) matchesType = false;
      if (typeFilter === "components" && !isComponent) matchesType = false;
    }
    
    let matchesCategory = true;
    if (categoryFilter !== "all") {
      if (item.category.toLowerCase() !== categoryFilter.toLowerCase()) matchesCategory = false;
    }
    
    let matchesStatus = true;
    if (statusFilter !== "all") {
      if (statusFilter === "public" && !item.isPublic) matchesStatus = false;
      if (statusFilter === "private" && item.isPublic) matchesStatus = false;
      if (statusFilter === "premium" && !item.isPremium) matchesStatus = false;
      if (statusFilter === "free" && item.isPremium) matchesStatus = false;
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const getStatusBadge = (isPublic: boolean, isPremium: boolean) => {
    if (isPremium) {
      return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Premium</Badge>;
    } else if (isPublic) {
      return <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Public</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">Private</Badge>;
    }
  };

  // Type badge component
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'templates':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Template</Badge>;
      case 'components':
        return <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">Component</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates & Components Marketplace</h1>
          <p className="text-gray-400">Manage and distribute design templates and reusable components</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
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
                  placeholder="Search templates and components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="components">Components</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Portfolio">Portfolio</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Agency">Agency</SelectItem>
                  <SelectItem value="Blog">Blog</SelectItem>
                  <SelectItem value="Sections">Sections</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                  <SelectItem value="Forms">Forms</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/90 border-gray-700 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Items', value: templates.length + components.length, icon: <PackageIcon className="w-5 h-5" />, color: 'from-blue-500/30 via-indigo-500/30 to-violet-500/30' },
          { title: 'Templates', value: templates.length, icon: <FileText className="w-5 h-5" />, color: 'from-green-500/30 via-emerald-500/30 to-teal-500/30' },
          { title: 'Components', value: components.length, icon: <Blocks className="w-5 h-5" />, color: 'from-purple-500/30 via-fuchsia-500/30 to-pink-500/30' },
          { title: 'Avg. Rating', value: (templates.concat(components as any[]).reduce((sum, item) => sum + item.rating, 0) / (templates.length + components.length)).toFixed(1), icon: <Star className="w-5 h-5" />, color: 'from-amber-500/30 via-orange-500/30 to-red-500/30' },
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

      {/* Marketplace Tabs */}
      <Tabs value={marketplaceTab} onValueChange={setMarketplaceTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="all" className="text-gray-300 data-[state=active]:bg-blue-600">All Items</TabsTrigger>
          <TabsTrigger value="templates" className="text-gray-300 data-[state=active]:bg-blue-600">Templates</TabsTrigger>
          <TabsTrigger value="components" className="text-gray-300 data-[state=active]:bg-blue-600">Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Marketplace Items</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredItems.length} items found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedItems.map((item) => {
                  const isTemplate = 'previewUrl' in item;
                  return (
                    <Card key={item.id} className="bg-gray-800/50 border-gray-700 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <div className="relative">
                        <img 
                          src={isTemplate ? (item as Template).thumbnailUrl : "/placeholder-component.jpg"} 
                          alt={item.name} 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(item.isPublic, item.isPremium)}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-white">{item.name}</h3>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-white">{item.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {item.usageCount.toLocaleString()} uses
                          </div>
                          <div className="flex gap-1">
                            {item.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
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
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Templates</CardTitle>
              <CardDescription className="text-gray-400">
                {templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).length} templates found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6).map(template => (
                  <Card key={template.id} className="bg-gray-800/50 border-gray-700 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedItem(template)}>
                    <div className="relative">
                      <img 
                        src={template.thumbnailUrl} 
                        alt={template.name} 
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(template.isPublic, template.isPremium)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white">{template.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-white">{template.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {template.usageCount.toLocaleString()} uses
                        </div>
                        <div className="flex gap-1">
                          {template.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 2 && (
                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              +{template.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Components</CardTitle>
              <CardDescription className="text-gray-400">
                {components.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length} components found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {components.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6).map(component => (
                  <Card key={component.id} className="bg-gray-800/50 border-gray-700 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setSelectedItem(component)}>
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-700/50 rounded-t-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto bg-gray-600/50 p-3 rounded-lg mb-2">
                            <Blocks className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-400 text-sm">{component.componentType}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(component.isPublic, component.isPremium)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white">{component.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-white">{component.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{component.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {component.usageCount.toLocaleString()} uses
                        </div>
                        <div className="flex gap-1">
                          {component.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {component.tags.length > 2 && (
                            <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                              +{component.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Item Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedItem.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedItem && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-7 bg-gray-800/50">
                  <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-blue-600">Overview</TabsTrigger>
                  <TabsTrigger value="details" className="text-gray-300 data-[state=active]:bg-blue-600">Details</TabsTrigger>
                  <TabsTrigger value="usage" className="text-gray-300 data-[state=active]:bg-blue-600">Usage</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
                  <TabsTrigger value="versions" className="text-gray-300 data-[state=active]:bg-blue-600">Versions</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-gray-300 data-[state=active]:bg-blue-600">Reviews</TabsTrigger>
                  <TabsTrigger value="config" className="text-gray-300 data-[state=active]:bg-blue-600">Configuration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Item Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{selectedItem.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Slug</span>
                          <span className="text-white">{selectedItem.slug}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category</span>
                          <span className="text-white">{selectedItem.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Author</span>
                          <span className="text-white">{selectedItem.authorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Version</span>
                          <span className="text-white">{selectedItem.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-white">{getStatusBadge(selectedItem.isPublic, selectedItem.isPremium)}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Usage Count</span>
                          <span className="text-white">{selectedItem.usageCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating</span>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-white">{selectedItem.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reviews</span>
                          <span className="text-white">{selectedItem.reviewCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Featured</span>
                          <span className="text-white">{selectedItem.hasOwnProperty('featured') ? (selectedItem as any).featured ? 'Yes' : 'No' : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Published</span>
                          <span className="text-white">{selectedItem.publishedAt || 'Not published'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created</span>
                          <span className="text-white">{selectedItem.createdAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{selectedItem.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Detailed Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedItem.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Properties</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Public</span>
                              <span className="text-white">{selectedItem.isPublic ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Premium</span>
                              <span className="text-white">{selectedItem.isPremium ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Author ID</span>
                              <span className="text-white">{selectedItem.authorId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Updated</span>
                              <span className="text-white">{selectedItem.updatedAt}</span>
                            </div>
                          </div>
                        </div>
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
                          <div className="text-2xl font-bold text-white">{selectedItem.usageCount.toLocaleString()}</div>
                          <div className="text-gray-400 text-sm">Total Uses</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedItem.rating}</div>
                          <div className="text-gray-400 text-sm">Average Rating</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">{selectedItem.reviewCount}</div>
                          <div className="text-gray-400 text-sm">Reviews</div>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-white">124</div>
                          <div className="text-gray-400 text-sm">Active Projects</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Analytics data for this item would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="versions" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Version History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Version history for this item would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Reviews for this item would be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="config" className="mt-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">Configuration options for this item would be displayed here.</p>
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