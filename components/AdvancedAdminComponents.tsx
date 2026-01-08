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

// Reusable Chart Components
interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ReusableBarChartProps {
  data: ChartData[];
  dataKey: string;
  nameKey?: string;
  title?: string;
  description?: string;
  color?: string;
  height?: number;
}

export const ReusableBarChart = ({ 
  data, 
  dataKey, 
  nameKey = "name", 
  title, 
  description, 
  color = "#8884d8",
  height = 300
}: ReusableBarChartProps) => {
  return (
    <ChartCard 
      title={title || "Bar Chart"} 
      description={description}
      chart={
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  );
};

interface ReusableLineChartProps {
  data: ChartData[];
  dataKey: string;
  nameKey?: string;
  title?: string;
  description?: string;
  color?: string;
  height?: number;
}

export const ReusableLineChart = ({ 
  data, 
  dataKey, 
  nameKey = "name", 
  title, 
  description, 
  color = "#8884d8",
  height = 300
}: ReusableLineChartProps) => {
  return (
    <ChartCard 
      title={title || "Line Chart"} 
      description={description}
      chart={
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      }
    />
  );
};

interface ReusablePieChartProps {
  data: ChartData[];
  dataKey: string;
  nameKey?: string;
  title?: string;
  description?: string;
  colors?: string[];
  height?: number;
}

export const ReusablePieChart = ({ 
  data, 
  dataKey, 
  nameKey = "name", 
  title, 
  description, 
  colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
  height = 300
}: ReusablePieChartProps) => {
  return (
    <ChartCard 
      title={title || "Pie Chart"} 
      description={description}
      chart={
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      }
    />
  );
};

interface ReusableAreaChartProps {
  data: ChartData[];
  dataKey: string;
  nameKey?: string;
  title?: string;
  description?: string;
  color?: string;
  height?: number;
}

export const ReusableAreaChart = ({ 
  data, 
  dataKey, 
  nameKey = "name", 
  title, 
  description, 
  color = "#8884d8",
  height = 300
}: ReusableAreaChartProps) => {
  return (
    <ChartCard 
      title={title || "Area Chart"} 
      description={description}
      chart={
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      }
    />
  );
};

// Reusable Dialog Components
interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default"
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"} 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit: () => void;
  submitDisabled?: boolean;
}

export const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  submitDisabled = false
}: FormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-2">
          {children}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={submitDisabled}
          >
            {submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Reusable Notification Components
interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export const Toast = ({ title, description, variant = "default", action, onDismiss }: ToastProps) => {
  const getVariantColor = () => {
    switch(variant) {
      case "success": return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30";
      case "warning": return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/30";
      case "error": return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30";
      default: return "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900";
    }
  };

  const getIcon = () => {
    switch(variant) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getVariantColor()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <div className="mt-1 text-sm">{description}</div>
          )}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          {action && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {onDismiss && (
            <button 
              className="ml-2 inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onDismiss}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface NotificationPanelProps {
  notifications: Array<{
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    read: boolean;
    type: "info" | "success" | "warning" | "error";
  }>;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationPanel = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  onClearAll
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Badge variant="secondary">{unreadCount} unread</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No notifications
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-md border ${
                  notification.read 
                    ? "bg-muted/30" 
                    : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onClearNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {notification.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.timestamp}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Reusable Filter Components
interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  presets?: Array<{ label: string; range: [Date, Date] }>;
}

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  presets
}: DateRangeFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">From:</label>
        <Input
          type="date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={(e) => onStartDateChange(e.target.valueAsDate)}
          className="w-auto"
        />
      </div>
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">To:</label>
        <Input
          type="date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={(e) => onEndDateChange(e.target.valueAsDate)}
          className="w-auto"
        />
      </div>
      {presets && (
        <div className="flex flex-wrap gap-1">
          {presets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                onStartDateChange(preset.range[0]);
                onEndDateChange(preset.range[1]);
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

interface MultiSelectFilterProps {
  options: Array<{ label: string; value: string }>;
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelectFilter = ({
  options,
  selectedValues,
  onValueChange,
  placeholder = "Select options..."
}: MultiSelectFilterProps) => {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter(v => v !== value));
    } else {
      onValueChange([...selectedValues, value]);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-10">
        {selectedValues.map(value => {
          const option = options.find(opt => opt.value === value);
          return (
            <Badge key={value} variant="secondary" className="flex items-center">
              {option?.label}
              <button 
                className="ml-1 rounded-full hover:bg-secondary"
                onClick={() => toggleOption(value)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
        <Input
          placeholder={selectedValues.length === 0 ? placeholder : ""}
          className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[100px]"
          onFocus={(e) => {
            // Focus behavior can be customized
          }}
        />
      </div>
      <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
        {options.map((option, index) => (
          <div 
            key={index}
            className={`p-2 cursor-pointer hover:bg-gray-100 ${
              selectedValues.includes(option.value) ? 'bg-blue-50' : ''
            }`}
            onClick={() => toggleOption(option.value)}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                readOnly
                className="mr-2"
              />
              {option.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable Card Components
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  trend?: "up" | "down";
  footer?: React.ReactNode;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend, 
  footer 
}: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs mt-1 ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {change.value}
          </p>
        )}
        {footer && <div className="mt-3">{footer}</div>}
      </CardContent>
    </Card>
  );
};

interface SummaryCardProps {
  title: string;
  description: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  status?: {
    text: string;
    variant: "default" | "success" | "warning" | "error";
  };
}

export const SummaryCard = ({ 
  title, 
  description, 
  value, 
  icon, 
  trend, 
  status 
}: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-4">
          {trend && (
            <p className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.value} from last period
            </p>
          )}
          {status && (
            <Badge 
              variant={
                status.variant === "success" ? "default" : 
                status.variant === "warning" ? "default" : 
                status.variant === "error" ? "destructive" : "outline"
              }
              className={
                status.variant === "warning" 
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
                  : ""
              }
            >
              {status.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Reusable Table Components
interface SortableTableHeaderProps {
  title: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
}

export const SortableTableHeader = ({ 
  title, 
  sortKey, 
  currentSort, 
  onSort 
}: SortableTableHeaderProps) => {
  const isSorted = currentSort?.key === sortKey;
  const isAsc = isSorted && currentSort.direction === 'asc';

  return (
    <div 
      className="flex items-center cursor-pointer"
      onClick={() => {
        if (isSorted) {
          onSort(sortKey, isAsc ? 'desc' : 'asc');
        } else {
          onSort(sortKey, 'asc');
        }
      }}
    >
      <span>{title}</span>
      <div className="ml-1 flex flex-col">
        <ChevronUp 
          className={`h-3 w-3 ${isSorted && !isAsc ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`} 
        />
        <ChevronDown 
          className={`h-3 w-3 ${isSorted && isAsc ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`} 
        />
      </div>
    </div>
  );
};

// Export all components
export default {
  ReusableBarChart,
  ReusableLineChart,
  ReusablePieChart,
  ReusableAreaChart,
  ConfirmationDialog,
  FormDialog,
  Toast,
  NotificationPanel,
  DateRangeFilter,
  MultiSelectFilter,
  MetricCard,
  SummaryCard,
  SortableTableHeader
};