"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Menu, 
  X, 
  Home, 
  Building2, 
  FileText, 
  Settings, 
  Database, 
  Users, 
  BarChart3, 
  Globe, 
  Upload, 
  Shield, 
  PieChart, 
  Activity, 
  Zap, 
  Award, 
  TrendingUp, 
  Monitor, 
  Sun, 
  Moon,
  DollarSign,
  Calendar,
  MessageSquare,
  Package,
  Key,
  Server,
  AlertTriangle,
  Bell,
  Layers,
  Grid3X3,
  Clock,
  Flag,
  Heart,
  Mail,
  Phone,
  MapPin,
  CalendarCheck,
  Eye,
  EyeOff,
  GitBranch,
  Cloud,
  Lock,
  UserRound,
  CreditCard,
  Receipt,
  ShoppingCart,
  Star,
  ThumbsUp,
  Volume2,
  UsersRound,
  UserCog,
  FileJson,
  Code,
  Palette,
  LockOpen,
  UserCheck,
  BadgeCheck,
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
  Archive,
  Trash2,
  RotateCcw,
  Filter,
  Search,
  Download,
  Upload as UploadIcon,
  Plus,
  MoreHorizontal,
  Copy,
  Share,
  Bookmark,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  Image,
  Video,
  Music,
  Archive as ArchiveIcon,
  Tag,
  Hash,
  AtSign,
  Link as LinkIcon,
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCw,
  RefreshCw,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  VolumeX,
  Volume1,
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
  HardDrive,
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
  Waves,
  Anchor,
  Sailboat,
  Waves as WavesIcon,
  Ship as ShipIcon,
  Anchor as AnchorIcon,
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  MapPin as MapPinIcon,
  Pin,
  PinOff,
  Crosshair,
  Crosshair as CrosshairIcon,
  Target,
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
import { useTheme } from "@/components/ThemeProvider";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props}>
        <SidebarLinks />
      </DesktopSidebar>
      <MobileSidebar {...(props as React.ComponentProps<"div">)}>
        <SidebarLinks />
      </MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen sticky top-0 px-4 py-4 hidden md:flex md:flex-col bg-gradient-to-b from-gray-900 to-gray-950 w-[280px] flex-shrink-0 border-r border-gray-800 backdrop-blur-xl",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "60px") : "280px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-gray-900/80 backdrop-blur-xl w-full border-b border-gray-800"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-gray-300 cursor-pointer hover:text-white"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-gray-900/95 backdrop-blur-xl p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-gray-300 cursor-pointer hover:text-white"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  
  if (link.disabled) {
    return (
      <div
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2 text-gray-500 cursor-not-allowed",
          className
        )}
        title="Coming soon"
      >
        {link.icon}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-gray-500 text-sm whitespace-pre inline-block !p-0 !m-0"
        >
          {link.label}
        </motion.span>
        {link.badge && open && (
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400"
          >
            {link.badge}
          </motion.span>
        )}
      </div>
    );
  }

  return (
    <Link
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors duration-200",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-gray-300 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
      {link.badge && open && (
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
        >
          {link.badge}
        </motion.span>
      )}
      {link.external && open && (
        <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
      )}
    </Link>
  );
};

// Map section titles to icons
const sectionIcons: Record<string, React.ReactNode> = {
  'COMMAND CENTER': <Home className="w-4 h-4 text-gray-400" />,
  'TENANT MANAGEMENT': <Building2 className="w-4 h-4 text-gray-400" />,
  'USER MANAGEMENT': <Users className="w-4 h-4 text-gray-400" />,
  'PROJECTS & WEBSITES': <FileText className="w-4 h-4 text-gray-400" />,
  'DEPLOYMENTS & DOMAINS': <Upload className="w-4 h-4 text-gray-400" />,
  'LEADS & APPOINTMENTS': <MessageSquare className="w-4 h-4 text-gray-400" />,
  'TEMPLATES & COMPONENTS': <Package className="w-4 h-4 text-gray-400" />,
  'BILLING & FINANCE': <DollarSign className="w-4 h-4 text-gray-400" />,
  'INTEGRATIONS & API': <Globe className="w-4 h-4 text-gray-400" />,
  'REVIEWS & REPUTATION': <Star className="w-4 h-4 text-gray-400" />,
  'ALERTS & LOGS': <AlertTriangle className="w-4 h-4 text-gray-400" />,
  'SYSTEM SETTINGS': <Settings className="w-4 h-4 text-gray-400" />,
  'REPORTS & INSIGHTS': <BarChart3 className="w-4 h-4 text-gray-400" />,
};

