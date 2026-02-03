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
} from "lucide-react";

interface WeeklyReportData {
  period: string;
  currentWeek: {
    builders: number;
    projects: number;
    leads: number;
    revenue: number;
    conversions: number;
    activeUsers: number;
  };
  previousWeek: {
    builders: number;
    projects: number;
    leads: number;
    revenue: number;
    conversions: number;
    activeUsers: number;
  };
  topPerformingBuilders: Array<{
    id: string;
    name: string;
    growth: number;
    revenue: number;
    leads: number;
  }>;
  topConvertingPages: Array<{
    id: string;
    name: string;
    conversionRate: number;
    traffic: number;
  }>;
  topTemplatesUsed: Array<{
    id: string;
    name: string;
    usageCount: number;
    conversionRate: number;
  }>;
  aiInsights: string;
  funnelPerformance: Array<{
    stage: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
  }>;
}

const WeeklyReports = () => {
  const { theme } = useTheme();
  const [reportData, setReportData] = useState<WeeklyReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last-week');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for weekly report
  useEffect(() => {
    const mockReportData: WeeklyReportData = {
      period: '2023-10-01 to 2023-10-07',
      currentWeek: {
        builders: 124,
        projects: 342,
        leads: 1287,
        revenue: 24560,
        conversions: 124,
        activeUsers: 892
      },
      previousWeek: {
        builders: 112,
        projects: 312,
        leads: 1123,
        revenue: 21890,
        conversions: 108,
        activeUsers: 789
      },
      topPerformingBuilders: [
        {
          id: 'builder_1',
          name: 'Acme Corporation',
          growth: 23.5,
          revenue: 4200,
          leads: 124
        },
        {
          id: 'builder_2',
          name: 'Beta Startup',
          growth: 18.2,
          revenue: 3850,
          leads: 98
        },
        {
          id: 'builder_3',
          name: 'Enterprise Inc',
          growth: 15.7,
          revenue: 3120,
          leads: 87
        },
        {
          id: 'builder_4',
          name: 'Tech Solutions',
          growth: 12.4,
          revenue: 2980,
          leads: 76
        },
        {
          id: 'builder_5',
          name: 'Global Services',
          growth: 9.8,
          revenue: 2560,
          leads: 65
        }
      ],
      topConvertingPages: [
        {
          id: 'page_1',
          name: 'Home Page',
          conversionRate: 4.2,
          traffic: 12400
        },
        {
          id: 'page_2',
          name: 'Contact Page',
          conversionRate: 3.8,
          traffic: 8900
        },
        {
          id: 'page_3',
          name: 'Services Page',
          conversionRate: 3.1,
          traffic: 11200
        },
        {
          id: 'page_4',
          name: 'About Page',
          conversionRate: 2.9,
          traffic: 7800
        },
        {
          id: 'page_5',
          name: 'Portfolio Page',
          conversionRate: 2.7,
          traffic: 9200
        }
      ],
      topTemplatesUsed: [
        {
          id: 'temp_1',
          name: 'Business Pro',
          usageCount: 42,
          conversionRate: 4.5
        },
        {
          id: 'temp_2',
          name: 'Creative Agency',
          usageCount: 38,
          conversionRate: 3.9
        },
        {
          id: 'temp_3',
          name: 'E-commerce',
          usageCount: 31,
          conversionRate: 5.2
        },
        {
          id: 'temp_4',
          name: 'Portfolio',
          usageCount: 28,
          conversionRate: 3.7
        },
        {
          id: 'temp_5',
          name: 'Landing Page',
          usageCount: 25,
          conversionRate: 4.1
        }
      ],
      aiInsights: "Based on this week's data, we noticed that builders using the 'E-commerce' template had 23% higher conversion rates compared to other templates. Additionally, traffic from organic search increased by 18%, suggesting improved SEO performance. We recommend promoting the 'E-commerce' template to new builders.",
      funnelPerformance: [
        {
          stage: 'Visitor',
          visitors: 45000,
          conversions: 0,
          conversionRate: 0
        },
        {
          stage: 'Lead',
          visitors: 0,
          conversions: 1287,
          conversionRate: 2.86
        },
        {
          stage: 'Appointment',
          visitors: 0,
          conversions: 89,
          conversionRate: 6.9
        },
        {
          stage: 'Booking',
          visitors: 0,
          conversions: 42,
          conversionRate: 47.2
        }
      ]
    };
    
    setReportData(mockReportData);
    setLoading(false);
  }, []);

  const calculateDelta = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!reportData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const growthData = [
    { name: 'Mon', visitors: 3200, leads: 89 },
    { name: 'Tue', visitors: 4100, leads: 102 },
    { name: 'Wed', visitors: 3800, leads: 95 },
    { name: 'Thu', visitors: 4500, leads: 118 },
    { name: 'Fri', visitors: 5200, leads: 132 },
    { name: 'Sat', visitors: 3900, leads: 98 },
    { name: 'Sun', visitors: 4300, leads: 115 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Reports</h1>
          <p className="text-muted-foreground mt-1">
            Week-over-week insights and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Period */}
      <Card>
        <CardHeader>
          <CardTitle>Report Period: {reportData.period}</CardTitle>
          <CardDescription>Comparative analysis of this week vs. previous week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Builders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{reportData.currentWeek.builders}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({calculateDelta(reportData.currentWeek.builders, reportData.previousWeek.builders).toFixed(1)}%)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs. {reportData.previousWeek.builders} last week
                </p>
                <Progress 
                  value={Math.min(100, (reportData.currentWeek.builders / 150) * 100)} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{formatNumber(reportData.currentWeek.leads)}</span>
                  <span className={`ml-2 text-sm ${calculateDelta(reportData.currentWeek.leads, reportData.previousWeek.leads) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculateDelta(reportData.currentWeek.leads, reportData.previousWeek.leads) >= 0 ? '+' : ''}
                    {calculateDelta(reportData.currentWeek.leads, reportData.previousWeek.leads).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs. {formatNumber(reportData.previousWeek.leads)} last week
                </p>
                <Progress 
                  value={Math.min(100, (reportData.currentWeek.leads / 1500) * 100)} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{formatCurrency(reportData.currentWeek.revenue)}</span>
                  <span className={`ml-2 text-sm ${calculateDelta(reportData.currentWeek.revenue, reportData.previousWeek.revenue) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {calculateDelta(reportData.currentWeek.revenue, reportData.previousWeek.revenue) >= 0 ? '+' : ''}
                    {calculateDelta(reportData.currentWeek.revenue, reportData.previousWeek.revenue).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs. {formatCurrency(reportData.previousWeek.revenue)} last week
                </p>
                <Progress 
                  value={Math.min(100, (reportData.currentWeek.revenue / 30000) * 100)} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Growth Trends</CardTitle>
          <CardDescription>Visitors and leads over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value.toLocaleString(), '']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="leads" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Builders */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Builders</CardTitle>
            <CardDescription>Builders with highest growth this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topPerformingBuilders.map((builder, index) => (
                <div key={builder.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{builder.name}</p>
                      <p className="text-sm text-muted-foreground">Revenue: {formatCurrency(builder.revenue)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-500">+{builder.growth}%</p>
                    <p className="text-sm text-muted-foreground">{builder.leads} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Converting Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Converting Pages</CardTitle>
            <CardDescription>Pages with highest conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topConvertingPages.map((page, index) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{page.name}</p>
                    <p className="text-sm text-muted-foreground">{formatNumber(page.traffic)} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{page.conversionRate}% conv.</p>
                    <p className="text-sm text-muted-foreground">rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates and Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Templates Used */}
        <Card>
          <CardHeader>
            <CardTitle>Top Templates Used</CardTitle>
            <CardDescription>Most popular templates this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.topTemplatesUsed.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.usageCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {template.conversionRate}%
                          <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Funnel Performance</CardTitle>
            <CardDescription>Conversion rates at each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.funnelPerformance.map((stage, index, stages) => (
                <div key={stage.stage}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.visitors > 0 ? formatNumber(stage.visitors) : formatNumber(stage.conversions)} 
                      {stage.conversionRate > 0 && ` (${stage.conversionRate}%)`}
                    </span>
                  </div>
                  {index < stages.length - 1 && (
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${(stage.conversionRate || (stage.conversions / stages[index + 1].visitors) * 100) || 0}%` }}
                        ></div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>Automated analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h4 className="font-medium mb-1">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">{reportData.aiInsights}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Promote the 'E-commerce' template to new builders to increase conversion rates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Organic search traffic increased by 18%. Invest in SEO optimization.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Action Item</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Follow up with builders who haven't converted after 7 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{formatNumber(reportData.currentWeek.activeUsers)}</span>
              <span className={`ml-2 text-sm ${calculateDelta(reportData.currentWeek.activeUsers, reportData.previousWeek.activeUsers) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateDelta(reportData.currentWeek.activeUsers, reportData.previousWeek.activeUsers) >= 0 ? '+' : ''}
                {calculateDelta(reportData.currentWeek.activeUsers, reportData.previousWeek.activeUsers).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Projects Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{formatNumber(reportData.currentWeek.projects)}</span>
              <span className={`ml-2 text-sm ${calculateDelta(reportData.currentWeek.projects, reportData.previousWeek.projects) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateDelta(reportData.currentWeek.projects, reportData.previousWeek.projects) >= 0 ? '+' : ''}
                {calculateDelta(reportData.currentWeek.projects, reportData.previousWeek.projects).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">
                {(reportData.currentWeek.conversions / reportData.currentWeek.leads * 100).toFixed(2)}%
              </span>
              <span className={`ml-2 text-sm ${calculateDelta(
                reportData.currentWeek.conversions / reportData.currentWeek.leads * 100,
                reportData.previousWeek.conversions / reportData.previousWeek.leads * 100
              ) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateDelta(
                  reportData.currentWeek.conversions / reportData.currentWeek.leads * 100,
                  reportData.previousWeek.conversions / reportData.previousWeek.leads * 100
                ) >= 0 ? '+' : ''}
                {calculateDelta(
                  reportData.currentWeek.conversions / reportData.currentWeek.leads * 100,
                  reportData.previousWeek.conversions / reportData.previousWeek.leads * 100
                ).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyReports;