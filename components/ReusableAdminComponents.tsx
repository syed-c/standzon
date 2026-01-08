"use client";

import React from "react";
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
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  EyeIcon,
  Pencil,
  Archive,
  Ban,
  Check,
  X,
  Flag,
  Package,
  Key,
  Lock,
  Verified,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Info,
  Play,
  Pause,
  Square,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitDiff,
  Code,
  Terminal,
  Command,
  PlayCircle,
  Stop,
  SkipBack,
  SkipForward,
  RotateCw,
  RefreshCw as RefreshCwIcon,
  TrendingDown,
  ShoppingCart,
  Receipt,
  Wallet,
  PiggyBank,
  Coins,
  Gem,
  Scale,
  Truck,
  Ship,
  Plane,
  Train,
  Car,
  Bike,
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
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CalendarArrowUp,
  CalendarArrowDown,
  Settings2,
  Server,
  Network,
  Router,
  Cpu,
  MemoryStick,
  Database as DatabaseIcon,
  HardDrive as HardDriveIcon,
  Monitor,
  Printer,
  Camera,
  Video,
  Speaker,
  Headphones,
  Gamepad2,
  Watch,
  Battery,
  BatteryCharging,
  Wifi,
  Bluetooth,
  Signal,
  Globe as GlobeIcon,
  Link,
  Unlock,
  Lock as LockIcon,
  ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Eye as EyeIconHidden,
  EyeOff,
  Copy,
  Share2,
  Archive as ArchiveIcon,
  Unarchive,
  Ban as BanIcon,
  Flag as FlagIcon,
  ArchiveRestore,
  RotateCcw,
  RefreshCcw,
  UploadCloud,
  DownloadCloud,
  Cloud,
  CloudUpload,
  CloudDownload,
  HardDriveUpload,
  HardDriveDownload,
} from "lucide-react";

// Reusable Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  color = "default"
}: StatCardProps) => {
  const getIconColor = () => {
    switch(color) {
      case "primary": return "text-blue-600 dark:text-blue-400";
      case "success": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "danger": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={getIconColor()}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value} {trend.isPositive ? '↑' : '↓'} {description}
          </p>
        )}
        {!trend && description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

// Reusable Data Table Component
interface DataTableProps<T> {
  columns: Array<{
    header: string;
    accessor: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
  }>;
  data: T[];
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filterOptions?: Array<{
    label: string;
    value: string;
    accessor: keyof T;
  }>;
  onFilterChange?: (filter: { accessor: string; value: string }) => void;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  actions,
  searchPlaceholder = "Search...",
  onSearchChange,
  filterOptions = [],
  onFilterChange
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleFilterChange = (accessor: string, value: string) => {
    const newFilterValues = { ...filterValues, [accessor]: value };
    setFilterValues(newFilterValues);
    if (onFilterChange) {
      onFilterChange({ accessor, value });
    }
  };

  // Filter data based on search term and filters
  const filteredData = data.filter(item => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Column filters
    for (const [accessor, filterValue] of Object.entries(filterValues)) {
      if (filterValue && String(item[accessor as keyof T]) !== filterValue) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-8 w-full sm:w-64"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter, index) => (
            <Select 
              key={index}
              value={filterValues[filter.accessor as string] || ""}
              onValueChange={(value) => handleFilterChange(filter.accessor as string, value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={`Filter by ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All {filter.label}s</SelectItem>
                {Array.from(new Set(data.map(item => String(item[filter.accessor])))).map((value, idx) => (
                  <SelectItem key={idx} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow 
                key={index} 
                onClick={() => onRowClick && onRowClick(item)}
                className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className={column.className}>
                    {column.cell ? column.cell(item) : String(item[column.accessor])}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Reusable Filter Bar Component
interface FilterBarProps {
  filters: Array<{
    label: string;
    value: string;
    accessor: string;
    options: Array<{ label: string; value: string }>;
  }>;
  onFilterChange: (filter: { accessor: string; value: string }) => void;
  activeFilters: Record<string, string>;
}

export const FilterBar = ({ 
  filters, 
  onFilterChange, 
  activeFilters 
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm font-medium">{filter.label}:</span>
          <Select 
            value={activeFilters[filter.accessor] || ""}
            onValueChange={(value) => onFilterChange({ accessor: filter.accessor, value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={`Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}s</SelectItem>
              {filter.options.map((option, idx) => (
                <SelectItem key={idx} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

// Reusable Status Badge Component
interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "outline";
}

export const StatusBadge = ({ status, variant = "default" }: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'success':
      case 'completed':
      case 'succeeded':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'inactive':
      case 'inactive':
      case 'disabled':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'failed':
      case 'error':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    }
  };

  return (
    <Badge variant={variant} className={getStatusColor()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Reusable Action Dialog Component
interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionButtonLabel: string;
  onAction: () => void;
  children?: React.ReactNode;
  actionButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const ActionDialog = ({
  open,
  onOpenChange,
  title,
  description,
  actionButtonLabel,
  onAction,
  children,
  actionButtonVariant = "default"
}: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={actionButtonVariant} onClick={onAction}>
            {actionButtonLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Reusable Chart Card Component
interface ChartCardProps {
  title: string;
  description?: string;
  chart: React.ReactNode;
}

export const ChartCard = ({ title, description, chart }: ChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {chart}
      </CardContent>
    </Card>
  );
};

// Reusable Progress Card Component
interface ProgressCardProps {
  title: string;
  value: number;
  max?: number;
  description?: string;
  status?: string;
}

export const ProgressCard = ({ 
  title, 
  value, 
  max = 100, 
  description, 
  status 
}: ProgressCardProps) => {
  const percentage = (value / max) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{value} / {max}</span>
          <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
        </div>
        <Progress value={percentage} className="w-full" />
        {status && (
          <div className="mt-2 text-sm text-muted-foreground">
            Status: <span className="font-medium">{status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Reusable User Avatar Component
interface UserAvatarProps {
  name: string;
  email?: string;
  image?: string;
  size?: "sm" | "md" | "lg";
}

export const UserAvatar = ({ name, email, image, size = "md" }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback>
        {name
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

// Reusable Activity Feed Item Component
interface ActivityItemProps {
  user: string;
  action: string;
  target?: string;
  time: string;
  icon?: React.ReactNode;
  color?: string;
}

export const ActivityItem = ({ user, action, target, time, icon, color = "text-blue-600" }: ActivityItemProps) => {
  return (
    <div className="flex items-start py-2">
      <div className={`mr-3 mt-0.5 ${color}`}>
        {icon || <Activity className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{user}</span> {action}
          {target && <span className="font-medium"> {target}</span>}
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

// Reusable Notification Banner Component
interface NotificationBannerProps {
  type: "info" | "success" | "warning" | "error";
  message: string;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export const NotificationBanner = ({ 
  type, 
  message, 
  actionText, 
  onAction, 
  onClose 
}: NotificationBannerProps) => {
  const getBannerStyle = () => {
    switch(type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200";
      default: // info
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200";
    }
  };

  const getIcon = () => {
    switch(type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-md border p-4 ${getBannerStyle()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm">{message}</p>
          {actionText && onAction && (
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={onAction}>
                {actionText}
              </Button>
            </div>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default {
  StatCard,
  DataTable,
  FilterBar,
  StatusBadge,
  ActionDialog,
  ChartCard,
  ProgressCard,
  UserAvatar,
  ActivityItem,
  NotificationBanner
};