// Map item labels to icons
const itemIcons: Record<string, React.ReactNode> = {
  // Command Center
  'Command Center': <Home className="w-4 h-4 text-gray-400" />,
  'Dashboard': <Home className="w-4 h-4 text-gray-400" />,
  'Activity Stream': <Activity className="w-4 h-4 text-gray-400" />,
  'AI Insights': <Zap className="w-4 h-4 text-gray-400" />,
  'Platform Status': <Server className="w-4 h-4 text-gray-400" />,
  
  // Tenant Management
  'Tenants': <Building2 className="w-4 h-4 text-gray-400" />,
  'Tenant Analytics': <BarChart3 className="w-4 h-4 text-gray-400" />,
  'Tenant Plans': <CreditCard className="w-4 h-4 text-gray-400" />,
  'Tenant Compliance': <Shield className="w-4 h-4 text-gray-400" />,
  
  // User Management
  'Users': <Users className="w-4 h-4 text-gray-400" />,
  'User Roles': <Shield className="w-4 h-4 text-gray-400" />,
  'User Sessions': <Activity className="w-4 h-4 text-gray-400" />,
  'User Permissions': <Lock className="w-4 h-4 text-gray-400" />,
  
  // Projects & Websites
  'Projects': <FileText className="w-4 h-4 text-gray-400" />,
  'Project Analytics': <BarChart3 className="w-4 h-4 text-gray-400" />,
  'Websites': <Globe className="w-4 h-4 text-gray-400" />,
  'SEO Management': <Search className="w-4 h-4 text-gray-400" />,
  
  // Deployments & Domains
  'Deployments': <Upload className="w-4 h-4 text-gray-400" />,
  'Domains': <Globe className="w-4 h-4 text-gray-400" />,
  'SSL Certificates': <Shield className="w-4 h-4 text-gray-400" />,
  'CDN Configuration': <Cloud className="w-4 h-4 text-gray-400" />,
  
  // Leads & Appointments
  'Leads': <MessageSquare className="w-4 h-4 text-gray-400" />,
  'Lead Pipeline': <Workflow className="w-4 h-4 text-gray-400" />,
  'Appointments': <Calendar className="w-4 h-4 text-gray-400" />,
  'Lead Analytics': <BarChart3 className="w-4 h-4 text-gray-400" />,
  
  // Templates & Components
  'Templates': <Package className="w-4 h-4 text-gray-400" />,
  'Components': <Layers className="w-4 h-4 text-gray-400" />,
  'Marketplace': <Store className="w-4 h-4 text-gray-400" />,
  'Design System': <Palette className="w-4 h-4 text-gray-400" />,
  
  // Billing & Finance
  'Subscriptions': <CreditCard className="w-4 h-4 text-gray-400" />,
  'Payments': <DollarSign className="w-4 h-4 text-gray-400" />,
  'Invoices': <Receipt className="w-4 h-4 text-gray-400" />,
  'Revenue Analytics': <TrendingUp className="w-4 h-4 text-gray-400" />,
  
  // Integrations & API
  'Third-Party Integrations': <Globe className="w-4 h-4 text-gray-400" />,
  'API Management': <Key className="w-4 h-4 text-gray-400" />,
  'Webhooks': <GitBranch className="w-4 h-4 text-gray-400" />,
  'OAuth Providers': <LockOpen className="w-4 h-4 text-gray-400" />,
  
  // Reviews & Reputation
  'Reviews': <Star className="w-4 h-4 text-gray-400" />,
  'Review Analytics': <BarChart3 className="w-4 h-4 text-gray-400" />,
  'Review Moderation': <Eye className="w-4 h-4 text-gray-400" />,
  'Review Responses': <MessageSquare className="w-4 h-4 text-gray-400" />,
  
  // Alerts & Logs
  'System Alerts': <AlertTriangle className="w-4 h-4 text-gray-400" />,
  'System Logs': <FileText className="w-4 h-4 text-gray-400" />,
  'Audit Trail': <Activity className="w-4 h-4 text-gray-400" />,
  'Error Monitoring': <AlertTriangle className="w-4 h-4 text-gray-400" />,
  
  // System Settings
  'Global Settings': <Settings className="w-4 h-4 text-gray-400" />,
  'Feature Flags': <Flag className="w-4 h-4 text-gray-400" />,
  'Maintenance Mode': <Settings className="w-4 h-4 text-gray-400" />,
  'Backup & Recovery': <Database className="w-4 h-4 text-gray-400" />,
  
  // Reports & Insights
  'Weekly Reports': <FileText className="w-4 h-4 text-gray-400" />,
  'Business Intelligence': <BarChart3 className="w-4 h-4 text-gray-400" />,
  'Usage Analytics': <Activity className="w-4 h-4 text-gray-400" />,
  'Performance Metrics': <TrendingUp className="w-4 h-4 text-gray-400" />,
};

// Navigation sections
const sections = [
  {
    title: 'COMMAND CENTER',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: itemIcons['Dashboard'] },
      { label: 'Activity Stream', href: '/admin/activity', icon: itemIcons['Activity Stream'] },
      { label: 'AI Insights', href: '/admin/ai-insights', icon: itemIcons['AI Insights'] },
      { label: 'Platform Status', href: '/admin/status', icon: itemIcons['Platform Status'] },
    ],
  },
  {
    title: 'TENANT MANAGEMENT',
    items: [
      { label: 'Tenants', href: '/admin/tenants', icon: itemIcons['Tenants'] },
      { label: 'Tenant Analytics', href: '/admin/tenants/analytics', icon: itemIcons['Tenant Analytics'] },
      { label: 'Tenant Plans', href: '/admin/tenants/plans', icon: itemIcons['Tenant Plans'] },
      { label: 'Tenant Compliance', href: '/admin/tenants/compliance', icon: itemIcons['Tenant Compliance'] },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { label: 'Users', href: '/admin/users', icon: itemIcons['Users'] },
      { label: 'User Roles', href: '/admin/users/roles', icon: itemIcons['User Roles'] },
      { label: 'User Sessions', href: '/admin/users/sessions', icon: itemIcons['User Sessions'] },
      { label: 'User Permissions', href: '/admin/users/permissions', icon: itemIcons['User Permissions'] },
    ],
  },
  {
    title: 'PROJECTS & WEBSITES',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: itemIcons['Projects'] },
      { label: 'Project Analytics', href: '/admin/projects/analytics', icon: itemIcons['Project Analytics'] },
      { label: 'Websites', href: '/admin/websites', icon: itemIcons['Websites'] },
      { label: 'SEO Management', href: '/admin/seo', icon: itemIcons['SEO Management'] },
    ],
  },
  {
    title: 'DEPLOYMENTS & DOMAINS',
    items: [
      { label: 'Deployments', href: '/admin/deployments', icon: itemIcons['Deployments'] },
      { label: 'Domains', href: '/admin/domains', icon: itemIcons['Domains'] },
      { label: 'SSL Certificates', href: '/admin/ssl', icon: itemIcons['SSL Certificates'] },
      { label: 'CDN Configuration', href: '/admin/cdn', icon: itemIcons['CDN Configuration'] },
    ],
  },
  {
    title: 'LEADS & APPOINTMENTS',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: itemIcons['Leads'] },
      { label: 'Lead Pipeline', href: '/admin/leads/pipeline', icon: itemIcons['Lead Pipeline'] },
      { label: 'Appointments', href: '/admin/appointments', icon: itemIcons['Appointments'] },
      { label: 'Lead Analytics', href: '/admin/leads/analytics', icon: itemIcons['Lead Analytics'] },
    ],
  },
  {
    title: 'TEMPLATES & COMPONENTS',
    items: [
      { label: 'Templates', href: '/admin/templates', icon: itemIcons['Templates'] },
      { label: 'Components', href: '/admin/components', icon: itemIcons['Components'] },
      { label: 'Marketplace', href: '/admin/marketplace', icon: itemIcons['Marketplace'] },
      { label: 'Design System', href: '/admin/design-system', icon: itemIcons['Design System'] },
    ],
  },
  {
    title: 'BILLING & FINANCE',
    items: [
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: itemIcons['Subscriptions'] },
      { label: 'Payments', href: '/admin/payments', icon: itemIcons['Payments'] },
      { label: 'Invoices', href: '/admin/invoices', icon: itemIcons['Invoices'] },
      { label: 'Revenue Analytics', href: '/admin/revenue', icon: itemIcons['Revenue Analytics'] },
    ],
  },
  {
    title: 'INTEGRATIONS & API',
    items: [
      { label: 'Third-Party Integrations', href: '/admin/integrations', icon: itemIcons['Third-Party Integrations'] },
      { label: 'API Management', href: '/admin/api', icon: itemIcons['API Management'] },
      { label: 'Webhooks', href: '/admin/webhooks', icon: itemIcons['Webhooks'] },
      { label: 'OAuth Providers', href: '/admin/oauth', icon: itemIcons['OAuth Providers'] },
    ],
  },
  {
    title: 'REVIEWS & REPUTATION',
    items: [
      { label: 'Reviews', href: '/admin/reviews', icon: itemIcons['Reviews'] },
      { label: 'Review Analytics', href: '/admin/reviews/analytics', icon: itemIcons['Review Analytics'] },
      { label: 'Review Moderation', href: '/admin/reviews/moderation', icon: itemIcons['Review Moderation'] },
      { label: 'Review Responses', href: '/admin/reviews/responses', icon: itemIcons['Review Responses'] },
    ],
  },
  {
    title: 'ALERTS & LOGS',
    items: [
      { label: 'System Alerts', href: '/admin/alerts', icon: itemIcons['System Alerts'] },
      { label: 'System Logs', href: '/admin/logs', icon: itemIcons['System Logs'] },
      { label: 'Audit Trail', href: '/admin/audit', icon: itemIcons['Audit Trail'] },
      { label: 'Error Monitoring', href: '/admin/errors', icon: itemIcons['Error Monitoring'] },
    ],
  },
  {
    title: 'SYSTEM SETTINGS',
    items: [
      { label: 'Global Settings', href: '/admin/settings', icon: itemIcons['Global Settings'] },
      { label: 'Feature Flags', href: '/admin/features', icon: itemIcons['Feature Flags'] },
      { label: 'Maintenance Mode', href: '/admin/maintenance', icon: itemIcons['Maintenance Mode'] },
      { label: 'Backup & Recovery', href: '/admin/backup', icon: itemIcons['Backup & Recovery'] },
    ],
  },
  {
    title: 'REPORTS & INSIGHTS',
    items: [
      { label: 'Weekly Reports', href: '/admin/reports/weekly', icon: itemIcons['Weekly Reports'] },
      { label: 'Business Intelligence', href: '/admin/business-intelligence', icon: itemIcons['Business Intelligence'] },
      { label: 'Usage Analytics', href: '/admin/usage', icon: itemIcons['Usage Analytics'] },
      { label: 'Performance Metrics', href: '/admin/performance', icon: itemIcons['Performance Metrics'] },
    ],
  },
];

export const SidebarLinks = () => {
  const { theme, toggleTheme } = useTheme();
  const { open } = useSidebar();
  
  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <div className="text-sm font-bold text-white">Super Admin</div>
                <div className="text-xs text-gray-400">Command Center</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-2 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="px-2 py-1 text-xs tracking-wide font-semibold text-gray-500 uppercase flex items-center gap-2"
              >
                {sectionIcons[section.title] || <div className="w-4 h-4" />}
                {section.title}
              </motion.div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarLink 
                  key={item.label} 
                  link={item} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-start gap-2 w-full py-2 text-gray-300 hover:bg-gray-800/50 rounded-md px-2 transition-colors duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-gray-300" />
          ) : (
            <Moon className="w-4 h-4 text-gray-300" />
          )}
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-gray-300"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          )}
        </button>
        
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-4 px-2 text-xs text-gray-500"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div>v1.0.0</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};