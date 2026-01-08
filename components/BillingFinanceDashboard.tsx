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
} from "lucide-react";

interface Transaction {
  id: string;
  builderId: string;
  builderName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'subscription' | 'payment' | 'refund' | 'credit';
  plan: string;
  date: Date;
  paymentMethod: string;
  invoiceId: string;
}

interface Subscription {
  id: string;
  builderId: string;
  builderName: string;
  plan: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
}

const BillingFinanceDashboard = () => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for transactions and subscriptions
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: 'txn_1',
        builderId: 'builder_1',
        builderName: 'Acme Corporation',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        type: 'subscription',
        plan: 'Premium',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        paymentMethod: 'Visa ending in 1234',
        invoiceId: 'inv_001'
      },
      {
        id: 'txn_2',
        builderId: 'builder_2',
        builderName: 'Beta Startup',
        amount: 99.99,
        currency: 'USD',
        status: 'pending',
        type: 'payment',
        plan: 'Enterprise',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        paymentMethod: 'Mastercard ending in 5678',
        invoiceId: 'inv_002'
      },
      {
        id: 'txn_3',
        builderId: 'builder_3',
        builderName: 'Enterprise Inc',
        amount: 19.99,
        currency: 'USD',
        status: 'failed',
        type: 'subscription',
        plan: 'Basic',
        date: new Date(Date.now() - 1000 * 60 * 60 * 3),
        paymentMethod: 'PayPal',
        invoiceId: 'inv_003'
      },
      {
        id: 'txn_4',
        builderId: 'builder_4',
        builderName: 'Demo Builder',
        amount: 49.99,
        currency: 'USD',
        status: 'completed',
        type: 'subscription',
        plan: 'Pro',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        paymentMethod: 'Visa ending in 9012',
        invoiceId: 'inv_004'
      },
      {
        id: 'txn_5',
        builderId: 'builder_5',
        builderName: 'Tech Solutions',
        amount: 149.99,
        currency: 'USD',
        status: 'refunded',
        type: 'payment',
        plan: 'Enterprise',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        paymentMethod: 'Bank Transfer',
        invoiceId: 'inv_005'
      }
    ];
    
    const mockSubscriptions: Subscription[] = [
      {
        id: 'sub_1',
        builderId: 'builder_1',
        builderName: 'Acme Corporation',
        plan: 'Premium',
        status: 'active',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        amount: 29.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      },
      {
        id: 'sub_2',
        builderId: 'builder_2',
        builderName: 'Beta Startup',
        plan: 'Enterprise',
        status: 'active',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 350),
        amount: 99.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
      },
      {
        id: 'sub_3',
        builderId: 'builder_3',
        builderName: 'Enterprise Inc',
        plan: 'Basic',
        status: 'past_due',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 320),
        amount: 19.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
      },
      {
        id: 'sub_4',
        builderId: 'builder_4',
        builderName: 'Demo Builder',
        plan: 'Pro',
        status: 'canceled',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        amount: 49.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
      },
      {
        id: 'sub_5',
        builderId: 'builder_5',
        builderName: 'Tech Solutions',
        plan: 'Enterprise',
        status: 'active',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 355),
        amount: 149.99,
        currency: 'USD',
        billingCycle: 'yearly',
        nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 355)
      }
    ];
    
    setTransactions(mockTransactions);
    setSubscriptions(mockSubscriptions);
    setFilteredTransactions(mockTransactions);
    setFilteredSubscriptions(mockSubscriptions);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...transactions];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(transaction => transaction.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(transaction => transaction.type === typeFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction => 
        transaction.builderName.toLowerCase().includes(term) ||
        transaction.invoiceId.includes(term) ||
        transaction.paymentMethod.toLowerCase().includes(term)
      );
    }
    
    setFilteredTransactions(result);
  }, [statusFilter, typeFilter, searchTerm, transactions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-blue-500';
      case 'active':
        return 'bg-green-500';
      case 'trialing':
        return 'bg-blue-500';
      case 'past_due':
        return 'bg-orange-500';
      case 'canceled':
        return 'bg-gray-500';
      case 'unpaid':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trialing';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'unpaid':
        return 'Unpaid';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const financialMetrics = {
    totalRevenue: transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0),
    mrr: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0),
    arr: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount : s.amount * 12), 0),
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    churnRate: 12.5, // Placeholder percentage
    ltv: 1250, // Placeholder value
    pendingPayments: transactions.filter(t => t.status === 'pending').length,
    failedPayments: transactions.filter(t => t.status === 'failed').length,
  };

  const revenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 18900 },
    { month: 'Mar', revenue: 14200 },
    { month: 'Apr', revenue: 17800 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 19500 },
    { month: 'Jul', revenue: 23000 },
    { month: 'Aug', revenue: 25500 },
    { month: 'Sep', revenue: 22000 },
    { month: 'Oct', revenue: 28000 },
    { month: 'Nov', revenue: 31000 },
    { month: 'Dec', revenue: 34500 },
  ];

  const planDistribution = [
    { name: 'Basic', value: 35 },
    { name: 'Pro', value: 25 },
    { name: 'Premium', value: 25 },
    { name: 'Enterprise', value: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Finance</h1>
          <p className="text-muted-foreground mt-1">
            Financial metrics, revenue tracking, and subscription management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.mrr)}</div>
            <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.arr)}</div>
            <p className="text-xs text-muted-foreground">Annual Recurring Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialMetrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">Monthly churn rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.ltv)}</div>
            <p className="text-xs text-muted-foreground">Customer Lifetime Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Past Due</p>
              <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'past_due').length}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Trialing</p>
              <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'trialing').length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Canceled</p>
              <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'canceled').length}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Builder</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        {subscription.builderName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subscription.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(subscription.status)} text-white`}>
                        {getStatusText(subscription.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(subscription.amount, subscription.currency)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{subscription.billingCycle}</Badge>
                    </TableCell>
                    <TableCell>
                      {subscription.nextBillingDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Subscription
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Process Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Builder</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
                          {transaction.invoiceId}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.builderName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.paymentMethod}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Receipt
                            </DropdownMenuItem>
                            {transaction.status === 'failed' && (
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Retry Payment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Failed Payments Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Failed Payments</CardTitle>
            <CardDescription>Payments that require attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions
                .filter(t => t.status === 'failed')
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{transaction.builderName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.invoiceId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date.toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Retry
                    </Button>
                  </div>
                ))}
              {transactions.filter(t => t.status === 'failed').length === 0 && (
                <p className="text-center text-muted-foreground py-4">No failed payments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
            <CardDescription>Payments awaiting processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions
                .filter(t => t.status === 'pending')
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{transaction.builderName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.invoiceId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date.toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Process
                    </Button>
                  </div>
                ))}
              {transactions.filter(t => t.status === 'pending').length === 0 && (
                <p className="text-center text-muted-foreground py-4">No pending payments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingFinanceDashboard;